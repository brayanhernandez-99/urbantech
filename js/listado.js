(function() {
  'use strict';

  var INFO_ICON = '<svg class="cart-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  // Secciones de partials/catalogo.html en el orden del nav. kinds = subfiltros (clave de data-kind -> etiqueta); celulares usa la condición de las opciones.
  var SECTIONS = [
    { id: 'celulares', label: 'Celulares', kinds: { nuevo: 'Nuevo', exhibicion: 'Exhibición' } },
    { id: 'accesorios', label: 'Accesorios', kinds: { cargadores: 'Cargadores y cables', audifonos: 'Audífonos', protectores: 'Protectores', cases: 'Cases' } },
    { id: 'suunto', label: 'Suunto', kinds: { relojes: 'Relojes', audifonos: 'Audífonos', correas: 'Correas' } },
    { id: 'dji', label: 'DJI', kinds: { drones: 'Drones', camaras: 'Cámaras', microfonos: 'Micrófonos', estabilizadores: 'Estabilizadores' } },
    { id: 'insta360', label: 'Insta360', kinds: { camaras: 'Cámaras' } }
  ];
  // <main data-section="<id>"> limita el listado a esa sección; sin el atributo se muestran todas.
  var only = document.querySelector('main').getAttribute('data-section');
  var shown = only ? SECTIONS.filter(function(s) { return s.id === only; }) : SECTIONS;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function slugify(text) {
    return String(text).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function groupDigits(digits) {
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function firstImage(card) {
    return JSON.parse(card.querySelector('.product-img-wrapper').getAttribute('data-images'))[0];
  }

  // Un producto por modelo (.model-divider) en las secciones de celulares y marcas, y por tarjeta en accesorios.
  // price = menor precio entre las opciones no agotadas (null = agotado); kinds = claves de SECTIONS[].kinds.
  function parseItems(doc) {
    var items = [];
    shown.forEach(function(section) {
      var current = null;
      Array.prototype.forEach.call(doc.querySelectorAll('#' + section.id + ' .products-grid > *'), function(node) {
        if (node.classList.contains('model-divider')) {
          var name = node.textContent.trim();
          current = { section: section.id, kinds: section.id === 'celulares' ? [] : [node.getAttribute('data-kind')], name: name, href: 'producto.html?modelo=' + slugify(name), price: null, desde: true, image: null };
          items.push(current);
        } else if (node.classList.contains('product-card')) {
          if (section.id === 'accesorios') {
            items.push({
              section: section.id,
              kinds: [node.getAttribute('data-kind')],
              name: node.querySelector('h3').textContent.trim(),
              href: 'producto.html?accesorio=' + node.id,
              price: node.querySelector('.stock-badge--out') ? null : parseInt(node.querySelector('.price').textContent.replace(/\D/g, ''), 10),
              image: firstImage(node)
            });
            return;
          }
          if (!current.image) current.image = firstImage(node);
          Array.prototype.forEach.call(node.querySelectorAll('.dual-capacity-option:not(.is-sold-out)'), function(o) {
            var price = parseInt(o.querySelector('.price').textContent.replace(/\D/g, ''), 10) || 0;
            if (current.price === null || price < current.price) current.price = price;
            var kind = o.querySelector('.badge-new') ? 'nuevo' : o.querySelector('.badge-deal') ? 'exhibicion' : '';
            if (section.id === 'celulares' && kind && current.kinds.indexOf(kind) === -1) current.kinds.push(kind);
          });
        }
      });
    });
    return items;
  }

  function renderItem(item, index) {
    var card = el('article', 'cat-card');
    card.setAttribute('data-group', item.section);
    card.setAttribute('data-kind', item.kinds.join(' '));
    if (item.price !== null) card.setAttribute('data-price', item.price);

    var media = el('a', 'cat-media');
    media.href = item.href;
    media.tabIndex = -1;
    media.setAttribute('aria-hidden', 'true');
    var img = el('img');
    img.src = item.image;
    img.alt = '';
    img.width = 1000;
    img.height = 1000;
    img.loading = index < 4 ? 'eager' : 'lazy';
    if (index === 0) img.fetchPriority = 'high';
    media.appendChild(img);
    card.appendChild(media);

    card.appendChild(el('h2', 'cat-name', item.name));
    card.appendChild(el('p', 'cat-amount', item.price === null ? 'Agotado' : (item.desde ? 'Desde ' : '') + '$' + groupDigits(String(item.price))));

    var more = el('a', 'btn btn-primary cat-buy');
    more.href = item.href;
    more.innerHTML = INFO_ICON + ' Más información';
    card.appendChild(more);

    return card;
  }

  fetch('partials/catalogo.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var items = parseItems(new DOMParser().parseFromString(html, 'text/html'));
      if (!items.length) throw new Error('catalog');
      var grid = document.getElementById('cat-grid');
      items.forEach(function(item, i) { grid.appendChild(renderItem(item, i)); });
      initCatFilters(shown);
      document.getElementById('cat-status').hidden = true;
    })
    .catch(function() {
      var status = document.getElementById('cat-status');
      status.textContent = 'No pudimos cargar los productos. ';
      var back = el('a', null, 'Volver al inicio');
      back.href = 'index.html';
      status.appendChild(back);
    });
})();
