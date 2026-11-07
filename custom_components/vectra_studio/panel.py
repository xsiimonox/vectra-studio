"""Register the Vectra Studio sidebar, using Home Assistant authentication."""

from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.core import HomeAssistant

from .const import DOMAIN, INTEGRATION_VERSION

PANEL_PATH = "vectra-studio"


async def async_register_studio_panel(hass: HomeAssistant) -> None:
    """Register once per HA session, including when entries are reloaded."""
    state = hass.data.setdefault(DOMAIN, {})
    if not state.get("studio_static_registered"):
        await hass.http.async_register_static_paths([
            StaticPathConfig(
                "/vectra_studio_panel",
                str(Path(__file__).parent / "panel"),
                False,
            )
        ])
        state["studio_static_registered"] = True
    if PANEL_PATH not in hass.data.get(frontend.DATA_PANELS, {}):
        await async_register_panel(
            hass,
            "vectra-studio-panel",
            PANEL_PATH,
            sidebar_title="Vectra Studio",
            sidebar_icon="mdi:pump",
            module_url=f"/vectra_studio_panel/vectra-studio.js?v={INTEGRATION_VERSION}",
            require_admin=True,
            embed_iframe=False,
        )
