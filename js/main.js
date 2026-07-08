document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initScroll();
  initGallery();

  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const card = target.closest('.product-card') || target;
      card.classList.remove('hidden');
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('anchor-highlight');
        setTimeout(() => card.classList.remove('anchor-highlight'), 3000);
      }, 100);
    }
  }
});
