document.addEventListener('DOMContentLoaded', () => {
  // Hashes de sección antiguos (en español) → id actual, para no romper enlaces ya compartidos.
  const legacyHash = {
    '#productos': '#products',
    '#accesorios': '#accessories',
    '#credito': '#credit',
    '#pagos': '#payments',
    '#testimonios': '#reviews',
    '#contacto': '#contact',
  };
  if (legacyHash[window.location.hash]) history.replaceState(null, '', legacyHash[window.location.hash]);

  initHero();
  initScroll();
  initGallery();
  initProducts();
  initCreditCalculator();

  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  const hash = window.location.hash;
  if (hash) {
    const target = document.getElementById(hash.slice(1));
    if (target) {
      const card = target.closest('.product-card');
      setTimeout(() => {
        if (card) {
          card.classList.remove('hidden');
          card.classList.remove('is-filtered');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('anchor-highlight');
          setTimeout(() => card.classList.remove('anchor-highlight'), 3000);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
});