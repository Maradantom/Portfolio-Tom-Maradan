/* =========================================================
   StudioTM — Analytics avec consentement RGPD
   Ne se déclenche QUE si l'utilisateur a accepté les cookies
   =========================================================
   Pour activer GA4 : remplace 'G-XXXXXXXXXX' par ton vrai ID
   (obtenu sur analytics.google.com après création de la propriété)
*/
(function () {
  'use strict';

  const GA_ID = 'G-XXXXXXXXXX'; // ← À REMPLACER par ton ID GA4 réel

  // Ne fait rien si placeholder non modifié (évite d'appeler Google avec un faux ID)
  if (GA_ID === 'G-XXXXXXXXXX') return;

  const CONSENT_KEY = 'stm_cookies_v1';
  const consent = () => localStorage.getItem(CONSENT_KEY) === 'accepted';

  const loadGA = () => {
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;

    // Google Consent Mode v2 par défaut = tout refusé
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted', // acceptée par l'utilisateur
      wait_for_update: 500
    });

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=Strict;Secure'
    });

    // API simple pour tracker des événements custom
    window.stmTrack = (name, params) => gtag('event', name, params || {});
  };

  // Si déjà consenti au chargement
  if (consent()) loadGA();

  // Écoute les changements de consentement (bouton "Accepter" cliqué)
  document.addEventListener('stm:consent-accepted', loadGA);

  // Détecte aussi les clics sur le bouton accept du bandeau cookies
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#cookie-banner .accept');
    if (btn) setTimeout(loadGA, 100);
  });

})();
