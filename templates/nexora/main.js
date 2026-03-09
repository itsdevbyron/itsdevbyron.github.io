/* ═══════════════════════════════════════════════════════════
   Nexora — Dark Theme  ·  main.js  v3
   ═══════════════════════════════════════════════════════════ */

/* ─── Smooth scroll ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Navbar: shadow on scroll ──────────────────────────── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 24 ? '0 4px 40px rgba(0,0,0,.6)' : 'none';
}, { passive: true });

/* ─── Hamburger menu ────────────────────────────────────── */
const hamburger  = document.querySelector('.hamburger');
const navLinks   = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
let menuOpen = false;

if (hamburger) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.setAttribute('aria-expanded', menuOpen);
    const openStyle = 'display:flex;flex-direction:column;position:fixed;top:68px;left:0;right:0;background:#141414;border-top:1px solid rgba(255,255,255,.06);padding:24px 28px;gap:18px;z-index:199;';
    navLinks.style.cssText   = menuOpen ? openStyle : '';
    navActions.style.cssText = menuOpen
      ? 'display:flex;flex-direction:column;position:fixed;top:calc(68px + 140px);left:0;right:0;background:#141414;padding:0 28px 28px;z-index:199;gap:10px;'
      : '';
    // animate hamburger bars
    const bars = hamburger.querySelectorAll('span');
    if (menuOpen) {
      bars[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      bars[1].style.cssText = 'opacity:0';
      bars[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => b.style.cssText = '');
    }
  });
}

/* ─── Hero glow: follow cursor (FIXED) ──────────────────── */
const heroSection = document.querySelector('.hero');
const glow        = document.querySelector('.hero-glow');

if (heroSection && glow) {
  // The glow element is at top:0 left:0, positioned via left/top in JS
  // We set left/top to the cursor pos, then keep transform: translate(-50%,-50%)
  // so the center of the glow is exactly under the cursor.
  glow.style.transform = 'translate(-50%, -35%)'; // default: centered at top

  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.left      = x + 'px';
    glow.style.top       = y + 'px';
    glow.style.transform = 'translate(-50%, -50%)';
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    // Drift back to center-top
    glow.style.left      = '50%';
    glow.style.top       = '0px';
    glow.style.transform = 'translate(-50%, -35%)';
  });
}

/* ─── Scroll-reveal ─────────────────────────────────────── */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease var(--d, 0s), transform 0.6s ease var(--d, 0s);
  }
  .reveal.in { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(revealStyle);

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

[
  '.feature-card',
  '.testimonial-card',
  '.pricing-card',
  '.process-step',
  '.band-stat',
  '.faq-item',
  '.about-badge-float',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', `${i * 0.06}s`);
    revealObs.observe(el);
  });
});

/* ─── Dashboard bar entrance animation ──────────────────── */
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  const bars    = heroVisual.querySelectorAll('.dashboard-bar');
  const targets = Array.from(bars).map(b => b.style.height);
  bars.forEach(b => { b.style.height = '2%'; b.style.transition = 'none'; });

  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.style.transition = `height 0.75s cubic-bezier(.4,0,.2,1)`;
        bar.style.height = targets[i];
      }, i * 50 + 200);
    });
  }, { threshold: 0.4 }).observe(heroVisual);
}

/* ─── Animated number counters (stats band) ─────────────── */
function runCounter(el, target, suffix, prefix = '', duration = 1800) {
  const start = performance.now();
  const tick  = now => {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 4); // ease out quart
    const v = Math.round(target * e);
    el.textContent = prefix + v + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.band-num[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.textContent.startsWith('$') ? '$' : '';
      runCounter(el, target, suffix, prefix);
    });
  });
}, { threshold: 0.5 }).observe(document.querySelector('.stats-band') || document.body);

/* ─── FAQ accordion ─────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-question.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
    });

    // Open clicked (unless it was already open)
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ─── Back to top button ────────────────────────────────── */
const backTop = document.querySelector('.back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Newsletter form ───────────────────────────────────── */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  const input = newsletterForm.querySelector('.newsletter-input');
  const btn   = newsletterForm.querySelector('.newsletter-btn');
  btn.addEventListener('click', () => {
    if (input.value && input.value.includes('@')) {
      btn.textContent = '✓';
      btn.style.background = '#4ADE80';
      btn.style.color = '#111';
      input.value = '';
      input.placeholder = 'You\'re in! ✨';
      setTimeout(() => {
        btn.textContent = '→';
        btn.style.background = '';
        btn.style.color = '';
        input.placeholder = 'your@email.com';
      }, 3000);
    } else {
      input.style.borderColor = '#F87171';
      setTimeout(() => input.style.borderColor = '', 1500);
    }
  });
}

/* ─── Pricing: subtle tilt on hover (desktop) ───────────── */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const rX     = y * -4;
    const rY     = x * 4;
    card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
