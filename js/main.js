import { initHero } from './hero.js';
import { initScroll } from './scroll.js';
import { whatsappLink } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initScroll();
  initWhatsApp();
  initBackToTop();
});

function initWhatsApp() {
  document.querySelectorAll('[message-whatsapp]').forEach((el) => {
    el.setAttribute('href', whatsappLink(el.getAttribute('message-whatsapp')));
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
