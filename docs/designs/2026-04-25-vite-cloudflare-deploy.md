# Vite Bundling + Cloudflare Workers Deploy for sokki.sorrycc.com

## 1. Background

The sokki landing page is currently served as raw HTML + JSX:
- `index.html` loads React 18 via UMD CDN
- `app.jsx` is JSX transpiled at runtime by `@babel/standalone`
- `i18n.js` exposes `window.SOKKI_I18N` as a global
- No bundler, no `package.json`, no deploy automation

This is slow (Babel compiles in the browser), fragile (third-party CDN), and has no path to deployment automation. The goal is to introduce a proper Vite bundle and ship to Cloudflare under `sokki.sorrycc.com`.

## 2. Requirements Summary

**Goal:** Replace in-browser Babel + UMD CDN with a Vite-bundled SPA, deployed to Cloudflare Workers Static Assets at `sokki.sorrycc.com`.

**Scope (in):**
- `package.json` with bun + Vite + React deps
- `vite.config.js` with `@vitejs/plugin-react`
- Convert `i18n.js` to ES module
- Convert `app.jsx` from runtime Babel to Vite-bundled module
- `wrangler.toml` for Cloudflare Workers Static Assets
- `bun run dev` / `bun run build` / `bun run deploy` scripts

**Scope (out):**
- TypeScript migration
- React 19 upgrade
- Content / copy / styling changes
- New features

## 3. Acceptance Criteria

1. `bun run dev` serves the site at `localhost:5173` with HMR working on `app.jsx` edits
2. `bun run build` produces hashed assets in `dist/` with no `@babel/standalone` and no UMD CDN scripts in the emitted HTML
3. `bun run deploy` publishes to `sokki.sorrycc.com` via `wrangler deploy`, returning HTTP 200 with the same visual + i18n behavior as today
4. Wrangler auth reuses existing credentials (`wrangler login` or `CLOUDFLARE_API_TOKEN`); no new tokens created
5. The `window.SOKKI_TWEAKS` runtime config still applies before app render

## 4. Problem Analysis

Approaches evaluated:

- **Cloudflare Pages** — purpose-built for static SPAs, but uses a different deploy command and auth flow than the reference `telemetry-worker`. Rejected for tooling consistency.
- **Workers Sites (legacy KV)** — superseded by Workers Static Assets. Rejected.
- **Workers Static Assets (chosen)** — same `wrangler dev` / `wrangler deploy` muscle memory as `telemetry-worker`, supports `custom_domain` routes, and natively serves a static `dist/` directory with SPA fallback.

For React loading: keeping UMD CDN alongside a Vite bundle requires externalization config and creates a dev/prod mismatch. Bundling React via npm is the simpler, default Vite path.

## 5. Decision Log

**1. Bundler / dev tool?**
- Options: A) Vite · B) esbuild standalone · C) Parcel
- Decision: **A) Vite** — user-specified, and the modern default for React SPAs.

**2. Cloudflare deploy target?**
- Options: A) Workers Static Assets · B) Pages · C) Workers Sites (legacy)
- Decision: **A) Workers Static Assets** — matches `telemetry-worker` tooling (single `wrangler` CLI, same auth, same `custom_domain` route pattern).

**3. Package manager?**
- Options: A) pnpm · B) npm · C) bun
- Decision: **C) bun** — user-selected; `telemetry-worker` also uses bun.

**4. React loading strategy?**
- Options: A) Keep UMD CDN · B) npm + bundle
- Decision: **B) npm + bundle** — no dev/prod mismatch, proper HMR, version-pinned.

**5. JSX transform?**
- Options: A) Runtime `@babel/standalone` · B) Vite `@vitejs/plugin-react` (build-time)
- Decision: **B)** — drops the in-browser compiler; standard Vite path.

**6. `i18n.js` shape?**
- Options: A) Keep as global `window.SOKKI_I18N` script · B) Convert to ES module
- Decision: **B) ES module** — single import graph; consistent with bundled `app.jsx`.

**7. `window.SOKKI_TWEAKS` inline config?**
- Options: A) Keep inline `<script>` in `index.html` · B) Move to module
- Decision: **A) Keep inline** — it's runtime config (could be edited per-deploy), legitimately a global; the inline `<script>` runs before the bundled module.

**8. SPA fallback for unknown routes?**
- Options: A) `not_found_handling = "single-page-application"` · B) `"404-page"` · C) None
- Decision: **A) SPA** — the app is a single-page React landing; SPA fallback returns `index.html` for unknown paths so client-side routing (or accidental deep links) work.

**9. Language?**
- Options: A) Stay JS (`.jsx`) · B) Migrate to TS (`.tsx`)
- Decision: **A) Stay JS** — YAGNI; out of scope.

**10. Worker script needed, or pure assets?**
- Options: A) Assets-only (no `main`) · B) Tiny Worker that just serves assets
- Decision: **A) Assets-only** — Workers Static Assets supports asset-only deploys without a Worker script when `main` is omitted and `[assets]` directory is set. Simpler.

