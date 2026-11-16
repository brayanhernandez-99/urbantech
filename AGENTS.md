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
- `index.html` — single-page landing (hero, catálogo `#modelos` —carrusel de una tarjeta por modelo que pinta `js/lineup.js` leyendo `#celulares`; la frase va en `data-tagline` del `.model-divider` (un modelo sin ella hereda la de su generación, el número tras "iPhone") y se pinta en `.lineup-tagline`; tras los modelos entran los productos con `data-featured` (en el `.model-divider` de las marcas o en la `<article>` de `#accesorios`; `FEATURED` en `lineup.js` fija las secciones y su orden; las que llevan `byPrice: true` ordenan sus destacados de menor a mayor precio; con `byKind: true` agrupan antes por `data-kind` en orden de aparición) y al final una tarjeta "Ver más" a `productos.html`—, ofertas —galería `.offers-grid` de imágenes de promoción en `assets/images/promos/`—, pagos, reseñas y footer); **no contiene el catálogo** (vive en `partials/catalogo.html`).
- `servicios.html` — vista independiente de servicios (`main.services-page` > `#servicios`, reusa los estilos `.service-*` de `css/sections.css`); el "Servicios" del nav de todas las páginas apunta aquí; el index ya no tiene sección de servicios.
- La fuente de datos de `producto.html`, `celulares.html`, `accesorios.html` y sus parsers es `partials/catalogo.html` (`fetch('partials/catalogo.html')`): contiene `<section id="celulares">`, `<section id="suunto">` y `<section id="accesorios">` con las tarjetas; **ahí se editan precios, fotos y variantes**.
- `google-merchant-feed.tsv` — feed de Google Merchant; se actualiza junto al HTML visible cuando cambian precios o disponibilidad.
- `partials/contacto.html` — footer de contacto compartido por todas las páginas. Cualquier página lo incluye con `<div data-include="partials/contacto.html"></div>` + `<script src="js/partials.js">` antes de sus scripts; `main.js` espera `window.partialsReady` antes de iniciar. `partials.js` rellena `#footer-year` al inyectarlo. Editar el footer solo en ese archivo.
- `js/main.js` — runtime entry; calls `initHero()`, `initScroll()` tras `window.partialsReady`. Al inicio mapea los hashes de sección antiguos en inglés (`#payments`, `#reviews`, …) y `#testimonios` a su id actual con `history.replaceState`.
- `js/hero.js` — controls hero parallax transforms (applies `transform` on `.hero-phone` img only).
- `js/scroll.js` — scroll spy / reveal animations + mobile menu (scroll lock, Escape). `js/nav.js` solo llama `initMobileToggle()` e `initNavDropdown()` en las páginas sin `main.js` (listados). El ítem "Productos" del nav es un desplegable (`.nav-dropdown`: botón `.nav-dropdown-toggle` + `.nav-submenu`, clic para abrir; Esc/clic fuera/enlace lo cierran; en móvil es acordeón dentro del menú): cada categoría nueva es un `<li><a class="nav-link" href="…">` (ancla `#<id de sección>` o página propia) dentro de `.nav-submenu` y el scroll spy marca también el botón.
- `js/credit.js` — "Calcula tu crédito": data de entidades, `formatCOP()`, cálculo y render del simulador; expone `window.prefillCredit(value)`.
- `js/search.js` + `css/search.css` — buscador del navbar (cargado en todas las páginas con navbar). El script **inyecta** el campo `.nav-search` entre el logo y los enlaces del navbar (siempre visible en escritorio, con la lista de resultados desplegada debajo) y, en ≤768px, un botón de lupa que lo abre como panel a todo el ancho; no hay markup del buscador en los HTML. Carga perezosa de `partials/catalogo.html` al abrirlo: un resultado por modelo de celular (`producto.html?modelo=<slug>`), por accesorio (`?accesorio=<id>`) y por modelo de las secciones de marca (`#suunto`, `#dji`, `#insta360`; el `data-kind` y el nombre de la marca entran como palabra clave; un término cuyas alternativas apuntan a varias categorías no fija ninguna). Coincidencias: texto sin tildes y en singular, palabras de relleno descartadas (`STOP`), sinónimos y colores en español → palabras del catálogo (`SYNONYMS`; edítalos ahí; claves tal como las deja `stem()` (singular, sin tildes), y un nombre del catálogo que la coincidencia difusa confundiría con una clave se declara como identidad) y tolerancia a un error de tecleo; coincidir en el nombre del modelo pesa el doble. Si todo lo escrito son términos de una categoría (`CATEGORY_TERMS`), el primer resultado es "Ver todos los…" hacia `celulares.html`/`accesorios.html`/`suunto.html`; sin coincidencias ofrece solo "Ver todos los productos" (`productos.html`) y WhatsApp (requiere `js/whatsapp.js` en la página). Es un combobox (flechas, Enter, Esc).
- `js/whatsapp.js` — defines `WA_NUMBER` + `openWhatsApp()` for all CTAs.
- `css/styles.css` — entry point; imports `variables.css`, `hero.css`, `sections.css`, `credit.css`, `animations.css`.
- `css/variables.css` — tema normal: CSS custom properties (colors, fonts, spacing) + los tokens de zona (fondos decorativos) vacíos. El acento se define con `--primary-rgb`; `--primary` y `--glow` se derivan de él. `--brand` es el cian fijo de la marca (solo `.nav-logo span`), no sigue el tema. Sobre fondo claro el acento como texto/borde usa `--primary-ink` (el cian puro no llega a 4.5:1); `#celulares` y `#accesorios` además redefinen `--gray` (→ `--gray-on-light`) y `--focus-ring` (anillo de foco). Errores sobre claro: `--danger-ink`.
- `css/themes/<tema>.css` — tema activo; solo sobreescribe tokens (ver "Temas").
- `css/credit.css` — estilos del simulador de crédito (sección oscura).

