import { describe, expect, it } from "vitest";
import type { MassPlayer, MediaItemLite } from "../src/types";
import {
  fmtTime,
  iconFor,
  imageProxyBaseFrom,
  playerLabel,
  roomOf,
  subtitleFor,
  thumbUrl,
} from "../src/util";

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

describe("imageProxyBaseFrom", () => {
  it("extracts the origin from a fully-qualified imageproxy URL", () => {
    expect(
      imageProxyBaseFrom("http://192.168.1.5:8095/imageproxy/abc123?size=512&fmt=jpeg"),
    ).toBe("http://192.168.1.5:8095");
    expect(imageProxyBaseFrom("https://mass.local/imageproxy/deadbeef")).toBe(
      "https://mass.local",
    );
  });

  it("returns undefined for non-imageproxy or missing URLs", () => {
    expect(imageProxyBaseFrom(undefined)).toBeUndefined();
    expect(imageProxyBaseFrom(null)).toBeUndefined();
    expect(imageProxyBaseFrom("")).toBeUndefined();
    expect(imageProxyBaseFrom("http://cdn.example.com/art/cover.jpg")).toBeUndefined();
  });
});

describe("thumbUrl", () => {
  const item = (over: Partial<MediaItemLite> = {}): MediaItemLite =>
    ({ name: "n", ...over }) as MediaItemLite;

  it("returns undefined (emoji fallback) when the item has no images", () => {
    expect(thumbUrl(item())).toBeUndefined();
    expect(thumbUrl(item({ metadata: { images: [] } }))).toBeUndefined();
    expect(thumbUrl(item({ metadata: { images: null } }))).toBeUndefined();
  });

  it("builds a resized imageproxy URL when a proxy id and base are known", () => {
    const it = item({
      metadata: {
        images: [{ type: "thumb", path: "spotify://cover", provider: "spotify", proxy_id: "ff00" }],
      },
    });
    expect(thumbUrl(it, "http://mass.local:8095")).toBe(
      "http://mass.local:8095/imageproxy/ff00?size=256&fmt=png",
    );
  });

  it("falls back to a remotely-accessible full URL when no proxy base is known", () => {
    const it = item({
      metadata: {
        images: [
          { type: "thumb", path: "https://cdn.example.com/cover.jpg", remotely_accessible: true },
        ],
      },
    });
    expect(thumbUrl(it)).toBe("https://cdn.example.com/cover.jpg");
  });

  it("does not use a non-remotely-accessible path without a proxy base", () => {
    const it = item({
      metadata: {
        images: [{ type: "thumb", path: "/local/cover.jpg", proxy_id: "abcd" }],
      },
    });
    expect(thumbUrl(it)).toBeUndefined();
  });

  it("prefers a thumb image, then any image, then the ItemMapping image", () => {
    const withThumb = item({
      metadata: {
        images: [
          { type: "fanart", path: "https://x/fan.jpg", remotely_accessible: true },
          { type: "thumb", path: "https://x/thumb.jpg", remotely_accessible: true },
        ],
      },
    });
    expect(thumbUrl(withThumb)).toBe("https://x/thumb.jpg");

    const noThumb = item({
      metadata: { images: [{ type: "fanart", path: "https://x/fan.jpg", remotely_accessible: true }] },
    });
    expect(thumbUrl(noThumb)).toBe("https://x/fan.jpg");

    const mappingOnly = item({
      image: { path: "https://x/map.jpg", remotely_accessible: true },
    });
    expect(thumbUrl(mappingOnly)).toBe("https://x/map.jpg");
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
