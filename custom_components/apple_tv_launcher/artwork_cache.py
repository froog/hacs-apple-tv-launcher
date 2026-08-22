"""Persistent, authenticated artwork caching for Apple TV Launcher."""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from pathlib import Path
from weakref import WeakValueDictionary

import aiohttp
import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    ARTWORK_DIRECTORY,
    COMMAND_CACHE_ARTWORK,
    DOMAIN,
    MAX_ARTWORK_BYTES,
    MAX_CACHE_FILES,
)

COUNTRY_PATTERN = re.compile(r"^[a-z]{2}$")
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
PNG_IHDR = b"IHDR"


@dataclass(slots=True)
class ArtworkCache:
    """Download Marketing Tools artwork once and expose a local HA URL."""

    hass: HomeAssistant
    directory: Path
    locks: WeakValueDictionary[str, asyncio.Lock] = field(
        default_factory=WeakValueDictionary
    )
    reservations: set[str] = field(default_factory=set)
    capacity_lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def async_get(self, track_id: int, country: str) -> str:
        """Return a local URL, downloading the artwork atomically if missing."""
        country = country.lower()
        if not COUNTRY_PATTERN.fullmatch(country):
            raise ValueError("country must be a two-letter storefront code")
        if track_id < 1:
            raise ValueError("track_id must be positive")

        filename = f"{country}-{track_id}.png"
        target = self.directory / filename
        if await self.hass.async_add_executor_job(self._has_content, target):
            return self._local_url(filename)

        lock = self.locks.setdefault(filename, asyncio.Lock())
        async with lock:
            if await self.hass.async_add_executor_job(self._has_content, target):
                return self._local_url(filename)

            await self._async_reserve(filename)
            try:
                data = await self._async_download(track_id, country)
                await self.hass.async_add_executor_job(self._atomic_write, target, data)
            finally:
                async with self.capacity_lock:
                    self.reservations.discard(filename)

        return self._local_url(filename)

    async def _async_reserve(self, filename: str) -> None:
        """Reserve one cache slot without racing downloads for other files."""
        async with self.capacity_lock:
            file_count = await self.hass.async_add_executor_job(self._count_cache_files)
            if file_count + len(self.reservations) >= MAX_CACHE_FILES:
                raise RuntimeError("artwork cache file limit reached")
            self.reservations.add(filename)

    async def _async_download(self, track_id: int, country: str) -> bytes:
        """Download one polished PNG from Apple's Marketing Tools service."""
        session = async_get_clientsession(self.hass)
        params = {
            "id": str(track_id),
            "type": "app",
            "sf": country,
            "lang": "en-us",
            "lob": "apps",
            "fileName": "icon.png",
            "includeHairline": "false",
        }
        timeout = aiohttp.ClientTimeout(total=30)
        async with session.get(
            "https://toolbox.marketingtools.apple.com/api/download-artwork",
            params=params,
            headers={"User-Agent": "Mozilla/5.0 AppleTVLauncher/0.1"},
            timeout=timeout,
        ) as response:
            response.raise_for_status()
            content_type = response.headers.get("Content-Type", "")
            if not content_type.startswith("image/png"):
                raise RuntimeError(f"unexpected artwork content type: {content_type}")
            if (
                response.content_length is not None
                and response.content_length > MAX_ARTWORK_BYTES
            ):
                raise RuntimeError("artwork exceeds cache size limit")

            chunks: list[bytes] = []
            received = 0
            async for chunk in response.content.iter_chunked(64 * 1024):
                received += len(chunk)
                if received > MAX_ARTWORK_BYTES:
                    raise RuntimeError("artwork exceeds cache size limit")
                chunks.append(chunk)

        data = b"".join(chunks)
        if not self._is_png(data):
            raise RuntimeError("invalid artwork PNG")
        return data

    def _count_cache_files(self) -> int:
        """Count complete cache entries outside Home Assistant's event loop."""
        return sum(1 for path in self.directory.glob("*.png") if path.is_file())

    @staticmethod
    def _is_png(data: bytes) -> bool:
        """Perform a small structural check without adding an image dependency."""
        return (
            24 <= len(data) <= MAX_ARTWORK_BYTES
            and data.startswith(PNG_SIGNATURE)
            and data[12:16] == PNG_IHDR
        )

    @staticmethod
    def _has_content(target: Path) -> bool:
        """Check for a usable cache entry outside Home Assistant's event loop."""
        if not target.is_file() or target.stat().st_size < 24:
            return False
        with target.open("rb") as cached:
            header = cached.read(16)
        return header.startswith(PNG_SIGNATURE) and header[12:16] == PNG_IHDR

    @staticmethod
    def _atomic_write(target: Path, data: bytes) -> None:
        """Write through a temporary sibling so clients never see a partial PNG."""
        temporary = target.with_name(f".{target.name}.tmp")
        try:
            temporary.write_bytes(data)
            temporary.replace(target)
        finally:
            temporary.unlink(missing_ok=True)

    @staticmethod
    def _local_url(filename: str) -> str:
        return f"/local/{ARTWORK_DIRECTORY}/{filename}"


async def async_create_cache(hass: HomeAssistant) -> ArtworkCache:
    """Create the cache directory and cache service."""
    directory = Path(hass.config.path("www", ARTWORK_DIRECTORY))
    await hass.async_add_executor_job(directory.mkdir, parents=True, exist_ok=True)
    return ArtworkCache(hass, directory)


def async_register_websocket_command(hass: HomeAssistant) -> None:
    """Register the authenticated artwork-cache WebSocket command."""
    websocket_api.async_register_command(hass, websocket_cache_artwork)


@websocket_api.websocket_command(
    {
        vol.Required("type"): COMMAND_CACHE_ARTWORK,
        vol.Required("track_id"): vol.All(vol.Coerce(int), vol.Range(min=1)),
        vol.Required("country"): vol.Match(COUNTRY_PATTERN),
    }
)
@websocket_api.async_response
async def websocket_cache_artwork(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Resolve one authenticated artwork-cache request."""
    cache: ArtworkCache = hass.data[DOMAIN]["artwork_cache"]
    try:
        url = await cache.async_get(msg["track_id"], msg["country"])
    except (
        TimeoutError,
        aiohttp.ClientError,
        OSError,
        RuntimeError,
        ValueError,
    ) as err:
        connection.send_error(msg["id"], "artwork_cache_failed", str(err))
        return
    connection.send_result(msg["id"], {"url": url})
