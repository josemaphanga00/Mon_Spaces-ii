const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// CSS entrances are opt-in so the document remains fully visible without JS.
if (!motionQuery.matches) document.documentElement.classList.add('motion-ready');

function setMenuOpen(isOpen) {
  if (!menuBtn || !mobileMenu) return;
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    setMenuOpen(menuBtn.getAttribute('aria-expanded') !== 'true');
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      setMenuOpen(false);
      const target = new URL(a.href, window.location.href);
      if (target.pathname === window.location.pathname && target.hash) menuBtn.focus();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenuOpen(false);
      menuBtn.focus();
    }
  });
}

// Mark the current document link without turning in-page links into false active states.
const currentPath = window.location.pathname.replace(/\/$/, '/index.html');
document.querySelectorAll('.nav-links a, .mobile-menu-inner a').forEach(link => {
  const target = new URL(link.href, window.location.href);
  if (target.origin === window.location.origin && target.pathname === currentPath && !target.hash) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

// Reveal supporting content as it enters the viewport. Without observer support,
// or when reduced motion is requested, content stays visible without animation.
const reduceMotion = motionQuery.matches;
const revealItems = document.querySelectorAll('.section-head, .featured-item, .process-step, .split, .testimonial-card, .gallery-item, .item-card, .form-section, .stats-row, .service-detail-card, .service-faq details, .planning-toc, .planning-article section, .planning-next-step, .cta-band .container, .footer-grid, .footer-bottom');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -48px 0px' });

  revealItems.forEach(item => {
    item.classList.add('scroll-reveal');
    const siblings = item.parentElement ? [...item.parentElement.children].filter(child => child.matches('.scroll-reveal')) : [];
    item.style.setProperty('--reveal-delay', `${Math.min(siblings.length - 1, 3) * 55}ms`);
    revealObserver.observe(item);
    item.addEventListener('focusin', () => {
      item.classList.add('is-visible');
      revealObserver.unobserve(item);
    }, { once: true });
  });
}

// Keep an open mobile menu in sync when the viewport crosses the desktop breakpoint.
const desktopQuery = window.matchMedia('(min-width: 861px)');
desktopQuery.addEventListener?.('change', event => {
  if (event.matches && mobileMenu?.classList.contains('open')) setMenuOpen(false);
});
