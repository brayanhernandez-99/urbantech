# Urban Tech Colombia

Landing page de Urban Tech Colombia, tienda de iPhones, accesorios y servicio de reparación de celulares en Medellín. Sitio estático de varias páginas, escrito en HTML, CSS y JavaScript puro, sin frameworks ni proceso de compilación.

## Qué ofrece el sitio

Una página de inicio (hero, carrusel del catálogo, ofertas, reseñas y medios de pago), listados por categoría con filtros (celulares, accesorios y marcas), una vista de producto con selector de color, capacidad y versión, la página de servicios, un simulador de crédito y los datos de contacto en el pie de página, compartido entre páginas.

Los botones de compra y de financiación abren WhatsApp con un mensaje armado a partir de lo que el usuario eligió en la tarjeta del producto. El simulador de crédito calcula, para cada entidad financiera, el recargo y el total a pagar partiendo del precio de contado.

## Ejecutar localmente

```bash
npx serve .
```

El sitio debe servirse por HTTP; no usar `file://`.

## Estructura

```
├── index.html                 # Página de inicio
├── robots.txt                 # Reglas para los rastreadores
├── sitemap.xml                # Sitemap para Google
├── google-merchant-feed.tsv   # Feed de productos para Google Merchant Center
├── *.html                     # Listados, producto, servicios y crédito
├── partials/                  # Catálogo (fuente de datos) y footer compartido
├── css/
│   ├── styles.css             # Entrada; importa el resto
│   ├── variables.css          # Colores, tipografías y espaciados
│   ├── hero.css               # Hero
│   ├── sections.css           # Secciones de la página
│   ├── credit.css             # Simulador de crédito
│   ├── animations.css         # Animaciones
│   ├── search.css             # Buscador del navbar
│   ├── product.css            # Vista de producto
│   ├── celulares.css          # Listados por categoría
│   ├── cat-filters.css        # Filtros de los listados
│   └── themes/                # (opcional) Temas de temporada, solo variables
├── js/
│   ├── main.js                # Arranque
│   ├── whatsapp.js            # Número y mensajes de WhatsApp
│   ├── hero.js                # Parallax del hero
│   ├── scroll.js              # Animaciones al hacer scroll
│   ├── listado.js             # Listados por categoría
│   ├── cat-filters.js         # Filtros de los listados
│   ├── search.js              # Buscador del navbar
│   ├── lineup.js              # Carrusel de modelos del index
│   ├── reviews.js             # Carrusel de reseñas
│   ├── nav.js                 # Menú móvil y desplegable (listados)
│   ├── partials.js            # Inyección de partials
│   ├── credito.js             # Arranque de credito.html
│   ├── product.js             # Vista de producto
│   └── credit.js              # Simulador de crédito
└── assets/images/
    ├── products/              # Fotos de los iPhones
    ├── accessories/           # Fotos de accesorios
    ├── payments/              # Logos de medios de pago
    ├── avatars/               # Fotos de las reseñas
    ├── <temporada>/           # Arte de temporada
    └── (sueltos)              # hero, favicon e icono
```

El sitio publicado vive en https://urbantechcol.com; ahí apuntan el canonical, Open Graph, el sitemap y los datos estructurados.

Las convenciones de desarrollo (WhatsApp, temas, JSON-LD, productos, SEO) están documentadas en `AGENTS.md`.
