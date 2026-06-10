/* ============================================================
   PROJET.JS — Comportements partagés par les pages /projetdetail/*

   Chaque page définit son tableau d'images via :
   <script>const lightboxImages1 = [ "url1", "url2", … ];</script>
   ============================================================ */

/* ----- PARALLAXE sur la hero ----- */
window.addEventListener('scroll', function () {
  const bg = document.querySelector('.parallax-bg');
  if (!bg) return;
  const scrollY = window.scrollY;
  bg.style.transform = `translateY(${scrollY * 0.4}px)`;
}, { passive: true });

/* ----- LIGHTBOX 1 (galerie principale du projet) ----- */
let currentLightboxIndex1 = 0;

function openLightbox1(index) {
  if (typeof lightboxImages1 === 'undefined') return;
  currentLightboxIndex1 = index;
  const img = document.getElementById('lightbox1-img');
  const lb = document.getElementById('lightbox1');
  if (img) img.src = lightboxImages1[index];
  if (lb) lb.style.display = 'flex';
  document.body.classList.add('modal-open');
}

function changeLightboxImage1(direction) {
  if (typeof lightboxImages1 === 'undefined' || !lightboxImages1.length) return;
  currentLightboxIndex1 = (currentLightboxIndex1 + direction + lightboxImages1.length) % lightboxImages1.length;
  const img = document.getElementById('lightbox1-img');
  if (img) img.src = lightboxImages1[currentLightboxIndex1];
}

function closeLightbox1(event) {
  const lb = document.getElementById('lightbox1');
  if (!lb) return;
  if (!event || event.target === lb || event.target.closest('.close-lightbox')) {
    lb.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}

/* Ferme la lightbox avec Échap */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox1();
});
