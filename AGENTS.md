# Urban Tech — AGENTS.md
Keep this file minimal and high-signal. Only include facts an OpenCode session would likely miss.

## Flujo de validación de cambios
- **Toda propuesta se valida antes de entregarse.** Antes de presentar cualquier solución, lánzala al subagente `validator` (contexto fresco, solo lectura).
- Si responde **"CAMBIOS REQUERIDOS"**, corrige y vuelve a lanzarlo. Repite hasta **"APROBADO"**. Solo entonces presenta la propuesta.
- **Lánzalo en background** y sigue con trabajo independiente mientras corre; espera su veredicto antes de entregar. Pásale el **diff**, no la propuesta completa.
- **Nada se aplica sin aprobación explícita del usuario.** La aplicación la hace el agente `build`.

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
- **Responsive y no romper nada:** todo cambio debe verificarse en móvil (≤768px) y en escritorio (sirve con `npx serve .` y revisa ~360px, 768px y escritorio), y confirmar que no daña secciones ni breakpoints vecinos antes de darlo por terminado.

## Git & Push
- **NUNCA** hacer commit, push ni ninguna operación de git sin instrucción explícita del usuario. Preguntar siempre. Cero excepciones.
- Mensajes de commit en español con prefijo `feat:` o `fix:` (ej. `feat: añadir banda de confianza`).

## Environment & Run
- No Node tooling: pure static site (HTML/CSS, JS clásico con globales). No package.json, build, test, or lint step.
- Serve with `npx serve .` (do not use `file://`; serve over HTTP).

## Domain
- Canonical: `https://urbantechcol.com`
- Referenced in: sitemap.xml, robots.txt, canonical link, og:url, JSON-LD LocalBusiness.url

## Entrypoints & important files
- `index.html` — single-page landing; primary edit point for content/markup.
- `js/main.js` — runtime entry; calls `initHero()`, `initScroll()`, `initGallery()`, `initProducts()`, `initCreditCalculator()` on DOMContentLoaded, y rellena `#footer-year` con el año en curso. Al inicio mapea los hashes de sección antiguos en español (`#productos`, `#credito`, …) a su id actual con `history.replaceState`.
- `js/gallery.js` — product image carousel arrows (`data-images` on `.product-img-wrapper`) + lightbox.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only).
- `js/scroll.js` — scroll spy / reveal animations + mobile menu (scroll lock, Escape).
- `js/products.js` — enhances product cards: variante seleccionable (`.selected`, `role="radio"`), CTA "Comprar" refleja variante, enlace "Financiar" (solo en celulares con `.dual-capacity`; llene el simulador vía `window.prefillCredit`) y filtro por modelo en `#products` (el filtro activo se persiste en la URL vía `?modelo=…` con `history.replaceState`).
- `js/credit.js` — "Calcula tu crédito": data de entidades, `formatCOP()`, cálculo y render del simulador; expone `window.prefillCredit(value)`.
- `js/whatsapp.js` — defines `WA_NUMBER` + `openWhatsApp()` for all CTAs.
- `css/styles.css` — entry point; imports `variables.css`, `hero.css`, `sections.css`, `credit.css`, `animations.css`.
- `css/variables.css` — tema normal: CSS custom properties (colors, fonts, spacing) + los tokens de zona (fondos decorativos) vacíos. El acento se define con `--primary-rgb`; `--primary` y `--glow` se derivan de él. `--brand` es el cian fijo de la marca (solo `.nav-logo span`), no sigue el tema.
- `css/themes/<tema>.css` — tema activo; solo sobreescribe tokens (ver "Temas").
- `css/credit.css` — estilos del simulador de crédito (sección oscura).

