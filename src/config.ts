import type {
  AppleTvLauncherConfig,
  LauncherApp,
  RawAppleTvLauncherConfig,
} from "./types";

export const DEFAULTS = Object.freeze({
  columns: 4,
  mobile_columns: 3,
  show_labels: false,
  artwork_lookup: true,
  artwork_country: "us",
  wake_before_launch: true,
  wake_delay: 2500,
  retry: true,
  app_order: [] as string[],
  include: [] as string[],
  exclude: [] as string[],
  artwork: {} as Record<string, string>,
});

export function clampNumber(
  value: unknown,
  minimum: number,
  maximum: number,
  fallback: number,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(parsed)));
}

function normalizeList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeConfig(
  input: RawAppleTvLauncherConfig,
): AppleTvLauncherConfig {
  if (!input?.entity || !String(input.entity).startsWith("media_player.")) {
    throw new Error("Apple TV Launcher requires a media_player entity");
  }

  const country = String(input.artwork_country ?? DEFAULTS.artwork_country)
    .trim()
    .toLowerCase();

  return {
    entity: String(input.entity),
    ...(input.title !== undefined ? { title: String(input.title) } : {}),
    columns: clampNumber(input.columns, 2, 10, DEFAULTS.columns),
    mobile_columns: clampNumber(
      input.mobile_columns,
      2,
      6,
      DEFAULTS.mobile_columns,
    ),
    show_labels: normalizeBoolean(input.show_labels, DEFAULTS.show_labels),
    artwork_lookup: normalizeBoolean(
      input.artwork_lookup,
      DEFAULTS.artwork_lookup,
    ),
    artwork_country: /^[a-z]{2}$/.test(country)
      ? country
      : DEFAULTS.artwork_country,
    wake_before_launch: normalizeBoolean(
      input.wake_before_launch,
      DEFAULTS.wake_before_launch,
    ),
    wake_delay: clampNumber(input.wake_delay, 0, 15_000, DEFAULTS.wake_delay),
    retry: normalizeBoolean(input.retry, DEFAULTS.retry),
    app_order: normalizeList(input.app_order),
    include: normalizeList(input.include),
    exclude: normalizeList(input.exclude),
    artwork:
      input.artwork &&
      typeof input.artwork === "object" &&
      !Array.isArray(input.artwork)
        ? Object.fromEntries(
            Object.entries(input.artwork).map(([key, value]) => [
              key,
              String(value),
            ]),
          )
        : {},
  };
}

function appMatches(app: LauncherApp, values: string[]): boolean {
  const wanted = new Set(values.map((value) => value.toLocaleLowerCase()));
  return (
    wanted.has(app.name.toLocaleLowerCase()) ||
    Boolean(app.id && wanted.has(app.id.toLocaleLowerCase()))
  );
}

export function prepareApps(
  apps: LauncherApp[],
  config: AppleTvLauncherConfig,
): LauncherApp[] {
  const seen = new Set<string>();
  const unique = apps.filter((app) => {
    const key = `${app.name.toLocaleLowerCase()}|${app.id?.toLocaleLowerCase() ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const included = config.include.length
    ? unique.filter((app) => appMatches(app, config.include))
    : unique;
  const visible = included.filter((app) => !appMatches(app, config.exclude));
  const order = new Map(
    config.app_order.map((value, index) => [value.toLocaleLowerCase(), index]),
  );

  const rank = (app: LauncherApp): number =>
    order.get(app.name.toLocaleLowerCase()) ??
    (app.id ? order.get(app.id.toLocaleLowerCase()) : undefined) ??
    Number.MAX_SAFE_INTEGER;

  return visible.sort(
    (left, right) =>
      rank(left) - rank(right) || left.name.localeCompare(right.name),
  );
}

export function isPoweredOn(state?: { state: string }): boolean {
  return Boolean(
    state && !["off", "unavailable", "unknown"].includes(state.state),
  );
}

export function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
