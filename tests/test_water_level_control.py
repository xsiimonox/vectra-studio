"""Safety and inertia tests for the chamber water-level controller."""

import importlib.util
from pathlib import Path
import unittest


_PATH = Path(__file__).resolve().parents[1] / "custom_components/vectra_studio/water_level_control.py"
_SPEC = importlib.util.spec_from_file_location("water_level_control", _PATH)
module = importlib.util.module_from_spec(_SPEC)
assert _SPEC.loader is not None
_SPEC.loader.exec_module(module)


class WaterLevelControllerTests(unittest.TestCase):
    def setUp(self):
        self.controller = module.WaterLevelController()
        self.settings = module.WaterLevelSettings(
            target_cm=10, deadband_cm=0.3, step_percent=1,
            minimum_percent=20, maximum_percent=80,
            settle_seconds=120, confirmations=3,
        )
        # First observation after HA start deliberately begins a settling
        # period; prime it 200 seconds before the samples in these tests.
        self.controller.evaluate(
            level_cm=10, current_power_percent=50,
            operation_state="Schedule", motor_speed_percent=50,
            now_monotonic=800, settings=self.settings,
        )

    def evaluate(self, **changes):
        values = dict(
            level_cm=10.8, current_power_percent=50,
            operation_state="Schedule", motor_speed_percent=50,
            now_monotonic=1000, settings=self.settings,
        )
        values.update(changes)
        return self.controller.evaluate(**values)

    def test_fresh_controller_waits_for_hydraulics(self):
        fresh = module.WaterLevelController()
        decision = fresh.evaluate(
            level_cm=8, current_power_percent=50,
            operation_state="Schedule", motor_speed_percent=50,
            now_monotonic=1000, settings=self.settings,
        )
        self.assertEqual(decision.reason, "waiting_after_start_or_resume")
        decision = fresh.evaluate(
            level_cm=8, current_power_percent=50,
            operation_state="Schedule", motor_speed_percent=50,
            now_monotonic=1119, settings=self.settings,
        )
        self.assertEqual(decision.reason, "waiting_for_hydraulics")

    def test_requires_repeated_deviation_before_small_step(self):
        self.assertEqual(self.evaluate().reason, "confirming_deviation")
        self.assertEqual(self.evaluate(now_monotonic=1010).reason, "confirming_deviation")
        decision = self.evaluate(now_monotonic=1020)
        self.assertEqual(decision.reason, "adjust_power")
        self.assertEqual(decision.new_power_percent, 51)

    def test_low_level_reduces_power_for_normal_return_chamber(self):
        self.evaluate(level_cm=9.2)
        self.evaluate(level_cm=9.2, now_monotonic=1010)
        decision = self.evaluate(level_cm=9.2, now_monotonic=1020)
        self.assertEqual(decision.new_power_percent, 49)

    def test_pause_and_stopped_motor_never_adjust(self):
        for state in ("Scene", "OOB", "unknown", "unavailable"):
            self.assertEqual(self.evaluate(operation_state=state).reason, "pump_paused_or_non_running_state")
        self.assertEqual(self.evaluate(motor_speed_percent=0).reason, "pump_stopped")

    def test_pause_clears_old_confirmation(self):
        self.evaluate()
        self.evaluate(now_monotonic=1010)
        self.evaluate(operation_state="Scene", now_monotonic=1020)
        self.assertEqual(self.evaluate(now_monotonic=1030).reason, "waiting_after_start_or_resume")
        self.assertEqual(self.evaluate(now_monotonic=1150).confirmation_count, 1)

    def test_settle_period_blocks_response_to_old_water_level(self):
        self.controller.record_successful_change(1000)
        self.assertEqual(self.evaluate(now_monotonic=1119).reason, "waiting_for_hydraulics")
        self.assertEqual(self.evaluate(now_monotonic=1120).confirmation_count, 1)

    def test_deadband_and_limits_prevent_writes(self):
        self.assertEqual(self.evaluate(level_cm=10.2).reason, "inside_deadband")
        self.evaluate(current_power_percent=80)
        self.evaluate(current_power_percent=80, now_monotonic=1010)
        self.assertEqual(self.evaluate(current_power_percent=80, now_monotonic=1020).reason, "power_limit_reached")

    def test_direction_can_be_reversed_for_other_plumbing(self):
        reversed_settings = module.WaterLevelSettings(
            target_cm=10, confirmations=1, higher_power_lowers_level=False,
        )
        decision = self.evaluate(settings=reversed_settings)
        self.assertEqual(decision.new_power_percent, 49)


if __name__ == "__main__":
    unittest.main()
