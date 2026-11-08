"""Contract tests for readback, units and rejection before writing."""
import importlib.util
from enum import IntEnum
from pathlib import Path
from types import ModuleType, SimpleNamespace
import unittest
from unittest.mock import AsyncMock, patch


class Mode(IntEnum):
    ConstantSpeed = 1
    Feed = 13


class Point:
    def __init__(self, time, value):
        self.time_minutes = time
        self.pump = SimpleNamespace(mode=Mode.ConstantSpeed, params={0: value})

    def encode(self):
        return self.time_minutes.to_bytes(2, "little") + self.pump.params[0].to_bytes(2, "little")


class ControlTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        fake = ModuleType("mobius")
        fake.OperationState = IntEnum("OperationState", {"Scene": 2, "Schedule": 3})
        fake.PumpMode = Mode
        fake.PumpParam = SimpleNamespace(MaxSpeed=0)
        fake.Model = SimpleNamespace(VectraM2=SimpleNamespace(name="VectraM2"))
        fake.PrimitiveType = SimpleNamespace(VectraV1=SimpleNamespace(name="VectraV1"))
        spec = importlib.util.spec_from_file_location("control", Path(__file__).resolve().parents[1] / "custom_components/vectra_studio/vectra_control.py")
        self.module = importlib.util.module_from_spec(spec)
        with patch.dict("sys.modules", {"mobius": fake}):
            spec.loader.exec_module(self.module)
        self.original = [Point(0, 300), Point(600, 600)]
        self.device = SimpleNamespace(
            get_device_info=AsyncMock(return_value={"model": "VectraM2", "primitive_type": "VectraV1"}),
            get_operation_state=AsyncMock(return_value=3),
            get_pump_override_mode=AsyncMock(return_value=SimpleNamespace(value=0)),
            get_pump_schedule=AsyncMock(side_effect=[self.original, [Point(0, 400), Point(600, 600)]]),
            get_current_pump_block=AsyncMock(return_value=self.original[0]),
            set_pump_schedule=AsyncMock())
        self.backup = AsyncMock()

    async def test_write_converts_numeric_units_and_preserves_other_blocks(self):
        await self.module.set_constant_percent(self.device, 40, self.backup, 100)
        points = self.device.set_pump_schedule.call_args.args[0]
        self.assertEqual(points[0].pump.params[0], 400)
        self.assertEqual(points[1].pump.params[0], 600)
        self.assertEqual(self.original[0].pump.params[0], 300)
        self.backup.assert_awaited_once_with(self.original)

    async def test_ack_without_matching_readback_is_failure(self):
        self.device.get_pump_schedule.side_effect = [self.original, self.original]
        with self.assertRaisesRegex(ValueError, "readback differs"):
            await self.module.set_constant_percent(self.device, 40, self.backup, 100)

    async def test_scene_and_unknown_override_rejected_before_write(self):
        self.device.get_operation_state.return_value = 2
        with self.assertRaisesRegex(ValueError, "reported operation_state=2"):
            await self.module.set_constant_percent(self.device, 40, self.backup, 100)
        self.device.set_pump_schedule.assert_not_awaited()

    async def test_raw_status_reports_unknown_and_failed_reads_without_writes(self):
        async def get(attribute):
            if attribute == 104:
                return [b"\x07"]
            if attribute == 105:
                raise IOError("FSCI rejected 105")
            if attribute == 700:
                return [b"\xc8\x00"]
            if attribute == 407:
                return [b"\x01\xba\x02", b"\x00\xff"]
            if attribute in (405, 406):
                return [b"\x3c\x00"]
            return []
        self.device.get_attribute = AsyncMock(side_effect=get)
        data = (await self.module.read_control_state(self.device))["attributes"]
        self.assertEqual(data["operation_state"]["value"], 7)
        self.assertEqual(data["operation_state"]["raw_hex"], "07")
        self.assertEqual(data["operation_state"]["label"], "unknown")
        self.assertIn("FSCI", data["operation_mode"]["error"])
        self.assertEqual(data["motor_speed"]["percent"], 20)
        self.assertIsNone(data["pump_override_mode"]["value"])
        self.assertEqual(data["live_demo_scene"]["elements_hex"], ["01ba02", "00ff"])
        self.assertIsNone(data["live_demo_scene"]["value"])
        self.assertEqual(data["live_demo_timeout"]["value"], 60)
        self.assertEqual(data["live_demo_timer"]["value"], 60)
        self.device.set_pump_schedule.assert_not_awaited()

    async def test_invalid_values_never_contact_device(self):
        for value in ["40", True, 0, 101, 10.5, float("nan")]:
            with self.assertRaises(ValueError):
                await self.module.set_constant_percent(self.device, value, self.backup, 100)
        self.device.get_device_info.assert_not_awaited()

    async def test_storage_failure_prevents_write(self):
        self.backup.side_effect = OSError("disk full")
        with self.assertRaises(OSError):
            await self.module.set_constant_percent(self.device, 40, self.backup, 100)
        self.device.set_pump_schedule.assert_not_awaited()

    async def test_rejected_ack_propagates(self):
        self.device.set_pump_schedule.side_effect = IOError("FSCI status 1 setting attribute 500")
        with self.assertRaisesRegex(IOError, "FSCI"):
            await self.module.set_constant_percent(self.device, 40, self.backup, 100)
