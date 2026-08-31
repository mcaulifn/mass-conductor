import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HaClient, type HassConnectionLike } from "./ha-client";
import {
  type AreaRegistryHass,
  canGroupWith,
  fmtTime,
  groupLeaderFor,
  groupMemberIds,
  iconFor,
  imageProxyBaseFrom,
  playerLabel,
  roomOf,
  subtitleFor,
  supportsGrouping,
  thumbUrl,
} from "./util";
import type {
  MassPlayer,
  MassProvider,
  MassConductorConfig,
  MassUser,
  MediaItemLite,
  SearchResults,
} from "./types";

// The HA `hass` object we read: the same-origin WebSocket connection (for the
// mass_conductor passthrough) plus the area registry (to map players to rooms).
interface HassLike extends HassConnectionLike, AreaRegistryHass {}

@customElement("mass-conductor")
export class MassConductor extends LitElement {
  @property({ attribute: false }) hass?: HassLike;

  @state() private config?: MassConductorConfig;
  @state() private users: MassUser[] = [];
  @state() private players: MassPlayer[] = [];
  @state() private userId?: string;
  @state() private playerId?: string;
  @state() private error = "";
  @state() private loading = true;
  @state() private query = "";
  @state() private view: "main" | "players" | "browse" | "group" = "main";
  @state() private playerQuery = "";
  @state() private providers: MassProvider[] = [];
  @state() private providerId?: string; // selected source provider; undefined = all
  @state() private results?: SearchResults;
  @state() private searching = false;
  @state() private browseMode: "tree" | "search" = "tree";
  @state() private browseItems: MediaItemLite[] = [];
  @state() private browseStack: { name: string; path?: string }[] = [];
  @state() private browsing = false;
  @state() private statusMsg = "";
  @state() private tick = 0; // forces progress re-render each second

  private client?: HaClient;
  private unsub?: () => void;
  private timer?: number;
  private refreshHandle?: number;
  private initialized = false;

  setConfig(config: MassConductorConfig): void {
    this.config = config;
    this.userId = config.default_user;
  }

