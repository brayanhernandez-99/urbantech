(function() {
  'use strict';

  var CREDIT_ENTITIES = [
    { name: 'Banco de Bogotá', divisor: 0.85 },
    { name: 'ADDI', divisor: 0.77 },
    { name: 'Sistecrédito', divisor: 0.70 }
  ];

  var MAX_LENGTH = 12;

  function groupDigits(value) {
    var rounded = Math.round(value);
    var sign = rounded < 0 ? '-' : '';
    var digits = String(Math.abs(rounded));
    var buffer = '';
    for (var i = 0; i < digits.length; i++) {
      if (i > 0 && (digits.length - i) % 3 === 0) {
        buffer += '.';
      }
      buffer += digits[i];
    }
    return sign + buffer;
  }

  function formatCOP(value) {
    var grouped = groupDigits(value);
    return grouped.charAt(0) === '-' ? '-$' + grouped.slice(1) : '$' + grouped;
  }

  function calculate(cashValue) {
    return CREDIT_ENTITIES.map(function(entity) {
      var calculated = cashValue / entity.divisor;
      var additional = calculated - cashValue;
      return {
        name: entity.name,
        divisor: entity.divisor,
        additionalValue: additional,
        totalValue: cashValue + additional
      };
    });
  }

  function validate(value) {
    if (value === null || value === undefined) {
      return 'Ingresa el valor.';
    }
    if (value <= 0) {
      return 'El valor debe ser mayor a cero.';
    }
    return null;
  }

  function buildResultCard(result, cashValue) {
    var card = document.createElement('div');
    card.className = 'credit-result-card';

    var name = document.createElement('h4');
    name.className = 'credit-result-name';
    name.textContent = result.name;

    var interest = document.createElement('p');
    interest.className = 'credit-result-interest';
    interest.textContent = 'interés (' + result.divisor.toFixed(2) + '%)';

    var amount = document.createElement('p');
    amount.className = 'credit-result-amount';
    amount.textContent = formatCOP(result.additionalValue);

    var divider = document.createElement('div');
    divider.className = 'credit-result-divider';

    var total = document.createElement('div');
    total.className = 'credit-result-total';

    var totalLabel = document.createElement('span');
    totalLabel.className = 'credit-result-total-label';
    totalLabel.textContent = 'TOTAL';

    var totalAmount = document.createElement('span');
    totalAmount.className = 'credit-result-total-amount';
    totalAmount.textContent = formatCOP(result.totalValue);

    total.appendChild(totalLabel);
    total.appendChild(totalAmount);

    var cta = document.createElement('a');
    cta.href = '#';
    cta.className = 'btn btn-primary';
    cta.textContent = 'Quiero este crédito';
    var message = 'Hola! quiero financiar ' + formatCOP(cashValue) +
      ' con ' + result.name +
      ' (total aproximado ' + formatCOP(result.totalValue) + ').';
    cta.setAttribute('message', message);
    cta.addEventListener('click', function(e) {
      e.preventDefault();
      window.openWhatsApp(cta);
    });

    card.appendChild(name);
    card.appendChild(interest);
    card.appendChild(amount);
    card.appendChild(divider);
    card.appendChild(total);
    card.appendChild(cta);

    return card;
  }

  function renderResults(cashValue) {
    var container = document.getElementById('credit-results');
    if (!container) return;

    container.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'credit-results-grid';

    calculate(cashValue).forEach(function(result) {
      grid.appendChild(buildResultCard(result, cashValue));
    });

    container.appendChild(grid);
  }

  function renderPlaceholder() {
    var container = document.getElementById('credit-results');
    if (!container) return;

    container.innerHTML = '';
    var placeholder = document.createElement('p');
    placeholder.className = 'credit-results-placeholder';
    placeholder.textContent = 'Ingresa el valor para ver las opciones de financiación.';
    container.appendChild(placeholder);
  }

  function initCreditCalculator() {
    var input = document.getElementById('credit-amount');
    var errorEl = document.getElementById('credit-error');
    if (!input || !errorEl) return;

    renderPlaceholder();

    input.addEventListener('input', function() {
      var digits = input.value.replace(/[^\d]/g, '').slice(0, MAX_LENGTH);
      var value = digits === '' ? null : parseInt(digits, 10);
      var error = validate(value);

      var formatted = value === null ? '' : groupDigits(value);
      if (input.value !== formatted) {
        input.value = formatted;
      }

      errorEl.textContent = error || '';

      if (error === null) {
        renderResults(value);
      } else {
        renderPlaceholder();
      }
    });
  }

  window.initCreditCalculator = initCreditCalculator;
})();
