/* =========================================================
   StudioTM V3 — WOW animations JS
   Chargé uniquement sur la home V3
   ========================================================= */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // ---------- SPLIT TEXT ----------
  const splitElement = (el) => {
    // Récupère le texte brut (déjà traduit)
    const raw = el.textContent.trim();
    el.innerHTML = '';
    // Retire le "in" pour rejouer l'animation si re-split
    el.classList.remove('in');
    raw.split(/(\s+)/).forEach(word => {
      if (/^\s+$/.test(word)) {
        const s = document.createElement('span');
        s.className = 'split-space';
        el.appendChild(s);
        return;
      }
      const w = document.createElement('span');
      w.className = 'split-word';
      word.split('').forEach(ch => {
        const c = document.createElement('span');
        c.className = 'split-char';
        c.textContent = ch;
        w.appendChild(c);
      });
      el.appendChild(w);
    });
  };
  const doSplitAll = () => document.querySelectorAll('.split').forEach(splitElement);
  doSplitAll();
  // Rejoue le split + reveal quand la langue change
  document.addEventListener('stm:i18n-applied', () => {
    doSplitAll();
    // Re-marque les .split visibles comme "in" pour éviter le vide
    document.querySelectorAll('.split').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        requestAnimationFrame(() => el.classList.add('in'));
      }
    });
  });

  // ---------- REVEAL (split + stagger) ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.split, .stagger').forEach(el => io.observe(el));

  // ---------- COUNTER ANIMATION ----------
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const raw = (el.dataset.count || el.textContent).trim();
    const m = raw.match(/^(\d+)([+%]*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || '';
    const duration = 1600;
    const start = performance.now();
    el.textContent = '0' + suffix;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const val = Math.round(easeOut(t) * target);
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.count').forEach(el => countIO.observe(el));

  // ---------- PARALLAX ----------
  const parallaxEls = document.querySelectorAll('.parallax');
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        parallaxEls.forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const speed = parseFloat(el.dataset.speed || '0.15');
          // Progression de -1 (haut de l'écran) à +1 (bas)
          const center = r.top + r.height / 2;
          const prog = (center - vh / 2) / vh;
          el.style.transform = `translate3d(0, ${prog * speed * 100}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  };
  if (parallaxEls.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- HERO SCROLL-LINKED ----------
  const hero = document.querySelector('.hero');
  const heroInner = document.querySelector('.hero-inner');
  const heroSlides = document.querySelector('.hero-slides');
  if (hero && heroInner && heroSlides) {
    let heroTicking = false;
    const heroScroll = () => {
      if (!heroTicking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          const h = hero.offsetHeight;
          const prog = Math.min(1, y / h);
          // Contenu qui remonte + s'estompe
          heroInner.style.transform = `translate3d(0, ${-prog * 40}px, 0)`;
          heroInner.style.opacity = String(1 - prog * 1.2);
          // Fond qui s'agrandit lentement
          heroSlides.style.transform = `scale(${1 + prog * 0.06})`;
          heroTicking = false;
        });
        heroTicking = true;
      }
    };
    window.addEventListener('scroll', heroScroll, { passive: true });
    heroScroll();
  }

  // ---------- CURTAIN REVEAL (rideau qui découvre la section) ----------
  document.querySelectorAll('.curtain').forEach(curtain => {
    const parent = curtain.parentElement;
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          curtain.classList.add('done');
          cio.unobserve(parent);
        }
      });
    }, { threshold: 0.15 });
    cio.observe(parent);
  });

})();