## Todos los productos (`productos.html`)
- `js/listado.js` sirve **todos** los listados (`productos`, `celulares`, `accesorios`, `suunto`, `dji`, `insta360`): hace `fetch('partials/catalogo.html')` y pinta una tarjeta `.cat-card` por modelo (`.model-divider`) de `#celulares`, `#suunto`, `#dji`, `#insta360` y por tarjeta de `#accesorios`. `SECTIONS` (orden del nav, etiqueta y `kinds` clave de `data-kind` → etiqueta) es lo que se edita al añadir una categoría o un tipo; en celulares el tipo es la condición (`nuevo`/`exhibicion`) de las opciones no agotadas. Precio = menor entre opciones no agotadas (`null` = Agotado).
- `<main data-section="<id de SECTIONS>">` limita el listado a esa sección (sin el atributo, `productos.html` muestra todas). `listado.js` solo pinta las tarjetas (con `data-group` = id de `SECTIONS`, `data-kind`, `data-price`, enlace y botón "Más información" a `producto.html`) y llama `initCatFilters` con las secciones mostradas; el panel y su lógica son los de `js/cat-filters.js` (ver "Filtros de los listados").

## Filtros de los listados (`js/cat-filters.js` + `css/cat-filters.css`)
- Todos los listados (`celulares`, `accesorios`, `suunto`, `dji`, `insta360` y `productos`) llaman `initCatFilters(groups)` tras pintar `#cat-grid`. El script **inyecta** el panel (`.prod-layout` > `form.prod-filters` + `.prod-results` con la grilla); no hay markup de filtros en los HTML. Las páginas enlazan `css/cat-filters.css` después de `css/celulares.css`.
- Lee de cada tarjeta `.cat-card`: `data-kind` (tipos separados por espacio), `data-price` (menor precio disponible; **sin él = agotado**) y `data-group` (solo si hay varias categorías). Un listado nuevo debe poner esos atributos al renderizar.
- `groups = [{ id, label, kinds: { tipo: 'Etiqueta' } }]`. Con un solo grupo el panel ofrece "Tipo" (casillas, OR); con varios, "Categoría" (casillas, OR) y al marcar una aparece su submenú de tipos (solo si hay ≥2 presentes; sin tipo marcado salen todos los de la categoría).
- Precio: dos `<input type="range">` superpuestos (`PRICE_STEP`; límites = menor y mayor `data-price`); con el rango recortado se ocultan los agotados. Con un solo grupo, sin ≥2 tipos y sin rango de precio no se muestra panel. En ≤960px el panel se abre con el botón `.prod-filters-toggle`.
- El estado se guarda en la URL con `history.replaceState` (sobrevive al recargar y al volver atrás): `f` = casillas marcadas (`<idCategoría>` y `<idCategoría>.<tipo>`, separadas por coma) y `min`/`max` solo si difieren de los límites. Se restaura antes del `apply()` final; los valores inválidos se ignoran.

