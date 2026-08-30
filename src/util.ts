import type { MassPlayer } from "./types";

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

export function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
