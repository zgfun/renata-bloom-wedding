/* main.js — Renata Bloom Esküvőszervező */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Sticky Header ─── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const scrollThreshold = 60;
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > scrollThreshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 2. Hamburger Menu ─── */
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');
  if (hamburger && overlay) {
    const toggleMenu = () => {
      const isOpen = hamburger.classList.toggle('nav__hamburger--open');
      overlay.classList.toggle('nav__overlay--open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    };
    hamburger.addEventListener('click', toggleMenu);
    overlay.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('nav__hamburger--open');
        overlay.classList.remove('nav__overlay--open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ─── 3. Intersection Observer — Fade Up ─── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up--visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  /* ─── 4. Counter Animation ─── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOutCubic(progress) * target);
        el.textContent = value + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ─── 5. Form Validation + Success ─── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('form-group--invalid');
      });

      form.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('form-group--invalid');
          valid = false;
        }
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            group.classList.add('form-group--invalid');
            valid = false;
          }
        }
      });

      if (valid) {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      }
    });
  }

  /* ─── 6. Active Nav Link ─── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* ─── 7. Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
