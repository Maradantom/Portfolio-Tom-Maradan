/* ============================================================
   MODALS.JS — Gère les modales projet + lightbox de l'accueil.
   Chargé sur index.html. Les fonctions sont globales pour rester
   accessibles depuis les onclick="openModal('modalN')" inline.
   ============================================================ */

/* ----- ÉTAT ----- */
const slideIndices = { 1: 0, 2: 0, 3: 0 };
let scrollY = 0;

/* ----- CARROUSEL DES MODALES ----- */
function changeSlide(n, id) {
  const slides = document.querySelectorAll(`.carousel-image.c${id}`);
  if (!slides.length) return;
  slideIndices[id] = (slideIndices[id] + n + slides.length) % slides.length;
  slides.forEach((img, i) => img.classList.toggle('active', i === slideIndices[id]));
}

/* ----- OUVRIR / FERMER UNE MODALE PROJET ----- */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) { console.warn('Modale introuvable :', id); return; }
  scrollY = window.scrollY;
  document.body.style.setProperty('--scroll-y', `-${scrollY}px`);
  el.style.display = 'block';
  document.body.classList.add('modal-open');
  const num = id.replace('modal', '');
  slideIndices[num] = 0;
  changeSlide(0, num);
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  document.body.classList.remove('modal-open');
  window.scrollTo(0, scrollY);
}

/* ----- LIGHTBOX (modal1 = projet villa) ----- */
let lightboxImages = [];   // rempli dynamiquement depuis le DOM au 1er clic
let currentLightboxIndex = 0;
function refreshLightbox1() {
  lightboxImages = Array.from(document.querySelectorAll('#modal1 [onclick^="openLightbox1"]'))
    .map(img => img.getAttribute('src'));
}
function openLightbox(index) {
  if (!lightboxImages.length) refreshLightbox1();
  if (!document.body.classList.contains('modal-open')) {
    scrollY = window.scrollY;
    document.body.style.setProperty('--scroll-y', `-${scrollY}px`);
  }
  currentLightboxIndex = index;
  const img = document.getElementById('lightbox-img');
  if (img && lightboxImages[index]) img.src = lightboxImages[index];
  const lb = document.getElementById('lightbox');
  if (lb) lb.style.display = 'flex';
  document.body.classList.add('modal-open');
}
function changeLightboxImage(direction) {
  if (!lightboxImages.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  const img = document.getElementById('lightbox-img');
  if (img) img.src = lightboxImages[currentLightboxIndex];
}
function closeLightbox(event) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  if (!event || event.target === lb || event.target.closest('.close-lightbox')) {
    lb.style.display = 'none';
    // Ne libérer le body que si plus aucune modale n'est ouverte (sinon on remet en haut de page)
    if (!document.querySelector('.modal[style*="block"]')) {
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    }
  }
}

/* ----- LIGHTBOX 1 (modal1 = villa annecy) ----- */
function openLightbox1(index) { openLightbox(index); }
function changeLightboxImage1(direction) { changeLightboxImage(direction); }
function closeLightbox1(event) { closeLightbox(event); }

/* ----- LIGHTBOX 2 (modal2 = showroom) — recense automatiquement les images cliquables ----- */
let lightboxImages2 = [];
let currentLightboxIndex2 = 0;
function refreshLightbox2() {
  lightboxImages2 = Array.from(document.querySelectorAll('#modal2 [onclick^="openLightbox2"]'))
    .map(img => img.getAttribute('src'));
}
function openLightbox2(index) {
  if (!lightboxImages2.length) refreshLightbox2();
  if (!document.body.classList.contains('modal-open')) {
    scrollY = window.scrollY;
    document.body.style.setProperty('--scroll-y', `-${scrollY}px`);
  }
  currentLightboxIndex2 = index;
  const img = document.getElementById('lightbox2-img');
  if (img && lightboxImages2[index]) img.src = lightboxImages2[index];
  const lb = document.getElementById('lightbox2');
  if (lb) lb.style.display = 'flex';
  document.body.classList.add('modal-open');
}
function changeLightboxImage2(direction) {
  if (!lightboxImages2.length) return;
  currentLightboxIndex2 = (currentLightboxIndex2 + direction + lightboxImages2.length) % lightboxImages2.length;
  const img = document.getElementById('lightbox2-img');
  if (img) img.src = lightboxImages2[currentLightboxIndex2];
}
function closeLightbox2(event) {
  const lb = document.getElementById('lightbox2');
  if (!lb) return;
  if (!event || event.target === lb || event.target.closest('.close-lightbox')) {
    lb.style.display = 'none';
    if (!document.querySelector('.modal[style*="block"]')) {
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    }
  }
}

/* ----- LIGHTBOX 3 (modal3 = présentation) ----- */
const lightboxImages3 = [
  '/photoprojet/8-projet-presentation-2025/3D/Scène 7-1-C05.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 7-2-C03.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 7-3-C03.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 1.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 2.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 3.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 4.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 6.webp',
  '/photoprojet/8-projet-presentation-2025/3D/Scène 10.webp',
];
let currentLightboxIndex3 = 0;
function openLightbox3(index) {
  if (!document.body.classList.contains('modal-open')) {
    scrollY = window.scrollY;
    document.body.style.setProperty('--scroll-y', `-${scrollY}px`);
  }
  currentLightboxIndex3 = index;
  const img = document.getElementById('lightbox3-img');
  if (img) img.src = lightboxImages3[index];
  const lb = document.getElementById('lightbox3');
  if (lb) lb.style.display = 'flex';
  document.body.classList.add('modal-open');
}
function changeLightboxImage3(direction) {
  currentLightboxIndex3 = (currentLightboxIndex3 + direction + lightboxImages3.length) % lightboxImages3.length;
  const img = document.getElementById('lightbox3-img');
  if (img) img.src = lightboxImages3[currentLightboxIndex3];
}
function closeLightbox3(event) {
  const lb = document.getElementById('lightbox3');
  if (!lb) return;
  if (!event || event.target === lb || event.target.closest('.close-lightbox')) {
    lb.style.display = 'none';
    if (!document.querySelector('.modal[style*="block"]')) {
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    }
  }
}

/* ----- ÉCOUTEURS GLOBAUX (clic fond + Échap) ----- */
document.addEventListener('click', (event) => {
  // Clic sur le fond d'une modale => ferme
  if (event.target.classList && event.target.classList.contains('modal')) {
    closeModal(event.target.id);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  // Si une lightbox est ouverte, on ferme la lightbox en premier (sans toucher au scroll si une modale reste ouverte)
  const openLightbox = Array.from(document.querySelectorAll('.lightbox')).find(lb => lb.style.display === 'flex');
  if (openLightbox) {
    openLightbox.style.display = 'none';
    if (!document.querySelector('.modal[style*="block"]')) {
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    }
    return;
  }
  // Sinon on ferme la modale ouverte
  document.querySelectorAll('.modal').forEach(m => {
    if (m.style.display === 'block') closeModal(m.id);
  });
});
