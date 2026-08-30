# Music Assistant Conductor

A Home Assistant card for Music Assistant: pick a room, see what's playing,
control it, and browse or search any of your music sources to start playback.

## Requirements

- [Music Assistant](https://www.music-assistant.io/) with the official
  **Music Assistant** integration set up in Home Assistant.

## Install

### HACS

1. HACS → ⋮ → **Custom repositories** → add this repo, category **Integration**.
2. Install **Music Assistant Conductor**, then **restart Home Assistant**.
3. Settings → **Devices & Services** → **Add Integration** → *Music Assistant
   Conductor* → **Submit**.

### Manual

1. Copy `custom_components/mass_conductor/` into `config/custom_components/`.
2. Restart Home Assistant and add the integration (step 3 above).

## Add the card

Edit a dashboard → **Add Card** → **Manual**, and paste:

```yaml
type: custom:mass-conductor
title: Whole-House Audio
```

If the card type isn't found, hard-refresh your browser once.

## Options

| Option         | Required | Description                                             |
| -------------- | -------- | ------------------------------------------------------- |
| `title`        | no       | Card heading.                                           |
| `default_user` | no       | Play and search as this Music Assistant user.           |

## Development

```bash
npm install
npm run build   # rebuilds the card
```

Commit the built file at `custom_components/mass_conductor/frontend/mass-conductor.js`.
