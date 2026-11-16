"""Persistent handoff switch, independent of unloaded pump platforms."""
import asyncio

from homeassistant.components.switch import SwitchEntity
from homeassistant.helpers.storage import Store
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN


class MobiusAppAccessSwitch(SwitchEntity):
    _attr_name = "Vectra Studio – Für Mobius-App freigeben"
    _attr_unique_id = "vectra_studio_mobius_app_access"
    _attr_icon = "mdi:bluetooth-off"
    _attr_should_poll = False

    def __init__(self, hass):
        self._hass = hass
        self._store = Store(hass, 1, f"{DOMAIN}.app_access")
        self._entries = []
        self._lock = asyncio.Lock()

    @property
    def is_on(self):
        return bool(self._entries)

    async def async_added_to_hass(self):
        await super().async_added_to_hass()
        self._entries = (await self._store.async_load() or {}).get("entries", [])

    async def _save(self):
        await self._store.async_save({"entries": self._entries})
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs):
        async with self._lock:
            for entry in self._hass.config_entries.async_entries(DOMAIN):
                if entry.disabled_by is not None:
                    continue
                # Save intent before disabling so a restart cannot strand it.
                if entry.entry_id not in self._entries:
                    self._entries.append(entry.entry_id)
                await self._save()
                try:
                    self._hass.config_entries.async_update_entry(entry, options={**entry.options, "mobius_app_access": True})
                    if not await self._hass.config_entries.async_reload(entry.entry_id):
                        raise HomeAssistantError("Integration konnte nicht vollständig getrennt werden")
                except Exception as err:
                    raise HomeAssistantError(f"Bluetooth-Freigabe fehlgeschlagen: {err}") from err
            await self._save()

    async def async_turn_off(self, **kwargs):
        async with self._lock:
            for entry_id in list(self._entries):
                entry = self._hass.config_entries.async_get_entry(entry_id)
                if entry:
                    self._hass.config_entries.async_update_entry(entry, options={**entry.options, "mobius_app_access": False})
                    if entry.disabled_by is None:
                        if not await self._hass.config_entries.async_reload(entry_id):
                            raise HomeAssistantError("HA-Verbindung noch nicht bereit; Mobius schließen und erneut versuchen")
                self._entries.remove(entry_id)
                await self._save()
