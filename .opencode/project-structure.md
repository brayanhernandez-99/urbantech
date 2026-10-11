# Estructura del proyecto — Urban Tech

Sitio estático puro (HTML/CSS, JS clásico con globales). **Sin** tooling de Node: no hay
`package.json`, build, test ni lint. Para servir localmente: `npx serve .`
(no usar `file://`, servir por HTTP).

## Árbol de archivos

```
urbantech/
├── index.html              # Landing de una sola página (contenido principal)
├── AGENTS.md               # Convenciones de alto nivel para sesiones OpenCode
├── opencode.json           # Config de OpenCode (instrucciones del proyecto)
├── README.md
├── google-merchant-feed.tsv
├── robots.txt              # SEO: apunta al sitemap
├── sitemap.xml             # SEO: URL canónica del sitio
├── .opencode/
│   ├── agent/
│   │   └── validator.md         # Subagente revisor (contexto fresco, solo lectura)
│   └── project-structure.md     # Este archivo
├── css/
│   ├── styles.css          # Entry point; importa el resto
│   ├── variables.css       # Custom properties (colores, fuentes, espaciado)
│   ├── hero.css            # Estilos del hero
│   ├── sections.css        # Estilos de secciones y productos
│   ├── credit.css          # Estilos del simulador de crédito (sección oscura)
│   └── animations.css      # Animaciones (reveal, wa-bounce, payment-scroll)
├── js/
│   ├── main.js             # Entry de runtime: initHero(), initScroll(), initGallery(), initProducts(), initCreditCalculator()
│   ├── gallery.js          # Carrusel de imágenes del producto + lightbox
│   ├── hero.js             # Parallax del hero (solo transform en .hero-phone img)
│   ├── scroll.js           # Scroll spy / reveal + menú móvil (scroll lock, Escape)
│   ├── products.js         # Selección de variante, botón "Financiar" y filtro por modelo
│   ├── credit.js           # Simulador "Calcula tu crédito" (formatCOP, render, prefillCredit)
│   └── whatsapp.js         # WA_NUMBER + openWhatsApp() para todos los CTA
└── assets/images/
    ├── products/           # una carpeta por modelo: iphone-{model}/{color}[-{n}].webp
    ├── accessories/        # {descriptive-name}.webp
    ├── payments/           # {method}.png
    └── avatars/            # testimonios
```

## Patrones y convenciones

Los selectores, clases, atributos `data-*`, flujos, reglas y gotchas viven en
`AGENTS.md`. Este archivo solo describe la estructura de carpetas.

## Flujo del agente

Antes de presentar cualquier propuesta, se valida con el subagente
`.opencode/agent/validator.md` (contexto fresco, solo lectura) en bucle hasta
"APROBADO" (regla en `AGENTS.md`). La aplicación la hace el agente `build`, solo
con aprobación explícita del usuario. Sirve el sitio con `npx serve .` antes de
dar un cambio por terminado.
