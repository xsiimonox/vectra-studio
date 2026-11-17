"""
Services used by the schedule editor card (the read side is in
websocket_api.py): write a schedule, or the schedule intensity, to a
device and every light in its schedule group.
"""

from __future__ import annotations

import logging
import time
from typing import Any, Awaitable, Callable

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util

from mobius import (
    min_schedule_capacity, light_schedule_from_dict, pump_schedule_from_dict, primitive_type_from_name, support_tier,
    SchedulePoint, LightPrimitive,
)

from .const import DOMAIN
from .coordinator import MobiusDeviceCoordinator
from .gateway_registry import params_with_master
from .websocket_api import _resolve_member, ScheduleGroupError
from .water_level_control import WaterLevelController, WaterLevelSettings

_LOGGER = logging.getLogger(__name__)

Member = tuple[str, MobiusDeviceCoordinator, Any]

SERVICE_WRITE_SCHEDULE_GROUP = "write_schedule_group"

WRITE_SCHEDULE_GROUP_SCHEMA = vol.Schema({
    vol.Required("device_id"): cv.string,
    vol.Required("points"): [dict],
})

SERVICE_SET_SCHEDULE_INTENSITY = "set_schedule_intensity"

SET_SCHEDULE_INTENSITY_SCHEMA = vol.Schema({
    vol.Required("device_id"): cv.string,
    vol.Required("intensity"): vol.All(vol.Coerce(float), vol.Range(min=0, max=100)),
})

SERVICE_ADJUST_WATER_LEVEL = "adjust_water_level"
WATER_LEVEL_EVENT = f"{DOMAIN}_water_level_control"

ADJUST_WATER_LEVEL_SCHEMA = vol.Schema({
    vol.Required("level_sensor"): cv.entity_id,
    vol.Required("power_entity"): cv.entity_id,
    vol.Required("operation_state_sensor"): cv.entity_id,
    vol.Required("motor_speed_sensor"): cv.entity_id,
    vol.Required("target_cm"): vol.All(vol.Coerce(float), vol.Range(min=0, max=1000)),
    vol.Optional("deadband_cm", default=0.3): vol.All(vol.Coerce(float), vol.Range(min=0.05, max=5)),
    vol.Optional("step_percent", default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=10)),
    vol.Optional("minimum_percent", default=10): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
    vol.Optional("maximum_percent", default=100): vol.All(vol.Coerce(int), vol.Range(min=1, max=100)),
    vol.Optional("settle_seconds", default=120): vol.All(vol.Coerce(float), vol.Range(min=10, max=3600)),
    vol.Optional("confirmations", default=3): vol.All(vol.Coerce(int), vol.Range(min=1, max=20)),
    vol.Optional("higher_power_lowers_level", default=True): cv.boolean,
    vol.Optional("max_sample_age_seconds", default=30): vol.All(vol.Coerce(float), vol.Range(min=5, max=600)),
    vol.Optional("max_pump_state_age_seconds", default=90): vol.All(vol.Coerce(float), vol.Range(min=30, max=600)),
})


def _support_from_primitive_type(primitive_type_name: str | None) -> str:
    """Support tier from a get_device_info() "primitive_type"."""
    return support_tier(primitive_type_from_name(primitive_type_name))


