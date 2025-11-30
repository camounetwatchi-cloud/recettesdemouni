# 🔥 Configuration Firestore

## Règles de Sécurité

Le fichier `firestore.rules` contient les règles de sécurité pour Firestore.

### Configuration Actuelle

```firestore
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et l'écriture publique sur les recettes
    match /recipes/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Signification:**
- ✅ Tout le monde peut **lire** les recettes (sans authentification)
- ✅ Tout le monde peut **écrire** les recettes (sans authentification)
- 📖 Les règles s'appliquent à la collection `recipes` et tous les documents en dessous

### ⚠️ Avertissement de Sécurité

Ces règles permettent un accès **public complet**. Cela signifie que :
- N'importe qui peut lire vos données
- N'importe qui peut modifier vos données
- N'importe qui peut supprimer vos données

**Pour la production**, vous devriez implémenter :
- ✅ L'authentification Firebase (Auth)
- ✅ Des règles basées sur les utilisateurs
- ✅ Des limites d'accès par rôle

## Déployer les Règles

### Via Firebase Console (Facile)

1. Va sur https://console.firebase.google.com/
2. Sélectionne **"recettesdemounie"**
3. Firestore Database → **Rules**
4. Copie le contenu de `firestore.rules`
5. Colle dans l'éditeur
6. Clique **Publish**

### Via Firebase CLI (Avancé)

```bash
firebase login
firebase deploy --only firestore:rules
```

## Structure de la Basse de Données

```
Firestore
└── recipes/
    ├── {recipeId}
    │   ├── id: number
    │   ├── name: string
    │   ├── ingredients: array
    │   ├── steps: array
    │   ├── servings: string
    │   ├── cookTime: string
    │   ├── prepTime: string
    │   ├── difficulty: string
    │   ├── createdAt: timestamp
    │   └── updatedAt: timestamp
    └── {recipeId2}
        └── ...
```

## Vérification

Pour vérifier que les règles fonctionnent :

1. Ouvre une recette dans Firestore Console
2. Essaie de la lire/modifier
3. Vérifie que le test réussit ✅

## Mises à Jour Futures

Les changements de règles peuvent prendre **jusqu'à 10 minutes** à se propager.

