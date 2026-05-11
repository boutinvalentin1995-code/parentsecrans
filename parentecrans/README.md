# ParentEcrans.fr — Site from scratch

## Structure du dossier

```
parentecrans/
├── index.html              ← Page d'accueil (quiz + hero + guides + articles)
├── css/
│   ├── global.css          ← Variables, reset, nav, footer, boutons, utilitaires
│   ├── home.css            ← Styles spécifiques à l'accueil
│   └── pages.css           ← Boutique, articles, à propos, contact
├── js/
│   └── main.js             ← Nav, quiz, FAQ, formulaires
└── pages/
    ├── boutique.html       ← Boutique + bundle + FAQ
    ├── articles.html       ← Blog + sidebar
    ├── a-propos.html       ← Histoire + valeurs + stats
    └── contact.html        ← Formulaire de contact
```

## Pour démarrer

Ouvrir `index.html` dans un navigateur. Aucune dépendance, aucun build nécessaire.

## Liens Stripe à remplacer

Dans `boutique.html` et `index.html`, remplacer :
- `VOTRE_LIEN_STRIPE_GUIDE1` → lien Stripe du guide 3-10 ans
- `VOTRE_LIEN_STRIPE_GUIDE2` → lien Stripe du guide jeux vidéo
- `VOTRE_LIEN_STRIPE_GUIDE3` → lien Stripe du guide réseaux sociaux
- `VOTRE_LIEN_STRIPE_BUNDLE` → lien Stripe du pack famille

## Brevo — Quiz

Dans `js/main.js`, fonction `submitQuizEmail()` :
Remplacer le commentaire `// ⚠️ Brevo` par l'appel API Brevo :

```js
fetch('https://api.brevo.com/v3/contacts', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api-key': 'VOTRE_CLE_API_BREVO'
  },
  body: JSON.stringify({
    email: input.value,
    listIds: [VOTRE_ID_LISTE],
    attributes: { SCORE: total }
  })
});
```

## WordPress — points d'intégration

Les commentaires `⚠️ WordPress` dans le HTML indiquent où coller les balises PHP :
- Articles → `WP_Query` + `the_title()`, `the_excerpt()`, `get_permalink()`
- Catégories → `wp_list_categories()`
- Pagination → `the_posts_pagination()`
- Formulaire contact → `wp_mail()` ou plugin WPForms / Contact Form 7

## Modifier les couleurs

Tout est dans `css/global.css`, section `:root` :

```css
:root {
  --terracotta: #C8614A;   /* couleur principale */
  --sage:       #6B8F71;   /* couleur secondaire */
  --dark:       #2C2416;   /* fond sombre */
  --cream:      #FDF8F2;   /* fond clair */
}
```

## Fonts

Playfair Display (titres) + DM Sans (corps) — chargées via Google Fonts dans `global.css`.