## Vista de producto (`producto.html`)
- Una sola plantilla para celulares y accesorios: `producto.html?modelo=<slug>[&color=&capacidad=&tipo=]` (slug = nombre del `.model-divider` en minúsculas con guiones) y `producto.html?accesorio=<id de la card>`. `js/product.js` hace `fetch('partials/catalogo.html')` y parsea `#celulares` (dividers + cards) y `#accesorios` (cada card se normaliza a un producto de un solo "color" sin nombre y una sola opción; sin color/capacidad/versión esos grupos, el selector de modelo y las etiquetas de condición/envío no se muestran): **el catálogo vive solo en `partials/catalogo.html`**; no hay datos duplicados.
- Reglas de lectura: color = `.product-color` (+ `--dot`), fotos = `data-images`, opciones = `.dual-capacity-option` (`.capacity-chip` + badge de tipo + `.price` + `is-sold-out`). Cada modelo es un producto independiente (sin selector de modelo); el grupo "Versión" aparece solo si el color tiene >1 tipo. Sobre el título van las etiquetas `.pdp-tags`: condición de la opción elegida (`.badge-new` → Nuevo, `.badge-deal` Exhibición → Exhibición) + Envío gratis; la etiqueta de condición lleva color propio (Nuevo → acento, Exhibición → ámbar, Agotado → `--danger-ink`); un color agotado sigue seleccionable y, sin opción disponible, solo se muestra `Agotado` con Comprar deshabilitado. Bajo el botón, `.pdp-extra`: `<details>` nativos (copy estático en `producto.html`, sin JS) + botón Compartir (`navigator.share`, con respaldo a copiar el enlace). Bajo Comprar va el enlace de texto `.pdp-finance` (a `credito.html?valor=<precio de la opción elegida>`; celulares y accesorios). El botón Comprar replica la animación de `.product-card .btn` (subrayado + `.cart-icon`) con selectores `.pdp-buy` en `css/product.css`.
- **Suunto:** `#suunto` en `partials/catalogo.html` sigue el patrón de `#celulares` (un `.model-divider` por modelo + una tarjeta por color, con `.product-color`/`--dot`, `data-images` y una sola `.dual-capacity-option` sin chip). El divider lleva `data-kind="<tipo>"` (clave de `kinds` de su entrada en `SECTIONS` de `js/listado.js`; el listado `suunto.html` reusa `css/celulares.css`); `product.js` lo lee con categoría `CATEGORIES.suunto` (ruta `Inicio / Suunto / <modelo>`). Un tipo nuevo = nuevo `data-kind` + entrada en `kinds`. `data-specs` (bullets separados por `|`, comillas como `&quot;`) alimenta "Características". Fotos en `assets/images/suunto/<modelo>/<color>[-n].webp`.
- **Marcas con listado propio (DJI, Insta360):** cada marca es una sección `#<marca>` de `partials/catalogo.html` (un `.model-divider` con `data-kind` + una tarjeta por producto, `<span class="product-color"></span>` vacío cuando no hay variantes de color) y una página `<marca>.html` con `data-section="<marca>"` en el `<main>` que pinta `js/listado.js` (los tipos de filtro están en su entrada de `SECTIONS`). Una marca nueva = sección + página + entrada en `CATEGORIES` y en el selector de `parseCatalog` de `js/product.js` + enlace en el submenú de Productos de cada página + `sitemap.xml` + entrada en `SECTIONS` de `js/listado.js`. Las fotos van en `assets/images/<marca>/…`; una imagen provisional es un solo archivo por marca hasta tener las reales.
- Galería: pista con `scroll-snap` (swipe nativo) + flechas `.product-img-arrow`, puntos y miniaturas (solo escritorio, >960px). La ruta es `Inicio / <categoría> / <producto>`; la categoría (nombre + enlace a su sección del index) sale del mapa `CATEGORIES` de `product.js` y cada producto trae la suya; una categoría nueva se añade ahí y en su parser. Los audífonos son accesorios; un producto sin parser queda fuera de esta vista. Toda card de `#accesorios` debe llevar `id` (lo usa `?accesorio=`). Clic/Enter en la galería abre el lightbox (markup propio `#lightbox` en `producto.html` con clases `.lightbox*`, lógica en `product.js`, con deslizar táctil y flechas/teclado). Estilos en `css/product.css` (se enlaza desde `producto.html`, no desde `styles.css`). Lleva `noindex`; quitarlo al publicar si se quiere indexar.
- `serve` con `cleanUrls` redirige `/producto.html` a `/producto` y **pierde el query** (todas las vistas caían en el modelo por defecto). `serve.json` lo evita (`cleanUrls: false` + `rewrites` para `/` y para cada página que se quiera abrir sin extensión); se lee al **arrancar** `serve`; los enlaces del código usan `.html`. Si el navegador ya cacheó el redirect, recargar sin caché.

