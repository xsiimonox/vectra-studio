"""Exercise handoff lifetime with HA config-entry/store stand-ins."""
import importlib.util
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, patch
import unittest


class AppAccessTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        modules = {n: ModuleType(n) for n in (
            "homeassistant", "homeassistant.components", "homeassistant.components.switch",
            "homeassistant.helpers", "homeassistant.helpers.storage", "homeassistant.exceptions",
            "handoff_test", "handoff_test.const")}
        class Entity:
            async def async_added_to_hass(self):
                pass
            def async_write_ha_state(self):
                pass
        self.saved = {}
        saved = self.saved
        class Store:
            def __init__(self, *args):
                pass
            async def async_load(self):
                return saved.copy()
            async def async_save(self, data):
                saved.update({"entries": list(data["entries"])})
        modules["homeassistant.components.switch"].SwitchEntity = Entity
        modules["homeassistant.helpers.storage"].Store = Store
        modules["homeassistant.exceptions"].HomeAssistantError = RuntimeError
        modules["handoff_test.const"].DOMAIN = "vectra_studio"
        spec = importlib.util.spec_from_file_location("handoff_test.app_access", Path(__file__).resolve().parents[1] / "custom_components/vectra_studio/app_access.py")
        module = importlib.util.module_from_spec(spec)
        with patch.dict("sys.modules", modules):
            spec.loader.exec_module(module)
        self.cls = module.MobiusAppAccessSwitch
        self.entry = SimpleNamespace(entry_id="m2", disabled_by=None, options={"other": 1})
        self.manual = SimpleNamespace(entry_id="manual", disabled_by="user", options={})
        def update(entry, options):
            entry.options = options
        self.reload = AsyncMock(return_value=True)
        self.hass = SimpleNamespace(config_entries=SimpleNamespace(
            async_entries=lambda domain: [self.entry, self.manual],
            async_get_entry=lambda eid: self.entry if eid == "m2" else None,
            async_update_entry=update, async_reload=self.reload))

    async def test_switch_survives_restart_and_reconnects_only_its_entries(self):
        switch = self.cls(self.hass)
        await switch.async_added_to_hass()
        await switch.async_turn_on()
        self.assertTrue(switch.is_on)
        self.assertTrue(self.entry.options["mobius_app_access"])
        self.assertEqual(self.entry.options["other"], 1)
        self.assertEqual(self.manual.options, {})
        restored = self.cls(self.hass)
        await restored.async_added_to_hass()
        self.assertTrue(restored.is_on)
        await restored.async_turn_off()
        self.assertFalse(restored.is_on)
        self.assertFalse(self.entry.options["mobius_app_access"])
        self.assertEqual(self.reload.await_count, 2)

    async def test_reload_failure_keeps_recovery_switch_on(self):
        switch = self.cls(self.hass)
        self.reload.return_value = False
        with self.assertRaises(RuntimeError):
            await switch.async_turn_on()
        self.assertTrue(switch.is_on)
