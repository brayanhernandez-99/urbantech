Urban Tech — AGENTS.md

Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

Environment & Run
- No Node tooling: pure static site (HTML/CSS/JS ES modules). There is no package.json, build, test, or lint step.
- Serve with any static server. Recommended quick command: `npx serve .` (do not open index.html via `file://` because `<script type="module">` requires an HTTP origin).

Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; it imports `js/hero.js`, `js/scroll.js`, `js/config.js` and wires page behavior.
- `js/config.js` — single source of truth for WhatsApp: change `WA_NUMBER` (top of file) to update all CTAs.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only). CSS `float` animation on `.hero-phone-wrapper` (parent div) — no conflict since they're different elements.
- `css/styles.css` — imports the rest of site styles.

Assets & cache-busting
- Images live under `assets/images/` (products and accessories in subfolders).
- Cache-busting is manual: image URLs include `?v=N`. When replacing an image, bump the `v` number in the HTML/CSS referencing it.
- JSON-LD: LocalBusiness schema in `<head>` with name, description, WhatsApp number, Medellín address.

Conventions & gotchas
- WhatsApp links: anchors include `onclick="return openWhatsApp(this)"` with `message` attribute. `js/whatsapp.js` defines `WA_NUMBER` and the `openWhatsApp` function.
- Module script CORS: any local testing must use an HTTP server (see Serve above).
- Small-screen hero sizing is controlled by CSS breakpoints; `hero.js` only manipulates `transform`.
- Products section uses `<div class="model-divider"><span>Model Name</span></div>` between model groups, spanning full grid width.
- Card element order: badge → img → `<h3>iPhone [Model]</h3>` → `<span class="product-color">[Color]</span>` → stock badge → price → `<span class="capacity-chip">[GB]</span>` → button. Price and chip render inline (same line) via CSS `display: inline-block`.
- iPhone 16 cards use `.dual-capacity` layout with two `.dual-capacity-option` blocks (one per capacity, each with price → chip) and a single `.btn` below both. All other models have single capacity.
- iPhone 16 image filenames use Spanish color names (`rosa`, `verde`, `azul`), not English.

Where to look next (high value files)
- `index.html`, `js/main.js`, `js/config.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

If you change structure or add tooling, update this file immediately so future agents don't assume "no build step".
