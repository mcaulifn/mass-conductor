import type { MassPlayer, MediaItemImage, MediaItemLite } from "./types";

// The slice of the HA `hass` object needed to map a player to a room via the
// area registry.
export interface AreaRegistryHass {
  areas?: Record<string, { area_id: string; name: string }>;
  devices?: Record<string, { area_id: string | null; identifiers: [string, string][] }>;
  entities?: Record<
    string,
    { entity_id: string; device_id: string | null; area_id: string | null }
  >;
}

/**
 * Resolve a player's room from the HA area registry. The Music Assistant
 * integration registers each player as a device with identifiers
 * ["music_assistant", player_id], so we map player -> device -> area
 * (an entity-level area assignment wins over the device's).
 *
 * :param player: The player to locate.
 * :param hass: The HA object exposing the area/device/entity registries.
 */
export function roomOf(player: MassPlayer, hass?: AreaRegistryHass): string {
  const areas = hass?.areas;
  const devices = hass?.devices;
  if (!areas || !devices) return "Speakers";
  let deviceId: string | undefined;
  let areaId: string | null = null;
  for (const [id, dev] of Object.entries(devices)) {
    if (dev.identifiers?.some((t) => t[0] === "music_assistant" && t[1] === player.player_id)) {
      deviceId = id;
      areaId = dev.area_id;
      break;
    }
  }
  if (!deviceId) return "Speakers";
  for (const ent of Object.values(hass?.entities ?? {})) {
    if (ent.device_id === deviceId && ent.entity_id.startsWith("media_player.") && ent.area_id) {
      areaId = ent.area_id;
      break;
    }
  }
  return areaId && areas[areaId] ? areas[areaId].name : "Speakers";
}

export function playerLabel(p: MassPlayer): string {
  return p.display_name ?? p.name ?? p.player_id;
}

// ---- multi-room grouping helpers -------------------------------------------

/**
 * Whether a player supports Music Assistant's multi-room grouping.
 *
 * MA advertises this via the `set_members` player feature; only such players
 * can act as a group leader / grouping target.
 *
 * :param p: The player to test (may be undefined).
 */
export function supportsGrouping(p?: MassPlayer): boolean {
  return !!p?.supported_features?.includes("set_members");
}

/**
 * Whether `other` may be added to `leader`'s multi-room group.
 *
 * MA exposes `can_group_with` as the set of player_ids the leader can group
 * with; that set may also contain a provider instance_id, meaning every player
 * of that provider is groupable. A player can never group with itself and an
 * unavailable player is never a valid target.
 *
 * :param leader: The prospective group leader / target player.
 * :param other: The candidate player to add to the group.
 */
export function canGroupWith(leader?: MassPlayer, other?: MassPlayer): boolean {
  if (!leader || !other) return false;
  if (leader.player_id === other.player_id) return false;
  if (!other.available) return false;
  const targets = leader.can_group_with;
  if (!targets || !targets.length) return false;
  return (
    targets.includes(other.player_id) ||
    (other.provider != null && targets.includes(other.provider))
  );
}

/**
 * The player_ids currently in `leader`'s group, excluding the leader itself.
 *
 * Prefers the leader's own `group_members` (the server's canonical membership,
 * which for a sync leader includes the leader's own id as the first entry) and
 * unions in any player reporting `synced_to`/`active_group` === leader as a
 * defensive fallback for providers that don't populate `group_members`.
 *
 * :param leader: The group leader / target player.
 * :param players: All known players, used for the fallback derivation.
 */
export function groupMemberIds(leader?: MassPlayer, players: MassPlayer[] = []): string[] {
  if (!leader) return [];
  const ids = new Set<string>();
  for (const m of leader.group_members ?? []) {
    if (m && m !== leader.player_id) ids.add(m);
  }
  for (const p of players) {
    if (p.player_id === leader.player_id) continue;
    if (p.synced_to === leader.player_id || p.active_group === leader.player_id) {
      ids.add(p.player_id);
    }
  }
  return [...ids];
}

/**
 * Resolve the effective group leader for a (possibly synced) player.
 *
 * If `player` is itself synced to another player, that leader is returned so
 * grouping actions target the real group; otherwise `player` is the leader.
 *
 * :param player: The currently selected player.
 * :param players: All known players, used to resolve `synced_to`.
 */
export function groupLeaderFor(
  player?: MassPlayer,
  players: MassPlayer[] = [],
): MassPlayer | undefined {
  if (!player) return undefined;
  if (player.synced_to) {
    const leader = players.find((p) => p.player_id === player.synced_to);
    if (leader) return leader;
  }
  return player;
}

export function iconFor(mt?: string): string {
  switch (mt) {
    case "album":
      return "💿";
    case "artist":
      return "🎤";
    case "playlist":
      return "☰";
    case "radio":
      return "📻";
    default:
      return "♪";
  }
}

export function subtitleFor(it: {
  artists?: { name: string }[];
  media_type?: string;
}): string | undefined {
  const artists = it.artists?.map((a) => a.name).filter(Boolean).join(", ");
  return artists || it.media_type;
}

// Square thumbnail edge, in px. Must be one of the MA imageproxy's allowed
// sizes (0/80/160/256/512/1024); 256 covers a small retina row thumbnail.
const THUMB_SIZE = 256;

/**
 * Extract the MA imageproxy origin (scheme://host[:port]) from a full imageproxy
 * URL, or undefined if the URL isn't one. The card has no direct handle on the
 * MA server's base URL (it talks to HA), so it recovers the origin from a
 * now-playing `current_media.image_url` — which the server already emits as a
 * fully-qualified imageproxy URL the browser can load.
 *
 * :param url: A candidate image URL (e.g. a player's current_media.image_url).
 */
export function imageProxyBaseFrom(url?: string | null): string | undefined {
  if (!url) return undefined;
  const match = /^(https?:\/\/[^/]+)\/imageproxy\//.exec(url);
  return match ? match[1] : undefined;
}

/**
 * Resolve a directly-loadable thumbnail URL for a media item, or undefined when
 * no usable image is present (the caller then shows a type emoji). Prefers the
 * MA imageproxy (resized, lighter) when a proxy id and base are known, otherwise
 * falls back to a remotely-accessible full URL carried on the item.
 *
 * :param it: The media item (search/browse row) to resolve artwork for.
 * :param proxyBase: The MA imageproxy origin, if known (see imageProxyBaseFrom).
 */
export function thumbUrl(
  it: Pick<MediaItemLite, "image" | "metadata">,
  proxyBase?: string,
): string | undefined {
  const img = pickImage(it);
  if (!img?.path) return undefined;
  if (img.proxy_id && proxyBase) {
    return `${proxyBase}/imageproxy/${img.proxy_id}?size=${THUMB_SIZE}&fmt=png`;
  }
  if (img.remotely_accessible && /^https?:\/\//.test(img.path)) {
    return img.path;
  }
  return undefined;
}

export function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Pick the best artwork reference off a media item: a thumb, then any image. */
function pickImage(
  it: Pick<MediaItemLite, "image" | "metadata">,
): MediaItemImage | undefined {
  const images = it.metadata?.images;
  if (images && images.length) {
    const thumb = images.find((im) => im && im.type === "thumb" && im.path);
    if (thumb) return thumb;
    const any = images.find((im) => im && im.path);
    if (any) return any;
  }
  return it.image?.path ? it.image : undefined;
}
