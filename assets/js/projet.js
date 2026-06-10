/* ============================================================
   PROJET.JS — Comportements communs aux pages de projet.

   Fournit :
     - Effet parallaxe sur .parallax-bg
     - Lightbox AUTOMATIQUE : il suffit d'ajouter l'attribut
       data-lightbox="nom-du-groupe" sur les <img> à rendre cliquables.
       Toutes les images du même groupe naviguent ensemble.
   ============================================================ */

/* ----- PARALLAXE ----- */
function initParallax() {
  const bg = document.querySelector('.parallax-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }, { passive: true });
}

/* ----- LIGHTBOX ----- */
function initLightbox() {
  const images = Array.from(document.querySelectorAll('img[data-lightbox]'));
  if (!images.length) return;

  // On groupe les images par data-lightbox
  const groups = {};
  images.forEach((img, idx) => {
    const group = img.dataset.lightbox;
    if (!groups[group]) groups[group] = [];
    groups[group].push(img);
    img.dataset.lightboxIndex = String(groups[group].length - 1);
  });

  // Création du lightbox unique
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <span class="close-lightbox" aria-label="Fermer">
      <svg viewBox="0 0 24 24"><path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </span>
    <button class="lightbox-nav prev" aria-label="Précédent">
      <svg viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
    <img class="lightbox-img" src="" alt="">
    <button class="lightbox-nav next" aria-label="Suivant">
      <svg viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lightbox-img');
  const btnPrev = lb.querySelector('.lightbox-nav.prev');
  const btnNext = lb.querySelector('.lightbox-nav.next');
  const btnClose = lb.querySelector('.close-lightbox');

  let currentGroup = [];
  let currentIndex = 0;

  function open(group, index) {
    currentGroup = groups[group] || [];
    currentIndex = index;
    show();
    lb.style.display = 'flex';
  }
  function show() {
    const img = currentGroup[currentIndex];
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
  }
  function next(delta) {
    if (!currentGroup.length) return;
    currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length;
    show();
  }
  function close() { lb.style.display = 'none'; }

  images.forEach((img) => {
    img.addEventListener('click', () => {
      open(img.dataset.lightbox, Number(img.dataset.lightboxIndex));
    });
  });

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); next(-1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); next(1); });
  btnClose.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.style.display !== 'flex') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') next(-1);
    if (e.key === 'ArrowRight') next(1);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initLightbox();
});
