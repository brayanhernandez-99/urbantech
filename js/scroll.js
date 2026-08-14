function initScroll() {
  const revealElements = document.querySelectorAll('.reveal');

  revealElements.forEach((el) => el.classList.add('hidden'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute('href');
    // WhatsApp CTAs usan href="#" y JS construye la URL de wa.me
    if (!href || href === '#') return;
    // El enlace "Financiar" gestiona su propio scroll/pushState (products.js)
    if (anchor.classList.contains('product-finance')) return;
    // El skip-link debe usar el salto nativo (mueve el foco al destino)
    if (anchor.classList.contains('skip-link')) return;
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    });
  });

  initMobileToggle();
  initScrollSpy();
}

function initMobileToggle() {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setMenu(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (links.contains(e.target) || toggle.contains(e.target)) return;
    setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
    }
  });
}

function initScrollSpy() {
  const NAV_HEIGHT = 72;
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const footer = document.querySelector('footer[id]');
  if (footer) sections.push(footer);
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${id}`);
    });
  }

  function update() {
    const scrollY = window.scrollY + NAV_HEIGHT;
    let current = '';
    for (const section of sections) {
      if (scrollY >= section.offsetTop) current = section.id;
    }
    setActive(current);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}
