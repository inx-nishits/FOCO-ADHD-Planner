# App Foundation

Production-ready, framework-free **native iOS-like PWA foundation** with a **multi-variant URL architecture**.

This repository is the **engine**, not the car. It intentionally ships a blank application screen. Real screens, features, branding, and business logic will be added later.

## Project Overview

| Concern | Approach |
| --- | --- |
| Stack | HTML5 · CSS3 · Vanilla ES modules · Web App Manifest · Service Worker |
| Variants | Shared app core + per-variant visual tokens |
| URLs | `/variant-a/`, `/variant-b/`, `/variant-c/` (shareable, refresh-safe) |
| Desktop | Premium HTML/CSS iPhone presentation frame |
| Real mobile / PWA | Frame hidden · full viewport · safe-area aware |
| Dev tools | Floating variant control only (removable in production) |

## Run Locally

Requirements: Node.js 18+ (for the static server) or any static file server.

```bash
npm start
```

Open:

- http://localhost:4173/
- http://localhost:4173/variant-a/
- http://localhost:4173/variant-b/
- http://localhost:4173/variant-c/

`npm start` uses `serve -s`, which falls back unknown paths to `index.html` (needed for History API + clean variant URLs).

Alternative:

```bash
npx serve -s . -l 4173
```

After editing `index.html`, sync entry copies:

```bash
npm run sync:entries
```

## Project Structure

```text
/
├── index.html                 Shared app shell
├── 404.html                   GitHub Pages SPA fallback (synced copy)
├── manifest.json              PWA manifest (placeholder name)
├── sw.js                      App-shell service worker
├── favicon.ico
├── vercel.json / netlify.toml / _redirects
├── assets/icons/              Temporary icons (replace later)
├── css/                       Reset, tokens, shell, device-frame, responsive, preview
├── js/                        Config, variants, router, PWA, preview
├── variants/                  Variant-specific stylesheets only
│   ├── variant-a/variant.css
│   ├── variant-b/variant.css
│   └── variant-c/variant.css
├── variant-a/index.html       Static entry (synced, no duplicated logic)
├── variant-b/index.html
├── variant-c/index.html
└── scripts/sync-entries.js
```

Application logic is **not** duplicated per variant. The `variant-*/index.html` files are identical shells so static hosts without rewrites still resolve direct URLs.

## Variant System

### Built-in variants

| ID | Name | URL |
| --- | --- | --- |
| `a` | Variant A | `/variant-a/` |
| `b` | Variant B | `/variant-b/` |
| `c` | Variant C | `/variant-c/` |

Variants primarily control visual language (colors, typography tokens, radius, stage atmosphere) via CSS variables.

### URL structure

Preferred client URLs:

```text
/variant-a/
/variant-b/
/variant-c/
```

Optional query form (canonicalized to a clean path):

```text
/?variant=b  →  /variant-b/
```

Root `/` resolves to the stored preference, otherwise **Variant A**, then replaces the URL with the clean variant path.

### Switching

Use the floating **Variant** control (development preview). Selecting another variant:

1. Applies tokens (`body[data-variant]`)
2. Updates `localStorage`
3. **Changes the browser URL** via the History API (e.g. `/variant-a/` → `/variant-b/`)
4. Supports Back / Forward

### Persistence priority

```text
1. Explicit URL variant          (always wins)
2. Saved localStorage variant
3. Default Variant A
```

Opening `/variant-a/` while storage says `b` still loads **A**.

### Adding Variant D

1. Register in `js/variants.js`:

```js
d: {
  id: 'd',
  name: 'Variant D',
  path: '/variant-d/',
  stylesheet: '/variants/variant-d/variant.css',
  description: '…',
},
```

2. Create `variants/variant-d/variant.css` and optional token overrides in `css/variants.css`.
3. Add `variant-d/` to `scripts/sync-entries.js` targets, then run `npm run sync:entries`.
4. Add rewrite rules in `vercel.json`, `netlify.toml`, and `_redirects`.
5. Optionally list the new CSS in `sw.js` `APP_SHELL`.

The selector and URL detector pick it up automatically from the registry.

## URL Architecture

- **Source of truth for demos:** the path (`/variant-b/`).
- Shared shell + `js/variant-manager.js` reads the path and sets `data-variant`.
- No full page reload required when switching variants in-session.
- Refresh / new tab / copy-paste keep the same variant because the path encodes it.

## PWA

- `manifest.json` — `display: standalone`, icons, placeholder name
- iOS meta tags in `index.html`
- `sw.js` caches the app shell for basic offline loading (no API caching)

### Install / test

1. Deploy over **HTTPS** (or use localhost).
2. Open in mobile Safari / Chrome.
3. Add to Home Screen.
4. Launch from the icon — should open chrome-less / standalone.

Utility helpers live in `js/pwa.js` (`isStandaloneDisplay`, `getInstallState`). No install popup is shown in this foundation phase.

## Icons

Temporary neutral icons live in:

```text
assets/icons/icon-192.png
assets/icons/icon-512.png
assets/icons/apple-touch-icon.png
assets/icons/favicon.png
favicon.ico
```

**Replace these files when final branding is available.** Keep the same filenames (or update `manifest.json` + `index.html` references).

## iPhone Preview

| Context | Behavior |
| --- | --- |
| Desktop / laptop | Realistic iPhone frame (titanium chassis, side buttons, Dynamic Island, home indicator) |
| Real phone (coarse pointer + narrow viewport) | Frame hidden · app fills viewport |
| Installed PWA / standalone | Frame hidden |

The Dynamic Island and side buttons are **hardware-layer** visuals only — not part of the app viewport. Desktop framed mode simulates iOS safe-area insets so app content stays clear of the island / home indicator.

Detection prefers viewport / pointer / display-mode signals over brittle user-agent sniffing. There is **no** device/preview mode selector — only the Variant control.

## Production Mode

In `js/config.js`:

```js
export const APP_CONFIG = {
  developmentPreview: false, // hide variant + device controls
  defaultVariant: 'a',
  // …
};
```

With `developmentPreview: false`, the floating preview UI is not injected. The blank app shell remains.

Also update `manifest.json` name / colors when branding is ready.

## Future Development

| Area | Where to work |
| --- | --- |
| Screens / features | Mount into `#app` / `#screen` via `js/router.js` (`registerScreen`) |
| Routes | Hash routes: `/variant-b/#/home` |
| Visual identity | Tokens in `css/tokens.css` + per-variant CSS |
| Data / APIs | Add later — do **not** cache API responses in `sw.js` yet |
| Branding | Icons, `manifest.json`, `APP_CONFIG.appName` |

Keep the application screen clean until real requirements arrive.

## Hosting / Rewrites

Configured for:

- **Vercel** — `vercel.json`
- **Netlify** — `netlify.toml` + `_redirects`
- **GitHub Pages** — `404.html` fallback + physical `variant-*/index.html` entries
- **Any static host** — keep `variant-*/index.html` in sync with `npm run sync:entries`

Use a server with SPA fallback (`serve -s`) locally so History API navigations survive refresh even without physical folders.

## Technical Limitations

- No bundler — ES modules require HTTP (not `file://`).
- Service worker and install prompts require secure context (localhost / HTTPS).
- iOS “Add to Home Screen” does not expose `beforeinstallprompt`.
- Variant entry HTML files must be re-synced after shell edits.
- Foundation ships placeholder branding only.

## License

Private / project foundation — update as needed.
