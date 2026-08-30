"""Constants for the Music Assistant Conductor integration."""

import logging

DOMAIN = "mass_conductor"
# The official Music Assistant integration, whose already-authenticated
# connection this integration reuses (no separate token needed).
MASS_DOMAIN = "music_assistant"
LOGGER = logging.getLogger(__package__)

# WebSocket API command types exposed to the browser.
WS_TYPE_COMMAND = f"{DOMAIN}/command"
WS_TYPE_SUBSCRIBE_EVENTS = f"{DOMAIN}/subscribe_events"

# Safelist of MA commands the passthrough may forward. Anything outside this
# set is rejected so the browser can never run arbitrary (admin) commands.
# Entries in ALLOWED_COMMAND_PREFIXES match by prefix; the rest must match exactly.
ALLOWED_COMMAND_PREFIXES = ("players/",)
ALLOWED_COMMANDS_EXACT = frozenset(
    {
        "providers",
        "music/search",
        "music/browse",
        "player_queues/play_media",
    }
)

# URL the bundled card JS is served from, and its on-disk location.
FRONTEND_URL_PATH = f"/{DOMAIN}/mass-conductor.js"
FRONTEND_FILENAME = "mass-conductor.js"
