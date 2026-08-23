import { beforeEach, describe, expect, it, vi } from "vitest";

import { marketingArtworkUrl, resolveArtwork } from "../../src/artwork";
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
    window.localStorage.clear();
    vi.mocked(hass.callWS).mockReset();
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

  it("reuses successful lookup metadata until it expires", async () => {
    vi.mocked(hass.callWS).mockResolvedValue({ url: "/local/example.png" });
    const fetchSpy = vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          results: [{ trackId: 12345, artworkUrl512: "https://fallback" }],
        }),
        { status: 200 },
      ),
    );
    const config = normalizeConfig({ entity: "media_player.lounge" });

    expect((await resolveArtwork(baseApp, config, hass)).artwork).toBe(
      "/local/example.png",
    );
    expect((await resolveArtwork(baseApp, config, hass)).artwork).toBe(
      "/local/example.png",
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(hass.callWS).toHaveBeenCalledTimes(2);
  });

  it("looks up successful metadata again after it expires", async () => {
    vi.mocked(hass.callWS).mockResolvedValue({ url: "/local/example.png" });
    const fetchSpy = vi.spyOn(window, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify({ results: [{ trackId: 12345 }] }), {
          status: 200,
        }),
    );
    const config = normalizeConfig({ entity: "media_player.lounge" });

    await resolveArtwork(baseApp, config, hass);
    const storageKey = window.localStorage.key(0);
    expect(storageKey).not.toBeNull();
    const stored = JSON.parse(window.localStorage.getItem(storageKey!)!);
    stored.expiresAt = 0;
    window.localStorage.setItem(storageKey!, JSON.stringify(stored));
    await resolveArtwork(baseApp, config, hass);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("does not persist a failed lookup", async () => {
    const fetchSpy = vi
      .spyOn(window, "fetch")
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValue(
        new Response(
          JSON.stringify({ results: [{ artworkUrl512: "https://recovered" }] }),
          { status: 200 },
        ),
      );
    const config = normalizeConfig({ entity: "media_player.lounge" });

    expect((await resolveArtwork(baseApp, config, hass)).artwork).toBeNull();
    expect((await resolveArtwork(baseApp, config, hass)).artwork).toBe(
      "https://recovered",
    );
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });
});