## Listado de celulares (`celulares.html`)
- Guía de la categoría: `celulares.html` (`data-section="celulares"`) usa `js/listado.js`, que lee `#celulares` y pinta **una tarjeta por `.model-divider`** (foto, nombre y "Desde $X" = precio mínimo entre opciones no agotadas; sin opciones, "Agotado") con enlace a `producto.html?modelo=<slug>`. Estilos en `css/celulares.css` (reusa `.pdp*` de `css/product.css`). El ítem "Celulares" del nav y la ruta de `producto.html` apuntan aquí. Las páginas de listado (`celulares.html`, `accesorios.html`) llevan el **mismo navbar del index** (páginas propias y `#contacto` del footer compartido; `js/scroll.js` + `js/nav.js` solo activan menú móvil y desplegable) con "Productos" y la categoría actual marcados con `nav-link--active` en el markup. La vista de producto lleva el navbar simple con `.nav-back` ("Todos los productos"), cuyo `href` apunta siempre a `productos.html` (estático en el markup; `product.js` no lo toca). Sin datos propios: todo sale de `partials/catalogo.html`. `accesorios.html` (`data-section="accesorios"`) sigue el mismo patrón con `#accesorios`: una tarjeta por accesorio (`.cat-card`, precio en `.cat-amount`, botón "Más información" a `producto.html?accesorio=<id>`) y reusa `css/celulares.css`. En el nav del index, "Celulares", "Accesorios" y "Crédito" apuntan a sus páginas.

