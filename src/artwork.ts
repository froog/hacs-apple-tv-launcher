import {
  computersIcon,
  searchIcon,
  settingsIcon,
  singIcon,
} from "./assets/icons";
import type {
  AppleTvLauncherConfig,
  HomeAssistant,
  LauncherApp,
} from "./types";

interface BuiltinArtwork {
  trackId?: number;
  url?: string;
  fit?: "cover" | "contain";
  unframed?: boolean;
}

interface ResolvedArtwork {
  primary: string;
  fallback: string | null;
  unframed: boolean;
  trackId?: number;
}

interface StoredArtwork {
  artwork: ResolvedArtwork;
  expiresAt: number;
}

const ARTWORK_METADATA_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const BRAND_STYLES: Array<[RegExp, [string, string]]> = [
  [/netflix/i, ["#f7f5f0", "#d81f26"]],
  [/bbc|iplayer/i, ["#3f185f", "#ffffff"]],
  [/channel 4/i, ["#b8ff45", "#111111"]],
  [/itvx/i, ["#ffe500", "#17248b"]],
  [/tvnz/i, ["#1910a5", "#ffffff"]],
  [/three|3now/i, ["#ef1738", "#ffffff"]],
  [/prime/i, ["#0879df", "#ffffff"]],
  [/disney/i, ["#082765", "#ffffff"]],
  [/infuse/i, ["#6439df", "#ffffff"]],
  [/purevpn/i, ["#6842e8", "#ffffff"]],
  [/tubi/i, ["#6f48f5", "#ffffff"]],
  [/channel 5/i, ["#224784", "#ffd92f"]],
  [/music|sing/i, ["#f21d55", "#ffffff"]],
  [/photos/i, ["#f5f5f2", "#313238"]],
  [/settings/i, ["#a4a8a9", "#ffffff"]],
];

const BUILTIN_ARTWORK: Record<string, BuiltinArtwork> = {
  "com.apple.TVWatchList": { trackId: 1174078549 },
  "com.apple.TVMusic": { trackId: 1108187390 },
  "com.apple.TVPhotos": { trackId: 1584215428 },
  "com.apple.Arcade": {
    url: "https://developer.apple.com/assets/elements/icons/arcade/arcade-128x128_2x.png",
  },
  "com.apple.TVAppStore": {
    url: "https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png",
  },
  // Bundled 240x240 icons from tvOS 26.6, inlined by scripts/generate-icons.mjs.
  // Previously these pointed at help.apple.com documentation crops, which were
  // only 120x80/102x60 and unversioned against any tvOS release.
  "com.apple.TVSearch": {
    url: searchIcon,
    unframed: false,
  },
  "com.apple.TVSettings": {
    url: settingsIcon,
    unframed: false,
  },
  "com.apple.Sing": {
    url: singIcon,
    unframed: false,
  },
  "com.apple.TVHomeSharing": {
    url: computersIcon,
    unframed: false,
  },
};

export function brandStyle(name: string): [string, string] {
  const match = BRAND_STYLES.find(([pattern]) => pattern.test(name));
  if (match) return match[1];

  let hash = 0;
  for (const char of name) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return [`hsl(${Math.abs(hash) % 360} 54% 39%)`, "#ffffff"];
}

export function marketingArtworkUrl(trackId: number, country: string): string {
  const query = new URLSearchParams({
    id: String(trackId),
    type: "app",
    sf: country,
    lang: "en-us",
    lob: "apps",
    fileName: "icon.png",
    includeHairline: "false",
  });
  return `https://toolbox.marketingtools.apple.com/api/download-artwork?${query}`;
}

async function cacheArtwork(
  hass: HomeAssistant,
  trackId: number,
  country: string,
): Promise<string | null> {
  try {
    const result = await hass.callWS<{ url?: unknown }>({
      type: "apple_tv_launcher/cache_artwork",
      track_id: trackId,
      country,
    });
    return typeof result?.url === "string" ? result.url : null;
  } catch {
    return null;
  }
}

