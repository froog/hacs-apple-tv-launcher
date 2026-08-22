import { LitElement, html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

import { brandStyle, resolveArtwork } from "./artwork";
import {
  DEFAULTS,
  initials,
  isPoweredOn,
  normalizeConfig,
  prepareApps,
} from "./config";
import { launcherStyles } from "./styles";
import type {
  AppleTvLauncherConfig,
  BrowseMediaResponse,
  HassEntity,
  HomeAssistant,
  LauncherApp,
  RawAppleTvLauncherConfig,
} from "./types";

export const CARD_TAG = "apple-tv-launcher-card";
export const CARD_VERSION = "0.1.0";

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function emptyApp(name: string, id: string | null): LauncherApp {
  return {
    name,
    id,
    artwork: null,
    artworkFallback: null,
    artworkFit: "cover",
    unframedArtwork: false,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class AppleTvLauncherCard extends LitElement {
  static styles = launcherStyles;

  private _config?: AppleTvLauncherConfig;
  private _hass?: HomeAssistant;
  private _apps: LauncherApp[] = [];
  private _loading = true;
  private _launching: string | null = null;
  private _powering = false;
  private _error = "";
  private _loadGeneration = 0;
  private _sourceSignature = "";
  private _discoveryConfigSignature = "";

  static getStubConfig(): RawAppleTvLauncherConfig {
    return {
      entity: "media_player.apple_tv",
      columns: DEFAULTS.columns,
      mobile_columns: DEFAULTS.mobile_columns,
    };
  }

  static getConfigForm(): Record<string, unknown> {
    const labels: Record<string, string> = {
      entity: "Apple TV entity",
      title: "Title",
      columns: "Icons per row",
      mobile_columns: "Mobile icons per row",
      show_labels: "Show app names",
      artwork_lookup: "Look up App Store artwork",
      artwork_country: "Preferred App Store country",
      wake_before_launch: "Wake before launching",
      wake_delay: "Wake delay (milliseconds)",
      retry: "Retry once after a failed launch",
    };

    return {
      schema: [
        {
          name: "entity",
          required: true,
          selector: {
            entity: {
              filter: { domain: "media_player", integration: "apple_tv" },
            },
          },
        },
        { name: "title", selector: { text: {} } },
        {
          type: "grid",
          name: "",
          flatten: true,
          column_min_width: "160px",
          schema: [
            {
              name: "columns",
              default: DEFAULTS.columns,
              selector: {
                number: { min: 2, max: 10, step: 1, mode: "box" },
              },
            },
            {
              name: "mobile_columns",
              default: DEFAULTS.mobile_columns,
              selector: { number: { min: 2, max: 6, step: 1, mode: "box" } },
            },
          ],
        },
        { name: "show_labels", default: true, selector: { boolean: {} } },
        {
          type: "expandable",
          name: "",
          title: "Artwork and launch behavior",
          icon: "mdi:tune-variant",
          flatten: true,
          schema: [
            {
              name: "artwork_lookup",
              default: true,
              selector: { boolean: {} },
            },
            {
              name: "artwork_country",
              default: DEFAULTS.artwork_country,
              selector: { text: { type: "text" } },
            },
            {
              name: "wake_before_launch",
              default: true,
              selector: { boolean: {} },
            },
            {
              name: "wake_delay",
              default: DEFAULTS.wake_delay,
              selector: {
                number: { min: 0, max: 15_000, step: 250, mode: "box" },
              },
            },
            { name: "retry", default: true, selector: { boolean: {} } },
          ],
        },
      ],
      computeLabel: (schema: { name: string }) => labels[schema.name],
      computeHelper: (schema: { name: string }) => {
        if (schema.name === "artwork_country") {
          return "Two-letter storefront code, for example nz, gb or us.";
        }
        if (schema.name === "wake_delay") {
          return "Time allowed for tvOS to wake before the app launch is sent.";
        }
        return undefined;
      },
      assertConfig: (config: Record<string, unknown>) => {
        for (const key of ["app_order", "include", "exclude"]) {
          if (config[key] !== undefined && !Array.isArray(config[key])) {
            throw new Error(`'${key}' must be a YAML list.`);
          }
        }
        if (
          config.artwork !== undefined &&
          (!config.artwork ||
            typeof config.artwork !== "object" ||
            Array.isArray(config.artwork))
        ) {
          throw new Error("'artwork' must be a YAML mapping.");
        }
      },
    };
  }

  setConfig(config: RawAppleTvLauncherConfig): void {
    const normalized = normalizeConfig(config);
    const oldSignature = this._discoveryConfigSignature;
    this._config = normalized;
    this._discoveryConfigSignature = JSON.stringify([
      normalized.entity,
      normalized.artwork_lookup,
      normalized.artwork_country,
      normalized.app_order,
      normalized.include,
      normalized.exclude,
      normalized.artwork,
    ]);
    this.requestUpdate();
    if (oldSignature !== this._discoveryConfigSignature) this._scheduleLoad();
  }

  set hass(value: HomeAssistant) {
    const previous = this._hass;
    this._hass = value;
    this.requestUpdate("hass", previous);

    const sources = this._entityState?.attributes.source_list ?? [];
    const signature = `${this._config?.entity ?? ""}|${sources.join("|")}`;
    if (signature !== this._sourceSignature) {
      this._sourceSignature = signature;
      this._scheduleLoad();
    }
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._scheduleLoad();
  }

  getCardSize(): number {
    const columns = this._config?.columns ?? DEFAULTS.columns;
    return Math.max(2, Math.ceil((this._apps.length || columns) / columns) * 2);
  }

  private get _entityState(): HassEntity | undefined {
    const entity = this._config?.entity;
    return entity ? this._hass?.states[entity] : undefined;
  }

  private _scheduleLoad(): void {
    if (!this.isConnected || !this._hass || !this._config) return;
    const generation = ++this._loadGeneration;
    queueMicrotask(() => void this._loadApps(generation));
  }

  private async _loadApps(generation: number): Promise<void> {
    const hass = this._hass;
    const config = this._config;
    if (!hass || !config) return;

    this._loading = true;
    this._error = "";
    this.requestUpdate();

    let apps: LauncherApp[];
    try {
      const response = await hass.callWS<BrowseMediaResponse>({
        type: "media_player/browse_media",
        entity_id: config.entity,
        media_content_type: "apps",
        media_content_id: "apps",
      });
      apps = (response.children ?? [])
        .filter((item) => item?.title)
        .map((item) =>
          emptyApp(
            String(item.title),
            item.media_content_id ? String(item.media_content_id) : null,
          ),
        );
    } catch {
      apps = (this._entityState?.attributes.source_list ?? []).map((name) =>
        emptyApp(String(name), null),
      );
    }

    if (generation !== this._loadGeneration) return;
    apps = prepareApps(apps, config);
    this._apps = apps;
    this._loading = false;
    this.requestUpdate();

    const resolved = await Promise.all(
      apps.map((app) => resolveArtwork(app, config, hass)),
    );
    if (generation !== this._loadGeneration) return;
    this._apps = resolved;
    this.requestUpdate();
  }

  private async _launch(app: LauncherApp): Promise<void> {
    const hass = this._hass;
    const config = this._config;
    if (this._launching || !hass || !config) return;

    this._launching = app.name;
    this._error = "";
    this.requestUpdate();

    const wake = async (): Promise<void> => {
      if (!config.wake_before_launch) return;
      await hass.callService(
        "media_player",
        "turn_on",
        {},
        { entity_id: config.entity },
      );
      if (config.wake_delay) await sleep(config.wake_delay);
    };
    const launch = (): Promise<unknown> =>
      hass.callService(
        "media_player",
        "select_source",
        { source: app.name },
        { entity_id: config.entity },
      );

    try {
      await wake();
      try {
        await launch();
      } catch (firstError) {
        if (!config.retry) throw firstError;
        await wake();
        await launch();
      }
    } catch (error) {
      this._notify(`Could not launch ${app.name}: ${errorMessage(error)}`);
    } finally {
      this._launching = null;
      this.requestUpdate();
    }
  }

  private async _togglePower(): Promise<void> {
    const hass = this._hass;
    const config = this._config;
    if (this._powering || !hass || !config) return;

    const turnOn = !isPoweredOn(this._entityState);
    this._powering = true;
    this.requestUpdate();
    try {
      await hass.callService(
        "media_player",
        turnOn ? "turn_on" : "turn_off",
        {},
        { entity_id: config.entity },
      );
    } catch (error) {
      this._notify(
        `Could not turn Apple TV ${turnOn ? "on" : "off"}: ${errorMessage(error)}`,
      );
    } finally {
      this._powering = false;
      this.requestUpdate();
    }
  }

  private _notify(message: string): void {
    this._error = message;
    this.dispatchEvent(
      new CustomEvent("hass-notification", {
        bubbles: true,
        composed: true,
        detail: { message },
      }),
    );
    this.requestUpdate();
  }

  private _handleArtworkError(app: LauncherApp): void {
    this._apps = this._apps.map((candidate) => {
      if (candidate !== app) return candidate;
      if (candidate.artworkFallback) {
        return {
          ...candidate,
          artwork: candidate.artworkFallback,
          artworkFallback: null,
          unframedArtwork: false,
        };
      }
      return { ...candidate, artwork: null, unframedArtwork: false };
    });
    this.requestUpdate();
  }

  protected render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const state = this._entityState;
    const poweredOn = isPoweredOn(state);
    const title = config.title ?? state?.attributes.friendly_name ?? "Apple TV";
    const activeApp =
      state?.attributes.app_name ?? state?.attributes.source ?? "";
    const cardStyle = {
      "--launcher-columns": String(config.columns),
      "--launcher-mobile-columns": String(config.mobile_columns),
    };

    return html`
      <ha-card style=${styleMap(cardStyle)} aria-busy=${this._loading}>
        <header>
          ${title ? html`<h2>${title}</h2>` : nothing}
          <button
            class=${classMap({
              power: true,
              on: poweredOn,
              off: !poweredOn,
              busy: this._powering,
            })}
            type="button"
            aria-label=${`Turn Apple TV ${poweredOn ? "off" : "on"}`}
            aria-pressed=${poweredOn}
            title=${`Turn Apple TV ${poweredOn ? "off" : "on"}`}
            ?disabled=${this._powering}
            @click=${() => void this._togglePower()}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5v9M7.3 5.9a8 8 0 1 0 9.4 0"></path>
            </svg>
          </button>
        </header>
        ${this._renderContents(activeApp)}
        ${
          this._error
            ? html`<div class="error" role="alert">${this._error}</div>`
            : nothing
        }
      </ha-card>
    `;
  }

  private _renderContents(activeApp: string): TemplateResult {
    if (this._loading) {
      const count = Math.max(this._config?.columns ?? DEFAULTS.columns, 5);
      return html`<div class="grid">
        ${Array.from(
          { length: count },
          (_, index) => html`
            <div
              class="placeholder"
              aria-hidden="true"
              style=${styleMap({ "--delay": `${index * 45}ms` })}
            ></div>
          `,
        )}
      </div>`;
    }

    if (!this._apps.length) {
      const unavailable = ["unavailable", "unknown"].includes(
        this._entityState?.state ?? "unknown",
      );
      return html`<div class="empty">
        <strong
          >${unavailable ? "Apple TV unavailable" : "No launchable apps found"}</strong
        >
        <span>
          Check that the built-in Apple TV integration is connected and
          Companion-paired.
        </span>
      </div>`;
    }

    return html`<div class="grid">
      ${repeat(
        this._apps,
        (app) => `${app.id ?? "source"}|${app.name}`,
        (app) => this._renderApp(app, activeApp),
      )}
    </div>`;
  }

  private _renderApp(app: LauncherApp, activeApp: string): TemplateResult {
    const [background, foreground] = brandStyle(app.name);
    const active =
      activeApp.toLocaleLowerCase() === app.name.toLocaleLowerCase();
    const launching = this._launching === app.name;

    return html`
      <button
        class=${classMap({ app: true, active, launching })}
        type="button"
        aria-label=${`Launch ${app.name}`}
        aria-pressed=${active}
        ?disabled=${Boolean(this._launching)}
        @click=${() => void this._launch(app)}
      >
        <span
          class=${classMap({
            art: true,
            "unframed-artwork": app.unframedArtwork,
            "fallback-artwork": !app.unframedArtwork,
          })}
          style=${styleMap({
            "--tile-bg": background,
            "--tile-fg": foreground,
          })}
        >
          <span class="fallback">${initials(app.name)}</span>
          ${
            app.artwork
              ? html`<img
                  class=${classMap({ contain: app.artworkFit === "contain" })}
                  src=${app.artwork}
                  alt=""
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  @error=${() => this._handleArtworkError(app)}
                />`
              : nothing
          }
          ${
            launching
              ? html`<span class="spinner" aria-hidden="true"></span>`
              : nothing
          }
        </span>
        ${
          this._config?.show_labels
            ? html`<span class="label">${app.name}</span>`
            : nothing
        }
      </button>
    `;
  }
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, AppleTvLauncherCard);
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Apple TV Launcher Card",
    description:
      "A tvOS-style launcher for apps exposed by Home Assistant's Apple TV integration.",
    preview: true,
    documentationURL: "https://github.com/froog/hacs-apple-launcher",
  });
}

console.info(
  `%c APPLE TV LAUNCHER %c ${CARD_VERSION} `,
  "color:#fff;background:#1c1c20;font-weight:700;padding:3px 6px;border-radius:5px 0 0 5px",
  "color:#111;background:#f5f5f7;padding:3px 6px;border-radius:0 5px 5px 0",
);
