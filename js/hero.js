export function initHero() {
  const hero = document.querySelector('.hero');
  const phone = document.querySelector('.hero-phone');

  if (!hero || !phone) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    requestAnimationFrame(() => {
      phone.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    phone.style.transition = 'transform 0.6s ease-out';
    phone.style.transform = '';
    setTimeout(() => {
      phone.style.transition = '';
    }, 700);
  });
}
