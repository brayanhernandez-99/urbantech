UrbanTech — AGENTS.md

Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

Environment & Run
- No Node tooling: pure static site (HTML/CSS/JS ES modules). There is no package.json, build, test, or lint step.
- Serve with any static server. Recommended quick command: `npx serve .` (do not open index.html via `file://` because `<script type="module">` requires an HTTP origin).

Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; it imports `js/hero.js`, `js/scroll.js`, `js/config.js` and wires page behavior.
- `js/config.js` — single source of truth for WhatsApp: change `WA_NUMBER` (top of file) to update all CTAs.
- `js/hero.js` — controls hero parallax transforms; avoid adding CSS animations that also transform `.hero-phone`.
- `css/styles.css` — imports the rest of site styles.

Assets & cache-busting
- Images live under `assets/images/` (products and accessories in subfolders).
- Cache-busting is manual: image URLs include `?v=N`. When replacing an image, bump the `v` number in the HTML/CSS referencing it.

Conventions & gotchas
- WhatsApp links: anchors include `data-wa="mensaje"`. `main.js` replaces hrefs at runtime using `WA_NUMBER`. The hardcoded `wa.me` in HTML is only a non-JS fallback.
- Module script CORS: any local testing must use an HTTP server (see Serve above).
- Small-screen hero sizing is controlled by CSS breakpoints; `hero.js` only manipulates `transform`.

Where to look next (high value files)
- `index.html`, `js/main.js`, `js/config.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

If you change structure or add tooling, update this file immediately so future agents don't assume "no build step".
