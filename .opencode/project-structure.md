# Estructura del proyecto — Urban Tech

Sitio estático puro (HTML/CSS/JS ES modules). **Sin** tooling de Node: no hay
`package.json`, build, test ni lint. Para servir localmente: `npx serve .`
(no usar `file://`, los `<script type="module">` requieren HTTP).

## Árbol de archivos

```
urbantech/
├── index.html              # Landing de una sola página (contenido principal)
├── AGENTS.md               # Convenciones de alto nivel para sesiones OpenCode
├── opencode.json           # Config de OpenCode (agente por defecto)
├── robots.txt              # SEO: apunta al sitemap
├── sitemap.xml             # SEO: URL canónica del sitio
├── .opencode/
│   ├── agent/
│   │   └── code-reviewer.md     # Agente por defecto: review + validación
│   └── project-structure.md     # Este archivo
├── css/
│   ├── styles.css          # Entry point; importa el resto
│   ├── variables.css       # Custom properties (colores, fuentes, espaciado)
│   ├── hero.css            # Estilos del hero
│   ├── sections.css        # Estilos de secciones y productos
│   ├── credit.css          # Estilos del simulador de crédito (sección oscura)
│   └── animations.css      # Animaciones (reveal, wa-bounce, payment-scroll)
├── js/
│   ├── main.js             # Entry de runtime: initHero(), initScroll(), initGallery(), initCreditCalculator()
│   ├── gallery.js          # Carrusel de imágenes del producto + lightbox
│   ├── hero.js             # Parallax del hero (solo transform en .hero-phone img)
│   ├── scroll.js           # Scroll spy / reveal animations
│   ├── credit.js           # Simulador "Calcula tu crédito" (3 entidades, formatCOP, render)
│   └── whatsapp.js         # WA_NUMBER + openWhatsApp() para todos los CTA
└── assets/images/
    ├── products/           # iphone-{model}-{color}.webp
    ├── accessories/        # {descriptive-name}.webp
    ├── payments/           # addi.png, banco-bogota.png, etc.
    └── avatars/            # testimonios
```

## Dominio y SEO

- Canónico: `https://urbantechcol.com` (sitemap.xml, robots.txt, canonical,
  og:url, JSON-LD LocalBusiness.url).
- Dos JSON-LD en `<head>`: `LocalBusiness` y `ItemList` (48 productos:
  36 teléfonos + 12 accesorios).
- Imágenes con cache-busting manual `?v=N`; subir `v` al reemplazar.

## Orden del catálogo

17 Pro Max → 17 Pro → 17 → 16 Pro Max → 16 → 15 → 13
→ accesorios. Cada grupo separado por `<div class="model-divider">`.

## Convenciones clave

- Tarjetas: `<article class="product-card reveal">`; opciones de capacidad en
  `.dual-capacity` > `.dual-capacity-option` con badges `.badge-new`/`.badge-deal.badge-sm`
  (o `stock-badge--out` para agotados).
- WhatsApp: `href="#"` + `onclick="return openWhatsApp(this)"` con `message`.
- Colores de producto en inglés (Deep Blue, Cosmic Orange, Silver).
- Simulador de crédito: sección `#calcula-tu-credito`, 3 entidades (Banco de
  Bogotá 0.85, ADDI 0.77, Sistecrédito 0.70), fórmula de UrbanPay, formato COP
  local en `credit.js`. Las secciones `#metodos-de-pago` y `#contacto` existen
  pero no están en el menú.
- Carga de scripts: `whatsapp.js` → `gallery.js` → `hero.js` → `scroll.js` →
  `credit.js` → `main.js` (globales, sin imports ES).

## Flujo de trabajo para el agente

1. Leer `AGENTS.md` y este archivo antes de modificar algo.
2. Presentar plan y pedir consentimiento (nunca aplicar sin aprobación).
3. Nunca hacer operaciones de git (commit/push) sin instrucción explícita.
4. Validar/revisar todo código nuevo antes de darlo por terminado.