**11. Where to keep source files?**
- Options: A) Move into `src/` · B) Leave at repo root
- Decision: **A) Move into `src/`** — cleaner separation from config files (vite.config.js, wrangler.toml, package.json) and standard Vite layout. `index.html` stays at root (Vite convention).

## 6. Design

### Architecture overview

```
sokki.sorrycc.com/
├── index.html              # entry HTML, references /src/main.jsx as type=module
├── src/
│   ├── main.jsx            # mounts <App /> to #root
│   ├── app.jsx             # current app, becomes a module
│   ├── i18n.js             # exports SOKKI_I18N
│   └── style.css           # imported from main.jsx
├── public/                 # (none initially; static files if needed)
├── package.json
├── vite.config.js
├── wrangler.toml
├── .gitignore
└── docs/designs/2026-04-25-vite-cloudflare-deploy.md
```

### Conversion details

**`index.html`** — strip:
- `<link rel="stylesheet" href="style.css">` (CSS now imported via `main.jsx`, served by Vite)
- The 3 CDN `<script>` tags (React, ReactDOM, `@babel/standalone`)
- `<script src="i18n.js">` and `<script type="text/babel" src="app.jsx">`

Keep:
- `<link rel="canonical" href="https://sokki.sorrycc.com/">`, `<meta>` tags, `<title>` — all unchanged.
- `<div id="root"></div>`
- The inline `<script>` block at the end of `<body>` (it already lives there in spirit — currently uses `DOMContentLoaded`). Drop the `DOMContentLoaded` wrapper; call `applySokkiTweaks(window.SOKKI_TWEAKS)` directly. This is safe because the inline `<script>` runs at its position in `<body>`, by which time `document.body` exists.

Add: `<script type="module" src="/src/main.jsx"></script>` after the inline tweaks script (still inside `<body>`).

Why this ordering works: classic `<script>` runs synchronously at its position; `<script type="module">` is deferred by the HTML spec and won't execute until after parsing, regardless of source order. So by the time `main.jsx` runs and React mounts, `window.SOKKI_TWEAKS` is set and `applySokkiTweaks` has run on `<body>` — satisfying AC5. (Do not move either script into `<head>`: the inline script touches `document.body`, which is `null` during `<head>` parsing.)

**`src/main.jsx`** — new file (sole mount point):

```jsx
import { createRoot } from 'react-dom/client';
import App from './app.jsx';
import './style.css';

createRoot(document.getElementById('root')).render(<App />);
```

**`src/app.jsx`** — three concrete edits:
1. Add at top: `import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';` and `import { SOKKI_I18N } from './i18n.js';`. Drop the existing `const { useState, ... } = React;` destructure line.
2. Line 251: `const t = window.SOKKI_I18N[lang];` → `const t = SOKKI_I18N[lang];`
3. **Delete the bottom mount block** (currently `const root = ReactDOM.createRoot(...); root.render(<App />);`). Replace with `export default App;` so `main.jsx` is the only mount site — otherwise React mounts twice.
4. Line 55: change `":now": new Date().toISOString()...` from a build-time constant to lazy evaluation. `SNIPPETS[trig]` is read in two places — line 100 (`const replacement = SNIPPETS[lastMatch.trig]`) and line 332 (`SNIPPETS[trig] || ""`). To avoid leaking a function reference into the textarea, introduce a small helper next to `SNIPPETS`:

   ```js
   const SNIPPETS = {
     ":email": "alex@sokkilabs.dev",
     // ...
     ":now": () => new Date().toISOString().slice(0, 16).replace("T", " "),
     // ...
   };
   const resolveSnippet = (trig) => {
     const v = SNIPPETS[trig];
     return typeof v === 'function' ? v() : v;
   };
   ```

   Replace both call sites with `resolveSnippet(...)`. This keeps the data shape simple and only `:now` pays the lazy-eval cost.

**`src/i18n.js`** — replace the `window.SOKKI_I18N = { ... }` line with `export const SOKKI_I18N = { ... }`. Remove the `window` assignment entirely.

**`src/style.css`** — unchanged content, imported from `main.jsx`.

### `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});
```

No production sourcemaps — they would publish source to the CDN with no acceptance-criteria payoff.

### `wrangler.toml`

```toml
name = "sokki-landing"
compatibility_date = "2026-04-22"
account_id = "965e9128d01710c7d4c2034d7b539d21"

routes = [
  { pattern = "sokki.sorrycc.com", custom_domain = true },
]

[assets]
directory = "./dist"
not_found_handling = "single-page-application"

