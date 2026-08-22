import { afterEach, describe, expect, it, vi } from "vitest";

import { AppleTvLauncherCard } from "../../src/apple-tv-launcher-card";
import type { HomeAssistant } from "../../src/types";

const apps = [
  ["Netflix", "com.netflix.Netflix"],
  ["TVNZ+", "nz.co.tvnz.ondemand.iphone"],
];

function createHass(overrides: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    states: {
      "media_player.lounge": {
        state: "idle",
        attributes: {
          friendly_name: "Lounge Apple TV",
          app_name: "Netflix",
          source_list: apps.map(([name]) => name),
        },
      },
    },
    callWS: vi.fn(async () => ({
      children: apps.map(([title, media_content_id]) => ({
        title,
        media_content_id,
      })),
    })),
    callService: vi.fn(async () => undefined),
    ...overrides,
  } as HomeAssistant;
}

async function mount(hass = createHass()): Promise<AppleTvLauncherCard> {
  const card = new AppleTvLauncherCard();
  card.setConfig({
    entity: "media_player.lounge",
    artwork_lookup: false,
    wake_delay: 0,
  });
  document.body.append(card);
  card.hass = hass;
  await vi.waitFor(() => {
    expect(card.shadowRoot?.querySelectorAll("button.app")).toHaveLength(2);
  });
  return card;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("AppleTvLauncherCard", () => {
  it("discovers apps and renders accessible, active buttons", async () => {
    const card = await mount();
    const buttons = [
      ...card.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.app"),
    ];

    expect(buttons.map((button) => button.ariaLabel)).toEqual([
      "Launch Netflix",
      "Launch TVNZ+",
    ]);
    expect(buttons[0].classList.contains("active")).toBe(true);
  });

  it("falls back to source_list when media browsing fails", async () => {
    const hass = createHass({
      callWS: vi.fn(async () => Promise.reject(new Error("no browse"))),
    });
    const card = await mount(hass);

    expect(
      [...card.shadowRoot!.querySelectorAll(".label")].map(
        (label) => label.textContent,
      ),
    ).toEqual(["Netflix", "TVNZ+"]);
  });

  it("wakes then launches the selected app", async () => {
    const hass = createHass();
    const card = await mount(hass);
    card
      .shadowRoot!.querySelectorAll<HTMLButtonElement>("button.app")[1]
      .click();

    await vi.waitFor(() => expect(hass.callService).toHaveBeenCalledTimes(2));
    expect(
      vi.mocked(hass.callService).mock.calls.map((call) => call[1]),
    ).toEqual(["turn_on", "select_source"]);
    expect(vi.mocked(hass.callService).mock.calls[1][2]).toEqual({
      source: "TVNZ+",
    });
  });

  it("retries one failed launch and then stops", async () => {
    let launches = 0;
    const callService = vi.fn(async (_domain: string, service: string) => {
      if (service === "select_source" && launches++ === 0)
        throw new Error("asleep");
    });
    const hass = createHass({ callService });
    const card = await mount(hass);
    card.shadowRoot!.querySelector<HTMLButtonElement>("button.app")!.click();

    await vi.waitFor(() => expect(callService).toHaveBeenCalledTimes(4));
    expect(callService.mock.calls.map((call) => call[1])).toEqual([
      "turn_on",
      "select_source",
      "turn_on",
      "select_source",
    ]);
  });

  it("emits one notification after the bounded retry fails", async () => {
    const callService = vi.fn(async (_domain: string, service: string) => {
      if (service === "select_source") throw new Error("still asleep");
    });
    const card = await mount(createHass({ callService }));
    const notification = vi.fn();
    card.addEventListener("hass-notification", notification);
    card.shadowRoot!.querySelector<HTMLButtonElement>("button.app")!.click();

    await vi.waitFor(() => expect(notification).toHaveBeenCalledOnce());
    expect(callService).toHaveBeenCalledTimes(4);
    expect(
      card.shadowRoot!.querySelector("[role=alert]")?.textContent,
    ).toContain("still asleep");
  });
  it("declares grid options so the layout editor allows resizing", () => {
    // An empty object here makes the card editor's Layout tab report that the
    // card does not support resizing, so the contract is that it stays filled.
    const options = new AppleTvLauncherCard().getGridOptions();

    expect(Object.keys(options).length).toBeGreaterThan(0);
    expect(options).toMatchObject({
      columns: "full",
      rows: "auto",
      min_columns: 6,
    });
  });
});
