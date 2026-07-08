document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initScroll();
  initGallery();

  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      target.classList.remove('hidden');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('anchor-highlight');
        setTimeout(() => target.classList.remove('anchor-highlight'), 3000);
      }, 100);
    }
  }
});
