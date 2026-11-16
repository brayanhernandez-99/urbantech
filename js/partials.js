// Sustituye cada <div data-include="ruta"> por el HTML de ese fragmento.
// window.partialsReady se resuelve cuando todos están en el DOM (main.js espera por él);
// si un fragmento falla, la página sigue funcionando sin él.
window.partialsReady = Promise.all(Array.prototype.map.call(document.querySelectorAll('[data-include]'), function(slot) {
  return fetch(slot.getAttribute('data-include'))
    .then(function(res) { return res.ok ? res.text() : Promise.reject(); })
    .then(function(html) { slot.outerHTML = html; })
    .catch(function() {});
})).then(function() {
  var year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
});
