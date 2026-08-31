import { describe, expect, it, vi } from "vitest";
import { HaClient, type HassConnectionLike } from "../src/ha-client";
import {
  canGroupWith,
  groupLeaderFor,
  groupMemberIds,
  supportsGrouping,
} from "../src/util";
import type { MassPlayer } from "../src/types";

function player(overrides: Partial<MassPlayer> & { player_id: string }): MassPlayer {
  return {
    name: overrides.player_id,
    available: true,
    playback_state: "idle",
    ...overrides,
  } as MassPlayer;
}

function makeHass() {
  const connection = {
    sendMessagePromise: vi.fn((_msg: Record<string, unknown>) => Promise.resolve({ ok: true })),
    subscribeMessage: vi.fn(() => Promise.resolve(() => {})),
  };
  return { hass: { connection } as HassConnectionLike, connection };
}

const lastCall = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls.at(-1)?.[0] as Record<string, unknown>;

describe("supportsGrouping", () => {
  it("is true only when the set_members feature is present", () => {
    expect(supportsGrouping(player({ player_id: "a", supported_features: ["set_members"] }))).toBe(
      true,
    );
    expect(supportsGrouping(player({ player_id: "a", supported_features: ["pause"] }))).toBe(false);
    expect(supportsGrouping(player({ player_id: "a" }))).toBe(false);
    expect(supportsGrouping(undefined)).toBe(false);
  });
});

describe("canGroupWith", () => {
  const leader = player({
    player_id: "leader",
    can_group_with: ["b", "sonos_provider"],
    supported_features: ["set_members"],
  });

  it("allows a target listed by its player_id", () => {
    expect(canGroupWith(leader, player({ player_id: "b" }))).toBe(true);
  });

  it("allows a target whose provider instance is listed (whole-provider grouping)", () => {
    expect(canGroupWith(leader, player({ player_id: "c", provider: "sonos_provider" }))).toBe(true);
  });

  it("rejects a target that is neither listed by id nor by provider", () => {
    expect(canGroupWith(leader, player({ player_id: "x", provider: "other" }))).toBe(false);
  });

  it("rejects self, unavailable targets, and empty/missing can_group_with", () => {
    expect(canGroupWith(leader, player({ player_id: "leader" }))).toBe(false);
    expect(canGroupWith(leader, player({ player_id: "b", available: false }))).toBe(false);
    expect(canGroupWith(player({ player_id: "l", can_group_with: [] }), player({ player_id: "b" }))).toBe(
      false,
    );
    expect(canGroupWith(undefined, player({ player_id: "b" }))).toBe(false);
    expect(canGroupWith(leader, undefined)).toBe(false);
  });
});

describe("groupMemberIds", () => {
  it("uses the leader's group_members and drops the leader's own id", () => {
    const leader = player({ player_id: "l", group_members: ["l", "b", "c"] });
    expect(groupMemberIds(leader, [])).toEqual(["b", "c"]);
  });

  it("falls back to players synced_to / active_group the leader when group_members is empty", () => {
    const leader = player({ player_id: "l" });
    const players = [
      leader,
      player({ player_id: "b", synced_to: "l" }),
      player({ player_id: "c", active_group: "l" }),
      player({ player_id: "d", synced_to: "other" }),
    ];
    expect(groupMemberIds(leader, players).sort()).toEqual(["b", "c"]);
  });

  it("does not duplicate ids present in both group_members and synced_to", () => {
    const leader = player({ player_id: "l", group_members: ["l", "b"] });
    const players = [leader, player({ player_id: "b", synced_to: "l" })];
    expect(groupMemberIds(leader, players)).toEqual(["b"]);
  });

  it("returns [] for no leader", () => {
    expect(groupMemberIds(undefined, [])).toEqual([]);
  });
});

describe("groupLeaderFor", () => {
  it("returns the resolved leader when the selected player is synced", () => {
    const leader = player({ player_id: "l" });
    const follower = player({ player_id: "f", synced_to: "l" });
    expect(groupLeaderFor(follower, [leader, follower])?.player_id).toBe("l");
  });

  it("returns the player itself when not synced or when the leader is unknown", () => {
    const standalone = player({ player_id: "s" });
    expect(groupLeaderFor(standalone, [standalone])?.player_id).toBe("s");
    const orphan = player({ player_id: "o", synced_to: "missing" });
    expect(groupLeaderFor(orphan, [orphan])?.player_id).toBe("o");
    expect(groupLeaderFor(undefined, [])).toBeUndefined();
  });
});

describe("HaClient grouping command payloads", () => {
  it("setGroupMembers sends set_members with add ids only", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).setGroupMembers("leader", { add: ["b", "c"] });
    expect(connection.sendMessagePromise).toHaveBeenCalledWith({
      type: "mass_conductor/command",
      command: "players/cmd/set_members",
      args: { target_player: "leader", player_ids_to_add: ["b", "c"] },
    });
  });

  it("setGroupMembers sends remove ids only", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).setGroupMembers("leader", { remove: ["b"] });
    expect(lastCall(connection.sendMessagePromise).args).toEqual({
      target_player: "leader",
      player_ids_to_remove: ["b"],
    });
  });

  it("setGroupMembers omits empty add/remove arrays", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).setGroupMembers("leader", { add: [], remove: [] });
    expect(lastCall(connection.sendMessagePromise).args).toEqual({ target_player: "leader" });
  });

  it("groupPlayer sends players/cmd/group with player_id + target_player", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).groupPlayer("child", "leader");
    expect(lastCall(connection.sendMessagePromise)).toEqual({
      type: "mass_conductor/command",
      command: "players/cmd/group",
      args: { player_id: "child", target_player: "leader" },
    });
  });

  it("ungroupPlayer sends players/cmd/ungroup with player_id", async () => {
    const { hass, connection } = makeHass();
    await new HaClient(hass).ungroupPlayer("child");
    expect(lastCall(connection.sendMessagePromise)).toEqual({
      type: "mass_conductor/command",
      command: "players/cmd/ungroup",
      args: { player_id: "child" },
    });
  });
});
