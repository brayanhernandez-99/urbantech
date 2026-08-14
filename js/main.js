document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initScroll();
  initGallery();
  initProducts();
  initCreditCalculator();

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