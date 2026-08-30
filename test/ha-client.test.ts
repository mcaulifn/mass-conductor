import { describe, expect, it, vi } from "vitest";
import { HaClient, type HassConnectionLike } from "../src/ha-client";

function makeHass() {
  const subs: { cb: (m: unknown) => void; sub: Record<string, unknown> }[] = [];
  const connection = {
    sendMessagePromise: vi.fn((_msg: Record<string, unknown>) => Promise.resolve({ ok: true })),
    subscribeMessage: vi.fn(
      (cb: (m: unknown) => void, sub: Record<string, unknown>) => {
        subs.push({ cb, sub });
        return Promise.resolve(() => {});
      },
    ),
  };
  return { hass: { connection } as HassConnectionLike, connection, subs };
}

const lastCall = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls.at(-1)?.[0] as Record<string, unknown>;

describe("HaClient command payloads", () => {
  it("getPlayers sends players/all through the passthrough (no args key)", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).getPlayers();
    expect(connection.sendMessagePromise).toHaveBeenCalledWith({
      type: "mass_conductor/command",
      command: "players/all",
    });
  });

  it("search sets media_types + default limit and omits optional args", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).search("pink floyd");
    expect(connection.sendMessagePromise).toHaveBeenCalledWith({
      type: "mass_conductor/command",
      command: "music/search",
      args: {
        search_query: "pink floyd",
        media_types: ["artist", "album", "track", "playlist", "radio"],
        limit: 8,
      },
    });
  });

  it("search includes providers and user when supplied", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).search("q", { providers: ["spotify"], userId: "u1", limit: 3 });
    expect(lastCall(connection.sendMessagePromise).args).toMatchObject({
      providers: ["spotify"],
      user: "u1",
      limit: 3,
    });
  });

  it("browse omits path/player_id when not given, includes them when given", async () => {
    const { hass, connection } = makeHass();
    const c = new HaClient(hass);
    await c.browse();
    expect(lastCall(connection.sendMessagePromise)).toEqual({
      type: "mass_conductor/command",
      command: "music/browse",
      args: {},
    });
    await c.browse("spotify://", "p1");
    expect(lastCall(connection.sendMessagePromise).args).toEqual({
      path: "spotify://",
      player_id: "p1",
    });
  });

  it("seek and setVolume round their numeric values", async () => {
    const { hass, connection } = makeHass();
    const c = new HaClient(hass);
    await c.seek("p1", 12.7);
    expect(lastCall(connection.sendMessagePromise).args).toEqual({ player_id: "p1", position: 13 });
    await c.setVolume("p1", 40.4);
    expect(lastCall(connection.sendMessagePromise).args).toEqual({
      player_id: "p1",
      volume_level: 40,
    });
  });

  it("playMedia includes the user only when provided", async () => {
    const { hass, connection } = makeHass();
    const c = new HaClient(hass);
    await c.playMedia("p1", "spotify://track/1");
    expect(lastCall(connection.sendMessagePromise).args).toEqual({
      queue_id: "p1",
      media: "spotify://track/1",
    });
    await c.playMedia("p1", "uri", "u1");
    expect((lastCall(connection.sendMessagePromise).args as Record<string, unknown>).user).toBe(
      "u1",
    );
  });
});

describe("HaClient events", () => {
  it("subscribes once and forwards events to listeners", async () => {
    const { hass, connection, subs } = makeHass();
    const seen: { event: string }[] = [];
    new HaClient(hass).onEvent((e) => seen.push(e as { event: string }));
    await Promise.resolve();
    await Promise.resolve();
    expect(connection.subscribeMessage).toHaveBeenCalledTimes(1);
    expect(subs[0].sub).toEqual({ type: "mass_conductor/subscribe_events" });
    subs[0].cb({ event: "player_updated", object_id: "p1", data: {} });
    expect(seen).toHaveLength(1);
    expect(seen[0].event).toBe("player_updated");
  });

  it("the returned unsubscribe stops delivery to that listener", async () => {
    const { hass, subs } = makeHass();
    const seen: unknown[] = [];
    const off = new HaClient(hass).onEvent((e) => seen.push(e));
    await Promise.resolve();
    await Promise.resolve();
    off();
    subs[0].cb({ event: "player_updated" });
    expect(seen).toHaveLength(0);
  });
});
