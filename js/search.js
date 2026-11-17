(function() {
  'use strict';

  var CATALOG_URL = 'partials/catalogo.html';
  var MAX_RESULTS = 6;

  var STOP = ('quiero quisiera necesito busco buscando un una unos unas el la los las de del para que con y o en me mi mis ' +
    'por favor hola tienen tiene hay precio cuanto cuesta vale comprar algo como al a es su se lo le si no mas muy pero ' +
    'tengo buenas dias tardes noches gracias ver dame dime cual cuales donde esta estan tienda sobre unos').split(' ');

  // Grupos de palabras del catálogo que se reusan en varias entradas.
  var ACTION = ['action', 'ace', 'go'];            // cámaras de acción (DJI Action, Insta360 Ace/GO)
  var CAM360 = ['360', 'x4', 'x5', 'x6'];          // cámaras 360° (Osmo 360, Insta360 serie X)
  var AUDIO = ['microfono', 'mic', 'audifono', 'airpod'];

  // Palabra escrita (singular, sin tildes) → palabras del catálogo que equivale a buscar.
  // La gente no nombra los productos como están en el catálogo: aquí se agrupan los nombres populares.
  var SYNONYMS = {
    // Cases (Case Space, Case Atomic)
    case: ['case'], estuche: ['case'], carcasa: ['case'], funda: ['case'], forro: ['case'], cover: ['case'],
    silicon: ['case'], silicona: ['case'], silicone: ['case'], tpu: ['case'], bumper: ['case'], tapa: ['case'],
    key: ['case'], kei: ['case'], kis: ['case'], magsafe: ['case'], rudo: ['case'], antigolpe: ['case'],
    proteccion: ['case', 'vidrio', 'protector'],
    // Adaptador (el "cubo" de carga)
    adaptador: ['adaptador'], cubo: ['adaptador'], cubito: ['adaptador'], cabezal: ['adaptador'],
    enchufe: ['adaptador'], bloque: ['adaptador'], toma: ['adaptador'], tomacorriente: ['adaptador'],
    adapter: ['adaptador'], pared: ['adaptador'], fuente: ['adaptador'],
    cargador: ['adaptador', 'cable'], carga: ['adaptador', 'cable'], charger: ['adaptador', 'cable'],
    // Cables
    cable: ['cable'], cordon: ['cable'], alambre: ['cable'], conector: ['cable'], dato: ['cable'],
    // Vidrios y protectores de pantalla
    vidrio: ['vidrio'], mica: ['vidrio'], cristal: ['vidrio'], templado: ['vidrio'], blindado: ['vidrio'],
    glas: ['vidrio'], pantalla: ['vidrio'], lamina: ['vidrio'], hidrogel: ['vidrio'], screen: ['vidrio'],
    tempered: ['vidrio'], film: ['vidrio'], '9h': ['vidrio'],
    protector: ['protector', 'vidrio'], espia: ['antiespia'], privacidad: ['antiespia'], antiespia: ['antiespia'],
    // Protector de cámaras
    camara: ['camara'], lente: ['camara'],
    // AirPods (en Colombia: "manos libres") y audio en general
    audifono: ['airpod', 'audifono'], auricular: ['airpod', 'audifono'], airpod: ['airpod'], pod: ['airpod'],
    air: ['air'], earbud: ['airpod'], earpod: ['airpod'], bud: ['airpod'], tws: ['airpod'],
    headphone: ['airpod', 'audifono'], headset: ['airpod', 'audifono'], handsfree: ['airpod', 'audifono'],
    musica: ['airpod', 'audifono'], apple: ['iphone', 'airpod'],
    bluetooth: ['airpod', 'audifono', 'microfono', 'mic'], inalambrico: ['airpod', 'audifono', 'microfono', 'mic'],
    wireles: AUDIO, audio: AUDIO, sonido: AUDIO,
    // Suunto (relojes, audífonos y correas; el tipo sale del data-kind del catálogo)
    correa: ['correa'], manilla: ['correa'], banda: ['correa'], band: ['correa'], strap: ['correa'],
    malla: ['correa'], brazalete: ['correa'], pulsera: ['correa', 'reloj'],
    reloj: ['reloj'], smartwatch: ['reloj'], watch: ['reloj'], inteligente: ['reloj'], cronometro: ['reloj'],
    garmin: ['reloj'], coro: ['reloj'], polar: ['reloj'], amazfit: ['reloj'],
    // Celulares
    celular: ['iphone'], cel: ['iphone'], telefono: ['iphone'], movil: ['iphone'], smartphone: ['iphone'],
    iphone: ['iphone'], aifon: ['iphone'], ifon: ['iphone'], ayfon: ['iphone'], promax: ['pro', 'max'],
    // Colores (el catálogo los tiene en inglés; algunos nombres de cámaras traen "Negra"/"Blanca")
    negro: ['black', 'negr'], blanco: ['white', 'blanc'], azul: ['blue'], rosa: ['pink'], rosado: ['pink'], verde: ['green'],
    naranja: ['orange'], plateado: ['silver'], rojo: ['red'], amarillo: ['yellow'], morado: ['lavender'],
    lavanda: ['lavender'], vino: ['burgundy'], vinotinto: ['burgundy'],
    gri: ['gray'], // 'gris' llega ya sin la s final (singular)
     grafito: ['graphite'], dorado: ['desert'], desierto: ['desert'], arena: ['sand', 'desert'],
    titanio: ['titanium'], celeste: ['blue'], turquesa: ['teal'], lila: ['lavender'], salvia: ['sage'],
    glaciar: ['glacier'], medianoche: ['midnight'], estrella: ['starlight'], perla: ['pearl'], lima: ['lime'],
    limon: ['lemon'], coral: ['coral'], rubi: ['ruby'], granate: ['burgundy'], guinda: ['burgundy'],
    borgona: ['burgundy'], cereza: ['burgundy'], anaranjado: ['orange'], ultramarino: ['ultramarine'],
    cosmico: ['cosmic'], plata: ['silver'], profundo: ['deep'], mistico: ['mystic'], burdeo: ['burgundy'],
    // Duo (plegable) y DJI Flip (el nombre choca con "flip" de plegable)
    plegable: ['duo'], doblable: ['duo'], fold: ['duo'], flip: ['duo', 'flip'],
    // Relojes deportivos Suunto
    deportivo: ['reloj', 'audifono'], deporte: ['reloj', 'audifono'], sport: ['reloj', 'audifono'],
    ejercicio: ['reloj', 'audifono'], atleta: ['reloj', 'audifono'], entrenamiento: ['reloj'], fitnes: ['reloj'],
    gps: ['reloj'], running: ['reloj'], correr: ['reloj'], maraton: ['reloj'], triatlon: ['reloj'],
    trail: ['reloj'], montana: ['reloj'], senderismo: ['reloj'], trekking: ['reloj'], caminata: ['reloj'],
    ciclismo: ['reloj'], bicicleta: ['reloj'], bici: ['reloj'], brujula: ['reloj'], altimetro: ['reloj'],
    mapa: ['reloj'], navegacion: ['reloj'], cardiaco: ['reloj'], pulso: ['reloj'], salud: ['reloj'],
    buceo: ['reloj'], bucear: ['reloj'], nadar: ['reloj', 'aqua'], natacion: ['reloj', 'aqua'], swim: ['reloj', 'aqua'],
    // Cables y carga por tipo de conector
    tipoc: ['usb'], typec: ['usb'], usbc: ['usb'], lightning: ['lightning'],
    // Audífonos de conducción ósea (Suunto)
    osea: ['audifono'], hueso: ['audifono'], conduccion: ['audifono'],
    // DJI e Insta360: marcas y nombres genéricos de drones
    insta: ['insta360'],
    // Nombres del catálogo que la coincidencia difusa confundiría con otra clave (ultra→ultramarino, light→lightning, …)
    ultra: ['ultra'], light: ['light'], action: ['action'], smart: ['smart'],
    dron: ['dron', 'drone'], drone: ['dron', 'drone'],
    quadcopter: ['dron', 'drone'], volador: ['dron', 'drone'], volar: ['dron', 'drone'], vuelo: ['dron', 'drone'], aereo: ['dron', 'drone'],
    aerea: ['dron', 'drone'],
    fpv: ['fpv', 'avata'], inmersivo: ['avata'], gafa: ['goggle'], visor: ['goggle'],
    principiante: ['neo', '4k'], selfie: ['neo', 'mobile'], seguimiento: ['neo', 'mobile', 'pocket'],
    // Micrófonos (DJI Mic) y marcas competidoras
    microfono: ['microfono', 'mic'], mic: ['mic', 'microfono'], solapa: ['microfono', 'mic'],
    lavalier: ['microfono', 'mic'], lapel: ['microfono', 'mic'], corbatero: ['microfono', 'mic'],
    podcast: ['microfono', 'mic'], entrevista: ['microfono', 'mic'], voz: ['microfono', 'mic'],
    rode: ['microfono', 'mic'], boya: ['microfono', 'mic'],
    // Estabilizadores (Osmo Mobile) y cámaras de mano (Osmo Pocket)
    gimbal: ['estabilizador', 'pocket'], stabilizer: ['estabilizador', 'pocket'], estabilizar: ['estabilizador'],
    tripode: ['mobile'], palo: ['mobile'], bolsillo: ['pocket'],
    vlog: ['pocket', 'mobile'], vlogger: ['pocket', 'mobile'],
    youtuber: ['pocket', 'mobile'], tiktok: ['pocket', 'mobile'],
    influencer: ['pocket', 'mobile'],
    // Cámaras de acción (alternativas a GoPro), 360°, webcams
    gopro: ACTION, accion: ACTION, deportiva: ACTION, pov: ACTION, bodycam: ACTION,
    sumergible: ['action', 'ace'], impermeable: ['action', 'ace'], acuatico: ['action', 'ace'],
    submarino: ['action', 'ace'], waterproof: ['action', 'ace'], snorkel: ['action', 'ace'],
    '360': CAM360, panoramica: CAM360, esferica: CAM360, vr: CAM360,
    moto: ACTION.concat(CAM360), motocicleta: ACTION.concat(CAM360), casco: ACTION.concat(CAM360),
    webcam: ['link'], web: ['link'], videollamada: ['link'], reunion: ['link'], conferencia: ['link'],
    teletrabajo: ['link'],
    // Actividades al aire libre (cámaras de acción), grabación en general, controles y baterías de drones
    ciclista: ACTION, kayak: ACTION, surf: ACTION, ski: ACTION, esqui: ACTION, pesca: ACTION,
    viaje: ACTION, aventura: ACTION, extremo: ACTION, vacaciones: ACTION,
    foto: ['camara'], video: ['camara'], grabar: ['camara'], filmar: ['camara'], grabacion: ['camara'],
    control: ['rc'], mando: ['rc'], radiocontrol: ['rc'],
    bateria: ['battery', 'batery', 'batterie'], battery: ['battery', 'batery', 'batterie']
  };
  // Palabras que indican una categoría (no un producto concreto); una lista si la palabra existe en varias.
  var CATEGORY_TERMS = {
    iphone: 'phones',
    case: 'accessories', vidrio: 'accessories', adaptador: 'accessories', cable: ['accessories', 'suunto'],
    airpod: 'accessories', protector: 'accessories', antiespia: 'accessories',
    correa: 'suunto', reloj: 'suunto', audifono: 'suunto', suunto: 'suunto',
    dji: 'dji', dron: 'dji', drone: 'dji', microfono: 'dji', mic: 'dji', estabilizador: 'dji', insta360: 'insta360'
  };
  var CATEGORIES = {
    phones: { label: 'Ver todos los celulares', href: 'celulares.html' },
    accessories: { label: 'Ver todos los accesorios', href: 'accesorios.html' },
    suunto: { label: 'Ver todo Suunto', href: 'suunto.html' },
    dji: { label: 'Ver todo DJI', href: 'dji.html' },
    insta360: { label: 'Ver todo Insta360', href: 'insta360.html' }
  };
  var ICON_SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.5" y2="16.5"/></svg>';
  var ICON_ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

  var nav = document.querySelector('.nav');
  if (!nav) return;
  var container = nav.querySelector('.container');

  var items = null;
  var loading = null;
  var rows = [];
  var active = -1;

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

  function stem(word) {
    return word.length > 3 && word.charAt(word.length - 1) === 's' ? word.slice(0, -1) : word;
  }

  function words(text) {
    var plain = String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/e-sim/g, 'esim').replace(/manos? libres?/g, 'handsfree')
      .replace(/insta[\s-]*360/g, 'insta360').replace(/\bgo[\s-]*pro\b/g, 'gopro').replace(/(\d)(gb|tb)\b/g, '$1 $2');
    return (plain.match(/[a-z0-9]+/g) || []).map(stem);
  }

  function formatCOP(value) {
    return '$' + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function priceOf(node) {
    var price = node.querySelector('.price');
    return price ? parseInt(price.textContent.replace(/\D/g, ''), 10) || 0 : 0;
  }

  function firstImage(card) {
    var wrapper = card.querySelector('.product-img-wrapper');
    if (wrapper) return JSON.parse(wrapper.getAttribute('data-images'))[0];
    return card.querySelector('.product-img').getAttribute('src');
  }

  /* ---------- Datos: se leen de partials/catalogo.html (única fuente) ---------- */

  function parseItems(doc) {
    var list = [];
    var model = null;
    Array.prototype.forEach.call(doc.querySelectorAll('#celulares .products-grid > *, #suunto .products-grid > *, #dji .products-grid > *, #insta360 .products-grid > *'), function(node) {
      if (node.classList.contains('model-divider')) {
        var name = node.textContent.trim();
        var brand = node.closest('section').id;
        var isBrand = brand !== 'celulares';
        var nameWords = words(name).concat(isBrand ? words(brand).concat(words(node.getAttribute('data-kind'))) : []);
        model = { name: name, category: isBrand ? brand : 'phones', href: 'producto.html?modelo=' + slugify(name), nameWords: nameWords, words: nameWords, prices: [], allPrices: [], image: null };
        list.push(model);
      } else if (model && node.classList.contains('product-card')) {
        if (!model.image) model.image = firstImage(node);
        model.words = model.words.concat(words(node.querySelector('.product-color').textContent));
        Array.prototype.forEach.call(node.querySelectorAll('.dual-capacity-option'), function(o) {
          var chip = o.querySelector('.capacity-chip');
          var badge = o.querySelector('.badge-sim, .badge-esim');
          if (chip) model.words = model.words.concat(words(chip.textContent));
          if (badge) model.words = model.words.concat(words(badge.textContent));
          model.allPrices.push(priceOf(o));
          if (!o.classList.contains('is-sold-out')) model.prices.push(priceOf(o));
        });
      }
    });
    Array.prototype.forEach.call(doc.querySelectorAll('#accesorios .products-grid > .product-card'), function(card) {
      var name = card.querySelector('h3').textContent.trim();
      var price = priceOf(card);
      list.push({
        name: name,
        category: 'accessories',
        href: 'producto.html?accesorio=' + encodeURIComponent(card.id),
        nameWords: words(name),
        words: words(name),
        prices: card.querySelector('.stock-badge--out') ? [] : [price],
        allPrices: [price],
        image: firstImage(card)
      });
    });
    return list;
  }

  function load() {
    if (!loading) {
      loading = fetch(CATALOG_URL)
        .then(function(res) { return res.text(); })
        .then(function(html) { items = parseItems(new DOMParser().parseFromString(html, 'text/html')); })
        .catch(function() { items = []; });
    }
    return loading;
  }

  /* ---------- Coincidencias ---------- */

  function editDistanceOne(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var i = 0;
    while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) i++;
    if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
    return a.length > b.length ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i);
  }

  function matches(term, word) {
    if (term === word) return true;
    if (/^\d+$/.test(term)) return false;
    if (term.length >= 3 && word.indexOf(term) === 0) return true;
    return term.length >= 5 && editDistanceOne(term, word);
  }

  // Cada palabra útil de la consulta se vuelve una lista de alternativas del catálogo.
  function parseQuery(text) {
    return words(text).filter(function(w) { return STOP.indexOf(w) === -1; }).map(function(w) {
      var key = SYNONYMS[w] ? w : Object.keys(SYNONYMS).filter(function(k) { return w.length >= 5 && matches(w, k); })[0];
      var alts = key ? SYNONYMS[key] : [w];
      // "iphone" suele ser solo contexto ("cargador para mi iphone"): el producto lo marcan los términos de cualquier otra categoría.
      return { alts: alts, weight: alts.some(function(a) { return CATEGORY_TERMS[a] && CATEGORY_TERMS[a] !== 'phones'; }) ? 2 : 1 };
    });
  }

  function search(text) {
    var terms = parseQuery(text);
    if (!terms.length) return { results: [], category: null };
    // Si todo lo escrito son palabras de una misma categoría, se ofrece ir a su sección.
    // Un término cuyas alternativas apuntan a varias categorías (p. ej. "audífonos") no fija ninguna.
    var cats = terms.map(function(t) {
      var found = [].concat.apply([], t.alts.map(function(a) { return CATEGORY_TERMS[a] || []; })).filter(function(c, i, all) { return all.indexOf(c) === i; });
      return found.length === 1 ? found[0] : null;
    });
    var category = cats.every(function(c) { return c && c === cats[0]; }) ? cats[0] : null;

    var scored = [];
    items.forEach(function(item) {
      if (category && item.category !== category) return;
      var score = 0;
      terms.forEach(function(t) {
        var inName = t.alts.some(function(alt) {
          return item.nameWords.some(function(w) { return matches(alt, w); });
        });
        var hit = inName || t.alts.some(function(alt) {
          return item.words.some(function(w) { return matches(alt, w); });
        });
        if (hit) score += t.weight * (inName ? 2 : 1);
      });
      // A igual puntaje gana el modelo con menos palabras sobrantes (iPhone 17 Pro antes que 17 Pro Max).
      var extra = category ? 0 : item.nameWords.filter(function(w) {
        return !terms.some(function(t) { return t.alts.some(function(alt) { return matches(alt, w); }); });
      }).length;
      if (score) scored.push({ item: item, score: score, extra: extra, order: scored.length });
    });
    scored.sort(function(a, b) { return b.score - a.score || a.extra - b.extra || a.order - b.order; });
    var best = scored.length ? scored[0].score : 0;
    var results = scored.filter(function(s) { return s.score >= best * 0.75; }).slice(0, MAX_RESULTS)
      .map(function(s) { return s.item; });
    return { results: results, category: category };
  }

  /* ---------- Interfaz ---------- */

  var button = el('button', 'nav-search-btn');
  button.type = 'button';
  button.setAttribute('aria-label', 'Buscar productos');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'nav-search');
  button.innerHTML = ICON_SEARCH;
  container.insertBefore(button, container.querySelector('.mobile-toggle'));

  var panel = el('div', 'nav-search');
  panel.id = 'nav-search';
  var field = el('div', 'nav-search-field');
  field.innerHTML = ICON_SEARCH;
  var input = el('input', 'nav-search-input');
  input.type = 'search';
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'nav-search-list');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-label', 'Buscar productos');
  input.setAttribute('autocomplete', 'off');
  input.maxLength = 150;
  input.placeholder = 'Busca Celulares, Accesorios, DJI, Suunto…';
  field.appendChild(input);
  var list = el('div', 'nav-search-list');
  list.id = 'nav-search-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Resultados de búsqueda');
  var status = el('p', 'nav-search-status');
  status.setAttribute('role', 'status');
  list.hidden = true;
  panel.appendChild(field);
  panel.appendChild(list);
  panel.appendChild(status);
  container.insertBefore(panel, container.querySelector('.nav-links, .nav-back'));

  function setActive(index) {
    active = index;
    rows.forEach(function(row, i) {
      row.setAttribute('aria-selected', i === active ? 'true' : 'false');
    });
    if (active >= 0) {
      input.setAttribute('aria-activedescendant', rows[active].id);
      rows[active].scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function row(href, id) {
    var node = el('a', 'nav-search-row');
    node.href = href;
    node.id = id;
    node.setAttribute('role', 'option');
    node.setAttribute('aria-selected', 'false');
    rows.push(node);
    list.appendChild(node);
    return node;
  }

  function categoryRow(key) {
    var node = row(CATEGORIES[key].href, 'nav-search-opt-' + rows.length);
    node.classList.add('nav-search-row--category');
    node.appendChild(el('span', 'nav-search-name', CATEGORIES[key].label));
    var arrow = el('span', 'nav-search-arrow');
    arrow.innerHTML = ICON_ARROW;
    node.appendChild(arrow);
  }

  function productRow(item) {
    var node = row(item.href, 'nav-search-opt-' + rows.length);
    var thumb = el('span', 'nav-search-thumb');
    var img = el('img');
    img.src = item.image;
    img.alt = '';
    img.width = 48;
    img.height = 48;
    thumb.appendChild(img);
    var text = el('span', 'nav-search-text');
    text.appendChild(el('span', 'nav-search-name', item.name));
    var prices = item.prices.length ? item.prices : item.allPrices;
    var min = Math.min.apply(null, prices);
    var label = item.prices.length ? (Math.max.apply(null, prices) > min ? 'Desde ' : '') + formatCOP(min) : 'Agotado';
    text.appendChild(el('span', 'nav-search-price', label));
    node.appendChild(thumb);
    node.appendChild(text);
  }

  function renderEmpty(text) {
    var box = el('div', 'nav-search-empty');
    box.appendChild(el('p', null, 'No encontramos coincidencias para “' + text.trim() + '”.'));
    var links = el('div', 'nav-search-empty-links');
    var all = el('a', null, 'Ver todos los productos');
    all.href = 'productos.html';
    links.appendChild(all);
    var wa = el('a', null, 'Pregúntanos por WhatsApp');
    wa.href = '#';
    wa.setAttribute('message', 'Hola! estoy buscando: ' + text.trim());
    wa.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.openWhatsApp) window.openWhatsApp(wa);
    });
    links.appendChild(wa);
    box.appendChild(links);
    list.appendChild(box);
  }

  function render() {
    var text = input.value.replace(/[\u0000-\u001f\u007f]/g, '');
    list.textContent = '';
    rows = [];
    active = -1;
    input.removeAttribute('aria-activedescendant');
    if (!text.trim() || !items) {
      input.setAttribute('aria-expanded', 'false');
      status.textContent = '';
      list.hidden = true;
      return;
    }
    list.hidden = false;
    var found = search(text);
    // Con una sola coincidencia (p. ej. "cubo" → adaptador) el producto va primero y la categoría queda al final.
    var categoryFirst = found.category && found.results.length > 1;
    if (categoryFirst) categoryRow(found.category);
    found.results.forEach(productRow);
    if (found.category && !categoryFirst && found.results.length) categoryRow(found.category);
    if (!found.results.length) renderEmpty(text);
    input.setAttribute('aria-expanded', rows.length ? 'true' : 'false');
    status.textContent = found.results.length
      ? found.results.length + (found.results.length === 1 ? ' resultado' : ' resultados')
      : 'Sin resultados';
    if (rows.length) setActive(0);
  }

  // En móvil el campo está oculto: la lupa lo abre como panel bajo la barra. En escritorio siempre es visible.
  function open() {
    var toggle = nav.querySelector('.mobile-toggle');
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
    panel.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    load().then(render);
    input.focus();
  }

  function close(returnFocus) {
    panel.classList.remove('is-open');
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (returnFocus) {
      if (button.offsetParent) button.focus(); else input.blur();
    }
  }

  button.addEventListener('click', function() {
    if (panel.classList.contains('is-open')) close(false); else open();
  });

  input.addEventListener('focus', function() { load().then(render); });
  input.addEventListener('input', function() { load().then(render); });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' && rows.length) {
      e.preventDefault();
      setActive((active + 1) % rows.length);
    } else if (e.key === 'ArrowUp' && rows.length) {
      e.preventDefault();
      setActive((active - 1 + rows.length) % rows.length);
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      window.location.href = rows[active].href;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && (!list.hidden || panel.classList.contains('is-open'))) close(true);
  });

  document.addEventListener('click', function(e) {
    if (panel.contains(e.target) || e.target.closest('.nav-search-btn')) return;
    close(false);
  });
})();