async def _live_group_members(
    hass: HomeAssistant, target_serial: str, target_coordinator: MobiusDeviceCoordinator,
) -> tuple[str, list[Member]]:
    """
    The target's support tier and the devices a write to it must reach, as
    [(serial, coordinator, connected_device)], starting with the target.

    Membership is checked with fresh get_device_info() reads right before
    writing, since group_mask may have changed since the last poll (the
    read-only resolve_schedule_groups command uses the cached data). A pump
    is always alone; a light includes every light of the same entry with
    exactly the same group_mask (a None group_mask never matches another
    light, see python-mobius 06-light-schedule.md, "Schedule groups").
    Lights that can't be re-checked are left out.

    Raises HomeAssistantError if the target can't be reached or has no
    schedule support.
    """
    target_device = await target_coordinator.async_get_connected_device()
    target_info = await target_device.get_device_info()
    support = _support_from_primitive_type(target_info.get("primitive_type"))

    if support in ("pump (experimental)", "unsupported"):
        raise HomeAssistantError(
            f"{target_serial} (support={support!r}) has no confirmed schedule support"
        )

    members: list[Member] = [(target_serial, target_coordinator, target_device)]
    target_group_mask = target_info.get("group_mask")
    if support == "pump" or target_group_mask is None:
        return support, members

    runtime = target_coordinator.config_entry.runtime_data
    for serial, coordinator in runtime.coordinators.items():
        # The cached support tier is enough here: it never changes.
        if serial == target_serial or (coordinator.data or {}).get("support") != "light":
            continue
        try:
            candidate_device = await coordinator.async_get_connected_device()
            candidate_info = await candidate_device.get_device_info()
        except Exception as e:
            _LOGGER.warning(
                "%s: could not re-verify group membership for %s (%s) -- "
                "excluding it from this write rather than risking a write "
                "based on stale membership",
                target_serial, serial, e,
            )
            continue
        if candidate_info.get("group_mask") == target_group_mask:
            members.append((serial, coordinator, candidate_device))

    return support, members


def _untranslate_parent_serial_to_master(points_dict: list[dict], coordinator: MobiusDeviceCoordinator) -> None:
    """
    The reverse of websocket_api.py's _translate_master_to_parent_serial():
    replaces each point's "ParentSerial" with the "Master" hex string
    pump_schedule_from_dict() expects (params_with_master()), in place.
    Raises HomeAssistantError if a parent can't be resolved.
    """
    group = coordinator.registry.group(coordinator.pan_id)
    for point in points_dict:
        try:
            point["params"] = params_with_master(point.get("params", {}), group)
        except ValueError as err:
            raise HomeAssistantError(str(err)) from err


async def _min_group_capacity(members: list[Member], which: int) -> int | None:
    """min_schedule_capacity() of `members`."""
    return await min_schedule_capacity([device for _serial, _coordinator, device in members], which)


async def _resolve_group(hass: HomeAssistant, device_id: str) -> tuple[str, MobiusDeviceCoordinator, str, list[Member]]:
    """(target_serial, target_coordinator, support, members) for a device
    registry id."""
    try:
        target_serial, _runtime, target_coordinator = _resolve_member(hass, device_id)
    except ScheduleGroupError as e:
        raise HomeAssistantError(e.message) from e
    support, members = await _live_group_members(hass, target_serial, target_coordinator)
    return target_serial, target_coordinator, support, members


async def _write_to_members(
    members: list[Member], write: Callable[[str, Any], Awaitable[None]], what: str,
) -> None:
    """Runs `write(serial, device)` on every member; raises HomeAssistantError
    listing the failures, if any."""
    errors: list[str] = []
    for serial, _coordinator, device in members:
        try:
            await write(serial, device)
        except Exception as e:
            errors.append(f"{serial}: {e}")
    if errors:
        raise HomeAssistantError(
            f"{what} {len(members) - len(errors)}/{len(members)} device(s) "
            f"successfully; failed: {'; '.join(errors)}"
        )


def _project_points_for(points, channels: set):
    """Copies `points`, keeping on each point only the channels in `channels`,
    plus Brightness (the per-point master dimmer, which every device uses).
    An empty `channels` set means the device's channels aren't known yet;
    the points are then written unchanged."""
    if not channels:
        return points
    keep = channels | {"Brightness"}
    projected = []
    for p in points:
        allowed = {vid: intensity for vid, intensity in p.light.channels.items() if vid.name in keep}
        projected.append(SchedulePoint(p.time_minutes, p.flags, LightPrimitive(allowed)))
    return projected


