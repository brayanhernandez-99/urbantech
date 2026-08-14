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

function dotForColor(hex) {
  hex = String(hex == null ? '' : hex).trim();
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  var lin = function(c) {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  var r = lin(parseInt(hex.substr(1, 2), 16));
  var g = lin(parseInt(hex.substr(3, 2), 16));
  var b = lin(parseInt(hex.substr(5, 2), 16));
  var L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.75 ? '#26E0D4' : hex;
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

function flashHintIn(card) {
  var hint = card.querySelector('.buy-hint');
  if (!hint) return;
  hint.classList.remove('buy-hint--show');
  void hint.offsetWidth;
  hint.classList.add('buy-hint--show');
  if (hint.__timer) clearTimeout(hint.__timer);
  hint.__timer = setTimeout(function() {
    hint.classList.remove('buy-hint--show');
  }, 2600);
}

function initVariantSelection() {
  var groups = document.querySelectorAll('.dual-capacity');

  groups.forEach(function(dc) {
    var options = Array.prototype.slice.call(dc.querySelectorAll('.dual-capacity-option'));
    if (!options.length) return;

    var card = dc.closest('.product-card');
    if (!card) return;
    var colorDot = card.querySelector('.product-color');
    if (colorDot) {
      var hex = colorDot.style.getPropertyValue('--dot');
      if (hex) dc.style.setProperty('--dot', dotForColor(hex));
    }
    var buy = dc.querySelector('.btn.btn-primary');
    if (!buy) return;

    buy.classList.add('is-disabled');
    buy.setAttribute('aria-disabled', 'true');

    var hint = document.createElement('p');
    hint.className = 'buy-hint';
    hint.setAttribute('role', 'status');
    hint.textContent = 'Selecciona una opción para continuar';
    dc.appendChild(hint);

    buy.onclick = function(e) {
      if (buy.classList.contains('is-disabled')) {
        e.preventDefault();
        flashHintIn(card);
        return false;
      }
      return openWhatsApp(buy);
    };

    dc.setAttribute('role', 'radiogroup');

    function updateCta(option) {
      var price = optionPrice(option);
      var cap = optionCapacity(option);
      var type = optionType(option);
      var finance = card.querySelector('.product-finance');
      if (finance) {
        finance.dataset.amount = String(price || 0);
        finance.classList.remove('is-disabled');
        finance.setAttribute('aria-disabled', 'false');
      }

      buy.classList.remove('is-disabled');
      buy.setAttribute('aria-disabled', 'false');
      hint.classList.remove('buy-hint--show');

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

    function select(option, focus, allowDeselect) {
      if (allowDeselect && option.classList.contains('selected')) {
        deselect();
        if (focus) option.focus();
        return;
      }
      options.forEach(function(o) {
        var sel = o === option;
        o.classList.toggle('selected', sel);
        o.setAttribute('aria-checked', sel ? 'true' : 'false');
        o.tabIndex = sel ? 0 : -1;
      });
      if (focus) option.focus();
      updateCta(option);
    }

    function deselect() {
      options.forEach(function(o) {
        o.classList.remove('selected');
        o.setAttribute('aria-checked', 'false');
        o.tabIndex = -1;
      });
      options[0].tabIndex = 0;

      var msg = 'Hola! quiero comprar un ' + getCardModel(card);
      var color = getCardColor(card);
      if (color) msg += ' ' + color;
      buy.setAttribute('message', msg);
      var svg = buy.querySelector('svg.cart-icon');
      buy.innerHTML = (svg ? svg.outerHTML : '') + ' Comprar';
      buy.classList.add('is-disabled');
      buy.setAttribute('aria-disabled', 'true');

      var finance = card.querySelector('.product-finance');
      if (finance) {
        finance.classList.add('is-disabled');
        finance.setAttribute('aria-disabled', 'true');
      }
    }

    options.forEach(function(option) {
      option.setAttribute('role', 'radio');
      option.setAttribute('aria-checked', 'false');
      option.tabIndex = -1;
      option.addEventListener('click', function() {
        select(option, false, true);
      });
      option.addEventListener('keydown', function(e) {
        var current = options.indexOf(option);
        var next = -1;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(option, false, true);
          return;
        }
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

    options[0].tabIndex = 0;
  });
}

function initFinanceLinks() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    var dc = card.querySelector('.dual-capacity');
    if (!dc) return;

    var buy = dc.querySelector('.btn.btn-primary');
    if (!buy) return;

    var link = document.createElement('a');
    link.href = '#calcula-tu-credito';
    link.className = 'product-finance';
    link.textContent = 'Financiar';

    var first = dc.querySelector('.dual-capacity-option');
    var price = first ? optionPrice(first) : 0;
    var hint = dc.querySelector('.buy-hint');
    if (hint) dc.insertBefore(link, hint);
    else dc.appendChild(link);
    link.dataset.amount = String(price || 0);
    link.classList.add('is-disabled');
    link.setAttribute('aria-disabled', 'true');

    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (link.classList.contains('is-disabled')) {
        flashHintIn(card);
        return;
      }
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
        var wasFiltered = child.classList.contains('is-filtered');
        var show = !model || child.dataset.model === model;
        child.classList.toggle('is-filtered', !show);
        if (show && wasFiltered) child.classList.remove('hidden');
      }
    });
    children.forEach(function(child) {
      if (child.classList.contains('model-divider')) {
        var show = !model || dividerHasVisible(child);
        child.classList.toggle('is-filtered', !show);
      }
    });

    var url = window.location.pathname;
    var params = new URLSearchParams(window.location.search);
    if (model) params.set('modelo', model);
    else params.delete('modelo');
    var qs = params.toString();
    history.replaceState(null, '', url + (qs ? '?' + qs : '') + window.location.hash);
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

  var urlModel = new URLSearchParams(window.location.search).get('modelo') || '';
  var defaultBtn = allBtn;
  buttons.forEach(function(b) {
    if (b.textContent === urlModel) defaultBtn = b;
  });
  if (defaultBtn === allBtn) {
    buttons.forEach(function(b) {
      if (b.textContent === 'iPhone 17 Pro Max') defaultBtn = b;
    });
  }
  var defaultModel = defaultBtn === allBtn ? '' : (urlModel || 'iPhone 17 Pro Max');
  apply(defaultModel, defaultBtn);
}