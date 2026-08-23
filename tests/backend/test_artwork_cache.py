"""Tests for the artwork cache."""

from __future__ import annotations

import asyncio
import os
from pathlib import Path
from unittest.mock import AsyncMock

import pytest

from custom_components.apple_tv_launcher.artwork_cache import (
    ArtworkCache,
    async_create_cache,
)

VALID_PNG = b"\x89PNG\r\n\x1a\n" + b"\x00\x00\x00\rIHDR" + b"\x00" * 8


class FakeHass:
    """Minimal executor surface used by ArtworkCache."""

    async def async_add_executor_job(self, target, *args):
        """Run an executor target inline for a focused unit test."""
        return target(*args)


class FakeConfig:
    """Resolve Home Assistant config-relative paths in a temporary directory."""

    def __init__(self, directory: Path) -> None:
        self.directory = directory

    def path(self, *parts: str) -> str:
        """Return a path beneath the temporary configuration directory."""
        return str(self.directory.joinpath(*parts))


@pytest.mark.asyncio
async def test_create_cache_creates_artwork_directory(tmp_path: Path) -> None:
    """Cache setup passes directory options through an executor callable."""
    hass = FakeHass()
    hass.config = FakeConfig(tmp_path)

    cache = await async_create_cache(hass)

    assert cache.directory == tmp_path / "www" / "apple-tv-launcher-artwork"
    assert cache.directory.is_dir()


@pytest.mark.asyncio
async def test_downloads_once_and_returns_local_url(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """The same artwork should only be downloaded once."""
    download = AsyncMock(return_value=VALID_PNG)
    monkeypatch.setattr(ArtworkCache, "_async_download", download)
    cache = ArtworkCache(FakeHass(), tmp_path)

    first = await cache.async_get(1234, "nz")
    second = await cache.async_get(1234, "nz")

    assert first == second == "/local/apple-tv-launcher-artwork/nz-1234.png"
    assert (tmp_path / "nz-1234.png").read_bytes() == VALID_PNG
    download.assert_awaited_once_with(1234, "nz")


@pytest.mark.asyncio
async def test_concurrent_requests_share_one_download(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Concurrent requests for one image use the same per-file lock."""

    async def download(*_args) -> bytes:
        await asyncio.sleep(0)
        return VALID_PNG

    download_mock = AsyncMock(side_effect=download)
    monkeypatch.setattr(ArtworkCache, "_async_download", download_mock)
    cache = ArtworkCache(FakeHass(), tmp_path)

    results = await asyncio.gather(
        cache.async_get(1234, "nz"), cache.async_get(1234, "nz")
    )

    assert results == [
        "/local/apple-tv-launcher-artwork/nz-1234.png",
        "/local/apple-tv-launcher-artwork/nz-1234.png",
    ]
    download_mock.assert_awaited_once()


@pytest.mark.asyncio
async def test_rejects_invalid_input(tmp_path: Path) -> None:
    """Only positive IDs and two-letter storefronts are accepted."""
    cache = ArtworkCache(FakeHass(), tmp_path)

    with pytest.raises(ValueError, match="positive"):
        await cache.async_get(0, "nz")
    with pytest.raises(ValueError, match="two-letter"):
        await cache.async_get(1, "new-zealand")


@pytest.mark.asyncio
async def test_refreshes_stale_file(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """An expired image is replaced on the next request."""
    target = tmp_path / "us-1.png"
    target.write_bytes(VALID_PNG)
    os.utime(target, (0, 0))
    replacement = VALID_PNG + b"new"
    download = AsyncMock(return_value=replacement)
    monkeypatch.setattr(ArtworkCache, "_async_download", download)
    cache = ArtworkCache(FakeHass(), tmp_path)

    assert await cache.async_get(1, "us") == (
        "/local/apple-tv-launcher-artwork/us-1.png"
    )
    assert target.read_bytes() == replacement
    download.assert_awaited_once_with(1, "us")


def test_png_validation() -> None:
    """The cache accepts a PNG structure and rejects extension-only content."""
    assert ArtworkCache._is_png(VALID_PNG)
    assert not ArtworkCache._is_png(b"not a png" + b"\x00" * 30)


def test_atomic_write_replaces_target(tmp_path: Path) -> None:
    """Atomic writes leave no temporary file behind."""
    target = tmp_path / "art.png"
    target.write_bytes(b"old")

    ArtworkCache._atomic_write(target, VALID_PNG)

    assert target.read_bytes() == VALID_PNG
    assert not (tmp_path / ".art.png.tmp").exists()
