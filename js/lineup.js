(function() {
  'use strict';

  var track = document.getElementById('lineup-track');
  if (!track) return;

  var taglines = {};
  // Secciones de partials/catalogo.html con productos destacados (data-featured), en el orden del carrusel.
  var FEATURED = [
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'suunto', label: 'Suunto', byPrice: true, byKind: true },
    { id: 'dji', label: 'DJI', byPrice: true, byKind: true },
    { id: 'insta360', label: 'Insta360', byPrice: true }
  ];

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

  function formatCOP(value) {
    return '$' + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Lee #celulares de partials/catalogo.html (única fuente de datos): un modelo por .model-divider.
  function parseModels(doc) {
    var models = [];
    var current = null;
    Array.prototype.forEach.call(doc.querySelectorAll('#celulares .products-grid > *'), function(node) {
      if (node.classList.contains('model-divider')) {
        var name = node.textContent.trim();
        current = { name: name, slug: slugify(name), tagline: node.getAttribute('data-tagline'), price: null, image: null, dots: [] };
        // Un modelo sin data-tagline hereda la de su generación (el número tras "iPhone").
        if (current.tagline) taglines[name.split(' ')[1]] = current.tagline;
        models.push(current);
      } else if (current && node.classList.contains('product-card')) {
        if (!current.image) current.image = JSON.parse(node.querySelector('.product-img-wrapper').getAttribute('data-images'))[0];
        var dot = /--dot:\s*([^;]+)/.exec(node.querySelector('.product-color').getAttribute('style') || '');
        if (dot) current.dots.push(dot[1].trim());
        Array.prototype.forEach.call(node.querySelectorAll('.dual-capacity-option:not(.is-sold-out)'), function(o) {
          var price = parseInt(o.querySelector('.price').textContent.replace(/\D/g, ''), 10) || 0;
          if (current.price === null || price < current.price) {
            current.price = price;
            current.was = parseInt(o.querySelector('.price').getAttribute('data-was'), 10) || 0;
          }
        });
      }
    });
    return models;
  }

  function firstImage(card) {
    return JSON.parse(card.querySelector('.product-img-wrapper').getAttribute('data-images'))[0];
  }

  // Un destacado por .model-divider[data-featured] en las marcas y por tarjeta[data-featured] en accesorios.
  function parseFeatured(doc) {
    var items = [];
    FEATURED.forEach(function(section) {
      var current = null;
      var start = items.length;
      Array.prototype.forEach.call(doc.querySelectorAll('#' + section.id + ' .products-grid > *'), function(node) {
        if (node.classList.contains('model-divider')) {
          var name = node.textContent.trim();
          current = node.hasAttribute('data-featured')
            ? { name: name, tagline: section.label, href: 'producto.html?modelo=' + slugify(name), kind: node.getAttribute('data-kind'), price: null, desde: true, image: null }
            : null;
          if (current) items.push(current);
        } else if (node.classList.contains('product-card')) {
          if (section.id === 'accesorios') {
            if (!node.hasAttribute('data-featured')) return;
            items.push({
              name: node.querySelector('h3').textContent.trim(),
              tagline: section.label,
              href: 'producto.html?accesorio=' + node.id,
              price: node.querySelector('.stock-badge--out') ? null : parseInt(node.querySelector('.price').textContent.replace(/\D/g, ''), 10),
              was: parseInt(node.querySelector('.price').getAttribute('data-was'), 10) || 0,
              image: firstImage(node)
            });
          } else if (current) {
            if (!current.image) current.image = firstImage(node);
            Array.prototype.forEach.call(node.querySelectorAll('.dual-capacity-option:not(.is-sold-out)'), function(o) {
              var price = parseInt(o.querySelector('.price').textContent.replace(/\D/g, ''), 10) || 0;
              if (current.price === null || price < current.price) {
                current.price = price;
                current.was = parseInt(o.querySelector('.price').getAttribute('data-was'), 10) || 0;
              }
            });
          }
        }
      });
      if (section.byPrice) {
        // Por precio; con byKind, agrupa primero por tipo (data-kind) en el orden en que aparecen en la sección.
        var kinds = [];
        items.slice(start).forEach(function(i) { if (kinds.indexOf(i.kind) === -1) kinds.push(i.kind); });
        var sorted = items.splice(start).sort(function(a, b) {
          return (section.byKind ? kinds.indexOf(a.kind) - kinds.indexOf(b.kind) : 0) || (a.price === null) - (b.price === null) || a.price - b.price;
        });
        items.push.apply(items, sorted);
      }
    });
    return items;
  }

  // Precio de la tarjeta; con descuento (was > price) añade la cinta "Ahorra" y el precio anterior tachado encima.
  function appendPrice(card, item, text) {
    var price = el('span', 'lineup-price');
    if (item.price !== null && item.was > item.price) {
      card.appendChild(el('span', 'lineup-save', 'Ahorra ' + formatCOP(item.was - item.price)));
      price.appendChild(el('s', 'lineup-was', formatCOP(item.was)));
    }
    price.appendChild(document.createTextNode(text));
    card.appendChild(price);
  }

  function renderModel(model) {
    var card = el('a', 'lineup-card');
    card.href = 'producto.html?modelo=' + model.slug;

    var media = el('span', 'lineup-media');
    var img = el('img');
    img.src = model.image;
    img.alt = '';
    img.width = 1000;
    img.height = 1000;
    img.loading = 'lazy';
    media.appendChild(img);
    card.appendChild(media);

    var dots = el('span', 'lineup-dots');
    model.dots.forEach(function(color) {
      var dot = el('span', 'lineup-dot');
      dot.style.setProperty('--dot', color);
      dots.appendChild(dot);
    });
    card.appendChild(dots);

    card.appendChild(el('h3', 'lineup-name', model.name));
    var tagline = model.tagline || taglines[model.name.split(' ')[1]];
    if (tagline) card.appendChild(el('span', 'lineup-tagline', tagline));
    appendPrice(card, model, model.price === null ? 'Agotado' : 'Desde ' + formatCOP(model.price));
    return card;
  }

  function renderFeatured(item) {
    var card = el('a', 'lineup-card');
    card.href = item.href;

    var media = el('span', 'lineup-media');
    var img = el('img');
    img.src = item.image;
    img.alt = '';
    img.width = 1000;
    img.height = 1000;
    img.loading = 'lazy';
    media.appendChild(img);
    card.appendChild(media);

    card.appendChild(el('span', 'lineup-dots'));
    card.appendChild(el('h3', 'lineup-name', item.name));
    card.appendChild(el('span', 'lineup-tagline', item.tagline));
    appendPrice(card, item, item.price === null ? 'Agotado' : (item.desde ? 'Desde ' : '') + formatCOP(item.price));
    return card;
  }

  function renderMore() {
    var card = el('a', 'lineup-card lineup-more');
    card.href = 'productos.html';

    var media = el('span', 'lineup-media');
    media.innerHTML = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    card.appendChild(media);

    card.appendChild(el('span', 'lineup-dots'));
    card.appendChild(el('h3', 'lineup-name', 'Ver más'));
    card.appendChild(el('span', 'lineup-tagline', 'Todos nuestros productos'));
    return card;
  }

  fetch('partials/catalogo.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      parseModels(doc).forEach(function(m) {
        track.appendChild(renderModel(m));
      });
      parseFeatured(doc).forEach(function(item) {
        track.appendChild(renderFeatured(item));
      });
      if (!track.children.length) throw new Error('catalog');
      track.appendChild(renderMore());
    })
    .catch(function() {
      document.getElementById('modelos').hidden = true;
    });

  Array.prototype.forEach.call(document.querySelectorAll('#modelos .lineup-arrow'), function(btn) {
    btn.addEventListener('click', function() {
      var step = track.firstElementChild ? track.firstElementChild.offsetWidth + 20 : track.clientWidth;
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: btn.getAttribute('data-dir') === 'prev' ? -step : step, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
