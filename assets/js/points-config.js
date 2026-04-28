// ==============================================================
// ==                    FICHIER DE CONFIG                     ==
// ==         Points cliquables sur les plans + images         ==
// ==============================================================
//
// POUR AJOUTER UN POINT :
//   - Duplique une ligne (ctrl+D ou copie-colle)
//   - Change :
//       scene = nom unique de la scene (pas d'espace, pas d'accent de preference)
//       image = chemin de l'image 360 associee
//       top   = position verticale en % (0 = haut, 100 = bas)
//       left  = position horizontale en % (0 = gauche, 100 = droite)
//
// Les 2 modes partagent les memes scenes (EDL et PROJET).
// Si une scene n'existe QUE dans l'avant-projet, tu peux la reutiliser
// dans le projet Airhub avec la meme entree.
// ==============================================================

window.POINTS_CONFIG = {

  // ===== AVANT-PROJET (EDL) ============================
  avant_projet: {

    // --- RDC (Rez-de-Chaussee) ---
    rdc: [
      { scene: 'extérieur',      image: 'photo/visite360/prieuré/edl/360/extérieur.webp',      top: '80%', left: '41%' },
      { scene: 'extérieur2',     image: 'photo/visite360/prieuré/edl/360/extérieur2.webp',     top: '60%', left: '7%'  },
      { scene: 'salleréunion',   image: 'photo/visite360/prieuré/edl/360/salleréunion.webp',   top: '40%', left: '28%' },
      { scene: 'salleréunion2',  image: 'photo/visite360/prieuré/edl/360/salleréunion2.webp',  top: '60%', left: '25%' },
      { scene: 'cuisine',        image: 'photo/visite360/prieuré/edl/360/cuisine.webp',        top: '58%', left: '43%' },
      { scene: 'wc',             image: 'photo/visite360/prieuré/edl/360/wc.webp',             top: '43%', left: '40%' },
      { scene: 'salleréception', image: 'photo/visite360/prieuré/edl/360/sallereception.webp', top: '52%', left: '58%' },
    ],

    // --- R+1 (1er etage) ---
    r1: [
      { scene: 'billard',       image: 'photo/visite360/prieuré/edl/360/billard.webp',      top: '62%', left: '50%' },
      { scene: 'grandesalle',   image: 'photo/visite360/prieuré/edl/360/grandesalle.webp',  top: '50%', left: '60%' },
      { scene: 'petitesalle',   image: 'photo/visite360/prieuré/edl/360/petitesalle.webp',  top: '58%', left: '41%' },
      { scene: 'toilette',      image: 'photo/visite360/prieuré/edl/360/toilette.webp',     top: '41%', left: '41%' },
      { scene: 'mezzanine',     image: 'photo/visite360/prieuré/edl/360/mezzanine.webp',    top: '40%', left: '24%' },
    ],

    // --- RDJ (Rez-de-Jardin) ---
    rdj: [
      { scene: 'samplesroom',   image: 'photo/visite360/prieuré/edl/360/samplesroom.webp', top: '50%', left: '60%', action: 'samplesroom' },
      { scene: 'yoga',          image: 'photo/visite360/prieuré/edl/360/yoga.webp',        top: '50%', left: '28%' },
      { scene: 'extérieur3',    image: 'photo/visite360/prieuré/edl/360/extérieur3.webp',  top: '30%', left: '70%' },
    ],
  },

  // ===== PROJET AIRHUB (FINAL) =========================
  projet_airhub: {

    // --- RDC (Rez-de-Chaussee) ---
    rdc: [
      { scene: 'extérieur_p',      image: 'photo/visite360/prieuré/projet/360/extérieur_p.png',      top: '80%', left: '41%' },
      { scene: 'extérieur2_p',     image: 'photo/visite360/prieuré/projet/360/extérieur2_p.png',     top: '60%', left: '7%'  },
      { scene: 'boutique_p',       image: 'photo/visite360/prieuré/projet/360/boutique_p.png',       top: '40%', left: '28%' },
      { scene: 'boutique2_p',      image: 'photo/visite360/prieuré/projet/360/boutique2_p.png',      top: '60%', left: '25%' },
      { scene: 'atelier_p',        image: 'photo/visite360/prieuré/projet/360/atelier_p.png',        top: '58%', left: '43%' },
      { scene: 'toilette_p',       image: 'photo/visite360/prieuré/projet/360/toilette_p.png',       top: '43%', left: '40%' },
      { scene: 'cuisine_p',        image: 'photo/visite360/prieuré/projet/360/cuisine_p.png',        top: '52%', left: '58%' },
    ],

    // --- R+1 (1er etage) ---
    r1: [
      { scene: 'billard_vide_p',          image: 'photo/visite360/prieuré/projet/360/billard_vide_p.png',          top: '62%', left: '50%' },
      { scene: 'grandesalle_vide_p',      image: 'photo/visite360/prieuré/projet/360/grandesalle_vide_p.png',      top: '50%', left: '60%' },
      { scene: 'petitesalle_vide_p',      image: 'photo/visite360/prieuré/projet/360/petitesalle_vide_p.png',      top: '58%', left: '41%' },
      { scene: 'toilette_vide_p',         image: 'photo/visite360/prieuré/projet/360/toilette_vide_p.png',         top: '41%', left: '41%' },
      { scene: 'test_p',                  image: 'photo/visite360/prieuré/projet/360/test_p.png',                  top: '40%', left: '24%' },
    ],

    // --- RDJ (Rez-de-Jardin) ---
    rdj: [
      { scene: 'formation_p',      image: 'photo/visite360/prieuré/projet/360/samplesroom_p.png',   top: '50%', left: '60%' },
      { scene: 'formation2_p',     image: 'photo/visite360/prieuré/projet/360/yoga_p.png',          top: '50%', left: '28%' },
      { scene: 'extérieur3_p',     image: 'photo/visite360/prieuré/projet/360/extérieur3_p.png',    top: '30%', left: '70%' },
    ],
  },

};

