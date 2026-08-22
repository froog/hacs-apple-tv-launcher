import { describe, expect, it } from "vitest";

import { initials, normalizeConfig, prepareApps } from "../../src/config";
import type { LauncherApp } from "../../src/types";

const app = (name: string, id: string | null): LauncherApp => ({
  name,
  id,
  artwork: null,
  artworkFallback: null,
  artworkFit: "cover",
  unframedArtwork: false,
});

describe("launcher configuration", () => {
  it("normalizes bounded fields and malformed advanced values", () => {
    const config = normalizeConfig({
      entity: "media_player.lounge",
      columns: 99,
      mobile_columns: 1,
      wake_delay: -10,
      artwork_country: "New Zealand",
      include: "Netflix" as unknown as string[],
    });

    expect(config.columns).toBe(10);
    expect(config.mobile_columns).toBe(2);
    expect(config.wake_delay).toBe(0);
    expect(config.artwork_country).toBe("us");
    expect(config.include).toEqual([]);
  });

  it("rejects non-media-player entities", () => {
    expect(() => normalizeConfig({ entity: "remote.lounge" })).toThrow(
      "media_player",
    );
  });

  it("filters and orders apps by name or bundle identifier", () => {
    const config = normalizeConfig({
      entity: "media_player.lounge",
      app_order: ["com.netflix.Netflix", "TVNZ+"],
      exclude: ["settings"],
    });
    const apps = prepareApps(
      [
        app("Settings", "com.apple.TVSettings"),
        app("TVNZ+", "nz.co.tvnz.ondemand.iphone"),
        app("Netflix", "com.netflix.Netflix"),
        app("Infuse", "com.firecore.infuse"),
      ],
      config,
    );

    expect(apps.map(({ name }) => name)).toEqual([
      "Netflix",
      "TVNZ+",
      "Infuse",
    ]);
  });

  it("generates stable initials", () => {
    expect(initials("BBC iPlayer")).toBe("BI");
    expect(initials("Netflix")).toBe("NE");
  });
});
