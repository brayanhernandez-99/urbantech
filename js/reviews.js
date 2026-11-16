(function() {
  'use strict';

  var carousel = document.getElementById('reviews-carousel');
  if (!carousel) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rota una lista de elementos marcando `.is-active`; `onShow` recibe el índice visible.
  function cycle(items, ms, onShow) {
    var current = 0;
    var timer = null;

    function show(i) {
      current = (i + items.length) % items.length;
      Array.prototype.forEach.call(items, function(item, n) {
        item.classList.toggle('is-active', n === current);
      });
      if (onShow) onShow(current);
    }

    function stop() {
      clearInterval(timer);
    }

    function start() {
      if (reduce) return;
      stop();
      timer = setInterval(function() { show(current + 1); }, ms);
    }

    show(0);
    start();
    return {
      go: function(i) { show(i); start(); },
      step: function(d) { show(current + d); start(); },
      start: start,
      stop: stop
    };
  }

  // Reseñas: una a la vez, con un punto por reseña.
  var dots = document.createElement('div');
  dots.className = 'review-dots';
  var quotes = cycle(carousel.querySelectorAll('.review-slide'), 5000, function(i) {
    Array.prototype.forEach.call(dots.children, function(dot, n) {
      dot.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
  });
  Array.prototype.forEach.call(carousel.querySelectorAll('.review-slide'), function(slide, n) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Ver reseña ' + (n + 1));
    dot.addEventListener('click', function() { quotes.go(n); });
    dots.appendChild(dot);
  });
  carousel.appendChild(dots);
  dots.children[0].setAttribute('aria-current', 'true');

  // Fotos de clientes: ciclo propio (pueden ser muchas más que las reseñas), con flechas y contador.
  var photoItems = carousel.querySelectorAll('.review-photo');
  var count = carousel.querySelector('.review-photo-count');
  var photos = cycle(photoItems, 5000, function(i) {
    count.textContent = (i + 1) + ' / ' + photoItems.length;
  });
  carousel.querySelector('.review-photo-prev').addEventListener('click', function() { photos.step(-1); });
  carousel.querySelector('.review-photo-next').addEventListener('click', function() { photos.step(1); });

  carousel.addEventListener('mouseenter', function() { quotes.stop(); photos.stop(); });
  carousel.addEventListener('mouseleave', function() { quotes.start(); photos.start(); });
})();
