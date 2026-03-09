/* ═══════════════════════════════════════════════════════════
   devbyron — Portfolio  ·  main.js
   ═══════════════════════════════════════════════════════════ */

/* ─── Navbar: shadow on scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── Hero glow: follow cursor ─── */
const hero = document.querySelector('.hero');
const glow = document.getElementById('heroGlow');

if (hero && glow) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top)  + 'px';
    glow.style.transform = 'translate(-50%, -50%)';
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    glow.style.left      = '50%';
    glow.style.top       = '0px';
    glow.style.transform = 'translate(-50%, -38%)';
  });
}

/* ─── Scroll reveal ─── */
const revealEls = document.querySelectorAll(
  '.template-card, .about-inner, .section-header, .hero-stat, .about-orb'
);

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--d', `${i * 0.08}s`);
  revealObs.observe(el);
});

/* ─── Hamburger menu ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navSocial = document.getElementById('navSocial');
let menuOpen = false;

if (hamburger) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.setAttribute('aria-expanded', menuOpen);
    const bars = hamburger.querySelectorAll('span');

    if (menuOpen) {
      bars[0].style.cssText = 'transform: translateY(7px) rotate(45deg)';
      bars[1].style.cssText = 'opacity: 0';
      bars[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg)';

      const baseStyle = `
        display: flex; flex-direction: column;
        position: fixed; top: ${navbar.offsetHeight}px; left: 0; right: 0;
        background: #0e0e0e; border-top: 1px solid rgba(255,255,255,.06);
        padding: 20px 28px; gap: 16px; z-index: 199;
      `;
      navLinks.style.cssText = baseStyle;
      navSocial.style.cssText = baseStyle + `
        top: ${navbar.offsetHeight + 130}px;
        flex-direction: row; align-items: center; padding-top: 0;
        border-top: none; gap: 16px;
      `;
    } else {
      bars.forEach(b => b.style.cssText = '');
      navLinks.style.cssText  = '';
      navSocial.style.cssText = '';
    }
  });

  /* Close menu on nav link click */
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (!menuOpen) return;
      menuOpen = false;
      hamburger.setAttribute('aria-expanded', false);
      hamburger.querySelectorAll('span').forEach(b => b.style.cssText = '');
      navLinks.style.cssText  = '';
      navSocial.style.cssText = '';
    });
  });
}

/* ─── Preview Modal ─── */
const modal      = document.getElementById('previewModal');
const frame      = document.getElementById('previewFrame');
const modalTitle = document.getElementById('modalTitle');
const modalClose = document.getElementById('modalClose');
const modalOpen  = document.getElementById('modalOpenBtn');

function openPreview(url, name) {
  frame.src        = url;
  modalTitle.textContent = name;
  modalOpen.href   = url;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { frame.src = 'about:blank'; }, 300);
}

if (modalClose) modalClose.addEventListener('click', closePreview);
if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) closePreview();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closePreview();
});

/* ─── Smooth scroll offset for fixed navbar ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 24;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});
