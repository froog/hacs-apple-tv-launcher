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
  "com.apple.TVSearch": {
    url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/08f09cdac4972f4b3daf8d8912eea958.png",
    unframed: false,
  },
  "com.apple.TVSettings": {
    url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/53286707fd1ad5fb25d30e83bc67b76d.png",
    unframed: false,
  },
  "com.apple.Sing": {
    url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/e6bf83bb2c9562d02282b6dc567356c6.png",
    unframed: false,
  },
  "com.apple.TVHomeSharing": {
    url: "https://help.apple.com/assets/6A440A7A736300C05C08253A/6A440A87867E8694C70A98B2/en_US/7408de6d13cf09241848fed559d8b9aa.png",
    unframed: false,
  },
};

const artworkMemoryCache = new Map<string, ResolvedArtwork | null>();

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

function validStoredArtwork(value: unknown): value is ResolvedArtwork {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.primary === "string" &&
    (record.fallback === null || typeof record.fallback === "string") &&
    typeof record.unframed === "boolean" &&
    (record.trackId === undefined || Number.isInteger(record.trackId))
  );
}

async function lookupArtwork(
  bundleId: string,
  country: string,
  hass: HomeAssistant,
): Promise<ResolvedArtwork | null> {
  const cacheKey = `${bundleId}|${country}`;
  if (artworkMemoryCache.has(cacheKey)) {
    return artworkMemoryCache.get(cacheKey) ?? null;
  }

  const storageKey = `apple-tv-launcher-artwork-v4:${cacheKey}`;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "-") {
      artworkMemoryCache.set(cacheKey, null);
      return null;
    }
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (validStoredArtwork(parsed)) {
        if (parsed.trackId) {
          parsed.primary =
            (await cacheArtwork(hass, parsed.trackId, country)) ??
            marketingArtworkUrl(parsed.trackId, country);
        }
        artworkMemoryCache.set(cacheKey, parsed);
        return parsed;
      }
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

  artworkMemoryCache.set(cacheKey, result);
  try {
    window.localStorage.setItem(
      storageKey,
      result ? JSON.stringify(result) : "-",
    );
  } catch {
    // Caching metadata is an optimization, not a requirement.
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

export function clearArtworkMemoryCache(): void {
  artworkMemoryCache.clear();
}
