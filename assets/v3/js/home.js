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

  // ---------- Grille projets : rotation photos ----------
  document.querySelectorAll('.project-card .rot').forEach((rot, cardIdx) => {
    const imgs = rot.querySelectorAll('img');
    if (imgs.length < 2) return;
    let idx = 0;
    // Décalage entre cartes pour un effet aléatoire
    setTimeout(() => {
      setInterval(() => {
        imgs[idx].classList.remove('active');
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add('active');
      }, 8000);
    }, cardIdx * 1200);
  });

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

  // ---------- i18n ----------
  const DICT = {
    fr: {
      'nav.about':'À propos','nav.services':'Services','nav.projects':'Projets','nav.process':'Déroulement','nav.contact':'Contact','nav.portfolio':'Portfolio',
      'hero.eyebrow':"StudioTM — Architecte d'intérieur, Lyon",
      'hero.title':"L'architecture qui prend de la hauteur.",
      'hero.lead':"Conception d'espaces, plans techniques, visualisation 3D, rénovation et suivi de chantier. Une approche visuelle rare, servie par l'œil du drone et le sens du détail.",
      'hero.cta':'Discutons de votre projet','hero.scroll':'Défiler',
      'about.eyebrow':'À propos','about.title':"Un regard neuf sur l'architecture d'intérieur.",
      'about.p1':"Tom Maradan, fondateur de StudioTM, se forme à l'école CREAD Lyon et développe depuis plusieurs années une pratique qui mêle conception spatiale, visualisation 3D et prises de vue drone. Cette double compétence — architecturale et visuelle — permet de faire lire un projet avant même qu'il n'existe.",
      'about.p2':"StudioTM accompagne particuliers, professionnels et confrères architectes sur des projets qui vont de la rénovation d'appartement à la villa complète, avec la même exigence : rendre le projet lisible, désirable et exécutable.",
      'about.m1':'Années de pratique','about.m2':'Projets livrés','about.m3s':'Lyon','about.m3':'& Sud de la France',
      'services.eyebrow':'Services','services.title':"De l'idée au chantier livré.",
      'services.lead':"Cinq pôles de compétence pensés pour couvrir un projet de bout en bout — ou intervenir au juste besoin, en soutien d'un archi ou d'un particulier.",
      'services.s1t':'Plans techniques','services.s1d':"Relevés, plans d'état des lieux, plans projet, coupes, élévations. Livrables clairs et exploitables.",
      'services.s2t':'Modélisation 3D','services.s2d':"Volumes, matières, éclairages. Une image qui parle au client avant même que le chantier ne démarre.",
      'services.s3t':'Rénovation','services.s3d':"Conception complète, choix des matériaux et coordination pour transformer un espace existant.",
      'services.s4t':'Suivi de chantier','services.s4d':"Présence sur site, coordination des artisans, respect du planning et de la vision.",
      'services.s5t':'Vues drone','services.s5d':"Captures aériennes de vos projets — reveal, chantier, communication. Une signature visuelle qui vous démarque.",
      'proj.eyebrow':'Projets','proj.title':'Sélection.','proj.lead':"Un aperçu d'univers travaillés récemment. L'intégralité des projets est visible sur le portfolio.",'proj.cta':'Voir tous les projets',
      'news.eyebrow':'Actualité','news.title':'Un projet frais sur la table.',
      'news.p':"Direction les combles d'un bâtiment lyonnais transformés en logement lumineux. Un chantier récent qui illustre bien la démarche StudioTM : lecture précise du volume, projection 3D et visite drone.",
      'news.cta':'Découvrir le projet','news.badge':'DERNIER PROJET',
      'proc.eyebrow':'Déroulement','proc.title':'Comment se passe une mission.','proc.tab1':'Particulier','proc.tab2':'Professionnel',
      'cs.eyebrow':'Prenons contact','cs.title':"Un projet, une idée, une question ?<br>Je réponds sous 48h.",'cs.form':'Formulaire complet',
      'foot.baseline':"StudioTM — Studio d'architecture d'intérieur basé à Lyon. Plans, 3D, rénovation, suivi de chantier.",
      'foot.site':'Site','foot.form':'Formulaire','foot.follow':'Suivre','foot.rights':'Tous droits réservés.','foot.legal':'Mentions légales','foot.privacy':'Politique de confidentialité','foot.cgv':'CGV',
      'fc.wa':'WhatsApp','fc.mail':'Email','fc.tel':'Téléphone',
      'ck.title':"Un espace pensé jusqu'aux détails.",
      'ck.p':"StudioTM utilise des cookies de mesure d'audience pour comprendre le nombre de visiteurs, le temps passé sur chaque page et les projets qui vous intéressent. Aucune donnée n'est revendue.",
      'ck.no':'Refuser','ck.yes':'Accepter'
    },
    en: {
      'nav.about':'About','nav.services':'Services','nav.projects':'Projects','nav.process':'Process','nav.contact':'Contact','nav.portfolio':'Portfolio',
      'hero.eyebrow':'StudioTM — Interior architect, Lyon',
      'hero.title':'Interior architecture, seen from above.',
      'hero.lead':"Space design, technical drawings, 3D visualisation, renovation and site supervision. A rare visual approach, served by the eye of the drone and a sharp attention to detail.",
      'hero.cta':"Let's discuss your project",'hero.scroll':'Scroll',
      'about.eyebrow':'About','about.title':'A fresh eye on interior architecture.',
      'about.p1':"Tom Maradan, founder of StudioTM, trained at CREAD Lyon and has been building a practice that mixes spatial design, 3D visualisation and drone photography. This dual skill — architectural and visual — makes it possible to read a project before it even exists.",
      'about.p2':"StudioTM works with private clients, professionals and fellow architects on projects that range from apartment renovation to full villas, always with the same standard: make the project readable, desirable and buildable.",
      'about.m1':'Years of practice','about.m2':'Delivered projects','about.m3s':'Lyon','about.m3':'& South of France',
      'services.eyebrow':'Services','services.title':'From the first idea to the finished site.',
      'services.lead':"Five areas of expertise, designed to cover a project end-to-end — or to step in exactly where needed, alongside an architect or a private client.",
      'services.s1t':'Technical drawings','services.s1d':"Surveys, existing plans, project plans, sections, elevations. Clear, workable deliverables.",
      'services.s2t':'3D modelling','services.s2d':"Volumes, materials, lighting. Images that speak to the client long before the site opens.",
      'services.s3t':'Renovation','services.s3d':"Full design, material selection and coordination to transform an existing space.",
      'services.s4t':'Site supervision','services.s4d':"On-site presence, coordination of trades, respect for the schedule and the vision.",
      'services.s5t':'Drone shots','services.s5d':"Aerial captures of your projects — reveal, works in progress, communication. A visual signature that sets you apart.",
      'proj.eyebrow':'Projects','proj.title':'Selection.','proj.lead':"A glimpse of recent work. The full body of projects lives on the portfolio.",'proj.cta':'See all projects',
      'news.eyebrow':'News','news.title':'A fresh project on the table.',
      'news.p':"An attic in Lyon turned into a bright, functional home. A recent project that shows the StudioTM approach: precise reading of the volume, 3D projection and drone survey.",
      'news.cta':'Discover the project','news.badge':'LATEST PROJECT',
      'proc.eyebrow':'Process','proc.title':'How a project unfolds.','proc.tab1':'Private','proc.tab2':'Professional',
      'cs.eyebrow':"Let's talk",'cs.title':"A project, an idea, a question?<br>I reply within 48 hours.",'cs.form':'Full form',
      'foot.baseline':"StudioTM — Interior architecture studio based in Lyon. Drawings, 3D, renovation, site supervision.",
      'foot.site':'Site','foot.form':'Form','foot.follow':'Follow','foot.rights':'All rights reserved.','foot.legal':'Legal notice','foot.privacy':'Privacy policy','foot.cgv':'Terms',
      'fc.wa':'WhatsApp','fc.mail':'Email','fc.tel':'Phone',
      'ck.title':'A space designed down to the details.',
      'ck.p':"StudioTM uses audience-measurement cookies to understand the number of visitors, the time spent on each page and the projects you care about. No data is ever sold.",
      'ck.no':'Decline','ck.yes':'Accept'
    }
  };

  // Steps content keyed by lang + mode
  const STEPS = {
    fr: {
      particulier: [
        ['Prise de contact', "Vous m'expliquez le projet. On échange par mail, téléphone ou visio."],
        ['RDV découverte',  "Visite du lieu, mesures, écoute de vos usages et de vos envies."],
        ['Devis',            "Une proposition claire et détaillée. Aucun engagement avant validation."],
        ['Conception 3D',    "Plans, coupes, modélisation 3D. On itère jusqu'au parfait."],
        ['Suivi de chantier',"Présence sur site, coordination des artisans, jusqu'à la livraison."]
      ],
      pro: [
        ['Prise de contact',   "Prise de brief technique. Cadrage rapide des attentes et livrables."],
        ['Cadrage & livrables',"Alignement sur le périmètre, format des livrables, jalons attendus."],
        ['Devis & planning',   "Chiffrage, planning et conditions posés noir sur blanc."],
        ['Production',         "Plans, 3D ou suivi selon la mission. Rendus livrés dans les délais."],
        ['Livraison',          "Fichiers sources, exports finaux et support si besoin."]
      ]
    },
    en: {
      particulier: [
        ['First contact',   "You describe your project. We exchange by email, phone or video call."],
        ['Discovery visit', "On-site visit, measurements, listening to your uses and wishes."],
        ['Quote',           "A clear, detailed proposal. No commitment before you approve it."],
        ['3D design',       "Drawings, sections, 3D modelling. We iterate until it's right."],
        ['Site supervision',"On-site presence, coordination of trades, all the way to delivery."]
      ],
      pro: [
        ['First contact',        "Technical briefing. Quick framing of expectations and deliverables."],
        ['Scope & deliverables', "Alignment on scope, deliverable format, expected milestones."],
        ['Quote & schedule',     "Pricing, planning and conditions laid out in writing."],
        ['Production',           "Drawings, 3D or supervision depending on the mission. Delivered on time."],
        ['Handover',             "Source files, final exports and support if needed."]
      ]
    }
  };

  const stepEls = document.querySelectorAll('.process-steps .step');
  const toggleWrap = document.querySelector('.process-toggle');
  let currentLang = localStorage.getItem('stm_lang') || 'fr';
  let currentMode = 'particulier';

  const applyI18n = (lang) => {
    const dict = DICT[lang] || DICT.fr;
    // Textes simples
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    // HTML (avec <br>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // Badge visuel actualité (data-i18n-attr="badge:news.badge")
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pair = el.getAttribute('data-i18n-attr').split(':');
      if (pair.length === 2 && dict[pair[1]] != null) el.setAttribute('data-badge', dict[pair[1]]);
    });
    // Lang du html
    document.documentElement.setAttribute('lang', lang);
    // Toggle state
    document.querySelectorAll('.lang-toggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    // Re-appliquer les steps
    applySteps();
    // Notifier les autres modules (wow.js re-split)
    document.dispatchEvent(new CustomEvent('stm:i18n-applied', { detail: { lang } }));
  };

  const applySteps = () => {
    const steps = (STEPS[currentLang] || STEPS.fr)[currentMode];
    stepEls.forEach((el, idx) => {
      if (!steps[idx]) return;
      const h = el.querySelector('h4');
      const p = el.querySelector('p');
      if (h) h.textContent = steps[idx][0];
      if (p) p.textContent = steps[idx][1];
    });
  };

  // Init
  applyI18n(currentLang);

  // Lang toggle click
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('stm_lang', currentLang);
      applyI18n(currentLang);
    });
  });

  // Process toggle click
  if (toggleWrap) {
    toggleWrap.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentMode = btn.dataset.mode;
        toggleWrap.dataset.mode = currentMode;
        toggleWrap.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
        applySteps();
      });
    });
  }

  // ---------- Float contact ----------
  const floatBtn = document.querySelector('.float-contact');
  const floatTrigger = document.querySelector('.float-contact-trigger');
  if (floatTrigger && floatBtn) {
    floatTrigger.addEventListener('click', (e) => { e.stopPropagation(); floatBtn.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!floatBtn.contains(e.target)) floatBtn.classList.remove('open'); });
  }

  // ---------- Cookie banner ----------
  const banner = document.getElementById('cookie-banner');
  if (banner && !localStorage.getItem('stm_cookies_v1')) {
    setTimeout(() => banner.classList.add('show'), 1500);
    banner.querySelector('.accept').addEventListener('click', () => { localStorage.setItem('stm_cookies_v1', 'accepted'); banner.classList.remove('show'); });
    banner.querySelector('.decline').addEventListener('click', () => { localStorage.setItem('stm_cookies_v1', 'declined'); banner.classList.remove('show'); });
  }

})();
