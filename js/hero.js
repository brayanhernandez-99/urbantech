export function initHero() {
  const hero = document.querySelector('.hero');
  const phone1 = document.querySelector('.hero-phone-1');
  const phone2 = document.querySelector('.hero-phone-2');

  if (!hero || !phone1) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    requestAnimationFrame(() => {
      phone1.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      if (phone2) {
        phone2.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
      }
    });
  });

  hero.addEventListener('mouseleave', () => {
    phone1.style.transition = 'transform 0.6s ease-out';
    phone1.style.transform = '';
    if (phone2) {
      phone2.style.transition = 'transform 0.6s ease-out';
      phone2.style.transform = '';
    }
    setTimeout(() => {
      phone1.style.transition = '';
      if (phone2) phone2.style.transition = '';
    }, 700);
  });
}
