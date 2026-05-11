/* ============================================================
   STUDENT PORTFOLIO — script.js
   ============================================================ */

/* ── 1. Navbar: shrink on scroll + active link highlight ── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Shrink navbar
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Highlight active section link
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ── 2. Mobile hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ── 3. Scroll-reveal for sections ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    // Animate skill bars inside this element
    const fills = entry.target.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
      const pct = fill.closest('.skill-item').dataset.skill;
      fill.style.width = pct + '%';
    });
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. Timeline stagger animation ── */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), i * 200);
    });
    timelineObserver.disconnect();
  });
}, { threshold: 0.2 });

const timeline = document.querySelector('.timeline');
if (timeline) timelineObserver.observe(timeline);

/* ── 5. Hero stat counter animation ── */
function animateCounter(el, target, duration = 1500) {
  let current = 0;
  const increment = Math.ceil(target / (duration / 30));

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('[data-count]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.count, 10));
    });
    statsObserver.disconnect();
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ── 6. Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 8. Project card: ripple on click ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', function (e) {
    // Only ripple if not clicking a link
    if (e.target.tagName === 'A') return;

    const ripple = document.createElement('span');
    const rect   = card.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      background: rgba(232,201,126,0.12);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out forwards;
      pointer-events: none;
    `;

    // Inject keyframes once
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes rippleEffect {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ── 9. Typing effect in hero description ── */
(function typingEffect() {
  const desc = document.querySelector('.hero-typing');
  if (!desc) return;

  const roles = [
    'building full-stack web apps.',
    'solving real-world problems.',
    'learning new technologies.',
    
  ];

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const base   = 'Software Engineering student at the University of Bedfordshire, ';

  function tick() {
    const role    = roles[roleIdx];
    const current = deleting
      ? role.slice(0, charIdx--)
      : role.slice(0, charIdx++);

    desc.textContent = base + current;

    let delay = deleting ? 40 : 70;

    if (!deleting && charIdx > role.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      charIdx  = 0;
      roleIdx  = (roleIdx + 1) % roles.length;
      delay    = 400;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1800);
})();
