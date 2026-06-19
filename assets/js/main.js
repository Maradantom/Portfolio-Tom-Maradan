/* ============================================================
   MAIN.JS — Chargé par toutes les pages du site.
   Rôle :
     1. Injecter le header et le footer partagés
     2. Initialiser l'année du copyright
     3. Comportements globaux (scroll smooth déjà géré par CSS)
   ============================================================ */

/**
 * Charge un fichier HTML partiel et l'injecte dans la cible.
 * Les balises <script> trouvées dans le partial sont RÉ-EXÉCUTÉES après injection
 * (sinon les fonctions/handlers qu'elles définissent ne seraient pas dispos).
 */
async function loadPartial(slotSelector, url) {
  const slot = document.querySelector(slotSelector);
  if (!slot) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur ${res.status} pour ${url}`);
    let html = await res.text();

    // 1) Extraire les scripts du HTML brut (regex) AVANT toute insertion
    //    On capture le contenu exact (caractères bruts, pas de decoding HTML)
    const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
    const scripts = [];
    html = html.replace(scriptRe, (match, attrs, content) => {
      scripts.push({ attrs, content });
      return ''; // on retire les <script> du HTML
    });

    // 2) Injecter le HTML restant à la place du slot
    const parent = slot.parentNode;
    const ref = slot.nextSibling;
    parent.removeChild(slot);
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    parent.insertBefore(tpl.content, ref);

    // 3) Ré-injecter chaque script en créant un nouvel élément (qui s'exécute)
    for (const { attrs, content } of scripts) {
      const s = document.createElement('script');
      // Reconstitue les attributs (src=, type=, etc.)
      const attrRe = /([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
      let m;
      while ((m = attrRe.exec(attrs))) {
        const name = m[1];
        const val = m[2] ?? m[3] ?? m[4] ?? '';
        s.setAttribute(name, val);
      }
      s.text = content; // .text = setter qui marche pour les scripts inline
      document.body.appendChild(s);
    }
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

/**
 * Anti-copie léger : décourage les copieurs paresseux.
 * N'empêche PAS la sélection de texte (donc l'email/tél restent copiables).
 * N'empêche pas un dev déterminé d'accéder au code (impossible côté front).
 */
function initAntiCopy() {
  // 1. Désactive le menu contextuel (clic droit)
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 2. Bloque F12, Ctrl/Cmd+U, Ctrl/Cmd+Shift+I, Ctrl/Cmd+Shift+J, Ctrl/Cmd+Shift+C
  document.addEventListener('keydown', e => {
    const k = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    if (
      k === 'F12' ||
      (ctrl && k.toLowerCase() === 'u') ||
      (ctrl && e.shiftKey && ['I','J','C'].includes(k.toUpperCase()))
    ) {
      e.preventDefault();
    }
  });

  // 3. Empêche le glisser-déposer des images (sauvegarde rapide)
  document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllPartials();
  setFooterYear();
  initFixedNav();
  initReveal();
  initAntiCopy();
});
