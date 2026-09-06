# 📊 Migration Analytics & Search Console → compte pro StudioTM

## 🎯 Étape 1 — Google Analytics 4 (GA4)

### Créer la propriété
1. Va sur **https://analytics.google.com** en étant connecté avec `contact@studiotm.fr`
2. **Admin** (roue dentée en bas à gauche) → **Créer un compte**
3. Nom du compte : `StudioTM`
4. Nom de la propriété : `studiotm.fr`
5. Fuseau horaire : `France (GMT+01:00)` — Devise : `Euro €`
6. Secteur : `Immobilier` — Taille : `Petite (moins de 10)`
7. Objectif : `Générer des prospects` + `Comprendre le comportement des internautes`
8. **Créer** puis choisir **Web** comme flux
9. URL : `https://studiotm.fr` — Nom du flux : `Site principal`

### Récupérer l'ID GA4
Une fois le flux créé, tu verras un **ID de mesure** au format **`G-XXXXXXXXXX`**.

### L'insérer dans le site
Ouvre le fichier :
```
assets/v3/js/analytics.js
```
Remplace la ligne :
```js
const GA_ID = 'G-XXXXXXXXXX';
```
Par ton vrai ID, par exemple :
```js
const GA_ID = 'G-ABC123XYZ4';
```
Sauvegarde, commit, push. Le tracking se déclenchera automatiquement pour les visiteurs qui **acceptent** les cookies via le bandeau RGPD.

---

## 🎯 Étape 2 — Google Search Console

### Ajouter la propriété
1. Va sur **https://search.google.com/search-console** en étant connecté avec `contact@studiotm.fr`
2. **Ajouter une propriété** → choisir **Domaine** (pas préfixe URL — c'est mieux)
3. Entre : `studiotm.fr`
4. Google va te demander de vérifier via DNS TXT → il te donne un enregistrement du type :
   ```
   google-site-verification=XXXXXXXXXXXX
   ```

### Ajouter le TXT sur OVH
1. Va sur **https://www.ovhcloud.com/fr/manager** (connexion OVH)
2. **Web Cloud** → **Noms de domaine** → `studiotm.fr` → **Zone DNS**
3. **Ajouter une entrée** → Type : `TXT` → Sous-domaine : (vide, racine) → Valeur : `google-site-verification=XXXXXXXXXXXX`
4. Valider
5. Attendre 5-15 min puis retourner sur Search Console cliquer **Valider**

### Une fois validé
- **Sitemaps** (menu gauche) → soumettre : `https://studiotm.fr/sitemap.xml`
- Vérifier que les 9 URLs sont détectées sans erreur

### Retirer l'ancienne propriété de ton Gmail perso
Sur ton compte Google **maradantom@gmail.com** :
1. Search Console → sélectionne l'ancienne propriété `studiotm.fr`
2. Paramètres → **Utilisateurs et autorisations**
3. Ajoute `contact@studiotm.fr` en Propriétaire d'abord (au cas où)
4. Puis retire ton perso quand tu veux

---

## 🎯 Étape 3 — Google Tag Manager (optionnel, pour plus tard)

Tu as déjà un container GTM (`GTM-5TXD68TR`). Si tu veux tout gérer via GTM plutôt qu'insérer GA4 en dur :

1. **https://tagmanager.google.com** connecté en `contact@studiotm.fr`
2. Créer un nouveau compte : `StudioTM`
3. Créer un container : `studiotm.fr` (Web)
4. Récupérer le nouvel ID `GTM-YYYYYYY`
5. On ajoutera le code GTM à la place de GA4 direct

**Recommandation** : reste sur GA4 en direct (Étape 1) tant que tu n'as pas besoin de tags avancés. GTM ajoute une couche complexe pour peu de gain à ton stade.

---

## ✅ Résumé de ce qui est en place côté code

| Élément | Statut | Fichier |
|---|---|---|
| Bandeau cookies RGPD | ✅ En place | `index.html` (splash) + `preview/index.html` |
| Script Analytics avec consent gate | ✅ En place | `assets/v3/js/analytics.js` |
| Analytics chargé sur toutes les pages V3 | ✅ | Toutes les pages `.html` |
| ID GA4 à insérer | ⏳ À faire | Ligne 12 de `analytics.js` |
| Sitemap.xml complet | ✅ | `sitemap.xml` |
| Robots.txt correct | ✅ | `robots.txt` |
| Meta OG sur toutes les pages | ✅ | Toutes les pages |
| JSON-LD ProfessionalService (home) | ✅ | `preview/index.html` |
| JSON-LD ContactPage (contact) | ✅ | `contact/index.html` |
| Vérif Search Console | ✅ En place (ancien) | Meta déjà présente |

---

## 🔍 Étape 4 — Vérification finale

Après avoir ajouté l'ID GA4 :
1. Va sur https://studiotm.fr en navigation privée
2. Accepte les cookies dans le bandeau
3. Ouvre l'onglet **Temps réel** dans GA4 → tu dois voir ta visite
4. Refais la même chose depuis Search Console (URL Inspection)

---

## 🛡️ RGPD & bonnes pratiques

- ✅ Consentement recueilli AVANT tout tracking (Google Consent Mode v2)
- ✅ IP anonymisée (`anonymize_ip: true`)
- ✅ Cookies avec flags `SameSite=Strict;Secure`
- ✅ Aucun cookie tiers non consenti
- ✅ Politique de confidentialité à jour et liée sur toutes les pages
- ✅ Bannière RGPD conforme (Refuser aussi visible que Accepter)