## Temas (theming)
- El tema normal es `css/variables.css`. Un tema estacional es un archivo en `css/themes/` que **solo sobreescribe valores del tema** (colores, fondos e iconografía del tema, sin reglas de layout) y se activa con un `<link>` en `index.html` después de `css/styles.css` (mismo selector `:root`, gana por orden de carga).
- **Acento:** se declara una sola vez como `--primary-rgb: r, g, b`; `--primary: rgb(var(--primary-rgb))` y `--glow: rgba(var(--primary-rgb), .35)` se derivan. En CSS toda transparencia del acento se escribe `rgba(var(--primary-rgb), α)` (nunca el hex), así un tema cambia `--primary-rgb` (+ `--primary-soft`/`--primary-dark` para los tonos claro/oscuro) y siguen todas.
- **Fondos decorativos por zona:** `--hero-bg` + `--hero-scrim`/`--hero-scrim-sm` (hero y su `≤1024px`), `--hero-panel` (panel oscuro detrás del texto del hero, que pinta `.hero-content::before` en `hero.css`) y `--section-bg` (una por sección, vía selector en el tema) + `--section-veil`. En el tema normal todos valen `none`; `.hero` los compone con `background-image` y cada zona de las de `css/sections.css` (el mismo grupo que asigna `--gray`) los pinta en la capa `.section-bg`. `--section-gray` es el gris de esas zonas cuando llevan velo: el tema solo lo aclara en las que oscurece (el velo oscurece el gris base y lo vuelve ilegible). Un tema solo declara estos tokens (nunca reglas de `background-*`). `.section-bg` es una capa `sticky` de alto `100svh` con margen negativo (no ocupa espacio) que el grupo de zonas de `sections.css` reparte y que pinta el arte anclado al viewport mientras se recorre la sección; la zona lleva `isolation: isolate` para que la capa (`z-index: -1`) no caiga tras el fondo de la página. No usar `background-attachment: fixed`: iOS lo ignora y escala el arte contra la sección entera (en `#products`, de decenas de miles de px, una mancha).
- **Rutas en `url()` de custom properties:** se resuelven contra la hoja donde se **usa** el `var()`, no donde se declara. Por eso `--hero-bg` y los `--section-bg` (usados desde `css/hero.css` y `css/sections.css`) van relativos a `css/` (`../assets/…`). Un `..` de más en http lo recorta el navegador en la raíz y carga igual, pero en `file://` sale del repo y la imagen no aparece.
- `--halo-fill` es el relleno del disco `.hero-halo`. `--price-color` es el color del precio de las tarjetas.
- **Receta para un tema nuevo:** (1) crear `css/themes/<tema>.css` con un `:root` que sobreescriba `--primary-rgb`, `--primary-soft`, `--primary-dark` y los tokens de fondo/velo/gris/precio que apliquen (rutas `../assets/images/<tema>/…`, relativas a `css/`, que es donde se usan); (2) poner el arte en `assets/images/<tema>/`, incluida una versión vertical `*-mobile.webp` de cada fondo (la escena completa a lo ancho sobre un relleno difuminado del mismo arte), que el tema sirve en `@media (max-width: 1024px) and (orientation: portrait)` — en apaisado el arte 3:2 ya cabe entero; sin ella el arte 3:2 con `cover` en un viewport vertical se recorta a ~1/3 del ancho; (3) en `index.html`, apuntar el `<link>` del tema a ese archivo y subir su `?v=`. No crear archivos de tema vacíos: un tema sin overrides es ruido.

