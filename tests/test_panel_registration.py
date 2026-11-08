"""Exercise the panel registration contract without a Bluetooth/HA install."""

import asyncio
import importlib.util
from pathlib import Path
import re
import sys
from types import ModuleType, SimpleNamespace
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components/vectra_studio"


class PanelRegistrationTests(unittest.TestCase):
    def setUp(self):
        self.registrations = []
        self.paths = []
        self.hass = SimpleNamespace(data={}, http=SimpleNamespace(
            async_register_static_paths=self.register_paths,
        ))

        # The argument order is the public panel_custom API in HA 2026.10.1.
        async def register(hass, frontend_url_path, webcomponent_name, **kwargs):
            self.registrations.append((frontend_url_path, webcomponent_name, kwargs))
            hass.data.setdefault("frontend_panels", {})[frontend_url_path] = kwargs

        modules = {name: ModuleType(name) for name in [
            "homeassistant", "homeassistant.components",
            "homeassistant.components.frontend", "homeassistant.components.http",
            "homeassistant.components.panel_custom", "homeassistant.core",
            "vectra_panel_test", "vectra_panel_test.const",
        ]}
        modules["homeassistant.components.frontend"].DATA_PANELS = "frontend_panels"
        modules["homeassistant.components.http"].StaticPathConfig = lambda *args: args
        modules["homeassistant.components.panel_custom"].async_register_panel = register
        modules["homeassistant.core"].HomeAssistant = object
        modules["vectra_panel_test.const"].DOMAIN = "vectra_studio"
        modules["vectra_panel_test.const"].INTEGRATION_VERSION = "test-version"
        with patch.dict(sys.modules, modules):
            spec = importlib.util.spec_from_file_location("vectra_panel_test.panel", COMPONENT / "panel.py")
            self.panel = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(self.panel)

    async def register_paths(self, paths):
        self.paths.extend(paths)

    def test_registered_element_exists_in_the_served_javascript(self):
        asyncio.run(self.panel.async_register_studio_panel(self.hass))
        route, element, config = self.registrations[0]
        source = (COMPONENT / "panel/vectra-studio.js").read_text()
        registered_elements = re.findall(r'customElements\.define\("([^"]+)"', source)
        self.assertIn(element, registered_elements, "HA must instantiate an element defined by the JS module")
        self.assertEqual(route, "vectra-studio")
        self.assertEqual(config["module_url"], "/vectra_studio_panel/vectra-studio.js?v=test-version")
        self.assertFalse(config["embed_iframe"])
        self.assertTrue(config["require_admin"])

    def test_reloading_entries_does_not_duplicate_the_panel_or_static_path(self):
        asyncio.run(self.panel.async_register_studio_panel(self.hass))
        asyncio.run(self.panel.async_register_studio_panel(self.hass))
        self.assertEqual(len(self.registrations), 1)
        self.assertEqual(len(self.paths), 1)


if __name__ == "__main__":
    unittest.main()
