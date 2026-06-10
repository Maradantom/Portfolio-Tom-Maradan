/* ============================================================
   MAIN.JS — Chargé par toutes les pages du site.
   Rôle :
     1. Injecter le header et le footer partagés
     2. Initialiser l'année du copyright
     3. Comportements globaux (scroll smooth déjà géré par CSS)
   ============================================================ */

/**
 * Charge un fichier HTML partiel et l'injecte dans la cible.
 * Utilisation dans une page :
 *   <div data-include="header"></div>
 *   <div data-include="footer"></div>
 */
async function loadPartial(slotSelector, url) {
  const slot = document.querySelector(slotSelector);
  if (!slot) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur ${res.status} pour ${url}`);
    slot.outerHTML = await res.text();
  } catch (err) {
    console.error('Partial non chargé :', url, err);
  }
}

/**
 * Initialise l'année dans le footer (#footer-year) après injection.
 */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * Affiche la nav fixe au scroll (comportement repris de l'index actuel).
 */
function initFixedNav() {
  const nav = document.getElementById('fixed-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 100) nav.classList.add('visible');
    else nav.classList.remove('visible');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Effet "reveal on scroll" : tout élément avec class="reveal" devient visible
 * en fondu+translation à chaque fois qu'il entre dans le viewport.
 * Décalage automatique pour les enfants d'un conteneur .reveal-group.
 */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Décalage en cascade pour les enfants .reveal d'un même conteneur .reveal-group
  document.querySelectorAll('.reveal-group').forEach(group => {
    group.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's';
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // L'animation se rejoue dans LES DEUX sens (scroll bas ET scroll haut)
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/**
 * Charge TOUS les partials de la page d'un coup, basés sur l'attribut data-include.
 * Permet d'avoir <div data-include="modal-villa-annecy"></div>, etc.
 */
async function loadAllPartials() {
  const slots = document.querySelectorAll('[data-include]');
  const tasks = Array.from(slots).map(slot => {
    const name = slot.dataset.include;
    return loadPartial(`[data-include="${name}"]`, `/partials/${name}.html`);
  });
  await Promise.all(tasks);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllPartials();
  setFooterYear();
  initFixedNav();
  initReveal();
});
