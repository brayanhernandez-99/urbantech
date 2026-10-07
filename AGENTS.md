# Urban Tech — AGENTS.md
Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

## Política de documentación

- **Documenta patrones, no inventario.** En `AGENTS.md` solo debe explicarse **CÓMO** funciona el proyecto: selectores, clases CSS, funciones JS, atributos `data-*`, flujos, convenciones y gotchas.
- **NUNCA documentes datos cambiantes.** No escribas precios, modelos, colores, capacidades, estados de stock, conteos, SKUs, handles, nombres comerciales, códigos hex ligados a un SKU o cualquier lista de productos.
- **Genérico ante todo.** Si puedes decirlo con "cualquier tarjeta", "cualquier variante" o "según el markup", hazlo así. Si solo aplica a UN producto concreto hoy, **no lo pongas**.
- **Pertenece al HTML/JS.** El contenido real vive en `index.html` y `js/*.js`. La documentación debe explicar las **reglas** para leer/escribir ese contenido.
- **Al editar documentación:** Solo añade lo estrictamente necesario para entender el patrón arquitectural.

## Reglas de implementación de código

- **Solo lo estrictamente necesario para que funcione.** Implementa únicamente lo imprescindible para cumplir el requisito exacto. No escribas código "por si acaso".
- **Código útil y mínimo.** Cada línea debe resolver lo solicitado AHORA. Usa la solución más simple, directa y corta (KISS). No anticipes lo no solicitado (YAGNI).
- **Sin features no solicitados ni código especulativo.** No añadas helpers, utilidades, validaciones, estados, efectos, clases o abstracciones que no se hayan pedido explícitamente.
- **Cambios quirúrgicos.** Modifica solo lo necesario. No refactorices, reformatees, muevas, reorganices ni toques código ajeno al objetivo.
- **Sin ruido ni código muerto.** No incluyas `console.log`, código comentado, TODOs, mocks o datos de prueba sin pedido explícito. Elimina imports, variables, funciones o clases sin usar tras el cambio.
- **Prioriza simple sobre complejo.** Si cabe en menos líneas, úsalo. Si dudas, pregunta.

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
- `js/products.js` — enhances product cards: variante seleccionable (`.selected`, `role="radio"`), CTA "Comprar" refleja variante, enlace "Financiar" (solo en celulares con `.dual-capacity`; llene el simulador vía `window.prefillCredit`) y filtro por modelo en `#productos` (el filtro activo se persiste en la URL vía `?modelo=…` con `history.replaceState`).
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
  1. `LocalBusiness` — store info, address (Medellín), phone, `openingHours`. **No** carries `priceRange` (no hay un valor real de rango de precios que publicar).
  2. `ItemList` — **minimal by design**: each `ListItem` carries only `position` + `name` + `url` (no offers, price, image, brand, description). `position` is sequential `1..N` with no gaps: **adding or removing an entry means renumbering every `position` after it.**
     - **Entry-count rule:** a card contributes **one entry per `id` on its `.dual-capacity-option`s**, or **1 entry if it has none**. It is *not* "one entry per capacity" — a card can hold two options of the same capacity (SIM vs E-SIM) and then contributes 2.
     - **Every option of a multi-option card must carry an `id`.** Without ids the card can only publish one entry, so the remaining variants are invisible to Google and unreachable by deep-link.
     - **A published `name` is frozen:** renaming it breaks the deep-link Google already indexed. Name format `Modelo Capacidad [SIM/E-SIM] - Color`; append ` SIM` / ` E-SIM` only when the card offers two options with the same capacity (otherwise the name would be duplicated).
     - Option `id` format: `<article-id>-<capacity-lowercase>-<sim|esim>`, e.g. `iphone-17-pro-max-cosmic-orange-256gb-sim`. The `<article>` may keep its own `id`; ids must be unique document-wide.
     - Precios, disponibilidad y condición **no viven en el JSON-LD**: se publican únicamente en el HTML visible de cada tarjeta, así un cambio de precio no exige sincronizar el schema.

