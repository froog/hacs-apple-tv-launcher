"""Tests for release metadata consistency."""

from __future__ import annotations

import json
import re
from pathlib import Path

from custom_components.apple_tv_launcher.const import CARD_VERSION

ROOT = Path(__file__).parents[2]


def test_release_versions_match() -> None:
    """Manifest, Python, package, and card versions stay in lockstep."""
    manifest = json.loads(
        (ROOT / "custom_components/apple_tv_launcher/manifest.json").read_text()
    )
    package = json.loads((ROOT / "package.json").read_text())
    card_source = (ROOT / "src/apple-tv-launcher-card.ts").read_text()
    card_match = re.search(r'CARD_VERSION = "([^"]+)"', card_source)

    assert card_match is not None
    assert manifest["version"] == package["version"] == CARD_VERSION
    assert card_match.group(1) == CARD_VERSION
