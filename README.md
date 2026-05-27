UrbanTech

Pequeña web estática (landing) creada con HTML, CSS y JS (módulos ES). Sin framework ni paso de build.

Requisitos
- Node no es necesario, pero para servir localmente usa un servidor HTTP (ej. `npx serve .`).

Ejecutar localmente
1. Desde la raíz del proyecto ejecuta:

```
npx serve .
```

2. Abre el URL que imprima el servidor (no uses `file://` — los módulos ES requieren origen HTTP).

Puntos de entrada importantes
- `index.html` — landing de una sola página.
- `js/main.js` — punto de entrada JS que orquesta el sitio.
- `js/config.js` — cambia `WA_NUMBER` aquí para actualizar todos los enlaces de WhatsApp.
- `js/hero.js` — controla el parallax del hero (solo modifica `transform`).
- `css/styles.css` — estilos principales (importa los parciales).
- `assets/images/` — imágenes (productos, accesorios, favicon).

Convenciones útiles
- Enlaces de WhatsApp: los anchors usan `data-wa="mensaje"` y `main.js` reemplaza sus `href` en tiempo de ejecución con `WA_NUMBER`.
- Cache-busting: las imágenes usan `?v=N` en la URL; al reemplazar una imagen, incrementa `v` donde se referencia.
- Pruebas locales: usar siempre un servidor HTTP por el CORS de `<script type="module">`.

Contribuir
- Este repo no tiene tests ni linters. Para cambios visuales, actualiza las imágenes y bumpea `?v=` según corresponda.
- Si agregas tooling o builds, actualiza `AGENTS.md` y este README para reflejar el nuevo flujo.

Licencia
- No se incluye licencia en este repositorio.
