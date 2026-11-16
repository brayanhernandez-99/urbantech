(function() {
  'use strict';

  var CATALOG_URL = 'partials/catalogo.html';
  // Segundo nivel de la ruta (Inicio / Categoría / Producto); cada producto trae la suya.
  var CATEGORIES = {
    phones: { name: 'Celulares', href: 'celulares.html' },
    accessories: { name: 'Accesorios', href: 'accesorios.html' },
    suunto: { name: 'Suunto', href: 'suunto.html' },
    dji: { name: 'DJI', href: 'dji.html' },
    insta360: { name: 'Insta360', href: 'insta360.html' }
  };
  var CART_ICON = '<svg class="cart-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

  var models = [];
  var accessories = [];
  var state = { model: null, color: null, option: null };
  var gallery = { track: null, dots: [], thumbs: [], index: 0, count: 0 };

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

  function unique(list) {
    return list.filter(function(v, i) { return list.indexOf(v) === i; });
  }

  /* ---------- Catálogo: se lee de #celulares, #suunto y #accesorios de partials/catalogo.html (única fuente de datos) ---------- */

  function optionType(option) {
    var deal = option.querySelector('.badge-deal');
    if (option.querySelector('.badge-sim')) return 'SIM';
    if (option.querySelector('.badge-esim')) return 'E-SIM';
    if (deal && deal.textContent.trim() !== 'Agotado') return deal.textContent.trim();
    if (option.querySelector('.badge-new')) return 'Nuevo';
    return '';
  }

  function optionCondition(option) {
    if (option.querySelector('.badge-new')) return 'Nuevo';
    var deal = option.querySelector('.badge-deal');
    return deal && deal.textContent.trim() === 'Exhibición' ? 'Exhibición' : '';
  }

  function parseSpecs(card) {
    var raw = card.getAttribute('data-specs');
    return raw ? raw.split('|') : [];
  }

  function parseCard(card) {
    var colorNode = card.querySelector('.product-color');
    var dot = /--dot:\s*([^;]+)/.exec(colorNode.getAttribute('style') || '');
    var wrapper = card.querySelector('.product-img-wrapper');
    var options = Array.prototype.map.call(card.querySelectorAll('.dual-capacity-option'), function(o) {
      var chip = o.querySelector('.capacity-chip');
      var price = o.querySelector('.price');
      return {
        capacity: chip ? chip.textContent.trim() : '',
        type: optionType(o),
        condition: optionCondition(o),
        price: price ? parseInt(price.textContent.replace(/\D/g, ''), 10) || 0 : 0,
        soldOut: o.classList.contains('is-sold-out')
      };
    });
    return {
      name: colorNode.textContent.trim(),
      dot: dot ? dot[1].trim() : '#ccc',
      images: JSON.parse(wrapper.getAttribute('data-images')),
      specs: parseSpecs(card),
      options: options
    };
  }

  function parseCatalog(doc) {
    var list = [];
    var current = null;
    Array.prototype.forEach.call(doc.querySelectorAll('#celulares .products-grid > *, #suunto .products-grid > *, #dji .products-grid > *, #insta360 .products-grid > *'), function(node) {
      if (node.classList.contains('model-divider')) {
        var name = node.textContent.trim();
        current = { name: name, slug: slugify(name), category: CATEGORIES[(node.closest('section').id)] || CATEGORIES.phones, colors: [] };
        list.push(current);
      } else if (current && node.classList.contains('product-card')) {
        current.colors.push(parseCard(node));
      }
    });
    return list;
  }

  // Un accesorio se normaliza a la misma forma que un modelo: un único "color" sin nombre y una única opción.
  function parseAccessories(doc) {
    return Array.prototype.map.call(doc.querySelectorAll('#accesorios .products-grid > .product-card'), function(card) {
      var wrapper = card.querySelector('.product-img-wrapper');
      var price = card.querySelector('.price');
      return {
        name: card.querySelector('h3').textContent.trim(),
        slug: card.id,
        category: CATEGORIES.accessories,
        colors: [{
          name: '',
          dot: '',
          images: wrapper ? JSON.parse(wrapper.getAttribute('data-images')) : [card.querySelector('.product-img').getAttribute('src')],
          specs: parseSpecs(card),
          options: [{
            capacity: '',
            type: '',
            condition: '',
            price: price ? parseInt(price.textContent.replace(/\D/g, ''), 10) || 0 : 0,
            soldOut: !!card.querySelector('.stock-badge--out')
          }]
        }]
      };
    });
  }

  /* ---------- Selección ---------- */

  function available(color) {
    return color.options.filter(function(o) { return !o.soldOut; });
  }

  // keep ('capacity' | 'type' | null): atributo que el usuario acaba de elegir y que tiene prioridad.
  function chooseOption(color, capacity, type, keep) {
    var avail = available(color);
    var pool = keep ? avail.filter(function(o) { return o[keep] === (keep === 'type' ? type : capacity); }) : avail;
    if (!pool.length) pool = avail;
    function find(fn) { return pool.filter(fn)[0]; }
    return find(function(o) { return o.capacity === capacity && o.type === type; }) ||
      find(function(o) { return o.capacity === capacity; }) ||
      find(function(o) { return o.type === type; }) ||
      pool[0] || null;
  }

  function firstColorWithStock(model) {
    return model.colors.filter(function(c) { return available(c).length; })[0] || model.colors[0];
  }

  function setColor(color) {
    var prev = state.option;
    state.color = color;
    state.option = chooseOption(color, prev && prev.capacity, prev && prev.type);
    render(true);
  }

  function setOption(capacity, type, keep) {
    state.option = chooseOption(state.color, capacity, type, keep);
    render(false);
  }

  /* ---------- Galería ---------- */

  function goTo(i) {
    var track = gallery.track;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var next = (i + gallery.count) % gallery.count;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  }

  function setActive(i) {
    gallery.index = i;
    gallery.dots.forEach(function(d, n) { d.classList.toggle('is-active', n === i); });
    gallery.thumbs.forEach(function(t, n) {
      t.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
  }

  function arrow(dir) {
    var btn = el('button', 'product-img-arrow product-img-arrow--' + dir, dir === 'prev' ? '‹' : '›');
    btn.type = 'button';
    btn.setAttribute('aria-label', dir === 'prev' ? 'Imagen anterior' : 'Imagen siguiente');
    btn.addEventListener('click', function() { goTo(gallery.index + (dir === 'prev' ? -1 : 1)); });
    return btn;
  }

  function renderGallery() {
    var root = document.getElementById('pdp-gallery');
    var images = state.color.images;
    var label = (state.model.name + ' ' + state.color.name).trim() + ' - Urban Tech';
    root.textContent = '';
    gallery.count = images.length;
    gallery.dots = [];
    gallery.thumbs = [];

    var thumbs = el('div', 'pdp-thumbs');
    var stage = el('div', 'pdp-stage');
    var track = el('div', 'pdp-track');
    track.tabIndex = 0;
    track.setAttribute('role', 'group');
    track.setAttribute('aria-roledescription', 'carrusel');
    track.setAttribute('aria-label', 'Imágenes de ' + (state.model.name + ' ' + state.color.name).trim());
    var dots = el('div', 'pdp-dots');

    images.forEach(function(src, i) {
      var alt = i === 0 ? label : label + ' - vista ' + (i + 1);
      var img = el('img', 'pdp-slide');
      img.src = src;
      img.alt = alt;
      img.width = 1000;
      img.height = 1000;
      if (i > 0) img.loading = 'lazy';
      track.appendChild(img);

      var thumb = el('button', 'pdp-thumb');
      thumb.type = 'button';
      thumb.setAttribute('aria-label', 'Ver imagen ' + (i + 1) + ' de ' + images.length);
      var timg = el('img');
      timg.src = src;
      timg.alt = '';
      timg.loading = 'lazy';
      thumb.appendChild(timg);
      thumb.addEventListener('click', function() { goTo(i); });
      thumbs.appendChild(thumb);
      gallery.thumbs.push(thumb);

      var dot = el('span', 'pdp-dot');
      dots.appendChild(dot);
      gallery.dots.push(dot);
    });

    var ticking = false;
    track.addEventListener('scroll', function() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        ticking = false;
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== gallery.index) setActive(i);
      });
    });

    track.addEventListener('click', function() { openLightbox(gallery.index); });
    track.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(gallery.index);
      }
    });

    gallery.track = track;
    stage.appendChild(track);
    if (images.length > 1) {
      stage.appendChild(arrow('prev'));
      stage.appendChild(arrow('next'));
      stage.appendChild(dots);
      root.appendChild(thumbs);
    }
    root.appendChild(stage);
    setActive(0);
  }

  /* ---------- Vista ampliada (markup en producto.html) ---------- */

  var lightbox = { root: null, img: null, counter: null, images: [], alts: [], index: 0, opener: null };

  function showLightbox(i) {
    lightbox.index = (i + lightbox.images.length) % lightbox.images.length;
    lightbox.img.src = lightbox.images[lightbox.index];
    lightbox.img.alt = lightbox.alts[lightbox.index];
    lightbox.counter.textContent = (lightbox.index + 1) + ' / ' + lightbox.images.length;
  }

  function openLightbox(i) {
    lightbox.opener = document.activeElement;
    lightbox.images = state.color.images;
    lightbox.alts = Array.prototype.map.call(gallery.track.children, function(img) { return img.alt; });
    var several = lightbox.images.length > 1;
    lightbox.root.querySelectorAll('.lightbox-arrow, .lightbox-counter').forEach(function(node) {
      node.style.display = several ? '' : 'none';
    });
    showLightbox(i);
    lightbox.root.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.root.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.root.hidden = true;
    document.body.style.overflow = '';
    if (lightbox.opener && document.contains(lightbox.opener)) lightbox.opener.focus();
  }

  function initLightbox() {
    var root = document.getElementById('lightbox');
    lightbox.root = root;
    lightbox.img = root.querySelector('.lightbox-img');
    lightbox.counter = root.querySelector('.lightbox-counter');
    root.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    root.querySelector('.lightbox-arrow--prev').addEventListener('click', function() { showLightbox(lightbox.index - 1); });
    root.querySelector('.lightbox-arrow--next').addEventListener('click', function() { showLightbox(lightbox.index + 1); });
    root.addEventListener('click', function(e) { if (e.target === root) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
      if (root.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(lightbox.index - 1);
      if (e.key === 'ArrowRight') showLightbox(lightbox.index + 1);
    });

    // Táctil: deslizar el dedo a izquierda/derecha cambia de imagen.
    var startX = 0;
    var startY = 0;
    root.addEventListener('touchstart', function(e) {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showLightbox(lightbox.index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Panel de información ---------- */

  function optionGroup(title, values, current, isDisabled, onPick) {
    var group = el('div', 'pdp-group');
    group.appendChild(el('h2', 'pdp-group-title', title));
    var row = el('div', 'pdp-options');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', title);
    values.forEach(function(v) {
      var btn = el('button', 'pdp-opt', v);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', v === current ? 'true' : 'false');
      if (isDisabled(v)) {
        btn.disabled = true;
        btn.title = 'Agotado';
      }
      btn.addEventListener('click', function() { onPick(v); });
      row.appendChild(btn);
    });
    group.appendChild(row);
    return group;
  }

  function soldOutFor(key, value) {
    return state.color.options.filter(function(o) { return o[key] === value && !o.soldOut; }).length === 0;
  }

  function buyMessage() {
    var o = state.option;
    if (!state.color.name) return 'Hola! quiero comprar ' + state.model.name;
    var msg = 'Hola! quiero comprar un ' + state.model.name + ' ' + state.color.name;
    if (o && o.capacity) msg += ' - ' + o.capacity;
    if (o && o.type) msg += ' - ' + o.type;
    return msg;
  }

  function renderInfo() {
    var root = document.getElementById('pdp-info');
    var model = state.model;
    var color = state.color;
    var option = state.option;
    var shown = option || color.options[0];
    root.textContent = '';

    var tags = el('div', 'pdp-tags');
    if (!option || option.soldOut) {
      tags.appendChild(el('span', 'pdp-tag pdp-tag--out', 'Agotado'));
    } else if (option.condition) {
      tags.appendChild(el('span', 'pdp-tag pdp-tag--' + (option.condition === 'Exhibición' ? 'display' : 'condition'), option.condition));
      if (option.condition !== 'Exhibición') tags.appendChild(el('span', 'pdp-tag', 'Envío gratis'));
    }
    if (tags.children.length) root.appendChild(tags);
    root.appendChild(el('h1', 'pdp-title', model.name));

    var priceRow = el('div', 'pdp-price-row');
    priceRow.appendChild(el('p', 'pdp-price', shown && shown.price ? formatCOP(shown.price) : ''));
    if (shown && shown.type && shown.type !== shown.condition) priceRow.appendChild(el('span', 'pdp-chip', shown.type));
    root.appendChild(priceRow);

    if (color.name) {
      var colorGroup = el('div', 'pdp-group');
      var colorTitle = el('h2', 'pdp-group-title', 'Color');
      colorTitle.appendChild(el('span', 'pdp-group-value', color.name));
      colorGroup.appendChild(colorTitle);
      var swatches = el('div', 'pdp-swatches');
      swatches.setAttribute('role', 'group');
      swatches.setAttribute('aria-label', 'Color');
      model.colors.forEach(function(c) {
        var btn = el('button', 'pdp-swatch');
        btn.type = 'button';
        btn.style.setProperty('--dot', c.dot);
        btn.setAttribute('aria-pressed', c === color ? 'true' : 'false');
        btn.setAttribute('aria-label', c.name);
        btn.title = c.name;
        btn.addEventListener('click', function() { if (c !== color) setColor(c); });
        swatches.appendChild(btn);
      });
      colorGroup.appendChild(swatches);
      root.appendChild(colorGroup);
    }

    var caps = unique(color.options.map(function(o) { return o.capacity; })).filter(Boolean);
    if (caps.length) {
      root.appendChild(optionGroup('Capacidad', caps, shown.capacity,
        function(v) { return soldOutFor('capacity', v); },
        function(v) { setOption(v, shown.type, 'capacity'); }));
    }

    var types = unique(color.options.map(function(o) { return o.type; })).filter(Boolean);
    if (types.length > 1) {
      root.appendChild(optionGroup('Versión', types, shown.type,
        function(v) { return soldOutFor('type', v); },
        function(v) { setOption(shown.capacity, v, 'type'); }));
    }

    var buy = el('a', 'btn btn-primary pdp-buy');
    buy.href = '#';
    buy.setAttribute('onclick', 'return openWhatsApp(this)');
    buy.setAttribute('message', buyMessage());
    if (option && !option.soldOut) {
      buy.innerHTML = CART_ICON + ' Comprar';
    } else {
      buy.className = 'btn btn-primary pdp-buy is-disabled';
      buy.setAttribute('aria-disabled', 'true');
      buy.removeAttribute('onclick');
      buy.addEventListener('click', function(e) { e.preventDefault(); });
      buy.innerHTML = CART_ICON + ' Agotado';
    }
    root.appendChild(buy);

    if (option && !option.soldOut) {
      var finance = el('a', 'pdp-finance', 'Financiar');
      finance.href = 'credito.html?valor=' + option.price;
      root.appendChild(finance);
    }
  }

  function renderCrumbs() {
    var crumbs = document.getElementById('pdp-crumbs');
    crumbs.textContent = '';
    var home = el('a', null, 'Inicio');
    home.href = 'index.html';
    var list = el('a', null, state.model.category.name);
    list.href = state.model.category.href;
    crumbs.appendChild(home);
    crumbs.appendChild(el('span', null, '/'));
    crumbs.appendChild(list);
    crumbs.appendChild(el('span', null, '/'));
    var current = el('span', null, state.model.name);
    current.setAttribute('aria-current', 'page');
    crumbs.appendChild(current);
  }

  function syncUrl() {
    var params = new URLSearchParams();
    if (state.model.category === CATEGORIES.accessories) {
      params.set('accesorio', state.model.slug);
    } else {
      params.set('modelo', state.model.slug);
      params.set('color', slugify(state.color.name));
      if (state.option) {
        if (state.option.capacity) params.set('capacidad', slugify(state.option.capacity));
        if (state.option.type) params.set('tipo', slugify(state.option.type));
      }
    }
    history.replaceState(null, '', '?' + params.toString());
  }

  function renderSpecs() {
    var box = document.getElementById('pdp-specs');
    var list = box.querySelector('ul');
    list.textContent = '';
    state.color.specs.forEach(function(text) { list.appendChild(el('li', null, text)); });
    box.hidden = !state.color.specs.length;
  }

  function render(withGallery) {
    if (withGallery) {
      renderGallery();
      renderCrumbs();
      document.title = (state.model.name + ' ' + state.color.name).trim() + ' - Urban Tech';
    }
    renderSpecs();
    var focused = document.activeElement;
    var group = focused && focused.closest('#pdp-info [role="group"]');
    var key = group && [group.getAttribute('aria-label'), focused.getAttribute('aria-label') || focused.textContent];
    renderInfo();
    if (key) {
      Array.prototype.filter.call(document.querySelectorAll('#pdp-info [role="group"]'), function(g) {
        return g.getAttribute('aria-label') === key[0];
      }).forEach(function(g) {
        Array.prototype.forEach.call(g.children, function(b) {
          if ((b.getAttribute('aria-label') || b.textContent) === key[1]) b.focus();
        });
      });
    }
    syncUrl();
  }

  /* ---------- Arranque ---------- */

  function showError() {
    var status = document.getElementById('pdp-status');
    status.textContent = 'No pudimos cargar el producto. ';
    var back = el('a', null, 'Volver a productos');
    back.href = 'productos.html';
    status.appendChild(back);
  }

  function initShare() {
    var btn = document.getElementById('pdp-share');
    var label = btn.querySelector('span');
    btn.addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({ title: document.title, url: location.href }).catch(function() {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(location.href).then(function() {
          label.textContent = 'Enlace copiado';
          setTimeout(function() { label.textContent = 'Compartir'; }, 2000);
        });
      }
    });
  }

  function init() {
    initShare();
    initLightbox();
    fetch(CATALOG_URL)
      .then(function(res) { return res.text(); })
      .then(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        models = parseCatalog(doc);
        accessories = parseAccessories(doc);
        if (!models.length) throw new Error('catalog');

        var params = new URLSearchParams(location.search);
        var accessory = accessories.filter(function(a) { return a.slug === params.get('accesorio'); })[0];
        var model = accessory || models.filter(function(m) { return m.slug === params.get('modelo'); })[0] || models[0];
        var color = model.colors.filter(function(c) { return slugify(c.name) === params.get('color'); })[0];
        if (!color) color = firstColorWithStock(model);
        var wantCap = params.get('capacidad');
        var wantType = params.get('tipo');
        var option = color.options.filter(function(o) {
          return slugify(o.capacity) === wantCap && slugify(o.type) === wantType;
        })[0] || chooseOption(color, null, null);

        state.model = model;
        state.color = color;
        state.option = option;
        document.getElementById('pdp-status').hidden = true;
        document.getElementById('pdp-grid').hidden = false;
        render(true);
      })
      .catch(showError);
  }

  init();
})();
