import type {
  MassEvent,
  MassPlayer,
  MassProvider,
  MediaItemLite,
  SearchResults,
} from "./types";

// Path B transport: the card never opens its own socket. It talks to the
// `mass_conductor` HA integration over HA's authenticated, same-origin
// WebSocket. The integration holds the MA connection (URL + token) server-side
// and forwards a safelisted subset of MA commands, plus streams MA events.

type EventListener = (event: MassEvent) => void;

interface HaConnection {
  sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
  subscribeMessage<T>(
    callback: (message: T) => void,
    subscribeMessage: Record<string, unknown>,
  ): Promise<() => void>;
}

export interface HassConnectionLike {
  connection: HaConnection;
}

/**
 * MA client that speaks to Home Assistant instead of the MA server directly.
 * Keeps the same method surface the card's UI already calls, so swapping the
 * transport doesn't touch the UI. One instance per card.
 */
export class HaClient {
  private listeners = new Set<EventListener>();
  private unsub?: () => void;
  private subscribing?: Promise<void>;

  constructor(private hass: HassConnectionLike) {}

  /** Refresh the `hass` reference (HA replaces it on every state change). */
  setHass(hass: HassConnectionLike): void {
    this.hass = hass;
  }

  onEvent(listener: EventListener): () => void {
    this.listeners.add(listener);
    void this.ensureSubscribed();
    return () => this.listeners.delete(listener);
  }

  private async ensureSubscribed(): Promise<void> {
    if (this.unsub || this.subscribing) return;
    this.subscribing = this.hass.connection
      .subscribeMessage<MassEvent>(
        (ev) => {
          for (const l of this.listeners) l(ev);
        },
        { type: "mass_conductor/subscribe_events" },
      )
      .then((unsub) => {
        this.unsub = unsub;
      })
      .catch(() => {
        // leave unsubscribed; a later onEvent() call will retry
      })
      .finally(() => {
        this.subscribing = undefined;
      });
    return this.subscribing;
  }

  private command<T = unknown>(
    command: string,
    args?: Record<string, unknown>,
  ): Promise<T> {
    return this.hass.connection.sendMessagePromise<T>({
      type: "mass_conductor/command",
      command,
      ...(args ? { args } : {}),
    });
  }

  // ---- reads -----------------------------------------------------------

  getPlayers(): Promise<MassPlayer[]> {
    return this.command<MassPlayer[]>("players/all");
  }

  getProviders(): Promise<MassProvider[]> {
    return this.command<MassProvider[]>("providers");
  }

  search(
    query: string,
    opts: { userId?: string; providers?: string[]; limit?: number } = {},
  ): Promise<SearchResults> {
    return this.command<SearchResults>("music/search", {
      search_query: query,
      media_types: ["artist", "album", "track", "playlist", "radio"],
      limit: opts.limit ?? 8,
      ...(opts.providers?.length ? { providers: opts.providers } : {}),
      ...(opts.userId ? { user: opts.userId } : {}),
    });
  }

  /**
   * Browse the provider/library tree. `path` undefined/"root" = top level
   * (a folder per provider); pass a BrowseFolder's `path` to descend.
   */
  browse(path?: string, playerId?: string): Promise<MediaItemLite[]> {
    return this.command<MediaItemLite[]>("music/browse", {
      ...(path ? { path } : {}),
      ...(playerId ? { player_id: playerId } : {}),
    });
  }

  // ---- player commands -------------------------------------------------

  playPause(playerId: string): Promise<void> {
    return this.command("players/cmd/play_pause", { player_id: playerId });
  }

  next(playerId: string): Promise<void> {
    return this.command("players/cmd/next", { player_id: playerId });
  }

  previous(playerId: string): Promise<void> {
    return this.command("players/cmd/previous", { player_id: playerId });
  }

  seek(playerId: string, position: number): Promise<void> {
    return this.command("players/cmd/seek", {
      player_id: playerId,
      position: Math.round(position),
    });
  }

  setVolume(playerId: string, volume: number): Promise<void> {
    return this.command("players/cmd/volume_set", {
      player_id: playerId,
      volume_level: Math.round(volume),
    });
  }

  setMute(playerId: string, muted: boolean): Promise<void> {
    return this.command("players/cmd/volume_mute", {
      player_id: playerId,
      muted,
    });
  }

  setPower(playerId: string, powered: boolean): Promise<void> {
    return this.command("players/cmd/power", {
      player_id: playerId,
      powered,
    });
  }

  /** Play media on a player's queue, optionally as another user (impersonation). */
  playMedia(
    playerId: string,
    media: string | string[],
    userId?: string,
  ): Promise<void> {
    return this.command("player_queues/play_media", {
      queue_id: playerId,
      media,
      ...(userId ? { user: userId } : {}),
    });
  }
}
