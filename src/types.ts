export interface HassEntity {
  state: string;
  attributes: {
    friendly_name?: string;
    app_name?: string;
    source?: string;
    source_list?: string[];
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config?: { country?: string | null };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
}

export interface AppleTvLauncherConfig {
  entity: string;
  title?: string;
  columns: number;
  mobile_columns: number;
  show_labels: boolean;
  artwork_lookup: boolean;
  artwork_country: string;
  wake_before_launch: boolean;
  wake_delay: number;
  retry: boolean;
  app_order: string[];
  include: string[];
  exclude: string[];
  artwork: Record<string, string>;
}

export interface RawAppleTvLauncherConfig extends Partial<AppleTvLauncherConfig> {
  entity: string;
}

/**
 * Sizing contract for the sections view grid, mirroring Home Assistant's
 * LovelaceGridOptions. Without it the card editor's Layout tab reports that the
 * card does not support resizing.
 */
export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

export interface LauncherApp {
  name: string;
  id: string | null;
  artwork: string | null;
  artworkFallback: string | null;
  artworkFit: "cover" | "contain";
  unframedArtwork: boolean;
}

export interface BrowseMediaChild {
  title?: string;
  media_content_id?: string;
}

export interface BrowseMediaResponse {
  children?: BrowseMediaChild[];
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
