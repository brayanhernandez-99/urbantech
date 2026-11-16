(function() {
  'use strict';

  var PRICE_STEP = 10000;

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function groupDigits(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function check(value, text, total) {
    var row = el('label', 'prod-check');
    var box = el('input');
    box.type = 'checkbox';
    box.value = value;
    row.appendChild(box);
    row.appendChild(el('span', null, text));
    if (total != null) row.appendChild(el('span', 'prod-check-count', String(total)));
    return row;
  }

  function hasKind(card, kind) {
    return (' ' + card.getAttribute('data-kind') + ' ').indexOf(' ' + kind + ' ') !== -1;
  }

  function fieldset(title) {
    var set = el('fieldset', 'prod-group');
    set.appendChild(el('legend', null, title));
    return set;
  }

  // Panel de filtros de los listados (envuelve #cat-grid). Lee de cada tarjeta: data-kind (tipos separados por espacio),
  // data-price (menor precio disponible; sin él = agotado) y data-group (solo si hay varias categorías).
  // groups = [{ id, label, kinds: { tipo: 'Etiqueta' } }]: con una categoría el panel ofrece sus tipos; con varias, categoría > tipos.
  window.initCatFilters = function(groups) {
    var grid = document.getElementById('cat-grid');
    var cards = Array.prototype.slice.call(grid.children);
    var single = groups.length === 1;
    var form = el('form', 'prod-filters');
    form.id = 'prod-filters';
    form.setAttribute('aria-label', 'Filtrar productos');

    // Tipos de cada categoría: solo los presentes y solo si hay al menos dos; el submenú se muestra mientras la categoría está marcada.
    var typeSet = fieldset(single ? 'Tipo' : 'Categoría');
    var rows = groups.map(function(group) {
      var inGroup = cards.filter(function(c) { return single || c.getAttribute('data-group') === group.id; });
      var row = { id: group.id, main: null, sub: null };
      if (!single) {
        row.main = check(group.id, group.label, inGroup.length);
        typeSet.appendChild(row.main);
      }
      var kinds = Object.keys(group.kinds).filter(function(k) {
        return inGroup.some(function(c) { return hasKind(c, k); });
      });
      if (kinds.length > 1) {
        row.sub = el('div', single ? null : 'prod-sub');
        kinds.forEach(function(k) { row.sub.appendChild(check(k, group.kinds[k])); });
        typeSet.appendChild(row.sub);
      }
      return row;
    });

    var prices = cards.map(function(c) { return parseInt(c.getAttribute('data-price'), 10); }).filter(function(p) { return p > 0; });
    var floor = Math.floor(Math.min.apply(null, prices) / PRICE_STEP) * PRICE_STEP;
    var ceil = Math.ceil(Math.max.apply(null, prices) / PRICE_STEP) * PRICE_STEP;
    var hasTypes = !single || rows[0].sub;
    var hasPrice = prices.length > 0 && floor < ceil;
    if (!hasTypes && !hasPrice) return;

    if (hasTypes) form.appendChild(typeSet);

    var min, max, fill, minOut, maxOut;
    if (hasPrice) {
      var priceSet = fieldset('Precio');
      var range = el('div', 'prod-range');
      var track = el('div', 'prod-range-track');
      fill = el('div', 'prod-range-fill');
      track.appendChild(fill);
      range.appendChild(track);
      [['Precio mínimo', floor], ['Precio máximo', ceil]].forEach(function(spec, i) {
        var input = el('input');
        input.type = 'range';
        input.min = floor;
        input.max = ceil;
        input.step = PRICE_STEP;
        input.setAttribute('value', spec[1]);
        input.setAttribute('aria-label', spec[0]);
        range.appendChild(input);
        if (i) max = input; else min = input;
      });
      min.addEventListener('input', function() { if (+min.value > +max.value) min.value = max.value; });
      max.addEventListener('input', function() { if (+max.value < +min.value) max.value = min.value; });
      var values = el('div', 'prod-range-values');
      minOut = el('output');
      maxOut = el('output');
      values.appendChild(minOut);
      values.appendChild(maxOut);
      priceSet.appendChild(range);
      priceSet.appendChild(values);
      form.appendChild(priceSet);
    }

    var clear = el('button', 'prod-clear', 'Limpiar filtros');
    clear.type = 'button';
    form.appendChild(clear);

    var layout = el('div', 'prod-layout');
    var toggle = el('button', 'prod-filters-toggle', 'Filtros');
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'prod-filters');
    var results = el('div', 'prod-results');
    var count = el('p', 'prod-count');
    count.setAttribute('role', 'status');
    var empty = el('p', 'pdp-status', 'Ningún producto coincide con los filtros.');
    empty.hidden = true;
    grid.parentNode.insertBefore(layout, grid);
    results.appendChild(count);
    results.appendChild(grid);
    results.appendChild(empty);
    layout.appendChild(toggle);
    layout.appendChild(form);
    layout.appendChild(results);

    function checked(scope) {
      return Array.prototype.filter.call(scope.querySelectorAll('input'), function(b) { return b.checked; })
        .map(function(b) { return b.value; });
    }

    function apply() {
      var lo = floor;
      var hi = ceil;
      if (hasPrice) {
        lo = +min.value;
        hi = +max.value;
        fill.style.left = (lo - floor) / (ceil - floor) * 100 + '%';
        fill.style.right = (ceil - hi) / (ceil - floor) * 100 + '%';
        min.style.zIndex = lo > (floor + ceil) / 2 ? 2 : 0;
        minOut.textContent = '$' + groupDigits(lo);
        maxOut.textContent = '$' + groupDigits(hi);
      }
      var chosen = {};
      var any = false;
      rows.forEach(function(row) {
        var on = single || row.main.querySelector('input').checked;
        if (row.sub && !single) {
          row.sub.hidden = !on;
          if (!on) row.sub.querySelectorAll('input').forEach(function(b) { b.checked = false; });
        }
        if (!on) return;
        any = true;
        chosen[row.id] = row.sub ? checked(row.sub) : [];
      });
      var shown = 0;
      cards.forEach(function(card) {
        var kinds = chosen[single ? rows[0].id : card.getAttribute('data-group')];
        var ok = !any || (!!kinds && (!kinds.length || kinds.some(function(k) { return hasKind(card, k); })));
        var price = parseInt(card.getAttribute('data-price'), 10);
        ok = ok && ((lo === floor && hi === ceil) || (price > 0 && price >= lo && price <= hi));
        card.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown + (shown === 1 ? ' producto' : ' productos');
      empty.hidden = shown > 0;

      var tokens = [];
      rows.forEach(function(row) {
        if (row.main && row.main.querySelector('input').checked) tokens.push(row.id);
        if (row.sub) checked(row.sub).forEach(function(k) { tokens.push(row.id + '.' + k); });
      });
      var query = new URLSearchParams(location.search);
      if (tokens.length) query.set('f', tokens.join(',')); else query.delete('f');
      if (lo !== floor) query.set('min', lo); else query.delete('min');
      if (hi !== ceil) query.set('max', hi); else query.delete('max');
      var qs = query.toString();
      try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) {}
    }

    form.addEventListener('input', apply);
    form.addEventListener('submit', function(e) { e.preventDefault(); });
    clear.addEventListener('click', function() {
      form.reset();
      apply();
    });
    toggle.addEventListener('click', function() {
      var open = form.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var saved = new URLSearchParams(location.search);
    var tokens = (saved.get('f') || '').split(',');
    rows.forEach(function(row) {
      if (row.main && tokens.indexOf(row.id) !== -1) row.main.querySelector('input').checked = true;
      if (row.sub) {
        row.sub.querySelectorAll('input').forEach(function(b) { b.checked = tokens.indexOf(row.id + '.' + b.value) !== -1; });
      }
    });
    if (hasPrice) {
      var lo = parseInt(saved.get('min'), 10);
      var hi = parseInt(saved.get('max'), 10);
      if (lo >= floor && lo <= ceil) min.value = lo;
      if (hi >= floor && hi <= ceil) max.value = hi;
      if (+min.value > +max.value) min.value = max.value;
    }
    apply();
  };
})();