## Products
- Order: newest model first, accessories last. Within a model group, one card per color.
- Each model group separated by `<div class="model-divider"><span>Model Name</span></div>` spanning full grid width
- Cards use `<article class="product-card reveal">` (semantic HTML5)
- Card element order: `<span class="stock-badge">` → `.product-img-wrapper` → `<h3>iPhone [Model]</h3>` → `<span class="product-color">[Color]</span>` → `.dual-capacity` (price → `.capacity-chip` → badge → `.btn`). Inside a `.dual-capacity-option` the order is always price → chip → badge; **no card puts a badge before the chip**.
- All product cards use `.dual-capacity` > `.dual-capacity-option` layout
- `js/products.js` inyecta en cada card: selección de variante SIN preselección (nada chequeado al cargar; clic o flechas/Enter cambian, dot coloreado solo en la elegida, clic sobre la marcada la desmarca), botón "Comprar" y enlace "Financiar" empiezan deshabilitados (`.is-disabled` + `aria-disabled`); al no elegir una variante, click en cualquiera muestra el mensaje rojo "Selecciona una opción..." (`.buy-hint`, fade, auto-hide) sin abrir WhatsApp. Al seleccionar, se habilitan y el CTA pasa a "Comprar [capacidad] · [tipo]" (mensaje WhatsApp incluye modelo + color + capacidad + SIM/E-SIM/Exhibición/Nuevo; "Financiar" con `data-amount` del precio seleccionado). Los accesorios (sin `.dual-capacity`) no tienen financiamiento ni gating. Una opción con clase `is-sold-out` (chip "Agotado") queda fuera de la selección y del financiamiento.
- Barra de filtros `.product-filters` en `#productos` (generada por `js/products.js` desde los `.model-divider`); cards ocultas usan `.is-filtered` (no confundir con `.hidden` de reveal).
- **Cards differ in options, not in structure.** Any card may offer 1 or N `.dual-capacity-option`s over any combination of capacity, SIM type and condition. Read the actual card before assuming a pattern from a neighbouring model.
- **Carousel photos must all be distinct.** If two frames of a source gallery are identical (or near-identical), drop one and renumber the survivors `-2..-N` consecutively — never ship the same photo twice in one carousel, and never leave a gap in the numbering. Check for cross-colour duplicates before committing.
- **One image folder per model**: `products/iphone-{model}/`, even when two models share a prefix (`iphone-16-pro/` vs `iphone-16-pro-max/`), otherwise their galleries overwrite each other.
- **Color swatch:** `--dot` on `.product-color` is the swatch hex. `dotForColor()` (`js/products.js`) forces any swatch above relative luminance 0.75 to cyan `#26E0D4`, so keep very light colors just under that or pick a darker hex.
- ⚠️ **Pending:** some cards still use provisional images sourced externally; replace them with photos of the store's own units.

## Credit simulator
- Section `#calcula-tu-credito` after `#accesorios`, before `#metodos-de-pago` (dark background).
- Nav link "Calcula tu crédito" in menu; `#metodos-de-pago` and `#contacto` remain as sections but are NOT in the nav.
- Entities and their financing factors live in `js/credit.js` (`{ name, divisor }`) — edit them there, never in the HTML. Formula: `calculated = cash / divisor`, `additional = calculated - cash`, `total = cash + additional`.
- Input `#credit-amount` (digits only, max 12, live thousands separator). Errors: "Ingresa el valor." (empty) / "El valor debe ser mayor a cero." (≤0).
- Results rendered by JS into `#credit-results`; per-entity card shows `Recargo <factor>` (the financing factor, `divisor.toFixed(2)`) + additional in money + TOTAL (primary) + CTA "Solicitar crédito" via `openWhatsApp`.
- Results include a `Precio de contado` summary line and a disclaimer note ("Valores aproximados. Sujetos a aprobación de la entidad."). Form card has a `.credit-hint` explaining "recargo". Cards fade in only on first valid render (`.credit-results--anim`).
- Formatting COP (`$1.176.471`, round to nearest) uses local `formatCOP`/`groupDigits` in `credit.js`.
- `window.prefillCredit(value)` (global en `credit.js`) llena `#credit-amount` y dispara un evento `input`; lo usa el enlace "Financiar" de `js/products.js` con el precio de la variante seleccionada.

