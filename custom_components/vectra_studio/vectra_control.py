"""Verified changes to an existing Vectra constant-speed schedule block.

No undocumented live override: the selected block is a persistent schedule
setting. The library supplies padded 16-byte points and validates FSCI ACKs.
"""
from copy import deepcopy
from math import isfinite
from datetime import datetime, timezone

from mobius import OperationState, PumpMode, PumpParam, PrimitiveType, Model


async def read_control_state(device):
    """Read wire bytes directly; unknown/failed reads are never called Feed.

    Numeric attribute ids are the documented C2 attributes. This function
    performs GETs only, including on unknown firmware/enum values.
    """
    result = {"read_at": datetime.now(timezone.utc).isoformat(), "attributes": {}}
    for name, attribute, size, signed in (
        ("operation_state", 104, 1, False),
        ("operation_mode", 105, 2, False),
        ("pump_override_mode", 705, 1, False),
        ("current_scene", 401, 4, False),
        ("motor_speed", 700, 2, True),
        ("live_demo_scene", 407, 1, False),
        ("live_demo_timeout", 405, 2, False),
        ("live_demo_timer", 406, 2, False),
    ):
        record = {"attribute_id": attribute, "raw_hex": None, "value": None, "error": None}
        try:
            values = await device.get_attribute(attribute)
            raw = values[0] if values else b""
            record["raw_hex"] = raw.hex()
            record["elements_hex"] = [element.hex() for element in values]
            record["length_bytes"] = len(raw)
            if len(raw) < size:
                record["error"] = f"Short/empty response: expected at least {size} bytes, got {len(raw)}"
            elif name == "live_demo_scene":
                # Payload semantics are not verified for M2: retain every
                # element verbatim instead of inventing a mode/speed mapping.
                record["value"] = None
            elif name == "current_scene":
                record["value"] = int.from_bytes(raw[:2], "little")
                record["duration_seconds"] = int.from_bytes(raw[2:4], "little")
            else:
                record["value"] = int.from_bytes(raw[:size], "little", signed=signed)
            if name == "operation_state" and record["value"] is not None:
                try:
                    record["label"] = OperationState(record["value"]).name
                except ValueError:
                    record["label"] = "unknown"
            if name == "motor_speed" and record["value"] is not None:
                record["percent"] = abs(record["value"]) / 10
        except Exception as err:
            record["error"] = str(err) or type(err).__name__
        result["attributes"][name] = record
    return result


def percent_to_permille(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError("MaxSpeed requires a numeric percentage")
    if not isfinite(value) or not 1 <= value <= 100 or int(value) != value:
        raise ValueError("MaxSpeed must be a whole percentage between 1 and 100")
    return int(value) * 10


def signature(points):
    return [point.encode() for point in points]


async def set_constant_percent(device, value, save_backup, minute_of_day):
    """Write once, then verify stored points AND live state; no blind rollback."""
    raw = percent_to_permille(value)
    info = await device.get_device_info()
    if info.get("model") != Model.VectraM2.name or info.get("primitive_type") != PrimitiveType.VectraV1.name:
        raise ValueError("This control supports only VectraM2 / VectraV1")
    state = await device.get_operation_state()
    if state != OperationState.Schedule:
        raise ValueError(f"MaxSpeed: Schedule required; reported operation_state={state!r}. "
                         "Use 'Betriebszustand auslesen' for raw controller data; no write attempted")
    override = await device.get_pump_override_mode()
    if override is None or override.value != 0:
        raise ValueError("MaxSpeed: controller override is active or unknown; check Mobius")
    original = await device.get_pump_schedule(which=1)
    block = await device.get_current_pump_block(which=1, points=original, minute_of_day=minute_of_day)
    if block is None or block.pump.mode != PumpMode.ConstantSpeed:
        raise ValueError("MaxSpeed: the current schedule block must be ConstantSpeed")
    updated = deepcopy(original)
    matching = [p for p in updated if p.time_minutes == block.time_minutes]
    if len(matching) != 1:
        raise ValueError("MaxSpeed: ambiguous schedule times")
    matching[0].pump.params[PumpParam.MaxSpeed] = raw
    await save_backup(original)
    await device.set_pump_schedule(updated, which=1,
                                   primitive_type=PrimitiveType.VectraV1, model=Model.VectraM2)
    actual = await device.get_pump_schedule(which=1)
    if signature(actual) != signature(updated):
        raise ValueError("MaxSpeed: device ACK received but schedule readback differs; change NOT confirmed")
    # A saved program and a running program are different confirmations.
    # Do not send resume_schedule: it caused problems on an actual M2.
    return raw
