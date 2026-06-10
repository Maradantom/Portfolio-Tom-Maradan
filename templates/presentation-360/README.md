# 📋 Template — Nouvelle visite 360°

La visite 360° du Prieuré (`/presentation-360/prieure/`) sert de **modèle de référence**.
Pour ajouter une nouvelle visite, la duplication est la méthode la plus sûre.

## Comment ajouter une nouvelle visite 360°

### 1. Préparer les photos
Préparer les photos 360° et les plans dans un dossier organisé :
```
photo/NOM-DU-LIEU/
  ├── edl/           (état des lieux — version actuelle)
  │   ├── 360/       (les photos sphériques équirectangulaires)
  │   ├── preview/   (miniatures pour le sélecteur de pièces)
  │   └── plans/     (les plans d'étage)
  └── projet/        (version projet/futur — même structure)
      ├── 360/
      ├── preview/
      └── plans/
```

### 2. Dupliquer le dossier prieure
1. Copier `/presentation-360/prieure/` vers `/presentation-360/nom-du-lieu/`
2. Remplacer le contenu du dossier `photo/prieuré/` par tes nouvelles photos
3. Renommer le dossier `photo/prieuré/` en `photo/nom-du-lieu/`

### 3. Éditer le code
Trois fichiers à modifier :

#### `index.html`
- `<title>` : titre de la visite
- `<meta>` description, og:title, og:image
- Texte du `welcome-screen` (nom du projet, sous-titre)
- Liens et boutons "Projet Airhub" → renommer pour ton projet

#### `js/points-config.js`
Contient les **points cliquables** sur chaque vue 360 (pour passer de pièce en pièce).
Adapter chaque entrée avec les coordonnées de ta scène et les noms de tes pièces.

#### `js/signature360.js`
Contient la **liste des pièces** et le mapping vers les photos.
Remplacer toutes les références à `photo/prieuré/` par `photo/nom-du-lieu/`.

#### `css/signature360.css`
- Ligne 158 (environ) : `--hero-bg` ou `background-image` pour l'écran d'accueil
  → remplacer `pp.webp` par l'image d'accueil de ton projet

## Notes importantes

- **Toutes les pages 360° sont dans `/presentation-360/`** → bloquées de Google
  via `robots.txt`. Les visites restent privées : tu envoies le lien
  direct à tes clients.
- **Chemins absolus pour les éléments globaux** (logo, favicons) :
  `/photosite/...`, `/favicon/...`
- **Chemins relatifs pour les photos de la visite** : `photo/nom-du-lieu/...`
  (depuis l'`index.html` de la visite)

## Cas particuliers à connaître

Le code utilise la bibliothèque [Pannellum](https://pannellum.org/) (chargée
via CDN) pour le viewer 360°. Les **hotpoints** (points cliquables pour
naviguer entre les pièces) sont définis dans `points-config.js`.

Une fois bien copié, ajuster les hotpoints peut prendre du temps — c'est
une étape fine. Conserver une copie de la version précédente avant
modifications majeures.