## Payment carousel
- Each method set is duplicated once (2×N items) to make the infinite scroll seamless
- Images fill SVG (`x="0" y="0" width="100" height="70"`, `preserveAspectRatio="xMidYMid slice"`)
- Text label below SVG in `<span class="payment-label">`
- Animation: `payment-scroll` translates -50% (needs duplicate set for seamless loop)

## Assets & cache-busting
- Images: `assets/images/` (products/, accessories/, payments/, avatars/)
- Cache-busting is manual: URLs include `?v=N`. Bump `v` when replacing an image. **No** add `?v=` to new product images: `js/gallery.js:36-39` matches the `<img src>` against `data-images` by substring to recover the lightbox index, and a mismatch drops it to 0. No product image currently carries a query string.
- Payment logos: one file per method in `payments/`, named `{method}.png` (kebab-case, matching the label below it).
- Product images follow convention: `products/iphone-{model}/{color}[-{n}].webp` (English color names, `{n}` = 2..N for carousel images, omitted on the first). All are 1000×1000 RGB WebP — match that when replacing. Carousel length varies per card; `n` is not a global constant.
- Accessory images follow convention: `{descriptive-name}.webp`.

## Conventions & gotchas
- Module script CORS: any local testing must use an HTTP server.
- Small-screen hero sizing: CSS breakpoints; `hero.js` only manipulates `transform`.
- Products with `stock-badge--out` have disabled buttons (no comprar).
- "Agotado" items still show price (for reference).
- Hero and product `alt` text is descriptive and follows `"<Model> <Color> - Urban Tech"`; the first `<img>` of a card also carries explicit `width`/`height` and `loading="lazy"`.
- Script loading order: `whatsapp.js` → `gallery.js` → `hero.js` → `scroll.js` → `products.js` → `credit.js` → `main.js` (globals, no ES module imports).
- Trust band `.trust-band` sits in normal flow at the foot of the hero, **not** absolutely positioned — the hero is a flex column and `.container` carries `flex: 1`. Its texts are `nowrap`, so a longer phrase needs a CSS change, not a markup change. Opening hours are duplicated in the footer and the JSON-LD; keep them in sync.
- Indentation: product cards use 10-space indent for `<article>` AND its direct children (`stock-badge`, `product-img-wrapper`, `h3`, `product-color`, `dual-capacity`), 12 for `.dual-capacity-option`/`.btn` and `<img>`/arrows, 14 for price/chip, 10 for `</div>` of `.dual-capacity`, 8 for `</article>`. Accessories use flat 10-space indent.
- **Color names are English everywhere**: the `.product-color` label, the JSON-LD `name`, and the image filename slug. Translate any Spanish source label on the way in (Negro → Black, Glaciar → Glacier); never let a Spanish color reach the HTML.

## SEO-critical
- Sitemap: `https://urbantechcol.com/sitemap.xml` (single URL, changefreq weekly)
- robots.txt: permissive, points to sitemap
- Meta robots: `index, follow`
- WhatsApp links: `href="#"`, JS constructs `wa.me` URL
- JSON-LD products: entries are minimal (`position` + `name` + `url`, no offers/price/availability in the schema). Every `item.url` fragment must resolve to a real `id` in `index.html` (`js/main.js` deep-links the fragment to `.product-card`), so per-capacity cards put the id on the `.dual-capacity-option`, not the `<article>`.
- og:image: absolute URL with width/height

## Where to look next
- `index.html`, `js/main.js`, `js/products.js`, `js/whatsapp.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

## If you change structure or add tooling
- Update this file immediately so future agents don't assume "no build step".
