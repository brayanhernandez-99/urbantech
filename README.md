# Urban Tech Colombia

Landing page de Urban Tech Colombia, tienda de iPhones, accesorios y servicio de reparación de celulares en Medellín. Sitio estático de una sola página, escrito en HTML, CSS y JavaScript puro, sin frameworks ni proceso de compilación.

## Qué ofrece el sitio

Una sola página con varias secciones: un hero con la imagen del celular, los servicios de reparación, el catálogo de iPhones (una tarjeta por color, con selector de capacidad y, en varios modelos, de tipo de SIM), los accesorios, un simulador de crédito, los medios de pago aceptados, reseñas de clientes y los datos de contacto en el pie de página.

Los botones de compra y de financiación abren WhatsApp con un mensaje armado a partir de lo que el usuario eligió en la tarjeta del producto. El simulador de crédito calcula, para cada entidad financiera, el recargo y el total a pagar partiendo del precio de contado.

## Ejecutar localmente

```bash
npx serve .
```

El sitio debe servirse por HTTP; no usar `file://`.

## Estructura

```
├── index.html                 # Toda la página
├── robots.txt                 # Reglas para los rastreadores
├── sitemap.xml                # Sitemap para Google
├── google-merchant-feed.tsv   # Feed de productos para Google Merchant Center
├── css/
│   ├── styles.css             # Entrada; importa el resto
│   ├── variables.css          # Colores, tipografías y espaciados
│   ├── hero.css               # Hero
│   ├── sections.css           # Secciones de la página
│   ├── credit.css             # Simulador de crédito
│   ├── animations.css         # Animaciones
│   └── themes/                # Temas de temporada (solo variables)
├── js/
│   ├── main.js                # Arranque
│   ├── whatsapp.js            # Número y mensajes de WhatsApp
│   ├── hero.js                # Parallax del hero
│   ├── scroll.js              # Animaciones al hacer scroll
│   ├── gallery.js             # Carrusel y visor ampliado de fotos
│   ├── products.js            # Selector de variante y botones de compra
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
