document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
    let targetX = ringX, targetY = ringY;

    window.addEventListener('mousemove', (e) => {
      document.body.classList.add('cursor-active');
      targetX = e.clientX; targetY = e.clientY;
      cursorDot.style.left = `${targetX}px`;
      cursorDot.style.top = `${targetY}px`;
    });

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    const hoverSelector = 'a, button, .btn, .service-card, .why-item, .portfolio-item, .filter-btn, input, select, textarea, .play-btn, .social-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) cursorRing.classList.remove('hovering');
    });
  }

  const header = document.getElementById('header');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  const openMobileMenu = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  });
  document.querySelectorAll('[data-nav-mobile]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const navLinks = document.querySelectorAll('[data-nav], [data-nav-mobile]');
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const currentPage = currentFile.replace(/\.html$/, '') || 'index';
  navLinks.forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\.html$/, '');
    link.classList.toggle('active', href === currentPage);
  });

  const backToTop = document.getElementById('backToTop');
  const toggleBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 500);
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  backToTop.addEventListener('click', scrollTop);
  backToTop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollTop(); }
  });

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  const particleField = document.getElementById('heroParticles');
  if (particleField) {
    const count = window.innerWidth < 700 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 3 + 1.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${Math.random() * 20}%`;
      p.style.animationDuration = `${8 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      particleField.appendChild(p);
    }
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const cats = item.getAttribute('data-cat') || '';
        const match = filter === 'all' || cats.split(' ').includes(filter);
        item.classList.toggle('hidden', !match);
      });
    });
  });

  const visionBg = document.getElementById('visionBg');
  const visionSection = document.querySelector('.vision');
  if (visionBg && visionSection) {
    const onParallax = () => {
      const rect = visionSection.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * 60;
      visionBg.style.transform = `translateY(${offset}px)`;
    };
    onParallax();
    window.addEventListener('scroll', onParallax, { passive: true });
  }

  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    const validators = {
      fName: (v) => v.trim().length > 1,
      fEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      fDetails: (v) => v.trim().length > 4
    };

    const validateField = (input) => {
      const rule = validators[input.id];
      if (!rule) return true;
      const field = input.closest('.field');
      const ok = rule(input.value);
      field.classList.toggle('invalid', !ok);
      return ok;
    };

    Object.keys(validators).forEach(id => {
      const input = document.getElementById(id);
      if (input) input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      Object.keys(validators).forEach(id => {
        const input = document.getElementById(id);
        if (input && !validateField(input)) valid = false;
      });

      if (!valid) {
        formSuccess.classList.remove('show');
        const firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      formSuccess.classList.add('show');
      form.reset();
      document.querySelectorAll('.field.invalid').forEach(f => f.classList.remove('invalid'));

      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    });
  }

});
