# Urban Tech Colombia

Sitio web estático (landing page) para Urban Tech Colombia — venta de iPhones premium, accesorios y reparación de celulares en Medellín.

Stack: HTML, CSS, JavaScript (JS clásico con globales). Sin framework, sin build step.

## Requisitos

- Node no es necesario. Para servir localmente: `npx serve .`

## Ejecutar localmente

```bash
npx serve .
```

Abrir la URL que imprime el servidor. **No usar `file://`** — servir por HTTP.

## Estructura del proyecto

```
├── index.html              # Landing page (única)
├── robots.txt              # Crawl rules, apunta a sitemap
├── sitemap.xml             # URLs para Google
├── css/
│   ├── styles.css          # Entry point CSS (importa parciales)
│   ├── variables.css       # Custom properties (colores, fuentes)
│   ├── hero.css            # Estilos del hero
│   ├── sections.css        # Estilos por sección
│   └── animations.css      # Keyframes
├── js/
│   ├── main.js             # Entry point JS
│   ├── whatsapp.js         # WA_NUMBER + openWhatsApp() handler
│   ├── hero.js             # Parallax del hero
│   ├── scroll.js           # Scroll spy / reveal animations
│   ├── gallery.js          # Carrusel de producto + lightbox
│   ├── products.js         # Selección de variante, CTA y filtro por modelo
│   └── credit.js           # Simulador de crédito
└── assets/images/
    ├── products/           # Fotos de iPhones por modelo
    ├── accessories/        # Fotos de accesorios
    ├── payments/           # Iconos de métodos de pago
    └── avatars/            # Fotos de reseñas
```

## Convenciones

- **WhatsApp**: los anchors usan `onclick="return openWhatsApp(this)"` con atributo `message`. El número se define en `js/whatsapp.js` (`WA_NUMBER`). Los `href` son `#` — el JS construye la URL completa desde `WA_NUMBER` + `message`.
- **Cache-busting**: las URLs de imágenes incluyen `?v=N`. Al reemplazar una imagen, incrementar `v`.
- **JSON-LD**: hay dos schemas en el `<head>`: `LocalBusiness` (información de la tienda) e `ItemList` **minimal** (cada `ListItem` solo `position` + `item` con `name`/`url`; los precios y la disponibilidad viven solo en el HTML visible de cada tarjeta).
- **Productos**: ordenados de más nuevo a más viejo, con los accesorios al final. Cada modelo agrupado con `<div class="model-divider">`. Usan `<article class="product-card">` semántico.
- **Métodos de pago**: carrusel infinito con 2 sets idénticos para el loop sin costura. Las imágenes llenan el SVG con `preserveAspectRatio="xMidYMid slice"` y el texto queda debajo en `.payment-label`.

## SEO / indexación

El sitio está optimizado para Google:
- ✅ Sitemap.xml funcional con URL canónica
- ✅ robots.txt permisivo
- ✅ Meta robots: index, follow
- ✅ JSON-LD **minimal** (`LocalBusiness` + `ItemList`)
- ✅ WhatsApp links con `href="#"` — JS construye `wa.me` URL
- ✅ Open Graph con URL absoluta y dimensiones
- ✅ Heading hierarchy: h1 → h2 → h3 (sin saltos)
- ✅ Alt text descriptivo en todas las imágenes de producto

## Dominio

Todas las referencias (canonical, og:url, JSON-LD, sitemap) apuntan a:
**https://urbantechcol.com**

## Política de commits

No se hace commit ni push automático. Toda modificación se sube únicamente por instrucción explícita del usuario.