async def async_handle_write_schedule_group(hass: HomeAssistant, call: ServiceCall) -> None:
    """Writes Schedule1 to the target and, for a light, every other light
    in its schedule group (never to only part of a group). Schedule2 isn't
    supported yet."""
    raise HomeAssistantError(
        "Vectra schedule writes are temporarily disabled after an unverified "
        "Vectra M2 hardware result. Use the Mobius app or the controller."
    )
    points_dict = call.data["points"]
    _target_serial, target_coordinator, support, members = await _resolve_group(hass, call.data["device_id"])

    if support == "light":
        channels_by_serial = {
            serial: set((coordinator.data or {}).get("channels") or [])
            for serial, coordinator, _device in members
        }
        points = light_schedule_from_dict(points_dict)
    else:
        _untranslate_parent_serial_to_master(points_dict, target_coordinator)
        points = pump_schedule_from_dict(points_dict)

    min_capacity = await _min_group_capacity(members, which=1)
    if min_capacity is not None and len(points) > min_capacity:
        raise HomeAssistantError(
            f"{len(points)} point(s) given, but the smallest capacity across "
            f"{len(members)} device(s) in this group is {min_capacity} -- refusing "
            f"to write, since some group member(s) would reject this schedule entirely."
        )

    if support == "light":
        # A light rejects a schedule unless every point holds exactly its own
        # channels, so each device gets the points projected onto the channels
        # it supports (extras dropped, Brightness always kept). In a group of
        # different light models this writes each model what it can use.
        await _write_to_members(
            members,
            lambda serial, d: d.set_light_schedule(_project_points_for(points, channels_by_serial[serial]), which=1),
            "Wrote to",
        )
    else:
        await _write_to_members(members, lambda _serial, d: d.set_pump_schedule(points, which=1), "Wrote to")


async def async_handle_set_schedule_intensity(hass: HomeAssistant, call: ServiceCall) -> None:
    """
    Writes Schedule1Intensity (the schedule-level dimmer, see python-mobius
    06-light-schedule.md) to the target light and every light in its
    schedule group. `intensity` is 0-100 percent. Rejected for pumps.
    """
    raise HomeAssistantError(
        "Vectra schedule writes are temporarily disabled after an unverified "
        "Vectra M2 hardware result. Use the Mobius app or the controller."
    )
    target_serial, _coordinator, support, members = await _resolve_group(hass, call.data["device_id"])
    if support != "light":
        raise HomeAssistantError(
            f"{target_serial} (support={support!r}) has no schedule-level intensity control -- "
            f"this is a light-only concept."
        )
    fraction = call.data["intensity"] / 100.0
    await _write_to_members(members, lambda _serial, d: d.set_schedule_intensity(fraction, which=1), "Set intensity on")


def _water_level_controllers(hass: HomeAssistant) -> dict[str, WaterLevelController]:
    """One persistent confirmation/settling state per controlled number."""
    return hass.data.setdefault(DOMAIN, {}).setdefault("water_level_controllers", {})


def _finite_state_number(hass: HomeAssistant, entity_id: str) -> float | None:
    state = hass.states.get(entity_id)
    if state is None or state.state in ("unknown", "unavailable"):
        return None
    try:
        value = float(state.state)
    except (TypeError, ValueError):
        return None
    return value if value == value and value not in (float("inf"), float("-inf")) else None


def _state_reported_at(state):
    """HA 2024.3+ tracks identical reports separately from value changes."""
    return getattr(state, "last_reported", state.last_updated)


def _fire_water_level_event(hass: HomeAssistant, call: ServiceCall, **data: Any) -> None:
    """Expose every skip/change decision for HA traces and diagnostics."""
    hass.bus.async_fire(
        WATER_LEVEL_EVENT,
        {"power_entity": call.data["power_entity"], "level_sensor": call.data["level_sensor"], **data},
        context=call.context,
    )


