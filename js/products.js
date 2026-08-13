function initProducts() {
  initVariantSelection();
  initFinanceLinks();
  initProductFilters();
}

function getCardModel(card) {
  var h3 = card.querySelector('h3');
  return h3 ? h3.textContent.trim() : '';
}

function getCardColor(card) {
  var el = card.querySelector('.product-color');
  return el ? el.textContent.trim() : '';
}

function parsePrice(text) {
  var digits = String(text == null ? '' : text).replace(/[^\d]/g, '');
  return parseInt(digits, 10) || 0;
}

function optionType(option) {
  var sim = option.querySelector('.badge-sim');
  var esim = option.querySelector('.badge-esim');
  var deal = option.querySelector('.badge-deal');
  var neu = option.querySelector('.badge-new');
  if (sim) return 'SIM';
  if (esim) return 'E-SIM';
  if (deal) return deal.textContent.trim();
  if (neu) return 'Nuevo';
  return '';
}

function optionCapacity(option) {
  var chip = option.querySelector('.capacity-chip');
  return chip ? chip.textContent.trim() : '';
}

function optionPrice(option) {
  var priceNode = option.querySelector('.price');
  return priceNode ? parsePrice(priceNode.textContent) : 0;
}

function initVariantSelection() {
  var groups = document.querySelectorAll('.dual-capacity');

  groups.forEach(function(dc) {
    var options = Array.prototype.slice.call(dc.querySelectorAll('.dual-capacity-option'));
    if (!options.length) return;

    var card = dc.closest('.product-card');
    if (!card) return;
    var buy = dc.querySelector('.btn.btn-primary');
    if (!buy) return;

    dc.setAttribute('role', 'radiogroup');

    function updateCta(option) {
      var price = optionPrice(option);
      var cap = optionCapacity(option);
      var type = optionType(option);
      var finance = card.querySelector('.product-finance');
      if (finance) finance.dataset.amount = String(price || 0);
      if (!buy) return;

      var label = 'Comprar';
      if (cap) label += ' ' + cap;
      if (type) label += ' · ' + type;

      var msg = 'Hola! quiero comprar un ' + getCardModel(card);
      var color = getCardColor(card);
      if (color) msg += ' ' + color;
      if (cap) msg += ' - ' + cap;
      if (type) msg += ' - ' + type;

      buy.setAttribute('message', msg);
      var svg = buy.querySelector('svg.cart-icon');
      buy.innerHTML = (svg ? svg.outerHTML : '') + ' ' + label;
    }

    function select(option, focus) {
      options.forEach(function(o) {
        var sel = o === option;
        o.classList.toggle('selected', sel);
        o.setAttribute('aria-checked', sel ? 'true' : 'false');
        o.tabIndex = sel ? 0 : -1;
      });
      if (focus) option.focus();
      updateCta(option);
    }

    options.forEach(function(option, idx) {
      option.setAttribute('role', 'radio');
      option.setAttribute('aria-checked', 'false');
      option.tabIndex = -1;
      option.addEventListener('click', function() {
        select(option, false);
      });
      option.addEventListener('keydown', function(e) {
        var current = options.indexOf(option);
        var next = -1;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          next = (current + 1) % options.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          next = (current - 1 + options.length) % options.length;
        } else if (e.key === 'Home') {
          next = 0;
        } else if (e.key === 'End') {
          next = options.length - 1;
        }
        if (next >= 0 && next !== current) {
          e.preventDefault();
          select(options[next], true);
        }
      });
    });

    select(options[0], false);
  });
}

function initFinanceLinks() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    var buy = card.querySelector('.btn.btn-primary');
    if (!buy) return;

    var link = document.createElement('a');
    link.href = '#calcula-tu-credito';
    link.className = 'btn btn-outline product-finance';
    link.textContent = 'Financiar';

    var dc = card.querySelector('.dual-capacity');
    var price = 0;
    if (dc) {
      var first = dc.querySelector('.dual-capacity-option');
      if (first) price = optionPrice(first);
      dc.appendChild(link);
    } else {
      price = parsePrice(card.querySelector('.price').textContent);
      buy.parentNode.insertBefore(link, buy.nextSibling);
    }
    link.dataset.amount = String(price || 0);

    link.addEventListener('click', function(e) {
      e.preventDefault();
      var amount = parseInt(link.dataset.amount, 10) || 0;
      if (amount > 0 && window.prefillCredit) window.prefillCredit(amount);
      var target = document.getElementById('calcula-tu-credito');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', '#calcula-tu-credito');
    });
  });
}

function initProductFilters() {
  var section = document.getElementById('productos');
  if (!section) return;
  var grid = section.querySelector('.products-grid');
  if (!grid) return;

  var children = Array.prototype.slice.call(grid.children);
  var models = [];
  children.forEach(function(child) {
    if (child.classList.contains('model-divider')) {
      var name = child.textContent.replace(/\s+/g, ' ').trim();
      if (name && models.indexOf(name) === -1) models.push(name);
    }
  });
  if (!models.length) return;

  var current = '';
  children.forEach(function(child) {
    if (child.classList.contains('model-divider')) {
      current = child.textContent.replace(/\s+/g, ' ').trim();
    } else if (child.classList.contains('product-card')) {
      child.dataset.model = current;
    }
  });

  var bar = document.createElement('div');
  bar.className = 'product-filters';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Filtrar por modelo');

  var buttons = [];

  function addButton(label) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-filter-btn';
    btn.textContent = label;
    btn.setAttribute('aria-pressed', 'false');
    bar.appendChild(btn);
    buttons.push(btn);
    return btn;
  }

  function dividerHasVisible(div) {
    var i = children.indexOf(div);
    for (var j = i + 1; j < children.length; j++) {
      var el = children[j];
      if (el.classList.contains('model-divider')) return false;
      if (el.classList.contains('product-card') && !el.classList.contains('is-filtered')) return true;
    }
    return false;
  }

  function apply(model, active) {
    buttons.forEach(function(b) {
      b.setAttribute('aria-pressed', b === active ? 'true' : 'false');
    });
    children.forEach(function(child) {
      if (child.classList.contains('product-card')) {
        var show = !model || child.dataset.model === model;
        child.classList.toggle('is-filtered', !show);
      }
    });
    children.forEach(function(child) {
      if (child.classList.contains('model-divider')) {
        var show = !model || dividerHasVisible(child);
        child.classList.toggle('is-filtered', !show);
      }
    });
  }

  var allBtn = addButton('Todos');
  allBtn.addEventListener('click', function() {
    apply('', allBtn);
  });

  models.forEach(function(model) {
    var btn = addButton(model);
    btn.addEventListener('click', function() {
      if (btn.getAttribute('aria-pressed') === 'true') {
        apply('', allBtn);
        return;
      }
      apply(model, btn);
    });
  });

  grid.parentNode.insertBefore(bar, grid);
  apply('', allBtn);
}