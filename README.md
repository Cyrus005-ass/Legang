# Vano Baby — 10 ans du gang

Site vitrine statique célébrant **10 ans de carrière** de Vano Baby (*Le Sorcier Vivant*) : splash d’entrée, parcours chronologique, galerie, contact et musique de fond.

## Aperçu

- **Langue** : français  
- **Stack** : HTML5, CSS3, JavaScript (sans framework)  
- **Polices** : Google Fonts (Bebas Neue, Barlow, Barlow Condensed)

## Structure du projet

```
vano_FINAL_V3/
├── index.html          # Page unique (splash + contenu principal)
├── css/
│   └── styles.css      # Styles et responsive
├── js/
│   └── main.js         # Splash, audio, slideshow hero, interactions
├── assets/
│   └── images/         # Photos et favicon
├── vanosong.mp4        # Piste utilisée par le lecteur audio (selon la config JS)
└── README.md
```

## Lancer en local

1. Ouvrir `index.html` dans un navigateur, **ou**
2. Servir le dossier avec un petit serveur HTTP (recommandé pour éviter des blocages sur certains navigateurs) :

   ```bash
   # Node (npx)
   npx --yes serve .

   # Python
   python -m http.server 8080
   ```

   Puis ouvrir `http://localhost:8080` (ou le port indiqué).

## Déploiement

Le site est **100 % statique** : compatible **GitHub Pages**, Netlify, Vercel ou tout hébergement de fichiers statiques.  
Sur GitHub Pages : branche `main`, dossier racine du dépôt, fichier d’entrée `index.html`.

## Licence / contenu

Les textes et l’identité artistique relèvent de leurs auteurs respectifs. Ce dépôt est fourni à des fins de présentation du site.
"# Legang" 
