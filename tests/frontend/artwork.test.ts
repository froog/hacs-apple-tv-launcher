import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearArtworkMemoryCache,
  marketingArtworkUrl,
  resolveArtwork,
} from "../../src/artwork";
import { normalizeConfig } from "../../src/config";
import type { HomeAssistant, LauncherApp } from "../../src/types";

const baseApp: LauncherApp = {
  name: "Example",
  id: "com.example.app",
  artwork: null,
  artworkFallback: null,
  artworkFit: "cover",
  unframedArtwork: false,
};

const hass = {
  states: {},
  callWS: vi.fn(),
  callService: vi.fn(),
} as unknown as HomeAssistant;

describe("artwork resolution", () => {
  beforeEach(() => {
    clearArtworkMemoryCache();
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("uses a bundle-ID override without a remote request", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");
    const config = normalizeConfig({
      entity: "media_player.lounge",
      artwork: { "com.example.app": "/local/example.png" },
    });

    const result = await resolveArtwork(baseApp, config, hass);

    expect(result.artwork).toBe("/local/example.png");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("makes no remote request when artwork lookup is disabled", async () => {
    const fetchSpy = vi.spyOn(window, "fetch");
    const config = normalizeConfig({
      entity: "media_player.lounge",
      artwork_lookup: false,
    });

    const result = await resolveArtwork(baseApp, config, hass);

    expect(result.artwork).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("builds a Marketing Tools URL from numeric metadata", () => {
    const url = new URL(marketingArtworkUrl(12345, "nz"));
    expect(url.hostname).toBe("toolbox.marketingtools.apple.com");
    expect(url.searchParams.get("id")).toBe("12345");
    expect(url.searchParams.get("sf")).toBe("nz");
  });
});