// ==============================================================
// ==  LIAISONS MANUELLES ENTRE AVANT-PROJET ET PROJET AIRHUB  ==
// ==============================================================
//
// Ici tu peux lier EXPLICITEMENT une scene avant-projet a une scene
// projet-airhub (ou l'inverse). Quand on clique sur le toggle en haut,
// le systeme utilise en priorite cette table.
//
// Format : 'scene_avant_projet': 'scene_projet_airhub'
// (la liaison est BIDIRECTIONNELLE — fonctionne dans les 2 sens)
//
// POUR AJOUTER UNE LIAISON : ajoute une ligne comme celle-ci :
//     'salleréunion': 'boutique',
//
// POUR RETIRER : supprime la ligne.
//
// Si une scene n'est pas dans cette liste, le systeme retombe
// automatiquement sur la correspondance par POSITION (top/left).
// ==============================================================

window.SCENE_LINKS = {
  'samplesroom':        'formation_p',      // RDC point (50%, 60%)
  'yoga':               'formation2_p',     // RDC point (50%, 28%)
  'extérieur3':         'extérieur3_p',     // RDC point (30%, 70%)
  'extérieur':          'extérieur_p',      // RDC point (80%, 41%)
  'extérieur2':         'extérieur2_p',     // RDC point (60%, 7%)
  'salleréunion':       'boutique_p',       // RDC point (40%, 28%)
  'salleréunion2':      'boutique2_p',      // RDC point (60%, 25%)
  'cuisine':            'atelier_p',        // RDC point (58%, 43%)
  'wc':                 'toilette_p',       // RDC point (43%, 40%)
  'salleréception':     'cuisine_p',        // RDC point (52%, 58%)
  'billard':            'billard_vide_p',           // RDC point (62%, 50%)
  'grandesalle':        'grandesalle_vide_p',           // RDC point (50%, 60%)
  'petitesalle':        'petitesalle_vide_p',           // RDC point (58%, 41%)
  'toilette':           'toilette_vide_p',           // RDC point (40%, 24%)
  'mezzanine':          'test_p',           // RDC point (40%, 24%) 
  // 'exemple_avant': 'exemple_projet',
};