## Temas (theming)
- El tema normal es `css/variables.css`. Un tema estacional es un archivo en `css/themes/` que **solo sobreescribe valores del tema** (colores, fondos e iconografía del tema, sin reglas de layout) y se activa con un `<link>` en `index.html` después de `css/styles.css` (mismo selector `:root`, gana por orden de carga).
- **Acento:** se declara una sola vez como `--primary-rgb: r, g, b`; `--primary: rgb(var(--primary-rgb))` y `--glow: rgba(var(--primary-rgb), .35)` se derivan. En CSS toda transparencia del acento se escribe `rgba(var(--primary-rgb), α)` (nunca el hex), así un tema cambia `--primary-rgb` (+ `--primary-soft`/`--primary-dark` para los tonos claro/oscuro) y siguen todas.
- **Fondos decorativos por zona:** `--hero-bg` + `--hero-scrim`/`--hero-scrim-sm` (hero y su `≤1024px`), `--hero-panel` (panel oscuro detrás del texto del hero, que pinta `.hero-content::before` en `hero.css`) y `--section-bg` (una por sección, vía selector en el tema) + `--section-veil`. En el tema normal todos valen `none`; `.hero` los compone con `background-image` y cada zona de las de `css/sections.css` (el mismo grupo que asigna `--gray`) los pinta en la capa `.section-bg`. `--section-gray` es el gris de esas zonas cuando llevan velo: el tema solo lo aclara en las que oscurece (el velo oscurece el gris base y lo vuelve ilegible). Un tema solo declara estos tokens (nunca reglas de `background-*`). `.section-bg` es una capa `sticky` de alto `100svh` con margen negativo (no ocupa espacio) que el grupo de zonas de `sections.css` reparte y que pinta el arte anclado al viewport mientras se recorre la sección; la zona lleva `isolation: isolate` para que la capa (`z-index: -1`) no caiga tras el fondo de la página. No usar `background-attachment: fixed`: iOS lo ignora y escala el arte contra la sección entera (en `#celulares`, de decenas de miles de px, una mancha).
- **Rutas en `url()` de custom properties:** se resuelven contra la hoja donde se **usa** el `var()`, no donde se declara. Por eso `--hero-bg` y los `--section-bg` (usados desde `css/hero.css` y `css/sections.css`) van relativos a `css/` (`../assets/…`). Un `..` de más en http lo recorta el navegador en la raíz y carga igual, pero en `file://` sale del repo y la imagen no aparece.
- `--halo-fill` es el relleno del disco `.hero-halo`. `--price-color` es el color del precio de las tarjetas.
- **Receta para un tema nuevo:** (1) crear `css/themes/<tema>.css` con un `:root` que sobreescriba `--primary-rgb`, `--primary-soft`, `--primary-dark`, `--primary-ink` (tono del acento con ≥4.5:1 sobre blanco) y los tokens de fondo/velo/gris/precio que apliquen (rutas `../assets/images/<tema>/…`, relativas a `css/`, que es donde se usan); (2) poner el arte en `assets/images/<tema>/`, incluida una versión vertical `*-mobile.webp` de cada fondo (la escena completa a lo ancho sobre un relleno difuminado del mismo arte), que el tema sirve en `@media (max-width: 1024px) and (orientation: portrait)` — en apaisado el arte 3:2 ya cabe entero; sin ella el arte 3:2 con `cover` en un viewport vertical se recorta a ~1/3 del ancho; (3) en `index.html`, apuntar el `<link>` del tema a ese archivo y subir su `?v=`. No crear archivos de tema vacíos: un tema sin overrides es ruido.

