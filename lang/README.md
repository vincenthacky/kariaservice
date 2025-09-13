# Système de Gestion des Langues - Kariaservice

Ce système permet de gérer facilement les traductions et d'ajouter de nouvelles langues au site Kariaservice.

## Structure

```
lang/
├── config.json          # Configuration des langues disponibles
├── fr.json              # Traductions françaises (défaut)
├── en.json              # Traductions anglaises
└── README.md            # Ce fichier
```

## Ajouter une Nouvelle Langue

### 1. Créer le fichier de traduction

Copiez `fr.json` ou `en.json` et renommez-le avec le code de la nouvelle langue (ex: `es.json` pour l'espagnol).

### 2. Traduire le contenu

Modifiez toutes les valeurs dans le fichier JSON avec les traductions appropriées.

### 3. Mettre à jour la configuration

Dans `config.json`, ajoutez la nouvelle langue dans `availableLanguages` :

```json
{
  "availableLanguages": {
    "fr": { "name": "Français", "flag": "🇫🇷" },
    "en": { "name": "English", "flag": "🇬🇧" },
    "es": { "name": "Español", "flag": "🇪🇸" }
  }
}
```

### 4. Mettre à jour le gestionnaire de langues

Dans `js/lang.js`, ajoutez la nouvelle langue à l'objet `availableLanguages` :

```javascript
this.availableLanguages = {
    'fr': 'Français',
    'en': 'English',
    'es': 'Español'
};
```

## Structure du fichier JSON

Chaque fichier de langue contient les sections suivantes :

- `navigation` : Menu de navigation
- `hero` : Section d'accueil avec slider
- `services` : Section des services
- `excellence` : Section Excellence avec onglets
- `about` : Section À propos
- `projects` : Section Réalisations
- `testimonials` : Section Témoignages
- `contact` : Section Contact avec formulaire
- `quote` : Section Devis
- `footer` : Pied de page
- `messages` : Messages système (notifications, erreurs, etc.)

## Fonctionnalités

### Changement de langue

- Sélecteur dans le header avec drapeaux
- Sauvegarde de la préférence dans localStorage
- Mise à jour dynamique de tout le contenu
- Support des événements personnalisés

### Traductions dynamiques

Utilisez la méthode `t()` pour accéder aux traductions :

```javascript
// Dans le code JavaScript
const message = window.langManager.t('messages.form_success');

// Avec des clés imbriquées
const title = window.langManager.t('services.real_estate.title');
```

### Messages de formulaire

Les messages du formulaire sont automatiquement traduits :

```javascript
// Le système cherche automatiquement la traduction
showNotification('messages.form_success', 'success');
```

## Bonnes Pratiques

1. **Cohérence** : Utilisez la même structure pour toutes les langues
2. **Clés descriptives** : Utilisez des clés explicites (`form_success` plutôt que `msg1`)
3. **Imbrication** : Organisez les traductions par section
4. **Contexte** : Conservez le contexte HTML dans les traductions avec balises
5. **Test** : Testez chaque nouvelle langue sur tous les navigateurs

## Exemple d'Ajout - Espagnol

1. Créer `es.json` :
```json
{
  "navigation": {
    "home": "Inicio",
    "about": "Acerca de",
    "services": "Servicios",
    ...
  }
}
```

2. Modifier `js/lang.js` :
```javascript
this.availableLanguages = {
    'fr': 'Français',
    'en': 'English',
    'es': 'Español'
};
```

3. La langue apparaîtra automatiquement dans le sélecteur !

## Maintenance

- Vérifiez que toutes les clés sont présentes dans chaque fichier de langue
- Mettez à jour les traductions lors d'ajouts de contenu
- Testez le changement de langue sur toutes les sections
- Vérifiez les formats de date/nombre selon la locale