// ==============================================================
// ==  HELPER : trouver une scene equivalente dans l'autre mode
// ==  1) utilise SCENE_LINKS si defini
// ==  2) sinon, se base sur la position top/left dans POINTS_CONFIG
// ==============================================================
window.findEquivalentScene = function(sceneName, fromMode, toMode) {
  // 1) Verif mapping manuel (bidirectionnel)
  const links = window.SCENE_LINKS || {};
  // sens avant_projet -> projet_airhub
  if (toMode === 'projet' && links[sceneName]) return links[sceneName];
  // sens projet_airhub -> avant_projet (recherche inversee)
  if (toMode === 'edl') {
    for (const k in links) {
      if (links[k] === sceneName) return k;
    }
  }

  // 2) Fallback : correspondance par position
  const cfg = window.POINTS_CONFIG;
  const fromKey = fromMode === 'projet' ? 'projet_airhub' : 'avant_projet';
  const toKey   = toMode   === 'projet' ? 'projet_airhub' : 'avant_projet';

  let sourcePos = null;
  ['rdc', 'r1', 'rdj'].forEach(floor => {
    (cfg[fromKey][floor] || []).forEach(p => {
      if (p.scene === sceneName) sourcePos = { top: p.top, left: p.left, floor };
    });
  });
  if (!sourcePos) return sceneName;

  const target = (cfg[toKey][sourcePos.floor] || []).find(p => p.top === sourcePos.top && p.left === sourcePos.left);
  return target ? target.scene : sceneName;
};

// ==============================================================
// ==  GENERATION AUTOMATIQUE DES ZONES CLIQUABLES SUR LES PLANS
// ==  (tu n'as pas a toucher a ce qui suit)
// ==============================================================
(function() {
  function buildZones() {
    const cfg = window.POINTS_CONFIG;
    if (!cfg) return;

    // Helpers pour construire les zones
    function renderZones(containerId, points, handler) {
      const c = document.getElementById(containerId);
      if (!c) return;
      c.innerHTML = points.map(p => {
        const onclick = p.action === 'samplesroom'
          ? (handler === 'startVisit' ? 'startSamplesroomVisit()' : 'showSamplesroom()')
          : handler + "('" + p.scene + "')";
        return '<div class="zone" style="top:' + p.top + '; left:' + p.left + ';" onclick="' + onclick + '"></div>';
      }).join('');
    }

    // PLAN PLEIN ECRAN ------ AVANT-PROJET
    renderZones('fullscreen-zones-rdc',  cfg.avant_projet.rdc,  'startVisit');
    renderZones('fullscreen-zones-r1',   cfg.avant_projet.r1,   'startVisit');
    renderZones('fullscreen-zones-rdj',  cfg.avant_projet.rdj,  'startVisit');

    // PLAN PLEIN ECRAN ------ PROJET AIRHUB
    renderZones('fullscreen-zones-rdc-projet', cfg.projet_airhub.rdc, 'startVisit');
    renderZones('fullscreen-zones-r1-projet',  cfg.projet_airhub.r1,  'startVisit');
    renderZones('fullscreen-zones-rdj-projet', cfg.projet_airhub.rdj, 'startVisit');

    // PLAN MINI ------ AVANT-PROJET
    renderZones('zones-rdc', cfg.avant_projet.rdc, 'loadScene');
    renderZones('zones-r1',  cfg.avant_projet.r1,  'loadScene');
    renderZones('zones-rdj', cfg.avant_projet.rdj, 'loadScene');

    // PLAN MINI ------ PROJET AIRHUB
    renderZones('zones-rdc-projet', cfg.projet_airhub.rdc, 'loadScene');
    renderZones('zones-r1-projet',  cfg.projet_airhub.r1,  'loadScene');
    renderZones('zones-rdj-projet', cfg.projet_airhub.rdj, 'loadScene');
  }

  // Lance la generation au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildZones);
  } else {
    buildZones();
  }
})();
