/* Navigation commune des sous-pages : burger mobile + header au scroll */
(function () {
  'use strict';
  const header = document.querySelector('.site-header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.header-nav');
  if (!header) return;

  if (burger && nav) {
    const close = () => {
      burger.classList.remove('open');
      nav.classList.remove('mobile-open');
      header.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () => {
      const open = !burger.classList.contains('open');
      burger.classList.toggle('open', open);
      nav.classList.toggle('mobile-open', open);
      header.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // Header clair sur image (pages projet) : passe en blanc une fois le hero dépassé
  if (header.classList.contains('header-light')) {
    const hero = document.getElementById('pinHero');
    const onScroll = () => {
      const limit = hero ? hero.offsetHeight - header.offsetHeight : 40;
      header.classList.toggle('scrolled', window.scrollY > limit);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
})();
