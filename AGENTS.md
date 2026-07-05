# Urban Tech — AGENTS.md

Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

## Git & Push
- **NUNCA** hacer commit o push sin instrucción explícita del usuario. Preguntar siempre antes de subir cualquier cambio.

## Environment & Run
- No Node tooling: pure static site (HTML/CSS/JS ES modules). No package.json, build, test, or lint step.
- Serve with `npx serve .` (do not use `file://` because `<script type="module">` requires HTTP origin).

## Domain
- Canonical: `https://urbantechcol.com`
- Referenced in: sitemap.xml, robots.txt, canonical link, og:url, JSON-LD LocalBusiness.url

## Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; imports `js/hero.js`, `js/scroll.js`, `js/config.js`, `js/whatsapp.js`.
- `js/config.js` — single source of truth for WhatsApp: change `WA_NUMBER` (top of file) to update all CTAs.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only).
- `css/styles.css` — imports the rest of site styles.

## WhatsApp links
- Anchors use `onclick="return openWhatsApp(this)"` with `message` attribute.
- `href` is a real `wa.me` URL (crawlable by Google). JS `openWhatsApp` prevents default navigation and opens a new tab.
- `js/whatsapp.js` defines `WA_NUMBER` and the `openWhatsApp` function.

## JSON-LD
- Two schemas in `<head>`:
  1. `LocalBusiness` — store info, address (Medellín), phone
  2. `ItemList` — 48 products (36 iPhones + 12 accessories) with `Product` + `Offer` (price, currency COP, availability, condition)

## Products
- Ordered newest → oldest: 17 Pro Max → 17 Pro → 17 → 16 Pro Max → 16 → 15 → 13 → accessories
- Each model group separated by `<div class="model-divider"><span>Model Name</span></div>` spanning full grid width
- Cards use `<article class="product-card reveal">` (semantic HTML5)
- Card element order: badge → img → `<h3>iPhone [Model]</h3>` → `<span class="product-color">[Color]</span>` → stock badge → price → `<span class="capacity-chip">[GB]</span>` → button
- All product cards use `.dual-capacity` > `.dual-capacity-option` layout
- iPhone 13 Midnight: dual capacity (Nuevo + Exhibición)
- iPhone 16: two options (256 GB Exhibición + 128 GB Nuevo), Spanish color names in filenames (`rosa`, `verde`, `azul`)
- iPhone 15 Green/Yellow/Pink: `stock-badge--out` (Agotado), button shows "Agotado" disabled

## Payment carousel
- 6 methods × 2 sets = 12 items for infinite scroll animation
- Images fill SVG (`x="0" y="0" width="100" height="70"`, `preserveAspectRatio="xMidYMid slice"`)
- Text label below SVG in `<span class="payment-label">`
- Animation: `payment-scroll` translates -50% (needs duplicate set for seamless loop)

## Assets & cache-busting
- Images: `assets/images/` (products/, accessories/, payments/, avatars/)
- Cache-busting is manual: URLs include `?v=N`. Bump `v` when replacing an image.
- Payment images: `addi.png`, `banco-bogota.png`, `efectivo.png`, `sistecredito.png`, `t-credito.png`, `t-debito.png`, `transferencia.png`, `addi.svg` (placeholder).

## Conventions & gotchas
- Module script CORS: any local testing must use an HTTP server.
- Small-screen hero sizing: CSS breakpoints; `hero.js` only manipulates `transform`.
- Products with `stock-badge--out` have disabled buttons (no comprar).
- "Agotado" items still show price (for reference).
- Hero alt text: descriptive, e.g. `alt="iPhone 17 Pro Max Cosmic Orange - Urban Tech"`.

## SEO-critical
- Sitemap: `https://urbantechcol.com/sitemap.xml` (single URL, changefreq weekly)
- robots.txt: permissive, points to sitemap
- Meta robots: `index, follow`
- WhatsApp links: real `wa.me` href for crawlability
- JSON-LD products: all 48 items with price, availability, condition
- og:image: absolute URL with width/height

## Where to look next
- `index.html`, `js/main.js`, `js/config.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

## If you change structure or add tooling
- Update this file immediately so future agents don't assume "no build step".
