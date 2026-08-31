// Minimal shapes for the MA objects this card touches. These mirror
// music_assistant_models but only the fields we actually read.

export interface MassUser {
  user_id: string;
  username: string;
  role: "admin" | "user" | "guest";
  enabled: boolean;
  display_name?: string | null;
  avatar_url?: string | null;
  provider_filter: string[];
  player_filter: string[];
}

export type PlaybackState = "idle" | "paused" | "playing" | "unknown";

export interface PlayerMedia {
  uri: string;
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  image_url?: string | null;
  duration?: number | null;
  elapsed_time?: number | null;
  elapsed_time_last_updated?: number | null;
}

export interface MassPlayer {
  player_id: string;
  provider?: string;
  type?: string;
  name: string;
  display_name?: string;
  available: boolean;
  playback_state: PlaybackState;
  powered?: boolean | null;
  volume_level?: number | null; // 0..100
  volume_muted?: boolean | null;
  elapsed_time?: number | null;
  elapsed_time_last_updated?: number | null;
  current_media?: PlayerMedia | null;
  group_members?: string[];
  can_group_with?: string[];
  synced_to?: string | null;
  active_group?: string | null;
  supported_features?: string[];
  extra_attributes?: Record<string, unknown>;
}

export interface MassProvider {
  instance_id: string;
  domain: string;
  name: string;
  type: string; // "music" | "player" | "metadata" | "plugin"
}

// Artwork reference as serialized by MA (music_assistant_models MediaItemImage).
// `path` is either a full URL (when remotely_accessible) or a provider-relative
// path; `proxy_id` is the opaque id for the MA imageproxy endpoint.
export interface MediaItemImage {
  type?: string; // ImageType, e.g. "thumb"
  path: string;
  provider?: string;
  remotely_accessible?: boolean;
  proxy_id?: string | null;
}

export interface MediaItemLite {
  uri?: string;
  name: string;
  media_type?: string;
  version?: string;
  artists?: { name: string }[];
  // present on browse results
  path?: string; // navigation path for a BrowseFolder
  is_playable?: boolean;
  provider?: string;
  subtitle?: string | null;
  // artwork: full media items carry metadata.images; ItemMapping-shaped
  // references carry a single `image`. Either may be absent.
  image?: MediaItemImage | null;
  metadata?: { images?: MediaItemImage[] | null } | null;
}

export interface SearchResults {
  tracks?: MediaItemLite[];
  albums?: MediaItemLite[];
  artists?: MediaItemLite[];
  playlists?: MediaItemLite[];
  radio?: MediaItemLite[];
}

// Wire shape of an MA event message (music_assistant_models/event.py).
export interface MassEvent {
  event: string; // EventType, e.g. "player_updated"
  object_id?: string | null;
  data?: unknown;
}

export interface MassConductorConfig {
  type: string;
  title?: string;
  // Path B: the MA connection (URL + token) lives server-side in the
  // `mass_conductor` HA integration, so no url/token is configured here.
  // If set, play/search as this MA user (user_id or username) — the
  // server-held admin connection performs the impersonation.
  default_user?: string;
  // Reserved for a future in-card user picker; unused by the current UI.
  allow_everyone?: boolean;
}
