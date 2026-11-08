"""Persistent, timed Studio-scene helpers layered on configured Mobius scenes.

Mobius stores the actual scene payloads on the aquarium devices. Studio scenes
therefore save a user-friendly name, a reference to one configured Mobius scene,
and an optional return-to-schedule time.  This avoids inventing unverified pump
write commands while still giving Home Assistant named, timed controls.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from uuid import uuid4

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .coordinator import async_tank_broadcast, used_scenes

_STORE_KEY = f"{DOMAIN}.studio_scenes"
_DATA_KEY = f"{DOMAIN}_studio_scene_manager"
_STORE_VERSION = 1


class StudioSceneManager:
    """Named local shortcuts and automatic resume timers for one or more tanks."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store = Store(hass, _STORE_VERSION, _STORE_KEY)
        self._scenes: dict[str, list[dict[str, Any]]] = {}
        self._active: dict[str, dict[str, Any]] = {}
        self._unsubs: dict[str, Any] = {}

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self._scenes = {
            str(entry_id): [scene for scene in scenes if self._valid_scene(scene)]
            for entry_id, scenes in (data.get("scenes") or {}).items()
            if isinstance(scenes, list)
        }
        self._active = {
            str(entry_id): active for entry_id, active in (data.get("active") or {}).items()
            if isinstance(active, dict) and isinstance(active.get("source_scene"), str)
        }

    @staticmethod
    def _valid_scene(scene: Any) -> bool:
        return isinstance(scene, dict) and all(isinstance(scene.get(key), str) for key in ("id", "name", "source_scene"))

    async def _async_save(self) -> None:
        await self._store.async_save({"scenes": self._scenes, "active": self._active})

    def list(self, entry_id: str) -> dict[str, Any]:
        return {
            "scenes": [dict(scene) for scene in self._scenes.get(entry_id, [])],
            "active": dict(self._active[entry_id]) if entry_id in self._active else None,
        }

    async def async_create(self, entry_id: str, name: str, source_scene: str, duration_seconds: int | None) -> dict[str, Any]:
        clean_name = name.strip()
        if not clean_name or len(clean_name) > 80:
            raise HomeAssistantError("A Studio scene needs a name of 1–80 characters")
        if not source_scene.strip():
            raise HomeAssistantError("Choose a configured Mobius scene first")
        scene = {
            "id": uuid4().hex,
            "name": clean_name,
            "source_scene": source_scene.strip(),
            "duration_seconds": duration_seconds,
        }
        self._scenes.setdefault(entry_id, []).append(scene)
        await self._async_save()
        return dict(scene)

    async def async_delete(self, entry_id: str, scene_id: str) -> None:
        before = self._scenes.get(entry_id, [])
        after = [scene for scene in before if scene["id"] != scene_id]
        if len(after) == len(before):
            raise HomeAssistantError("Studio scene not found")
        self._scenes[entry_id] = after
        await self._async_save()

    @staticmethod
    def _scene_ids(entry: ConfigEntry) -> dict[str, int]:
        runtime = entry.runtime_data
        names: dict[str, int] = {}
        for coordinator in runtime.coordinators.values():
            for scene in used_scenes(coordinator.data or {}):
                names.setdefault(scene.name, scene.id)
        return names

    async def async_activate(self, entry: ConfigEntry, source_scene: str, duration_seconds: int | None, label: str) -> dict[str, Any]:
        scene_id = self._scene_ids(entry).get(source_scene)
        if scene_id is None:
            raise HomeAssistantError(f"Configured Mobius scene {source_scene!r} was not found")

        runtime = entry.runtime_data
        applies = lambda coordinator: any(scene.id == scene_id for scene in used_scenes(coordinator.data or {}))
        sent, errors = await async_tank_broadcast(
            runtime.coordinators.values(), lambda device: device.start_scene(scene_id, broadcast=True), applies=applies,
        )
        if not sent:
            raise HomeAssistantError(f"No reachable device has scene {source_scene!r}: {'; '.join(errors)}")
        if errors:
            raise HomeAssistantError(f"Started {source_scene!r}, but some device writes failed: {'; '.join(errors)}")

        # Unlike the native select entity, this path bypasses its refresh
        # helper. Refresh now so the state displayed in HA reflects the scene
        # request without waiting for the regular polling interval.
        for coordinator in runtime.coordinators.values():
            await coordinator.async_request_refresh()

        ends_at = (dt_util.utcnow() + timedelta(seconds=duration_seconds)).isoformat() if duration_seconds else None
        self._active[entry.entry_id] = {
            "label": label,
            "source_scene": source_scene,
            "started_at": dt_util.utcnow().isoformat(),
            "ends_at": ends_at,
        }
        await self._async_save()
        self._schedule_resume(entry, ends_at)
        return dict(self._active[entry.entry_id])

    async def async_activate_saved(self, entry: ConfigEntry, scene_id: str) -> dict[str, Any]:
        scene = next((item for item in self._scenes.get(entry.entry_id, []) if item["id"] == scene_id), None)
        if scene is None:
            raise HomeAssistantError("Studio scene not found")
        return await self.async_activate(entry, scene["source_scene"], scene.get("duration_seconds"), scene["name"])

    async def async_resume(self, entry: ConfigEntry) -> None:
        runtime = entry.runtime_data
        sent, errors = await async_tank_broadcast(
            runtime.coordinators.values(), lambda device: device.resume_schedule(broadcast=True),
        )
        if not sent:
            raise HomeAssistantError(f"Could not resume the normal schedule: {'; '.join(errors)}")
        if errors:
            raise HomeAssistantError(f"Some devices could not resume the normal schedule: {'; '.join(errors)}")
        for coordinator in runtime.coordinators.values():
            await coordinator.async_request_refresh()
        self._cancel_timer(entry.entry_id)
        self._active.pop(entry.entry_id, None)
        await self._async_save()

    def _cancel_timer(self, entry_id: str) -> None:
        if unsub := self._unsubs.pop(entry_id, None):
            unsub()

    def _schedule_resume(self, entry: ConfigEntry, ends_at: str | None) -> None:
        self._cancel_timer(entry.entry_id)
        if ends_at is None:
            return
        when = datetime.fromisoformat(ends_at)
        if when <= dt_util.utcnow():
            self.hass.async_create_task(self._async_timed_resume(entry))
            return
        self._unsubs[entry.entry_id] = async_track_point_in_utc_time(
            self.hass, lambda _now: self.hass.async_create_task(self._async_timed_resume(entry)), when,
        )

    async def _async_timed_resume(self, entry: ConfigEntry) -> None:
        self._unsubs.pop(entry.entry_id, None)
        try:
            await self.async_resume(entry)
        except HomeAssistantError:
            # Keep the active marker. A later manual resume remains possible and
            # no unverified repeated pump writes are attempted in the background.
            return

    def async_restore_timer(self, entry: ConfigEntry) -> None:
        active = self._active.get(entry.entry_id)
        if active:
            self._schedule_resume(entry, active.get("ends_at"))


async def async_get_scene_manager(hass: HomeAssistant) -> StudioSceneManager:
    manager: StudioSceneManager | None = hass.data.get(_DATA_KEY)
    if manager is None:
        manager = StudioSceneManager(hass)
        await manager.async_load()
        hass.data[_DATA_KEY] = manager
    return manager
