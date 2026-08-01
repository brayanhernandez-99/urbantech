# Urban Tech — AGENTS.md

Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

## Git & Push
- **NUNCA** hacer commit, push ni ninguna operación de git sin instrucción explícita del usuario. Preguntar siempre. Cero excepciones.

## Environment & Run
- No Node tooling: pure static site (HTML/CSS/JS ES modules). No package.json, build, test, or lint step.
- Serve with `npx serve .` (do not use `file://` because `<script type="module">` requires HTTP origin).

## Domain
- Canonical: `https://urbantechcol.com`
- Referenced in: sitemap.xml, robots.txt, canonical link, og:url, JSON-LD LocalBusiness.url

## Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; calls `initHero()`, `initScroll()`, `initGallery()` on DOMContentLoaded.
- `js/gallery.js` — product image carousel arrows (`data-images` on `.product-img-wrapper`) + lightbox.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only).
- `js/scroll.js` — scroll spy / reveal animations.
- `js/whatsapp.js` — defines `WA_NUMBER` + `openWhatsApp()` for all CTAs.
- `css/styles.css` — entry point; imports `variables.css`, `hero.css`, `sections.css`, `animations.css`.
- `css/variables.css` — CSS custom properties (colors, fonts, spacing).

## WhatsApp links
- Anchors use `onclick="return openWhatsApp(this)"` with `message` attribute (plain text, no URL encoding).
- `href="#"` — JS builds the full `wa.me` URL from `WA_NUMBER` + `message` via `openWhatsApp()`.
- `js/whatsapp.js` defines `WA_NUMBER` and the `openWhatsApp` function.
- Floating button `.wa-float` fixed bottom-right (24px/24px, 56px circle, #25D366 bg, white icon). Added before scripts in `<body>`. Bounce animation `wa-bounce` in `animations.css`. Mobile: 50px, 16px inset.

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
- iPhone 16: two options (256 GB Exhibición + 128 GB Nuevo), English color names in filenames (`pink`, `teal`, `ultramarine`)
- iPhone 15 Green/Yellow/Pink: `stock-badge--out` (Agotado), button shows "Agotado" disabled
- iPhone 13: Midnight has dual capacity (Nuevo + Exhibición); Blue/Green/Red/Pink single capacity (Exhibición)

## Payment carousel
- 6 methods × 2 sets = 12 items for infinite scroll animation
- Images fill SVG (`x="0" y="0" width="100" height="70"`, `preserveAspectRatio="xMidYMid slice"`)
- Text label below SVG in `<span class="payment-label">`
- Animation: `payment-scroll` translates -50% (needs duplicate set for seamless loop)

## Assets & cache-busting
- Images: `assets/images/` (products/, accessories/, payments/, avatars/)
- Cache-busting is manual: URLs include `?v=N`. Bump `v` when replacing an image.
- Payment images: `addi.png`, `banco-bogota.png`, `efectivo.png`, `sistecredito.png`, `t-credito.png`, `t-debito.png`, `transferencia.png`.
- Product images follow convention: `iphone-{model}-{color}.webp` (English color names).
- Accessory images follow convention: `{descriptive-name}.webp`.

## Conventions & gotchas
- Module script CORS: any local testing must use an HTTP server.
- Small-screen hero sizing: CSS breakpoints; `hero.js` only manipulates `transform`.
- Products with `stock-badge--out` have disabled buttons (no comprar).
- "Agotado" items still show price (for reference).
- Hero alt text: descriptive, e.g. `alt="iPhone 17 Pro Max Cosmic Orange - Urban Tech"`.
- Script loading order: `whatsapp.js` → `gallery.js` → `hero.js` → `scroll.js` → `main.js` (globals, no ES module imports).
- Indentation: product cards use 10-space indent for `<article>`/children, 12 for `.dual-capacity-option`, 14 for price/chip, 8 for `</article>`. Accessories use flat 10-space indent.

## SEO-critical
- Sitemap: `https://urbantechcol.com/sitemap.xml` (single URL, changefreq weekly)
- robots.txt: permissive, points to sitemap
- Meta robots: `index, follow`
- WhatsApp links: `href="#"`, JS constructs `wa.me` URL
- JSON-LD products: all 48 items with price, availability, condition
- og:image: absolute URL with width/height

## Where to look next
- `index.html`, `js/main.js`, `js/whatsapp.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

## If you change structure or add tooling
- Update this file immediately so future agents don't assume "no build step".
