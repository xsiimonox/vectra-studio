"""Validate and optionally package Vectra Studio without importing HA."""

import ast
import argparse
import json
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "vectra_studio"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", action="store_true")
    parser.add_argument("--tag", help="Require the tag to match the manifest version")
    args = parser.parse_args()
    manifest = json.loads((COMPONENT / "manifest.json").read_text())
    assert manifest["domain"] == "vectra_studio"
    assert manifest["name"] == "Vectra Studio"
    assert "python-mobius~=0.12.0" in manifest["requirements"]
    if args.tag:
        assert args.tag == f"v{manifest['version']}", "Tag and manifest version must match"
    hacs = json.loads((ROOT / "hacs.json").read_text())
    assert hacs["zip_release"] and hacs["filename"] == "vectra_studio.zip"
    assert f"## {manifest['version']}" in (ROOT / "CHANGELOG.md").read_text()
    assert not (ROOT / "custom_components" / "mobius").exists(), "Do not ship two Bluetooth owners"
    for path in COMPONENT.rglob("*.py"):
        ast.parse(path.read_text(), filename=str(path))
    for path in COMPONENT.rglob("*.json"):
        json.loads(path.read_text())
    for name in ["vectra-studio-schedule-card.js", "vectra-studio-scene-card.js"]:
        source = (COMPONENT / "frontend" / "dist" / name).read_text()
        if "schedule" in name:
            assert "vectra_studio/" in source
        assert not re.search(r'''["']mobius(?:/|["'])''', source), "Stale backend namespace"
    for name in ["LICENSE", "panel.py", "panel/model.js", "panel/vectra-studio.js", "translations/de.json"]:
        assert (COMPONENT / name).is_file(), f"Missing {name}"
    assert (ROOT / "frontend-src" / "package.json").is_file(), "Include editor source"
    assert (ROOT / "NOTICE.md").is_file()
    print(f"Vectra Studio {manifest['version']}: Python, JSON, namespaces and bundled assets valid.")
    for name in ["installation", "usage", "troubleshooting", "development"]:
        assert (ROOT / "docs" / f"{name}.md").is_file()
    if args.package:
        target = ROOT / "dist" / f"vectra-studio-{manifest['version']}.zip"
        target.parent.mkdir(exist_ok=True)
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(COMPONENT.rglob("*")):
                if path.is_file() and "__pycache__" not in path.parts:
                    archive.write(path, path.relative_to(ROOT))
            for name in ["NOTICE.md", "README.md", "LICENSE", "CHANGELOG.md", "CONTRIBUTING.md", "hacs.json", "package.json"]:
                archive.write(ROOT / name, name)
            for directory in ["frontend-src", "docs", "examples", "tools", "tests", ".github"]:
                for path in sorted((ROOT / directory).rglob("*")):
                    if path.is_file() and not {"node_modules", "__pycache__"}.intersection(path.parts):
                        archive.write(path, path.relative_to(ROOT))
        print(target)
        hacs_target = target.parent / "vectra_studio.zip"
        with zipfile.ZipFile(hacs_target, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(COMPONENT.rglob("*")):
                if path.is_file() and "__pycache__" not in path.parts:
                    archive.write(path, path.relative_to(COMPONENT))
            archive.write(ROOT / "NOTICE.md", "NOTICE.md")
        print(hacs_target)


if __name__ == "__main__":
    main()
