# Urban Tech — AGENTS.md

Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

## Git & Push
- **NUNCA** hacer commit, push ni ninguna operación de git sin instrucción explícita del usuario. Preguntar siempre. Cero excepciones.
- Mensajes de commit en español con prefijo `feat:` o `fix:` (ej. `feat: añadir banda de confianza`).

## Environment & Run
- No Node tooling: pure static site (HTML/CSS/JS ES modules). No package.json, build, test, or lint step.
- Serve with `npx serve .` (do not use `file://` because `<script type="module">` requires HTTP origin).

## Domain
- Canonical: `https://urbantechcol.com`
- Referenced in: sitemap.xml, robots.txt, canonical link, og:url, JSON-LD LocalBusiness.url

## Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; calls `initHero()`, `initScroll()`, `initGallery()`, `initProducts()`, `initCreditCalculator()` on DOMContentLoaded.
- `js/gallery.js` — product image carousel arrows (`data-images` on `.product-img-wrapper`) + lightbox.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only).
- `js/scroll.js` — scroll spy / reveal animations + mobile menu (scroll lock, Escape).
- `js/products.js` — enhances product cards: variante seleccionable (`.selected`, `role="radio"`), CTA "Comprar" refleja variante, enlace "Financiar" (solo en celulares con `.dual-capacity`; llene el simulador vía `window.prefillCredit`) y filtro por modelo en `#productos`.
- `js/credit.js` — "Calcula tu crédito": data de entidades, `formatCOP()`, cálculo y render del simulador; expone `window.prefillCredit(value)`.
- `js/whatsapp.js` — defines `WA_NUMBER` + `openWhatsApp()` for all CTAs.
- `css/styles.css` — entry point; imports `variables.css`, `hero.css`, `sections.css`, `credit.css`, `animations.css`.
- `css/variables.css` — CSS custom properties (colors, fonts, spacing).
- `css/credit.css` — estilos del simulador de crédito (sección oscura).

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
- `js/products.js` inyecta en cada card: selección de variante SIN preselección (nada chequeado al cargar; clic o flechas/Enter cambian, dot coloreado solo en la elegida, clic sobre la marcada la desmarca), botón "Comprar" y enlace "Financiar" empiezan deshabilitados (`.is-disabled` + `aria-disabled`); al no elegir una variante, click en cualquiera muestra el mensaje rojo "Selecciona una opción..." (`.buy-hint`, fade, auto-hide) sin abrir WhatsApp. Al seleccionar, se habilitan y el CTA pasa a "Comprar [capacidad] · [tipo]" (mensaje WhatsApp incluye modelo + color + capacidad + SIM/E-SIM/Exhibición/Nuevo; "Financiar" con `data-amount` del precio seleccionado). Los accesorios (sin `.dual-capacity`) no tienen financiamiento ni gating.
- Barra de filtros `.product-filters` en `#productos` (generada por `js/products.js` desde los `.model-divider`); cards ocultas usan `.is-filtered` (no confundir con `.hidden` de reveal).
- iPhone 13 Midnight: dual capacity (Nuevo + Exhibición)
- iPhone 16: two options (256 GB Exhibición + 128 GB Nuevo), English color names in filenames (`pink`, `teal`, `ultramarine`)
- iPhone 15 Green/Yellow/Pink: `stock-badge--out` (Agotado), button shows "Agotado" disabled
- iPhone 13: Midnight has dual capacity (Nuevo + Exhibición); Blue/Green/Red/Pink single capacity (Exhibición)

## Credit simulator
- Section `#calcula-tu-credito` after `#accesorios`, before `#metodos-de-pago` (dark background).
- Nav link "Calcula tu crédito" in menu; `#metodos-de-pago` and `#contacto` remain as sections but are NOT in the nav.
- 3 entities: Banco de Bogotá (0.85), ADDI (0.77), Sistecrédito (0.70). Formula: `calculated = cash / divisor`, `additional = calculated - cash`, `total = cash + additional`.
- Input `#credit-amount` (digits only, max 12, live thousands separator). Errors: "Ingresa el valor." (empty) / "El valor debe ser mayor a cero." (≤0).
- Results rendered by JS into `#credit-results`; per-entity card shows `Recargo (X.X%)` (real % on cash price, derived from `additional / cash`) + additional in money + TOTAL (primary) + CTA "Solicitar crédito" via `openWhatsApp`.
- Results include a `Precio de contado` summary line and a disclaimer note ("Valores aproximados. Sujetos a aprobación de la entidad."). Form card has a `.credit-hint` explaining "recargo". Cards fade in only on first valid render (`.credit-results--anim`).
- Formatting COP (`$1.176.471`, round to nearest) uses local `formatCOP`/`groupDigits` in `credit.js` (same rules as UrbanPay).
- `window.prefillCredit(value)` (global en `credit.js`) llena `#credit-amount` y dispara un evento `input`; lo usa el enlace "Financiar" de `js/products.js` con el precio de la variante seleccionada.

## Payment carousel
- 7 methods × 2 sets = 14 items for infinite scroll animation
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
- Script loading order: `whatsapp.js` → `gallery.js` → `hero.js` → `scroll.js` → `products.js` → `credit.js` → `main.js` (globals, no ES module imports).
- Trust band `.trust-band` (Garantía, Envíos, Pago seguro, 100% original) anclada al pie del hero (position absolute, visible en la pantalla principal); horarios reales en footer y JSON-LD: Lun-Sáb 10:00-19:00, Dom-Fes 10:30-16:00.
- Indentation: product cards use 10-space indent for `<article>`/children, 12 for `.dual-capacity-option`, 14 for price/chip, 8 for `</article>`. Accessories use flat 10-space indent.

## SEO-critical
- Sitemap: `https://urbantechcol.com/sitemap.xml` (single URL, changefreq weekly)
- robots.txt: permissive, points to sitemap
- Meta robots: `index, follow`
- WhatsApp links: `href="#"`, JS constructs `wa.me` URL
- JSON-LD products: all 48 items with price, availability, condition
- og:image: absolute URL with width/height

## Where to look next
- `index.html`, `js/main.js`, `js/products.js`, `js/whatsapp.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

## If you change structure or add tooling
- Update this file immediately so future agents don't assume "no build step".
