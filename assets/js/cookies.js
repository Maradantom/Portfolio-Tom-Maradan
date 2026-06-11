/* ============================================================
   COOKIES.JS — Bandeau RGPD pour Google Tag Manager / Analytics

   Stratégie :
     - Au 1er affichage : bandeau visible, GTM/Analytics bloqués
     - "Accepter" → consentement stocké, scripts activés
     - "Refuser" → consentement stocké à "denied", scripts non chargés
     - Lien "Mes préférences" dans le footer pour ré-afficher le bandeau
   ============================================================ */

(function () {
  const KEY = 'tm_cookie_consent';   // 'granted' | 'denied' | null
  const consent = localStorage.getItem(KEY);

  // Active GTM / Google Analytics si consentement déjà accordé
  if (consent === 'granted') {
    loadAnalytics();
  }

  // Affiche le bandeau seulement si pas encore de choix
  if (!consent) {
    showBanner();
  }

  /* --- chargement asynchrone de GTM / gtag --- */
  function loadAnalytics() {
    // Si déjà chargé, on saute
    if (window.dataLayer && window.dataLayer.length > 0) return;

    // Google Tag Manager
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-5TXD68TR');

    // Google Analytics (gtag)
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-GFHBS8S2BH';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-GFHBS8S2BH', { anonymize_ip: true });
  }

  /* --- bandeau --- */
  function showBanner() {
    const html = `
      <div class="cookie-banner" role="dialog" aria-labelledby="cb-title" aria-describedby="cb-text">
        <div class="cookie-banner-inner">
          <div>
            <h3 id="cb-title" class="cookie-banner-title">🍪 Cookies & mesure d'audience</h3>
            <p id="cb-text" class="cookie-banner-text">
              Ce site utilise Google Analytics pour mesurer son audience de façon anonyme.
              Vos données ne sont jamais revendues. En savoir plus dans les
              <a href="/mentions-legales/">mentions légales</a>.
            </p>
          </div>
          <div class="cookie-banner-actions">
            <button class="cookie-btn cookie-btn-reject" data-act="reject">Refuser</button>
            <button class="cookie-btn cookie-btn-accept" data-act="accept">Accepter</button>
          </div>
        </div>
      </div>
    `;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const banner = wrap.firstElementChild;
    document.body.appendChild(banner);

    banner.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.act === 'accept' ? 'granted' : 'denied';
        localStorage.setItem(KEY, choice);
        banner.remove();
        if (choice === 'granted') loadAnalytics();
      });
    });
  }

  /* --- expose une fonction pour ré-afficher le bandeau (lien "Mes cookies" dans le footer) --- */
  window.openCookiePrefs = function () {
    localStorage.removeItem(KEY);
    showBanner();
  };
})();
