window.partialsReady.then(() => {
  // Hashes de sección antiguos (en inglés) → id actual, para no romper enlaces ya compartidos.
  const legacyHash = {
    '#hero': '#inicio',
    '#payments': '#pagos',
    '#reviews': '#resenas',
    '#testimonios': '#resenas',
    '#contact': '#contacto',
    '#offers': '#ofertas',
    '#lineup': '#modelos',
  };
  if (legacyHash[window.location.hash]) history.replaceState(null, '', legacyHash[window.location.hash]);

  initHero();
  initScroll();

  const offers = document.querySelector('.offers-grid');
  document.querySelectorAll('#ofertas .lineup-arrow').forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = offers.firstElementChild.offsetWidth + 20;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      offers.scrollBy({ left: btn.dataset.dir === 'prev' ? -step : step, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  const hash = window.location.hash;
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
  }
});
