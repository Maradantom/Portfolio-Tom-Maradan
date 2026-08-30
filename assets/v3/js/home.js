/* =========================================================
   StudioTM V3 — Home JS
   ========================================================= */
(function () {
  'use strict';

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader')?.classList.add('done'), 400);
  });

  // ---------- Header scroll ----------
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Burger mobile ----------
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.header-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('mobile-open');
      document.body.style.overflow = burger.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('mobile-open');
      document.body.style.overflow = '';
    }));
  }

  // ---------- Curseur custom ----------
  const isHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isHover) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`; });
    const animate = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(animate);
    };
    animate();
    document.querySelectorAll('a, button, .service-item, .step, .about-photo').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('.project-card, .hero, .news-visual').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-image'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-image'));
    });
  }

  // ---------- Hero carousel ----------
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 5500);
  }

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Process toggle ----------
  const toggleWrap = document.querySelector('.process-toggle');
  if (toggleWrap) {
    const buttons = toggleWrap.querySelectorAll('button');
    const steps = document.querySelectorAll('.process-steps .step');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        toggleWrap.dataset.mode = mode;
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        steps.forEach(step => {
          const label = step.querySelector('h4');
          const desc = step.querySelector('p');
          label.textContent = step.dataset[mode + 'Title'] || label.textContent;
          desc.textContent = step.dataset[mode + 'Desc'] || desc.textContent;
        });
      });
    });
  }

  // ---------- Float contact ----------
  const floatBtn = document.querySelector('.float-contact');
  const floatTrigger = document.querySelector('.float-contact-trigger');
  if (floatTrigger && floatBtn) {
    floatTrigger.addEventListener('click', () => floatBtn.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!floatBtn.contains(e.target)) floatBtn.classList.remove('open');
    });
  }

  // ---------- Cookie banner ----------
  const banner = document.getElementById('cookie-banner');
  if (banner && !localStorage.getItem('stm_cookies_v1')) {
    setTimeout(() => banner.classList.add('show'), 1500);
    banner.querySelector('.accept').addEventListener('click', () => {
      localStorage.setItem('stm_cookies_v1', 'accepted');
      banner.classList.remove('show');
    });
    banner.querySelector('.decline').addEventListener('click', () => {
      localStorage.setItem('stm_cookies_v1', 'declined');
      banner.classList.remove('show');
    });
  }

  // ---------- Lang toggle (placeholder — vraies traductions à venir) ----------
  const langButtons = document.querySelectorAll('.lang-toggle button');
  langButtons.forEach(b => b.addEventListener('click', () => {
    langButtons.forEach(x => x.classList.toggle('active', x === b));
    // TODO: appliquer les traductions
  }));

})();
