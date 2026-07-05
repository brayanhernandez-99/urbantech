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
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
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

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initScrollSpy() {
  const NAV_HEIGHT = 72;
  const sections = document.querySelectorAll('section[id]');
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
    if (current) setActive(current);
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
}
