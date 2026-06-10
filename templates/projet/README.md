# 📋 Template — Nouveau projet

## Comment ajouter un nouveau projet

### 1. Préparer les photos
Mettre toutes les photos du projet dans :
```
/photoprojet/N-projet-nom-2025/
  ├── 3D/          (les rendus 3D)
  └── Rendu/       (les planches de présentation)
```

### 2. Créer la page projet
1. Dupliquer le dossier `/templates/projet/` à la racine de `/projetdetail/`
2. Le renommer (ex : `/projetdetail/mon-nouveau-projet/`)
3. Ouvrir `index.html`
4. Modifier toutes les lignes marquées `🔧 À MODIFIER` :
   - Titre et description (lignes 7-8)
   - Chemin de l'image hero (ligne 23)
   - Texte du hero (lignes 37-38)
   - Points clés (section `.key-points`)
   - Sections de contenu (titre, texte, grilles d'images)

### 3. Ajouter le projet à la page projets
Éditer `/projets/index.html` et ajouter une carte qui pointe vers
`/projetdetail/mon-nouveau-projet/`.

## Notes

- **Tous les chemins sont absolus** (commencent par `/`) → ils fonctionnent
  depuis n'importe où.
- **Le header et le footer** sont chargés automatiquement via les balises
  `<div data-include="header"></div>` et `<div data-include="footer"></div>`.
  Pour modifier la navigation : éditer `/partials/header.html`.
- **La lightbox** se branche automatiquement sur toutes les `<img>` qui ont
  un attribut `data-lightbox="nom-de-groupe"`. Les images du même groupe
  navigueront ensemble (flèches gauche/droite).
