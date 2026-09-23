# Crazy Games build

Ghost Garden ships two static builds:

| | GitHub Pages / AlterU | Crazy Games |
| --- | --- | --- |
| Command | `npm run build` | `npm run build:crazygames` |
| Output | `dist/` | `dist-crazygames/` |
| Upload zip | — | `artifacts/ghost-garden-crazygames.zip` (`index.html` at the zip root) |
| Asset paths | relative (`./`) | relative (`./`), safe for iframe hosting |
| AlterU / Aigram | guest shell + bridge; active when the host passes `api_origin` and `telegram_id` | **off**. Guests play immediately. No login wall and no App Store link |

## Guest play

Crazy Games requires that guests can play and that the game does not add its own login (including AlterU / Aigram) before play. This build:

- Starts from the same splash and story intro as the main game. There is no account screen.
- Does not load `https://images.aiwaves.tech/alteru/guest-shell.js`.
- Saves progress and the best run in `localStorage` on the device.
- Opens the leaderboard as a local note (“best score stays on this device”) instead of “Open in AlterU” / the App Store.
- Does not treat Crazy Games query parameters as an Aigram session.

The default `npm run build` path is unchanged for GitHub Pages and any AlterU/Aigram embed. That build still includes the guest shell.

The Pages workflow publishes this guest build next to the root site, without replacing it:

https://yinxinghuan.github.io/ghost-garden/crazygames/

Progress sync through the Crazy Games SDK Data module is not wired up. Local progress is enough for this version.

## Build the upload package

```bash
npm ci
npm run build:crazygames
```

Upload `artifacts/ghost-garden-crazygames.zip` in the Crazy Games developer portal. Do not submit from this repository’s automation.

`artifacts/crazygames/` is the same unpacked folder (`index.html` plus `./assets/...`) if you need to preview it:

```bash
npx --yes serve artifacts/crazygames
```