## WhatsApp links
- Anchors use `onclick="return openWhatsApp(this)"` with `message` attribute (plain text, no URL encoding).
- `href="#"` — JS builds the full `wa.me` URL from `WA_NUMBER` + `message` via `openWhatsApp()`.
- `js/whatsapp.js` defines `WA_NUMBER` and the `openWhatsApp` function.
- Floating button `.wa-float` fixed bottom-right (24px/24px, 56px circle, #25D366 bg, white icon). Added before scripts in `<body>`. Bounce animation `wa-bounce` in `animations.css`. Mobile: 50px, 16px inset. Al hacer hover: la sombra verde se intensifica y el `<svg>` interno salta (`wa-bounce 0.5s ×2`, aplicado al svg para no chocar con el rebote idle del anchor) y aparece la etiqueta `::after` "Escríbenos por WhatsApp" (sin emoji; solo bajo `@media (hover: hover) and (pointer: fine)` o `:focus-visible`). Un tema puede ocultar el glifo de marca y el círculo del botón (fondo y sombra), y hacer que el elemento decorativo `.wa-float-pumpkin` ocupe todo el botón (oculto por defecto en `sections.css`).

## JSON-LD
- Two schemas in `<head>`:
  1. `LocalBusiness` — store info, address (Medellín), phone, `openingHours`. **No** carries `priceRange` (no hay un valor real de rango de precios que publicar).
  2. `ItemList` — **minimal by design**: each `ListItem` carries only `position` + `item: { @type, name, url }` (no offers, price, image, brand, description). `position` is sequential `1..N` with no gaps: **adding or removing an entry means renumbering every `position` after it.**
     - **Entry-count rule:** a card contributes **one entry per `id` on its `.dual-capacity-option`s**, or **1 entry if it has none**. It is *not* "one entry per capacity" — a card can hold two options of the same capacity (SIM vs E-SIM) and then contributes 2.
     - **Every option of a multi-option card must carry an `id`.** Without ids the card can only publish one entry, so the remaining variants are invisible to Google and unreachable by deep-link.
     - **A published `name` is frozen:** renaming it breaks the deep-link Google already indexed. Name format `Modelo Capacidad [SIM/E-SIM] - Color`; append ` SIM` / ` E-SIM` only when the card offers two options with the same capacity (otherwise the name would be duplicated).
     - Option `id` format: `<article-id>-<capacity-lowercase>-<sim|esim>`, donde `<article-id>` es el id o slug de la propia tarjeta. The `<article>` may keep its own `id`; ids must be unique document-wide.
     - Precios, disponibilidad y condición **no viven en el JSON-LD**: se publican únicamente en el HTML visible de cada tarjeta, así un cambio de precio no exige sincronizar el schema.

## Products
- Order: newest model first, accessories last. Within a model group, one card per color.
- Each model group separated by `<div class="model-divider"><span>Model Name</span></div>` spanning full grid width
- Cards use `<article class="product-card reveal">` (semantic HTML5)
- Card element order: `<span class="stock-badge">` → `.product-img-wrapper` → `<h3>iPhone [Model]</h3>` → `<span class="product-color">[Color]</span>` → `.dual-capacity` (price → `.capacity-chip` → badge → `.btn`). Inside a `.dual-capacity-option` the order is always price → chip → badge; **no card puts a badge before the chip**.
- All product cards use `.dual-capacity` > `.dual-capacity-option` layout
- `js/products.js` inyecta en cada card: selección de variante SIN preselección (nada chequeado al cargar; clic o flechas/Enter cambian, dot cyan solo en la elegida, clic sobre la marcada la desmarca), botón "Comprar" y enlace "Financiar" empiezan deshabilitados (`.is-disabled` + `aria-disabled`); al no elegir una variante, click en cualquiera muestra el mensaje rojo "Selecciona una opción..." (`.buy-hint`, fade, auto-hide) sin abrir WhatsApp. Al seleccionar, se habilitan y el CTA pasa a "Comprar [capacidad] · [tipo]" (mensaje WhatsApp incluye modelo + color + capacidad + SIM/E-SIM/Exhibición/Nuevo; "Financiar" con `data-amount` del precio seleccionado). Los accesorios (sin `.dual-capacity`) no tienen financiamiento ni gating. Una opción con clase `is-sold-out` (chip "Agotado") queda fuera de la selección y del financiamiento.
- Barra de filtros `.product-filters` en `#products` (generada por `js/products.js` desde los `.model-divider`); cards ocultas usan `.is-filtered` (no confundir con `.hidden` de reveal). Si la URL no trae `?modelo=`, el filtro arranca en el modelo del fragmento cuando éste apunta a una card del grid de `#products` (con `data-model`); las cards de accesorios (sin `.model-divider`) y cualquier otro fragmento caen al modelo por defecto. `apply()` escribe el `?modelo=` resultante en la URL con `history.replaceState`.
- **Cards differ in options, not in structure.** Any card may offer 1 or N `.dual-capacity-option`s over any combination of capacity, SIM type and condition. Read the actual card before assuming a pattern from a neighbouring model.
- **Carousel photos must all be distinct.** If two frames of a source gallery are identical (or near-identical), drop one and renumber the survivors `-2..-N` consecutively — never ship the same photo twice in one carousel, and never leave a gap in the numbering. Check for cross-colour duplicates before committing.
- **One image folder per model**: `products/iphone-{model}/`, even when a model's folder name is a prefix of another's, otherwise their galleries overwrite each other.
- **Color swatch:** `--dot` on `.product-color` is the swatch hex (solo el circulito junto al nombre del color). El punto de la variante seleccionada usa siempre el color de acento (`--primary`), no el color del equipo.
- ⚠️ **Pending:** some cards still use provisional images sourced externally; replace them with photos of the store's own units.

## Credit simulator
- Section `#credit` after `#accessories`, before `#payments` (dark background).
- Nav links "Crédito" (`#credit`) and "Contacto" (`#contact`) in menu; `#payments` and `#reviews` remain as sections but are NOT in the nav.
- Entities and their financing factors live in `js/credit.js` (`{ name, divisor }`) — edit them there, never in the HTML. Formula: `calculated = cash / divisor`, `additional = calculated - cash`, `total = cash + additional`.
- Input `#credit-amount` (digits only, max 12, live thousands separator). Errors: "Ingresa el valor." (empty) / "El valor debe ser mayor a cero." (≤0).
- Results rendered by JS into `#credit-results`; per-entity card shows `Recargo <factor>` (the financing factor, `divisor.toFixed(2)`) + additional in money + TOTAL (primary) + CTA "Solicitar crédito" via `openWhatsApp`.
- Results include a `Precio de contado` summary line and a disclaimer note ("Valores aproximados. Sujetos a aprobación de la entidad."). Form card has a `.credit-hint` explaining "recargo". Cards fade in only on first valid render (`.credit-results--anim`).
- Formatting COP (`$1.234.567`, thousands grouped with dots, round to nearest) uses local `formatCOP`/`groupDigits` in `credit.js`.
- `window.prefillCredit(value)` (global en `credit.js`) llena `#credit-amount` y dispara un evento `input`; lo usa el enlace "Financiar" de `js/products.js` con el precio de la variante seleccionada.

## Payment carousel
- Each method set is duplicated once (2×N items) to make the infinite scroll seamless
- Images fill SVG (`x="0" y="0" width="100" height="70"`, `preserveAspectRatio="xMidYMid slice"`)
- Text label below SVG in `<span class="payment-label">`
- Animation: `payment-scroll` translates -50% (needs duplicate set for seamless loop)

## Assets & cache-busting
- Images: `assets/images/` (products/, accessories/, payments/, avatars/)
- Seasonal art (fondos de hero/secciones/footer de una temporada) vive en `assets/images/<tema>/`; sus rutas se referencian solo desde el archivo de tema en `css/themes/` (tokens `--hero-bg`, `--section-bg`) o, si el arte va en el markup (p. ej. el botón flotante), desde `index.html`; nunca desde JS ni desde el CSS base.
- Cache-busting is manual: URLs include `?v=N`. Bump `v` when replacing an image. **No** add `?v=` to new product images: `js/gallery.js:36-39` matches the `<img src>` against `data-images` by substring to recover the lightbox index, and a mismatch drops it to 0. No product image currently carries a query string.
- Payment logos: one file per method in `payments/`, named `{method}.<ext>` con la extensión de su formato real (kebab-case, matching the label below it).
- **La extensión debe coincidir con el formato real del archivo.** Renombrar la extensión no convierte el formato: el `Content-Type` que recibe el navegador lo dicta la extensión, y los navegadores estrictos (Safari/iOS) no pintan la imagen si no coincide con sus bytes (en un `<img>` se ve rota; en un fondo CSS o un `<image>` de SVG queda invisible, sin aviso). Verifica con `file --mime-type` antes de subir.
- Product images follow convention: `products/iphone-{model}/{color}[-{n}].webp` (English color names, `{n}` = 2..N for carousel images, omitted on the first). All are 1000×1000 RGB WebP — match that when replacing. Carousel length varies per card; `n` is not a global constant.
- Accessory images follow convention: `{descriptive-name}.webp`.

## Conventions & gotchas
- Module script CORS: any local testing must use an HTTP server.
- Small-screen hero sizing: CSS breakpoints; `hero.js` only manipulates `transform`.
- Products with `stock-badge--out` have disabled buttons (no comprar) and their single option carries `is-sold-out` (row dimmed, fuera de selección y financiamiento).
- "Agotado" items still show price (for reference).
- Heading hierarchy: strict h1 → h2 → h3 → h4 (no skipped levels).
- Hero and product `alt` text is descriptive and follows `"<Model> <Color> - Urban Tech"`; the first `<img>` of a card also carries explicit `width`/`height` and `loading="lazy"`.
- Script loading order: `whatsapp.js` → `gallery.js` → `hero.js` → `scroll.js` → `products.js` → `credit.js` → `main.js` (globals, no ES module imports).
- Trust band `.trust-band` sits in normal flow at the foot of the hero, **not** absolutely positioned — the hero is a flex column and `.container` carries `flex: 1`. Its texts are `nowrap`, so a longer phrase needs a CSS change, not a markup change. Opening hours are duplicated in the footer and the JSON-LD; keep them in sync — exception: the footer's "Dom y Festivos" has no schema.org equivalent (`openingHours` can only declare `Su`), so don't drop the holidays from the footer to "sync" it.
- Indentation: product cards use 10-space indent for `<article>` AND its direct children (`stock-badge`, `product-img-wrapper`, `h3`, `product-color`, `dual-capacity`), 12 for `.dual-capacity-option`/`.btn` and `<img>`/arrows, 14 for price/chip, 10 for `</div>` of `.dual-capacity`, 8 for `</article>`. Accessories use flat 10-space indent.
- **Color names are English everywhere**: the `.product-color` label, the JSON-LD `name`, and the image filename slug. Translate any Spanish source label to English on the way in; never let a Spanish color reach the HTML.
- Footer social (`.footer-social-item`): ítem en columna — círculo 44px sobre la etiqueta — y los 4 ítems en fila (centrada) bajo el título; como `.footer-social` es `flex-wrap: wrap`, en anchos de escritorio estrechos la fila envuelve a una segunda fila y el bloque queda centrado por `justify-content: center` (el grid del footer usa `align-items: center` para equilibrar las 3 columnas). El `<a>` es lo único clicable y el texto queda **fuera** del botón (sin separador). Links externos llevan `target="_blank" rel="noopener"` y URLs sin parámetros de tracking. Al hover/focus del círculo solo el `<svg>` salta (`wa-bounce 0.5s ×2`) — sin tooltip.

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
