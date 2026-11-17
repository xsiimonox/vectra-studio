"""Conservative feedback decisions for aquarium return-chamber level control.

The controller deliberately makes at most one small pump adjustment per call.
Home Assistant supplies the measurements and performs the actual number write;
keeping the decision code pure makes the safety rules independently testable.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import isfinite


RUNNING_OPERATION_STATES = frozenset({"Schedule", "LiveDemo"})


@dataclass(frozen=True)
class WaterLevelSettings:
    """Tuning values in user-facing units."""

    target_cm: float
    deadband_cm: float = 0.3
    step_percent: float = 1.0
    minimum_percent: float = 10.0
    maximum_percent: float = 100.0
    settle_seconds: float = 120.0
    confirmations: int = 3
    # Normal return-chamber hydraulics: more pump power lowers the chamber.
    higher_power_lowers_level: bool = True

    def validate(self) -> None:
        numeric = (
            self.target_cm, self.deadband_cm, self.step_percent,
            self.minimum_percent, self.maximum_percent, self.settle_seconds,
        )
        if any(isinstance(value, bool) or not isinstance(value, (int, float)) or not isfinite(value)
               for value in numeric):
            raise ValueError("Water-level settings must be finite numbers")
        if self.target_cm < 0:
            raise ValueError("target_cm must be zero or greater")
        if self.deadband_cm <= 0:
            raise ValueError("deadband_cm must be greater than zero")
        if not 1 <= self.step_percent <= 10 or int(self.step_percent) != self.step_percent:
            raise ValueError("step_percent must be a whole percentage between 1 and 10")
        if not 1 <= self.minimum_percent <= self.maximum_percent <= 100:
            raise ValueError("power limits must satisfy 1 <= minimum <= maximum <= 100")
        if int(self.minimum_percent) != self.minimum_percent or int(self.maximum_percent) != self.maximum_percent:
            raise ValueError("power limits must be whole percentages")
        if self.settle_seconds < 10:
            raise ValueError("settle_seconds must be at least 10")
        if isinstance(self.confirmations, bool) or not isinstance(self.confirmations, int) or not 1 <= self.confirmations <= 20:
            raise ValueError("confirmations must be a whole number between 1 and 20")


@dataclass(frozen=True)
class ControlDecision:
    """One evaluation result. ``new_power_percent`` is None for no write."""

    reason: str
    new_power_percent: float | None = None
    error_cm: float | None = None
    confirmation_count: int = 0


class WaterLevelController:
    """State needed across repeated automation calls for one pump entity."""

    def __init__(self) -> None:
        self.last_change_monotonic: float | None = None
        self._direction = 0
        self._confirmations = 0
        self._pump_running = False

    def reset_confirmation(self) -> None:
        self._direction = 0
        self._confirmations = 0

    def record_successful_change(self, now_monotonic: float) -> None:
        self.last_change_monotonic = now_monotonic
        self.reset_confirmation()

    def record_suspension(self) -> None:
        """Forget deviations seen before/during a pause or stopped motor."""
        self._pump_running = False
        self.reset_confirmation()

    def evaluate(
        self,
        *,
        level_cm: float,
        current_power_percent: float,
        operation_state: str,
        motor_speed_percent: float,
        now_monotonic: float,
        settings: WaterLevelSettings,
    ) -> ControlDecision:
        """Return a safe single-step decision for the current sample."""
        settings.validate()
        values = (level_cm, current_power_percent, motor_speed_percent, now_monotonic)
        if any(isinstance(value, bool) or not isinstance(value, (int, float)) or not isfinite(value)
               for value in values):
            self.reset_confirmation()
            return ControlDecision("invalid_measurement")

        # Scene/feed/pause and stopped motors intentionally change the chamber
        # level. Never let that expected movement influence the return pump.
        if operation_state not in RUNNING_OPERATION_STATES:
            self.record_suspension()
            return ControlDecision("pump_paused_or_non_running_state")
        if motor_speed_percent <= 0.5:
            self.record_suspension()
            return ControlDecision("pump_stopped")

        # The water level during pause/off is intentionally different. Start
        # a fresh hydraulic settling period when the pump first appears or
        # resumes, before accepting any deviation from the target.
        if not self._pump_running:
            self._pump_running = True
            self.last_change_monotonic = now_monotonic
            self.reset_confirmation()
            return ControlDecision("waiting_after_start_or_resume")

        if self.last_change_monotonic is not None:
            elapsed = max(0.0, now_monotonic - self.last_change_monotonic)
            if elapsed < settings.settle_seconds:
                self.reset_confirmation()
                return ControlDecision("waiting_for_hydraulics")

        error = level_cm - settings.target_cm
        if abs(error) <= settings.deadband_cm:
            self.reset_confirmation()
            return ControlDecision("inside_deadband", error_cm=error)

        level_direction = 1 if error > 0 else -1
        if level_direction != self._direction:
            self._direction = level_direction
            self._confirmations = 1
        else:
            self._confirmations += 1

        if self._confirmations < settings.confirmations:
            return ControlDecision(
                "confirming_deviation", error_cm=error,
                confirmation_count=self._confirmations,
            )

        # If more power lowers the chamber, a high level needs more power and
        # a low level less. Reverse that sign for the opposite plumbing.
        power_direction = level_direction if settings.higher_power_lowers_level else -level_direction
        requested = round(current_power_percent) + power_direction * settings.step_percent
        requested = min(settings.maximum_percent, max(settings.minimum_percent, requested))
        if abs(requested - current_power_percent) < 0.001:
            self.reset_confirmation()
            return ControlDecision("power_limit_reached", error_cm=error)

        return ControlDecision(
            "adjust_power", new_power_percent=round(requested, 3),
            error_cm=error, confirmation_count=self._confirmations,
        )