[observability]
enabled = true
```

- `compatibility_date` matches `telemetry-worker` for sibling consistency and to avoid setting a date the local wrangler hasn't shipped a bundle for.
- No `main = ...` — pure assets deploy. Workers Static Assets serves `dist/` directly.
- `not_found_handling = "single-page-application"` requires `wrangler ≥ 3.78`. The `^3.90.0` pin in `devDependencies` covers this.

### `package.json`

```json
{
  "name": "sokki-landing",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "vite build && wrangler deploy"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0",
    "wrangler": "^3.90.0"
  }
}
```

### Auth

Cloudflare auth is handled by `wrangler` itself — either:
- `wrangler login` (OAuth, persisted under `~/.wrangler/`)
- `CLOUDFLARE_API_TOKEN` env var

The `account_id` in `wrangler.toml` (`965e9128d01710c7d4c2034d7b539d21`) is reused from `telemetry-worker`. No secrets are committed.

### Dev server choice

`bun run dev` invokes **Vite directly** (`vite`), not `wrangler dev`. Since this is an asset-only deploy with no Worker script, `wrangler dev` would add nothing — Vite handles HMR on `localhost:5173` and there's no edge logic to emulate. (Distinction from `telemetry-worker`, which uses `wrangler dev` because it has a Worker script.)

### Data flow

1. Browser requests `/` → Cloudflare serves `dist/index.html`
2. HTML inline `<script>` sets `window.SOKKI_TWEAKS` synchronously
3. `<script type="module" src="/assets/main-<hash>.js">` loads
4. React mounts `<App />` into `#root`
5. `App` reads `SOKKI_I18N` from import + `window.SOKKI_TWEAKS` from globals
6. CSS injected via Vite-emitted `<link rel="stylesheet">` (in production) or HMR (dev)

Unknown paths (e.g. `/foo`) → SPA fallback returns `index.html` (status 200).

### Error handling

- Build errors: Vite surfaces in terminal / CI
- Deploy errors: wrangler surfaces (auth missing, domain conflict, account mismatch)
- Runtime errors: existing app behavior unchanged
- DNS / domain provisioning: `custom_domain = true` provisions the route on the existing zone. **Prerequisite:** the `sorrycc.com` zone must already exist on Cloudflare account `965e9128d01710c7d4c2034d7b539d21`. If not, `wrangler deploy` fails with "zone not found" — verify in the Cloudflare dashboard before first deploy.

### Testing strategy

Manual verification only (static landing page, no test infrastructure):
1. `bun install` succeeds
2. `bun run dev` → open `localhost:5173`, verify hero, i18n toggle, sparkles, layout
3. `bun run build` → inspect `dist/index.html` for absence of `@babel/standalone` and CDN React
4. `bun run preview` → sanity check production bundle locally
5. `bun run deploy` → curl `https://sokki.sorrycc.com/` → HTTP 200, same content

## 7. Files Changed

- `package.json` — new, declares deps + scripts
- `vite.config.js` — new, Vite + React plugin (no prod sourcemaps)
- `wrangler.toml` — new, Workers Static Assets config
- `.gitignore` — new, contents:
  ```
  node_modules/
  dist/
  .wrangler/
  .env
  .env.*
  .DS_Store
  ```
- `index.html` — stays at repo root (Vite convention). Strip stylesheet `<link>` + 3 CDN scripts + 2 local script tags; make tweaks apply synchronously; add module script.
- `src/main.jsx` — new, mounts the app (only mount site)
- `src/app.jsx` — moved from `app.jsx`; add explicit React + i18n imports; replace `window.SOKKI_I18N` with imported `SOKKI_I18N`; delete bottom mount block; export `App` default; lazy-evaluate `:now` snippet
- `src/i18n.js` — moved from `i18n.js`; replace `window.SOKKI_I18N = ...` with `export const SOKKI_I18N = ...`
- `src/style.css` — moved from `style.css`, imported by `main.jsx`
- `docs/designs/2026-04-25-vite-cloudflare-deploy.md` — this doc

## 8. Verification

1. **[AC1]** Run `bun run dev`, open `http://localhost:5173`, edit `src/app.jsx` and confirm HMR re-renders without full reload
2. **[AC2]** Run `bun run build`; `dist/` contains hashed `assets/*.js` and `assets/*.css`; both of these return empty:
   - `grep -rE 'babel/standalone' dist/`
   - `grep -rE 'unpkg.com' dist/`
3. **[AC3]** Run `bun run deploy`; `curl -sI https://sokki.sorrycc.com/` returns `HTTP/2 200`; visual diff against current site shows identical hero, sparkles, language toggle, sections
4. **[AC4]** `bun run deploy` succeeds without prompting for a token, using existing `wrangler login` state or a pre-set `CLOUDFLARE_API_TOKEN`. Verify via `wrangler whoami` returning the expected account `965e9128…` before deploy.
5. **[AC5]** In dev and prod, `console.log(window.SOKKI_TWEAKS)` in DevTools returns the configured object **before** `<App />` mounts (the inline classic `<script>` lives at the end of `<body>` and runs synchronously before the deferred module script).
6. **Sanity checks** — all should return empty (use `-E` so alternation works on BSD `grep`):
   - `grep -rEn 'window\.SOKKI_I18N' --include='*.js' --include='*.jsx' --include='*.html' --exclude-dir=node_modules --exclude-dir=dist .`
   - `grep -En 'ReactDOM' src/app.jsx`
   - `grep -En '@babel/standalone|unpkg\.com' index.html`