function inferredCountries(bundleId: string, preferred: string): string[] {
  const inferred =
    bundleId.startsWith("uk.") || bundleId.startsWith("com.itv.")
      ? "gb"
      : bundleId.startsWith("nz.")
        ? "nz"
        : preferred;
  return [...new Set([inferred, preferred, "us", "gb"])];
}

function validStoredArtwork(value: unknown): value is StoredArtwork {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const artwork = record.artwork as Record<string, unknown> | undefined;
  if (!artwork) return false;
  return (
    typeof record.expiresAt === "number" &&
    record.expiresAt > Date.now() &&
    typeof artwork.primary === "string" &&
    (artwork.fallback === null || typeof artwork.fallback === "string") &&
    typeof artwork.unframed === "boolean" &&
    (artwork.trackId === undefined || Number.isInteger(artwork.trackId))
  );
}

async function lookupArtwork(
  bundleId: string,
  country: string,
  hass: HomeAssistant,
): Promise<ResolvedArtwork | null> {
  const cacheKey = `${bundleId}|${country}`;
  const storageKey = `apple-tv-launcher-artwork-v5:${cacheKey}`;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (validStoredArtwork(parsed)) {
        const artwork = parsed.artwork;
        if (artwork.trackId) {
          artwork.primary =
            (await cacheArtwork(hass, artwork.trackId, country)) ??
            marketingArtworkUrl(artwork.trackId, country);
        }
        return artwork;
      }
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    // Browser storage may be unavailable in strict privacy modes.
  }

  let result: ResolvedArtwork | null = null;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10_000);
  try {
    const query = new URLSearchParams({ bundleId, country });
    const response = await fetch(`https://itunes.apple.com/lookup?${query}`, {
      signal: controller.signal,
    });
    if (response.ok) {
      const payload = (await response.json()) as {
        results?: Array<{
          trackId?: number;
          artworkUrl512?: string;
          artworkUrl100?: string;
        }>;
      };
      const found = payload.results?.[0];
      const fallback = found?.artworkUrl512 ?? found?.artworkUrl100 ?? null;
      if (found?.trackId) {
        result = {
          primary:
            (await cacheArtwork(hass, found.trackId, country)) ??
            marketingArtworkUrl(found.trackId, country),
          fallback,
          unframed: true,
          trackId: found.trackId,
        };
      } else if (fallback) {
        result = { primary: fallback, fallback: null, unframed: false };
      }
    }
  } catch {
    result = null;
  } finally {
    window.clearTimeout(timeout);
  }

  if (result) {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          artwork: result,
          expiresAt: Date.now() + ARTWORK_METADATA_MAX_AGE_MS,
        } satisfies StoredArtwork),
      );
    } catch {
      // Caching metadata is an optimization, not a requirement.
    }
  }
  return result;
}

export async function resolveArtwork(
  app: LauncherApp,
  config: AppleTvLauncherConfig,
  hass: HomeAssistant,
): Promise<LauncherApp> {
  const override =
    (app.id && config.artwork[app.id]) || config.artwork[app.name];
  if (override) {
    return {
      ...app,
      artwork: override,
      artworkFallback: null,
      artworkFit: "cover",
      unframedArtwork: false,
    };
  }

  // This switch is also the privacy switch: no Apple request is made when off.
  if (!config.artwork_lookup) return app;

  const builtin = app.id ? BUILTIN_ARTWORK[app.id] : undefined;
  if (builtin) {
    const remote = builtin.trackId
      ? marketingArtworkUrl(builtin.trackId, config.artwork_country)
      : (builtin.url ?? null);
    const local = builtin.trackId
      ? await cacheArtwork(hass, builtin.trackId, config.artwork_country)
      : null;
    return {
      ...app,
      artwork: local ?? remote,
      artworkFallback: null,
      artworkFit: builtin.fit ?? "cover",
      unframedArtwork: builtin.unframed !== false,
    };
  }

  if (!app.id) return app;
  for (const country of inferredCountries(app.id, config.artwork_country)) {
    const artwork = await lookupArtwork(app.id, country, hass);
    if (artwork) {
      return {
        ...app,
        artwork: artwork.primary,
        artworkFallback: artwork.fallback,
        artworkFit: "cover",
        unframedArtwork: artwork.unframed,
      };
    }
  }
  return app;
}
