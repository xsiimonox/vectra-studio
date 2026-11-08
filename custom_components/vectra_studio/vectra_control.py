"""Verified changes to an existing Vectra constant-speed schedule block.

No undocumented live override: the selected block is a persistent schedule
setting. The library supplies padded 16-byte points and validates FSCI ACKs.
"""
from copy import deepcopy
from math import isfinite

from mobius import OperationState, PumpMode, PumpParam, PrimitiveType, Model


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
    if await device.get_operation_state() != OperationState.Schedule:
        raise ValueError("MaxSpeed: leave Feed/scene mode in Mobius first")
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