## WhatsApp links
- Anchors use `onclick="return openWhatsApp(this)"` with `message` attribute (plain text, no URL encoding).
- `href="#"` — JS builds the full `wa.me` URL from `WA_NUMBER` + `message` via `openWhatsApp()`.
- `js/whatsapp.js` defines `WA_NUMBER` and the `openWhatsApp` function.
- Floating button `.wa-float` fixed bottom-right (24px/24px, 56px circle, #25D366 bg, white icon). Added before scripts in `<body>`. Bounce animation `wa-bounce` in `animations.css`. Mobile: 50px, 16px inset. Al hacer hover: la sombra verde se intensifica y el `<svg>` interno salta (`wa-bounce 0.5s ×2`, aplicado al svg para no chocar con el rebote idle del anchor) y aparece la etiqueta `::after` "Escríbenos por WhatsApp" (sin emoji; solo bajo `@media (hover: hover) and (pointer: fine)` o `:focus-visible`). Un tema puede ocultar el glifo de marca y el círculo del botón (fondo y sombra).

## JSON-LD
- Two schemas in `<head>`:
  1. `LocalBusiness` — store info, address (Medellín), phone, `openingHours`. **No** carries `priceRange` (no hay un valor real de rango de precios que publicar).
  2. `ItemList` — **minimal by design**: each `ListItem` carries only `position` + `item: { @type, name, url }` (no offers, price, image, brand, description). `position` is sequential `1..N` with no gaps: **adding or removing an entry means renumbering every `position` after it.**
     - **Entry-count rule:** a card contributes **one entry per `id` on its `.dual-capacity-option`s**, or **1 entry if it has none**. It is *not* "one entry per capacity" — a card can hold two options of the same capacity (SIM vs E-SIM) and then contributes 2.
     - **Todo el catálogo, no solo iPhones y accesorios:** las tarjetas de marcas (`#suunto`, `#dji`, `#insta360`) aportan 1 entrada cada una (`?modelo=<slug del divider>[&color=<slug>]`, nombre `Modelo - Color`, sin color solo el modelo); una tarjeta sin precio ni opciones disponibles (p. ej. Agotado sin precio) sí entra en el JSON-LD pero no en el feed de Merchant (el precio es obligatorio allí).
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
- **Cards differ in options, not in structure.** Any card may offer 1 or N `.dual-capacity-option`s over any combination of capacity, SIM type and condition. Read the actual card before assuming a pattern from a neighbouring model.
- **Carousel photos must all be distinct.** If two frames of a source gallery are identical (or near-identical), drop one and renumber the survivors `-2..-N` consecutively — never ship the same photo twice in one carousel, and never leave a gap in the numbering. Check for cross-colour duplicates before committing.
- **One image folder per model**: `products/iphone-{model}/`, even when a model's folder name is a prefix of another's, otherwise their galleries overwrite each other.
- **Color swatch:** `--dot` on `.product-color` is the swatch hex (solo el circulito junto al nombre del color). El punto de la variante seleccionada usa siempre el color de acento (`--primary`), no el color del equipo.
- ⚠️ **Pending:** some cards still use provisional images sourced externally; replace them with photos of the store's own units.

## Credit simulator
- El simulador vive únicamente en `credito.html` (el index ya no tiene sección `#credito`); el nav del index lo enlaza.
- Nav links "Crédito" (`credito.html`) and "Contacto" (`#contacto`) in menu; `#pagos` and `#resenas` remain as sections but are NOT in the nav.
- Entities and their financing factors live in `js/credit.js` (`{ name, divisor }`) — edit them there, never in the HTML. Formula: `calculated = cash / divisor`, `additional = calculated - cash`, `total = cash + additional`.
- Input `#credit-amount` (digits only, max 12, live thousands separator). Errors: "Ingresa el valor." (empty) / "El valor debe ser mayor a cero." (≤0).
- Results rendered by JS into `#credit-results`; per-entity card shows `Recargo <factor>` (the financing factor, `divisor.toFixed(2)`) + additional in money + TOTAL (primary) + CTA "Solicitar crédito" via `openWhatsApp`.
- Results include a `Precio de contado` summary line and a disclaimer note ("Valores aproximados. Sujetos a aprobación de la entidad."). Form card has a `.credit-hint` explaining "recargo". Cards fade in only on first valid render (`.credit-results--anim`).
- Formatting COP (`$1.234.567`, thousands grouped with dots, round to nearest) uses local `formatCOP`/`groupDigits` in `credit.js`.
- `credito.html` aloja el mismo simulador como vista independiente (mismos ids `#credit-amount`/`#credit-results`; `js/credito.js` solo llama `initCreditCalculator`). `initCreditCalculator` lee `?valor=` de la URL y precarga el monto con `prefillCredit`; así cualquier producto puede enlazar `credito.html?valor=<monto>`.
- `window.prefillCredit(value)` (global en `credit.js`) llena `#credit-amount` y dispara un evento `input`; lo usa `initCreditCalculator` para precargar el monto de `?valor=`.

## Reviews carousel
- `#reviews-carousel` (index) tiene dos ciclos **independientes** que rota `js/reviews.js`: reseñas (`.review-slide` > `.testimonial-card`, dentro de `.review-quotes`, con puntos `.review-dots` generados por JS) y fotos de clientes (`.review-photo` con su `<img>`, dentro de `#review-photos`, con flechas y contador `.review-photo-nav`). Solo un elemento `.is-active` por ciclo. Reseña nueva = nuevo `.review-slide`; foto nueva = nuevo `.review-photo`. Pausa con el cursor encima y no rota con `prefers-reduced-motion`.

## Payment carousel
- Each method set is duplicated once (2×N items) to make the infinite scroll seamless
- Images fill SVG (`x="0" y="0" width="100" height="70"`, `preserveAspectRatio="xMidYMid slice"`)
- Text label below SVG in `<span class="payment-label">`
- Animation: `payment-scroll` translates -50% (needs duplicate set for seamless loop)

## Assets & cache-busting
- Images: `assets/images/` (products/, accessories/, payments/, avatars/)
- Seasonal art (fondos de hero/secciones/footer de una temporada) vive en `assets/images/<tema>/`; sus rutas se referencian solo desde el archivo de tema en `css/themes/` (tokens `--hero-bg`, `--section-bg`) o, si el arte va en el markup (p. ej. el botón flotante), desde `index.html`; nunca desde JS ni desde el CSS base.
- Cache-busting is manual: URLs include `?v=N`. Bump `v` when replacing an image. **No** add `?v=` to new product images: the `<img src>` must match its `data-images` entry exactly (the lightbox in `product.js` locates the open photo by that value). No product image currently carries a query string. Al editar un CSS importado por `css/styles.css`, sube su `?v=` en el `@import` de `css/styles.css` y el `?v=` de `styles.css` en `index.html` (preload + stylesheet).
- Payment logos: one file per method in `payments/`, named `{method}.<ext>` con la extensión de su formato real (kebab-case, matching the label below it).
- **La extensión debe coincidir con el formato real del archivo.** Renombrar la extensión no convierte el formato: el `Content-Type` que recibe el navegador lo dicta la extensión, y los navegadores estrictos (Safari/iOS) no pintan la imagen si no coincide con sus bytes (en un `<img>` se ve rota; en un fondo CSS o un `<image>` de SVG queda invisible, sin aviso). Verifica con `file --mime-type` antes de subir.
- Product images follow convention: `products/iphone-{model}/{color}[-{n}].webp` (English color names, `{n}` = 2..N for carousel images, omitted on the first). All are 1000×1000 RGB WebP — match that when replacing. Carousel length varies per card; `n` is not a global constant.
- Accessory images follow convention: `{descriptive-name}.webp`.

## Conventions & gotchas
- Module script CORS: any local testing must use an HTTP server.
- Small-screen hero sizing: CSS breakpoints; `hero.js` only manipulates `transform`.
- Products with `stock-badge--out` have disabled buttons (no comprar) and their single option carries `is-sold-out` (row dimmed, fuera de selección y financiamiento).
- "Agotado" items still show price (for reference).
- Heading hierarchy: strict h1 → h2 → h3 → h4 (no skipped levels). Sin etiquetas/eyebrows sobre los títulos de sección: el h2 va solo.
- Iconos siempre SVG de trazo con `stroke="currentColor"` (nunca emoji ni glifos), salvo el glifo de marca de `.wa-float`, que va relleno. Chips/etiquetas ≥11px; los chips de opción llevan `white-space: nowrap` (`.capacity-chip`, `.badge-sim`/`.badge-esim`, `.badge-new`; `.badge-deal.badge-sm` no, porque es una sola palabra) y un chip nuevo debe declararlo.
- El acento es el único color saturado de la interfaz, aparte del verde de WhatsApp, los badges de stock y el rojo de error (`--danger`/`--danger-ink`): no se introduce un segundo acento.
- **Qué cian usar según el fondo:** sobre fondo oscuro (navbar, hero, banda de beneficios, simulador, footer) el acento es `--primary`; sobre fondo blanco, `--primary-ink` (el cian puro no llega a 4.5:1). Aplica a texto, íconos y rellenos con texto encima: botones (`.pdp-buy`, `.cat-buy`) sobre blanco llevan fondo `--primary-ink` con texto blanco, y su línea animada de hover es blanca. Los detalles decorativos sin texto (separadores, puntos) pueden usar cualquiera de los dos según el fondo.
- **Hover de tarjetas (`.cat-card`, `.product-card`):** solo sombra (y elevación en las de producto); el borde no cambia a acento. Las estrellas de cada reseña van en `--dark`.
- Énfasis por color sólido, peso o tamaño: sin texto con degradado. Todo precio o monto lleva `font-variant-numeric: tabular-nums` (hoy vía `.product-card .price`, `.credit-input` y `.credit-results`; un precio nuevo fuera de ellos debe declararlo).
- Al hover solo se elevan las tarjetas con controles propios (producto, resultado del simulador); las de solo contenido (servicio, reseña) no se levantan.
- Área táctil ≥24px en enlaces y controles (≥44px en filas del menú móvil y la hamburguesa).
- Las flechas del carrusel y del lightbox y el cierre del lightbox se dibujan en `css/sections.css` con `::before` + `mask` SVG; el glifo del markup queda oculto (`font-size: 0`) y el nombre lo da `aria-label`, así que cambiar el glifo no cambia el icono.
- En ≤768px los accesorios (`#accesorios .products-grid`) van en 2 columnas con foto de 120px; los celulares siguen en 1 columna.
- Hero and product `alt` text is descriptive and follows `"<Model> <Color> - Urban Tech"`; the first `<img>` of a card also carries explicit `width`/`height` and `loading="lazy"`.
- Script loading order (index): `whatsapp.js` → `hero.js` → `scroll.js` → `search.js` → `lineup.js` → `reviews.js` → `partials.js` → `main.js` (globals; `credit.js` solo en `credito.html`, no ES module imports).
- Trust band `.trust-band` sits in normal flow at the foot of the hero, **not** absolutely positioned — the hero is a flex column and `.container` carries `flex: 1`. Its texts are `nowrap`, so a longer phrase needs a CSS change, not a markup change. Opening hours are duplicated in the footer and the JSON-LD; keep them in sync — exception: the footer's "Dom y Festivos" has no schema.org equivalent (`openingHours` can only declare `Su`), so don't drop the holidays from the footer to "sync" it.
- Indentation: product cards use 10-space indent for `<article>` AND its direct children (`stock-badge`, `product-img-wrapper`, `h3`, `product-color`, `dual-capacity`), 12 for `.dual-capacity-option`/`.btn` and `<img>`/arrows, 14 for price/chip, 10 for `</div>` of `.dual-capacity`, 8 for `</article>`. Accessories use flat 10-space indent.
- **Color names are English everywhere**: the `.product-color` label, the JSON-LD `name`, and the image filename slug. Translate any Spanish source label to English on the way in; never let a Spanish color reach the HTML.
- Footer social (`.footer-social-item`): ítem en columna — círculo 44px sobre la etiqueta — y los 4 ítems en fila (centrada) bajo el título; como `.footer-social` es `flex-wrap: wrap`, en anchos de escritorio estrechos la fila envuelve a una segunda fila y el bloque queda centrado por `justify-content: center` (el grid del footer usa `align-items: center` para equilibrar las 3 columnas). El `<a>` es lo único clicable y el texto queda **fuera** del botón (sin separador). Links externos llevan `target="_blank" rel="noopener"` y URLs sin parámetros de tracking. Al hover/focus del círculo solo el `<svg>` salta (`wa-bounce 0.5s ×2`) — sin tooltip.

## SEO-critical
- Sitemap: `https://urbantechcol.com/sitemap.xml` (index + listados/páginas de contenido, con URLs `.html`; `producto.html` queda fuera y con `noindex`). Una página nueva indexable lleva `robots` `index, follow`, `canonical` y `og:url` propios y una entrada en el sitemap.
- robots.txt: permissive, points to sitemap
- Meta robots: `index, follow`
- WhatsApp links: `href="#"`, JS constructs `wa.me` URL
- JSON-LD products: entries are minimal (`position` + `name` + `url`, no offers/price/availability in the schema). Every `item.url` is a `producto.html?...` link (`?accesorio=<id>` or `?modelo=<slug>&color=&capacidad=&tipo=`) that `product.js` resolves against `partials/catalogo.html`; the Merchant feed `link` column uses the same URLs. Per-capacity cards put the id on the `.dual-capacity-option`, not the `<article>`.
- og:image: absolute URL with width/height

## Where to look next
- `index.html`, `partials/catalogo.html`, `js/main.js`, `js/product.js`, `js/whatsapp.js`, `js/hero.js`, `css/styles.css`, `assets/images/`.

## If you change structure or add tooling
- Update this file immediately so future agents don't assume "no build step".
