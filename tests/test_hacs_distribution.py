"""Regression coverage for the failed HACS commit installation (596924f)."""

import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "vectra_studio"


class HacsDistributionTests(unittest.TestCase):
    def test_commit_installation_does_not_require_a_github_release_asset(self):
        manifest = json.loads((ROOT / "hacs.json").read_text())
        # HACS unconditionally chooses download_zip_files when both are set,
        # even when the selected version is a commit rather than a release.
        self.assertFalse(manifest.get("zip_release", False))
        self.assertNotIn("filename", manifest)

    def test_repository_installation_includes_runtime_assets(self):
        # No build step is available to an end user's HACS installation.
        for relative in [
            "manifest.json", "__init__.py", "config_flow.py",
            "panel/vectra-studio.js", "panel/model.js", "panel/vectra-studio-logo.png",
            "frontend/dist/vectra-studio-schedule-card.js",
            "frontend/dist/vectra-studio-scene-card.js",
            "brand/icon.png", "brand/icon@2x.png",
        ]:
            with self.subTest(relative=relative):
                self.assertTrue((COMPONENT / relative).is_file())
                self.assertGreater((COMPONENT / relative).stat().st_size, 0)

    def test_panel_static_import_uses_current_release_version(self):
        manifest = json.loads((COMPONENT / "manifest.json").read_text())
        panel = (COMPONENT / "panel/vectra-studio.js").read_text()
        self.assertIn(f"model.js?v={manifest['version']}", panel)

    def test_single_device_warning_is_not_a_persistent_notification(self):
        source = (COMPONENT / "__init__.py").read_text()
        start = source.index("def _notify_single_device_tank")
        end = source.index("def _dismiss_single_device_notification")
        self.assertNotIn("persistent_notification.async_create", source[start:end])


if __name__ == "__main__":
    unittest.main()