  getCardSize(): number {
    return 6;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.timer = window.setInterval(() => (this.tick = Date.now()), 1000);
    this.maybeInit();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsub?.();
    this.unsub = undefined;
    this.initialized = false;
    if (this.timer) window.clearInterval(this.timer);
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) this.maybeInit();
  }

  // The card gets `hass` after setConfig, and again on every HA state change.
  // Create the client the first time `hass` is available, then keep its
  // reference fresh (HA hands out a new `hass` object each update).
  private maybeInit(): void {
    if (!this.hass) return;
    if (!this.client) this.client = new HaClient(this.hass);
    else this.client.setHass(this.hass);
    if (this.initialized) return;
    this.initialized = true;
    this.unsub = this.client.onEvent((ev) => this.onEvent(ev));
    void this.loadData();
  }

  private onEvent(ev: { event: string; object_id?: string | null; data?: unknown }): void {
    if (ev.event === "player_updated" && ev.data) {
      const updated = ev.data as MassPlayer;
      const idx = this.players.findIndex((p) => p.player_id === updated.player_id);
      if (idx >= 0) {
        const copy = [...this.players];
        copy[idx] = updated;
        this.players = copy;
      }
    } else if (
      ev.event === "player_added" ||
      ev.event === "player_removed" ||
      ev.event === "queue_updated"
    ) {
      this.debouncedRefresh();
    }
  }

  private debouncedRefresh(): void {
    if (this.refreshHandle) window.clearTimeout(this.refreshHandle);
    this.refreshHandle = window.setTimeout(() => void this.loadData(), 400);
  }

  private async loadData(): Promise<void> {
    if (!this.client) return;
    try {
      const [players, providers] = await Promise.all([
        this.client.getPlayers(),
        this.client.getProviders(),
      ]);
      this.players = players;
      this.providers = providers;
      this.error = "";
      // when "Everyone" is disabled, a real user must always be selected
      if (!this.allowEveryone && !this.selectedUser && this.users.length) {
        const preferred = this.users.find(
          (u) => u.user_id === this.config?.default_user || u.username === this.config?.default_user,
        );
        this.userId = (preferred ?? this.users[0]).user_id;
      }
      if (!this.playerId || !this.scopedPlayers.some((p) => p.player_id === this.playerId)) {
        this.playerId = this.pickDefaultPlayer()?.player_id;
      }
    } catch (err) {
      this.error = `Could not reach Music Assistant: ${(err as Error).message}`;
    } finally {
      this.loading = false;
    }
  }

  private get selectedUser(): MassUser | undefined {
    return this.users.find((u) => u.user_id === this.userId);
  }

  // Players are independent of the user (user is a sourcing concept only):
  // show every available, non-synced player.
  private get scopedPlayers(): MassPlayer[] {
    return this.players.filter((p) => p.available && !p.synced_to);
  }

  private get selectedPlayer(): MassPlayer | undefined {
    return this.players.find((p) => p.player_id === this.playerId);
  }

  // The MA imageproxy origin, recovered from any player's now-playing image URL
  // (the server emits those as fully-qualified imageproxy URLs). Used to build
  // resized thumbnails for search/browse rows; undefined until a player has art.
  private get imageProxyBase(): string | undefined {
    for (const p of this.players) {
      const base = imageProxyBaseFrom(p.current_media?.image_url);
      if (base) return base;
    }
    return undefined;
  }

  private pickDefaultPlayer(): MassPlayer | undefined {
    const playing = this.scopedPlayers.find((p) => p.playback_state === "playing");
    return playing ?? this.scopedPlayers[0];
  }

  private liveElapsed(p: MassPlayer): number {
    const cm = p.current_media;
    const base = cm?.elapsed_time ?? p.elapsed_time ?? 0;
    const last = cm?.elapsed_time_last_updated ?? p.elapsed_time_last_updated;
    if (p.playback_state === "playing" && last) {
      return base + (Date.now() / 1000 - last);
    }
    return base;
  }

  // ---- actions ---------------------------------------------------------

  private cmd(fn: (c: HaClient, id: string) => Promise<unknown>): void {
    const id = this.playerId;
    if (!this.client || !id) return;
    fn(this.client, id).catch((e) => (this.error = (e as Error).message));
  }

  // ---- grouping --------------------------------------------------------

  // The effective group leader for grouping actions: if the selected player is
  // itself synced to another, that leader is targeted so we manage the real group.
  private get groupLeader(): MassPlayer | undefined {
    return groupLeaderFor(this.selectedPlayer, this.players);
  }

  // Players currently in the selected player's group (excluding the leader).
  private get groupMembers(): MassPlayer[] {
    const ids = new Set(groupMemberIds(this.groupLeader, this.players));
    return this.players.filter((p) => ids.has(p.player_id));
  }

  // Available, compatible players that are not already in the group.
  private get groupCandidates(): MassPlayer[] {
    const leader = this.groupLeader;
    if (!leader) return [];
    const memberIds = new Set(groupMemberIds(leader, this.players));
    return this.players.filter(
      (p) => p.player_id !== leader.player_id && !memberIds.has(p.player_id) && canGroupWith(leader, p),
    );
  }

  private get canManageGroup(): boolean {
    return supportsGrouping(this.groupLeader);
  }

  // Run a grouping command against the client, surfacing any error to the user.
  // State refreshes live via player_updated events; we don't optimistically mutate.
  private runGroupCmd(fn: (c: HaClient) => Promise<unknown>): void {
    if (!this.client) return;
    try {
      fn(this.client).catch((e) => (this.error = (e as Error).message));
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  private addToGroup(playerId: string): void {
    const leader = this.groupLeader;
    if (!leader) return;
    this.runGroupCmd((c) => c.setGroupMembers(leader.player_id, { add: [playerId] }));
  }

  private removeFromGroup(playerId: string): void {
    const leader = this.groupLeader;
    if (!leader) return;
    this.runGroupCmd((c) => c.setGroupMembers(leader.player_id, { remove: [playerId] }));
  }

  private ungroupAll(): void {
    const leader = this.groupLeader;
    if (!leader) return;
    this.runGroupCmd((c) => c.ungroupPlayer(leader.player_id));
  }

  // the selectable sources = music provider instances (each is an account)
  private get musicProviders(): MassProvider[] {
    return this.providers.filter((p) => p.type === "music");
  }

  private async doSearch(): Promise<void> {
    if (!this.client || !this.query.trim()) return;
    this.browseMode = "search";
    this.searching = true;
    this.results = undefined;
    try {
      this.results = await this.client.search(this.query.trim(), {
        userId: this.userId,
        providers: this.providerId ? [this.providerId] : undefined,
      });
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.searching = false;
    }
  }

  private openBrowse(): void {
    this.view = "browse";
    this.browseMode = "tree";
    if (!this.browseStack.length) void this.loadBrowse([{ name: "Browse" }]);
  }

  // Load the folder described by the last crumb of `stack` and adopt it.
  private async loadBrowse(stack: { name: string; path?: string }[]): Promise<void> {
    if (!this.client) return;
    this.browseMode = "tree";
    this.browsing = true;
    this.browseStack = stack;
    try {
      const path = stack[stack.length - 1]?.path;
      this.browseItems = await this.client.browse(path, this.playerId);
    } catch (e) {
      this.error = (e as Error).message;
      this.browseItems = [];
    } finally {
      this.browsing = false;
    }
  }

  private browseTap(item: MediaItemLite): void {
    if (item.media_type === "folder") {
      void this.loadBrowse([...this.browseStack, { name: item.name, path: item.path }]);
    } else {
      void this.playItem(item);
    }
  }

  private crumbTo(index: number): void {
    void this.loadBrowse(this.browseStack.slice(0, index + 1));
  }

  private async playItem(item: MediaItemLite): Promise<void> {
    const id = this.playerId;
    if (!this.client || !id || !item.uri) return;
    try {
      await this.client.playMedia(id, item.uri, this.userId);
      this.statusMsg = `▶ ${item.name}`;
      this.view = "main";
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  // ---- render ----------------------------------------------------------

  render(): TemplateResult {
    if (!this.config) return html`<ha-card>Not configured</ha-card>`;
    if (this.loading) return html`<ha-card><div class="pad muted">Loading…</div></ha-card>`;
    if (this.view === "players") return html`<ha-card>${this.renderPlayersView()}</ha-card>`;
    if (this.view === "browse") return html`<ha-card>${this.renderBrowseView()}</ha-card>`;
    if (this.view === "group") return html`<ha-card>${this.renderGroupView()}</ha-card>`;
    return html`
      <ha-card>
        <div class="pickers">${this.renderPickerButtons()}</div>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${this.renderNowPlaying()} ${this.renderControls()} ${this.renderSearch()}
      </ha-card>
    `;
  }

  private renderViewHead(title: string): TemplateResult {
    return html`
      <div class="view-head">
        <button class="ctl" title="Back" @click=${() => (this.view = "main")}>‹</button>
        <span class="view-title">${title}</span>
      </div>
    `;
  }

  private get allowEveryone(): boolean {
    return this.config?.allow_everyone !== false;
  }

  private pickProvider(id?: string): void {
    this.providerId = id;
    if (this.browseMode === "search") {
      if (this.query.trim()) void this.doSearch();
      return;
    }
    // jump the browse tree straight into that account's root (or the all-providers root)
    if (id) {
      const prov = this.providers.find((p) => p.instance_id === id);
      void this.loadBrowse([
        { name: "Browse" },
        { name: prov?.name ?? "Source", path: `${id}://` },
      ]);
    } else {
      void this.loadBrowse([{ name: "Browse" }]);
    }
  }

  private renderPickerButtons(): TemplateResult {
    // Only the player/room selector lives up top. User is a *sourcing* concept
    // (whose library to browse), so it lives inside Browse/Search, not here.
    const p = this.selectedPlayer;
    const memberCount = p ? this.groupMembers.length : 0;
    return html`
      <button class="selbtn" @click=${() => (this.view = "players")}>
        <span class="ic">🔊</span>
        <span class="selbtn-main">${p ? playerLabel(p) : "No player"}</span>
        ${p ? html`<span class="selbtn-sub">${roomOf(p, this.hass)}</span>` : nothing}
        <span class="caret">▾</span>
      </button>
      ${p && this.canManageGroup
        ? html`
            <button
              class="groupbtn ${memberCount ? "on" : ""}"
              title="Group speakers"
              @click=${() => (this.view = "group")}
            >
              <span class="ic">🔗</span>
              ${memberCount ? html`<span class="group-badge">+${memberCount}</span>` : nothing}
            </button>
          `
        : nothing}
    `;
  }

  private renderGroupView(): TemplateResult {
    const leader = this.groupLeader;
    if (!leader) {
      return html`
        ${this.renderViewHead("Group speakers")}
        <div class="muted pad">Pick a player first.</div>
      `;
    }
    if (!this.canManageGroup) {
      return html`
        ${this.renderViewHead("Group speakers")}
        <div class="muted pad">${playerLabel(leader)} doesn't support grouping.</div>
      `;
    }
    const members = this.groupMembers;
    const candidates = this.groupCandidates;
    return html`
      ${this.renderViewHead("Group speakers")}
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      <div class="view-list">
        <div class="sheet-group">Playing on</div>
        ${this.sheetRow(true, "🔊", playerLabel(leader), roomOf(leader, this.hass), () => {})}
        ${members.length
          ? html`
              <div class="sheet-group">Grouped speakers</div>
              ${members.map((m) =>
                this.groupRow(m, "remove", () => this.removeFromGroup(m.player_id)),
              )}
              <button class="browse ungroup" @click=${() => this.ungroupAll()}>
                ✕ Ungroup all
              </button>
            `
          : html`<div class="muted pad">No other speakers grouped yet.</div>`}
        <div class="sheet-group">Add speakers</div>
        ${candidates.length
          ? candidates.map((c) => this.groupRow(c, "add", () => this.addToGroup(c.player_id)))
          : html`<div class="muted pad">No compatible speakers available.</div>`}
      </div>
    `;
  }

  private groupRow(p: MassPlayer, action: "add" | "remove", onClick: () => void): TemplateResult {
    return html`
      <button class="sheet-row group-row" @click=${onClick}>
        <span class="row-ic">🔊</span>
        <span class="row-txt">
          <span class="row-lbl">${playerLabel(p)}</span>
          <span class="row-sub">${roomOf(p, this.hass)}</span>
        </span>
        <span class="group-act ${action}">${action === "add" ? "＋" : "✕"}</span>
      </button>
    `;
  }

  private renderPlayersView(): TemplateResult {
    const q = this.playerQuery.trim().toLowerCase();
    const byRoom = new Map<string, MassPlayer[]>();
    for (const p of this.scopedPlayers) {
      const room = roomOf(p, this.hass);
      if (q && !playerLabel(p).toLowerCase().includes(q) && !room.toLowerCase().includes(q)) {
        continue;
      }
      (byRoom.get(room) ?? byRoom.set(room, []).get(room)!).push(p);
    }
    return html`
      ${this.renderViewHead("Play on…")}
      <input
        class="sheet-search"
        type="text"
        placeholder="Filter rooms or players…"
        .value=${this.playerQuery}
        @input=${(e: Event) => (this.playerQuery = (e.target as HTMLInputElement).value)}
      />
      <div class="view-list">
        ${[...byRoom.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(
            ([room, players]) => html`
              <div class="sheet-group">${room}</div>
              ${players.map((p) =>
                this.sheetRow(
                  p.player_id === this.playerId,
                  p.playback_state === "playing" ? "▶" : "🔊",
                  playerLabel(p),
                  p.playback_state === "playing" ? "playing" : undefined,
                  () => {
                    this.playerId = p.player_id;
                    this.view = "main";
                    this.playerQuery = "";
                  },
                ),
              )}
            `,
          )}
        ${byRoom.size === 0 ? html`<div class="muted pad">no matches</div>` : nothing}
      </div>
    `;
  }

  // Icon for a media-item row: an album-art thumbnail when the item carries a
  // usable image, otherwise the media-type emoji. The <img> lazy-loads with
  // fixed dimensions (no layout shift) and, on a load error, hides itself and
  // reveals the emoji sibling so a broken image can never blank the row.
  private rowIcon(it: MediaItemLite): string | TemplateResult {
    const emoji = it.media_type === "folder" ? "📁" : iconFor(it.media_type);
    const src = thumbUrl(it, this.imageProxyBase);
    if (!src) return emoji;
    return html`
      <span class="row-thumb">
        <img
          src=${src}
          alt=""
          loading="lazy"
          decoding="async"
          @error=${(e: Event) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            (img.nextElementSibling as HTMLElement | null)?.style.removeProperty("display");
          }}
        />
        <span class="row-thumb-fallback" style="display:none">${emoji}</span>
      </span>
    `;
  }

  private sheetRow(
    active: boolean,
    icon: string | TemplateResult,
    label: string,
    sub: string | undefined,
    onClick: () => void,
  ): TemplateResult {
    return html`
      <button class="sheet-row ${active ? "active" : ""}" @click=${onClick}>
        <span class="row-ic">${icon}</span>
        <span class="row-txt">
          <span class="row-lbl">${label}</span>
          ${sub ? html`<span class="row-sub">${sub}</span>` : nothing}
        </span>
        ${active ? html`<span class="row-check">✓</span>` : nothing}
      </button>
    `;
  }

  private renderNowPlaying(): TemplateResult {
    const p = this.selectedPlayer;
    const cm = p?.current_media;
    const art = cm?.image_url;
    return html`
      <div class="art">
        ${art
          ? html`<img src=${art} alt="" />`
          : html`<div class="art-empty">♪</div>`}
      </div>
      <div class="meta">
        <div class="title">${cm?.title ?? "Nothing playing"}</div>
        <div class="artist">${cm?.artist ?? (p ? playerLabel(p) : "")}</div>
      </div>
      ${this.renderProgress()}
    `;
  }

  private renderProgress(): TemplateResult {
    void this.tick; // read so the 1s timer re-renders the live position
    const p = this.selectedPlayer;
    const dur = p?.current_media?.duration ?? 0;
    const el = p ? this.liveElapsed(p) : 0;
    return html`
      <div class="progress">
        <input
          type="range"
          min="0"
          max=${dur || 0}
          .value=${String(Math.floor(el))}
          ?disabled=${!dur}
          @change=${(e: Event) =>
            this.cmd((c, id) => c.seek(id, Number((e.target as HTMLInputElement).value)))}
        />
        <div class="times"><span>${fmtTime(el)}</span><span>${fmtTime(dur)}</span></div>
      </div>
    `;
  }

  private renderControls(): TemplateResult {
    const p = this.selectedPlayer;
    const playing = p?.playback_state === "playing";
    const vol = p?.volume_level ?? 0;
    const muted = !!p?.volume_muted;
    return html`
      <div class="controls">
        <button class="ctl" title="Previous" @click=${() => this.cmd((c, id) => c.previous(id))}>
          ⏮
        </button>
        <button class="ctl big" title="Play/Pause" @click=${() => this.cmd((c, id) => c.playPause(id))}>
          ${playing ? "⏸" : "▶"}
        </button>
        <button class="ctl" title="Next" @click=${() => this.cmd((c, id) => c.next(id))}>⏭</button>
      </div>
      <div class="volrow">
        <button class="ctl sm" title="Mute" @click=${() => this.cmd((c, id) => c.setMute(id, !muted))}>
          ${muted ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          .value=${String(vol)}
          @change=${(e: Event) =>
            this.cmd((c, id) => c.setVolume(id, Number((e.target as HTMLInputElement).value)))}
        />
        <button
          class="ctl sm ${p?.powered ? "on" : ""}"
          title="Power"
          @click=${() => this.cmd((c, id) => c.setPower(id, !p?.powered))}
        >
          ⏻
        </button>
      </div>
    `;
  }

  private renderSearch(): TemplateResult {
    return html`
      <button class="browse" @click=${() => this.openBrowse()}>⌕ Browse / Search</button>
      ${this.statusMsg ? html`<div class="muted status">${this.statusMsg}</div>` : nothing}
    `;
  }

  private renderBrowseView(): TemplateResult {
    const p = this.selectedPlayer;
    return html`
      ${this.renderViewHead("Browse & Search")}
      <div class="src-bar">
        <div class="src-line">
          <span class="src-cap">Source</span>
          <div class="src-chips">
            ${this.srcChip(!this.providerId, "All", () => this.pickProvider(undefined))}
            ${this.musicProviders.map((pr) =>
              this.srcChip(pr.instance_id === this.providerId, pr.name, () =>
                this.pickProvider(pr.instance_id),
              ),
            )}
          </div>
        </div>
      </div>
      <div class="searchbox">
        <input
          type="text"
          placeholder="Search this source…"
          .value=${this.query}
          @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
          @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.doSearch()}
        />
        <button class="ctl sm" @click=${() => this.doSearch()}>⌕</button>
      </div>
      ${p ? nothing : html`<div class="muted pad">Pick a player first to play.</div>`}
      ${this.renderBrowseNav()}
      <div class="view-list">
        ${this.browseMode === "search"
          ? this.searching
            ? html`<div class="muted pad">Searching…</div>`
            : this.renderResults()
          : this.browsing
            ? html`<div class="muted pad">Loading…</div>`
            : this.renderBrowseList()}
      </div>
    `;
  }

  private renderBrowseNav(): TemplateResult {
    if (this.browseMode === "search") {
      return html`
        <button class="crumb-back" @click=${() => (this.browseMode = "tree")}>‹ Back to Browse</button>
      `;
    }
    return html`
      <div class="crumbs">
        ${this.browseStack.map((c, i) => {
          const last = i === this.browseStack.length - 1;
          return html`
            <button class="crumb ${last ? "active" : ""}" @click=${() => this.crumbTo(i)}>
              ${c.name}
            </button>
            ${last ? nothing : html`<span class="crumb-sep">›</span>`}
          `;
        })}
      </div>
    `;
  }

  private renderBrowseList(): TemplateResult {
    if (!this.browseItems.length) return html`<div class="muted pad">Empty.</div>`;
    return html`
      ${this.browseItems.map((it) =>
        this.sheetRow(
          false,
          this.rowIcon(it),
          it.name,
          it.media_type === "folder" ? (it.subtitle ?? undefined) : subtitleFor(it),
          () => this.browseTap(it),
        ),
      )}
    `;
  }

  private srcChip(active: boolean, label: string, onClick: () => void): TemplateResult {
    return html`<button class="srcchip ${active ? "active" : ""}" @click=${onClick}>
      ${label}
    </button>`;
  }

  private renderResults(): TemplateResult {
    const r = this.results;
    if (!r) return html`<div class="muted pad">Search to see results.</div>`;
    const sections: [string, MediaItemLite[] | undefined][] = [
      ["Tracks", r.tracks],
      ["Albums", r.albums],
      ["Artists", r.artists],
      ["Playlists", r.playlists],
      ["Radio", r.radio],
    ];
    if (!sections.some(([, list]) => list && list.length)) {
      return html`<div class="muted pad">No results.</div>`;
    }
    return html`
      ${sections.map(([label, list]) =>
        list && list.length
          ? html`
              <div class="sheet-group">${label}</div>
              ${list.map((it) =>
                this.sheetRow(false, this.rowIcon(it), it.name, subtitleFor(it), () =>
                  this.playItem(it),
                ),
              )}
            `
          : nothing,
      )}
    `;
  }

  static styles = css`
    ha-card {
      padding: 16px;
    }
    .pad {
      padding: 8px 0;
    }
    .pickers {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    /* a button that shows the current choice and opens a bottom sheet on tap */
    .selbtn {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 8px 14px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 22px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
      overflow: hidden;
    }
    .selbtn .ic {
      font-size: 1rem;
    }
    .selbtn-main {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .selbtn-sub {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }
    .caret {
      opacity: 0.6;
      font-size: 0.7rem;
    }
    /* bottom sheet (custom, fully themed — no native popup) */
    .sheet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    .sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 11;
      max-height: 75vh;
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #fff);
      border-radius: 18px 18px 0 0;
      box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4);
      padding: 8px 12px calc(16px + env(safe-area-inset-bottom));
    }
    .sheet.tall {
      height: 80vh;
      max-height: 80vh;
    }
    .sheet-grip {
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #666);
      margin: 6px auto 10px;
    }
    .sheet-title {
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0 4px 10px;
    }
    .sheet-search {
      margin: 0 0 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color, #2a2a2a);
      color: var(--primary-text-color);
      font-size: 0.95rem;
    }
    .sheet-list {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .sheet-group {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      padding: 10px 6px 4px;
      position: sticky;
      top: 0;
      background: var(--card-background-color, #1c1c1c);
    }
    .sheet-row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 52px;
      padding: 10px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
    }
    .sheet-row:hover {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
    }
    .sheet-row.active {
      color: var(--primary-color, #03a9f4);
    }
    .row-ic {
      font-size: 1.1rem;
      width: 1.4rem;
      text-align: center;
      flex: 0 0 auto;
    }
    .row-ic:has(.row-thumb) {
      width: 36px;
    }
    .row-thumb {
      display: block;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      overflow: hidden;
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
    }
    .row-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .row-thumb-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .row-txt {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .row-sub {
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .row-check {
      font-size: 1rem;
    }
    .pad {
      padding: 10px;
    }
    .art {
      width: 180px;
      height: 180px;
      margin: 0 auto 14px;
      border-radius: 12px;
      overflow: hidden;
      background: var(--secondary-background-color, #eee);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }
    .art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .art-empty {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 3rem;
      color: var(--secondary-text-color);
    }
    .meta {
      text-align: center;
      margin-bottom: 8px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .progress input[type="range"] {
      width: 100%;
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      margin: 10px 0;
    }
    .ctl {
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .ctl.big {
      font-size: 2.4rem;
    }
    .ctl.sm {
      font-size: 1.1rem;
    }
    .ctl.on {
      color: var(--primary-color, #03a9f4);
    }
    .volrow {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0 4px;
    }
    .volrow input[type="range"] {
      flex: 1;
    }
    .browse {
      width: 100%;
      margin-top: 12px;
      padding: 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
    }
    /* in-card sub-screens (players / browse) — no fixed positioning, so they
       work inside HA's transformed card containers and scroll normally */
    .view-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .view-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .view-list {
      max-height: 60vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    /* breadcrumbs for the browse tree */
    .crumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
      margin: 4px 0 8px;
    }
    .crumb {
      border: none;
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 2px 4px;
    }
    .crumb.active {
      color: var(--primary-text-color);
      font-weight: 600;
      cursor: default;
    }
    .crumb-sep {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .crumb-back {
      border: none;
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 4px 0;
      margin-bottom: 4px;
    }
    /* source (user + provider) selectors inside the browse screen */
    .src-bar {
      margin-bottom: 10px;
    }
    .src-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .src-cap {
      flex: 0 0 68px;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--secondary-text-color);
    }
    .src-chips {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
      padding-bottom: 2px;
    }
    .src-chips::-webkit-scrollbar {
      display: none;
    }
    .srcchip {
      flex: 0 0 auto;
      min-height: 34px;
      padding: 5px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 17px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .srcchip.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .searchbox {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .searchbox input {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    /* group speakers button next to the player selector */
    .groupbtn {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 22px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
    }
    .groupbtn.on {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .group-badge {
      font-size: 0.75rem;
      font-weight: 600;
    }
    .group-row .group-act {
      font-size: 1.2rem;
      width: 1.6rem;
      text-align: center;
    }
    .group-act.add {
      color: var(--primary-color, #03a9f4);
    }
    .group-act.remove {
      color: var(--error-color, #db4437);
    }
    .ungroup {
      margin-top: 8px;
      color: var(--error-color, #db4437);
    }
    .status {
      margin-top: 6px;
    }
    .error {
      color: var(--error-color, #db4437);
      margin-bottom: 8px;
      font-size: 0.85rem;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
  `;
}

(window as unknown as { customCards?: unknown[] }).customCards ??= [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: "mass-conductor",
  name: "Music Assistant Conductor",
  description: "Mini Music Assistant player with room + user selection.",
});

declare global {
  interface HTMLElementTagNameMap {
    "mass-conductor": MassConductor;
  }
}