async def async_handle_adjust_water_level(hass: HomeAssistant, call: ServiceCall) -> None:
    """Evaluate one sample and, when safe, request one small power step.

    Call this service periodically. Confirmation counts and the hydraulic
    settling lock live in the integration and are keyed by the target number.
    """
    data = call.data
    controller = _water_level_controllers(hass).setdefault(data["power_entity"], WaterLevelController())

    operation = hass.states.get(data["operation_state_sensor"])
    operation_state = operation.state if operation is not None else "unavailable"
    motor_state = hass.states.get(data["motor_speed_sensor"])
    motor_speed = _finite_state_number(hass, data["motor_speed_sensor"])

    # Pause/feed/scene and a stopped motor intentionally change the chamber
    # level. Never let that expected movement build control confirmations.
    if operation_state not in ("Schedule", "LiveDemo"):
        controller.record_suspension()
        _fire_water_level_event(hass, call, reason="pump_paused_or_non_running_state", operation_state=operation_state)
        return
    now = dt_util.now()
    if (operation is None or motor_state is None
            or (now - _state_reported_at(operation)).total_seconds() > data["max_pump_state_age_seconds"]
            or (now - _state_reported_at(motor_state)).total_seconds() > data["max_pump_state_age_seconds"]):
        controller.record_suspension()
        _fire_water_level_event(hass, call, reason="stale_pump_state", operation_state=operation_state)
        return
    if motor_speed is None or motor_speed <= 0.5:
        controller.record_suspension()
        _fire_water_level_event(hass, call, reason="pump_stopped_or_unknown", operation_state=operation_state)
        return

    level_state = hass.states.get(data["level_sensor"])
    level_cm = _finite_state_number(hass, data["level_sensor"])
    if level_state is None or level_cm is None:
        controller.reset_confirmation()
        _fire_water_level_event(hass, call, reason="invalid_level_sensor")
        return
    sample_age = max(0.0, (now - _state_reported_at(level_state)).total_seconds())
    if sample_age > data["max_sample_age_seconds"]:
        controller.reset_confirmation()
        _fire_water_level_event(hass, call, reason="stale_level_sensor", sample_age_seconds=round(sample_age, 1))
        return

    current_power = _finite_state_number(hass, data["power_entity"])
    if current_power is None:
        controller.reset_confirmation()
        _fire_water_level_event(hass, call, reason="invalid_power_entity")
        return

    settings = WaterLevelSettings(
        target_cm=data["target_cm"], deadband_cm=data["deadband_cm"],
        step_percent=data["step_percent"], minimum_percent=data["minimum_percent"],
        maximum_percent=data["maximum_percent"], settle_seconds=data["settle_seconds"],
        confirmations=data["confirmations"],
        higher_power_lowers_level=data["higher_power_lowers_level"],
    )
    try:
        decision = controller.evaluate(
            level_cm=level_cm, current_power_percent=current_power,
            operation_state=operation_state, motor_speed_percent=motor_speed,
            now_monotonic=time.monotonic(), settings=settings,
        )
    except ValueError as err:
        raise HomeAssistantError(str(err)) from err

    event = {
        "level_cm": level_cm,
        "target_cm": settings.target_cm,
        "error_cm": decision.error_cm,
        "current_power_percent": current_power,
        "confirmation_count": decision.confirmation_count,
        "operation_state": operation_state,
        "motor_speed_percent": motor_speed,
    }
    if decision.new_power_percent is None:
        _fire_water_level_event(hass, call, reason=decision.reason, **event)
        return

    try:
        await hass.services.async_call(
            "number", "set_value",
            {"entity_id": data["power_entity"], "value": decision.new_power_percent},
            blocking=True, context=call.context,
        )
    except Exception as err:
        controller.reset_confirmation()
        _fire_water_level_event(
            hass, call, **event, reason="power_write_failed",
            requested_power_percent=decision.new_power_percent,
            error=str(err) or type(err).__name__,
        )
        raise
    controller.record_successful_change(time.monotonic())
    _fire_water_level_event(
        hass, call, **event, reason="power_changed",
        requested_power_percent=decision.new_power_percent,
    )


def async_register_services(hass: HomeAssistant) -> None:
    """Registers the services (called from async_setup())."""
    hass.services.async_register(
        DOMAIN, SERVICE_WRITE_SCHEDULE_GROUP, lambda call: async_handle_write_schedule_group(hass, call),
        schema=WRITE_SCHEDULE_GROUP_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_SCHEDULE_INTENSITY, lambda call: async_handle_set_schedule_intensity(hass, call),
        schema=SET_SCHEDULE_INTENSITY_SCHEMA,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_ADJUST_WATER_LEVEL, lambda call: async_handle_adjust_water_level(hass, call),
        schema=ADJUST_WATER_LEVEL_SCHEMA,
    )
