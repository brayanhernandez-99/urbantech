(function() {
  var WA_NUMBER = '573242923238';
  window.openWhatsApp = function(el) {
    var msg = el.getAttribute('message');
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
    return false;
  };
})();
