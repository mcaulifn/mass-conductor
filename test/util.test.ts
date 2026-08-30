import { describe, expect, it } from "vitest";
import type { MassPlayer } from "../src/types";
import { fmtTime, iconFor, playerLabel, roomOf, subtitleFor } from "../src/util";

const player = (over: Partial<MassPlayer> = {}): MassPlayer =>
  ({ player_id: "ma_1", available: true, playback_state: "idle", name: "n", ...over }) as MassPlayer;

describe("fmtTime", () => {
  it("formats seconds as m:ss", () => {
    expect(fmtTime(0)).toBe("0:00");
    expect(fmtTime(5)).toBe("0:05");
    expect(fmtTime(65)).toBe("1:05");
    expect(fmtTime(3661)).toBe("61:01");
  });

  it("guards negatives and non-finite input", () => {
    expect(fmtTime(-1)).toBe("0:00");
    expect(fmtTime(Number.NaN)).toBe("0:00");
    expect(fmtTime(Number.POSITIVE_INFINITY)).toBe("0:00");
  });
});

describe("iconFor", () => {
  it("maps known media types", () => {
    expect(iconFor("album")).toBe("💿");
    expect(iconFor("artist")).toBe("🎤");
    expect(iconFor("playlist")).toBe("☰");
    expect(iconFor("radio")).toBe("📻");
  });

  it("falls back for tracks / unknown / undefined", () => {
    expect(iconFor("track")).toBe("♪");
    expect(iconFor(undefined)).toBe("♪");
  });
});

describe("subtitleFor", () => {
  it("joins artist names", () => {
    expect(subtitleFor({ artists: [{ name: "A" }, { name: "B" }] })).toBe("A, B");
  });

  it("falls back to media_type when there are no artists", () => {
    expect(subtitleFor({ media_type: "album" })).toBe("album");
    expect(subtitleFor({ artists: [], media_type: "playlist" })).toBe("playlist");
  });

  it("is undefined when there is nothing to show", () => {
    expect(subtitleFor({})).toBeUndefined();
  });
});

describe("playerLabel", () => {
  it("prefers display_name, then name, then id", () => {
    expect(playerLabel(player({ display_name: "Kitchen" }))).toBe("Kitchen");
    expect(playerLabel(player({ display_name: undefined, name: "Living" }))).toBe("Living");
    expect(playerLabel(player({ display_name: undefined, name: undefined }))).toBe("ma_1");
  });
});

describe("roomOf", () => {
  it("returns Speakers without the area/device registries", () => {
    expect(roomOf(player())).toBe("Speakers");
    expect(roomOf(player(), {})).toBe("Speakers");
  });

  it("maps player -> device (by identifier) -> area name", () => {
    expect(
      roomOf(player(), {
        areas: { a1: { area_id: "a1", name: "Kitchen" } },
        devices: { d1: { area_id: "a1", identifiers: [["music_assistant", "ma_1"]] } },
        entities: {},
      }),
    ).toBe("Kitchen");
  });

  it("lets an entity-level area override the device's area", () => {
    expect(
      roomOf(player(), {
        areas: { a1: { area_id: "a1", name: "Kitchen" }, a2: { area_id: "a2", name: "Patio" } },
        devices: { d1: { area_id: "a1", identifiers: [["music_assistant", "ma_1"]] } },
        entities: {
          "media_player.x": { entity_id: "media_player.x", device_id: "d1", area_id: "a2" },
        },
      }),
    ).toBe("Patio");
  });

  it("returns Speakers when the matched device has no area", () => {
    expect(
      roomOf(player(), {
        areas: {},
        devices: { d1: { area_id: null, identifiers: [["music_assistant", "ma_1"]] } },
        entities: {},
      }),
    ).toBe("Speakers");
  });

  it("returns Speakers when no device matches the player", () => {
    expect(
      roomOf(player(), {
        areas: { a1: { area_id: "a1", name: "Kitchen" } },
        devices: { d1: { area_id: "a1", identifiers: [["music_assistant", "other"]] } },
        entities: {},
      }),
    ).toBe("Speakers");
  });
});
