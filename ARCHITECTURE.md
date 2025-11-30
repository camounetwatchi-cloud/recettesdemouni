# 🏗️ Architecture du système de Scanner de Recettes

## 📊 Flux général

```
Utilisateur
    ↓
[Bouton "Scanner une recette"]
    ↓
RecipeScanner (Modal)
    ├─ Upload image / Caméra
    ├─ Conversion Base64
    └─ Envoi à Gemini API
         ↓
    [Analyse par IA]
         ↓
    Extraction JSON
         ↓
RecipeManager
    ├─ Affichage des données extraites
    ├─ Validation par utilisateur
    └─ Sauvegarde dans localStorage
         ↓
Recettes sauvegardées
```

## 📁 Structure des fichiers

```
recettesdemouni/
├── src/
│   ├── App.jsx              # Point d'entrée principal
│   ├── RecipeManager.jsx    # Gestionnaire de recettes
│   ├── RecipeScanner.jsx    # 🆕 Scanner IA
│   ├── index.css            # Styles
│   └── main.jsx             # Bootstrap
├── package.json             # Dépendances
├── vite.config.js          # Config build
├── tailwind.config.js      # Config Tailwind
├── SCANNER_SETUP.md        # 🆕 Documentation
├── SECURITY_API_KEY.md     # 🆕 Guide sécurité
└── .env.local              # 🆕 Variables d'env (à créer)
```

## 🔄 Composants et responsabilités

### 1. `RecipeScanner.jsx` (NOUVEAU)

**Responsabilité** : Capture et traitement d'images

```
RecipeScanner
├── État local
│   ├── image (File)
│   ├── loading (boolean)
│   ├── error (string)
│   └── extractedRecipe (object)
│
├── Fonctions principales
│   ├── fileToBase64() → Convertit image en Base64
│   ├── extractRecipeFromImage() → Appelle Gemini API
│   └── handleFileSelect() → Gère upload/caméra
│
└── Exports
    └── onRecipeExtracted() → Callback parent
```

**Flux d'utilisation** :
1. Utilisateur sélectionne/prend une photo
2. `handleFileSelect()` déclenche la conversion
3. `extractRecipeFromImage()` appelle Gemini
4. Résultat affiché pour vérification
5. Au clic "Ajouter", appelle `onRecipeExtracted()`

### 2. `RecipeManager.jsx` (MODIFIÉ)

**Responsabilité** : Gestion globale et orchestration

```
RecipeManager
├── État
│   ├── recipes[] (stockage)
│   ├── showScanner (boolean)
│   └── ... (autres états)
│
├── Nouveautés
│   ├── handleRecipeExtracted() → Traite recette du scanner
│   ├── Bouton "Scanner une recette"
│   └── <RecipeScanner /> → Composant modal
│
└── Intégrations
    └── localStorage (persistence)
```

**Flux d'intégration** :
1. Utilisateur clique "Scanner"
2. `showScanner = true` → Affiche modal
3. Scanner extrait recette
4. `handleRecipeExtracted()` crée objet complet
5. Sauvegarde via `saveRecipes()`
6. Modal ferme, retour à search

## 🌐 Communication API

### Endpoint utilisé

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
```

### Payload envoyé

```javascript
{
  contents: [
    {
      parts: [
        {
          text: "Prompt d'extraction"  // Instructions pour l'IA
        },
        {
          inlineData: {
            mimeType: "image/jpeg",     // Type d'image
            data: "BASE64_STRING"       // Image encodée
          }
        }
      ]
    }
  ]
}
```

### Réponse reçue

```javascript
{
  candidates: [
    {
      content: {
        parts: [
          {
            text: '{"name": "...JSON...'  // Réponse JSON
          }
        ]
      }
    }
  ]
}
```

## 💾 Modèle de données

### Structure d'une recette

```javascript
{
  id: 1234567890,                    // Timestamp ou UUID
  name: "Tarte aux pommes",          // Nom recette
  ingredients: [                      // Array d'ingrédients
    {
      name: "Farine",
      quantity: "200g"
    }
  ],
  steps: [                           // Array d'étapes
    "Préparer la pâte",
    "Éplucher les pommes"
  ],
  servings: "4 portions",            // (Optionnel)
  cookTime: "40 minutes",            // (Optionnel)
  prepTime: "15 minutes",            // (Optionnel)
  difficulty: "Facile",              // (Optionnel)
  createdAt: "2024-11-30T..."        // ISO timestamp
}
```

### Stockage

- **Type** : localStorage (navigateur)
- **Clés** :
  - `recipes` → Toutes les recettes
  - `search-history` → Historique recherches
- **Format** : JSON string

## 🔐 Flux sécurité

```
Clé API
  ├─ Option 1 : Hardcodée (DEV uniquement)
  ├─ Option 2 : Variable d'env (.env.local) ✅ RECOMMANDÉ
  └─ Option 3 : Backend proxy (PRODUCTION)

Restrictions Google Cloud
  ├─ Domaines autorisés
  ├─ APIs restreintes
  └─ Quotas définis
```

## 📱 Flux utilisateur détaillé

```
┌─────────────────────────────────────────────────────┐
│ Vue "Trouver une recette"                           │
│ [Scanner] [Ajouter] [Exporter] [Importer]           │
└────────────────┬────────────────────────────────────┘
                 │ Click "Scanner"
                 ↓
┌─────────────────────────────────────────────────────┐
│ Modal RecipeScanner                                  │
│ ┌──────────────┐  ┌──────────────┐                  │
│ │ Importer     │  │ Caméra       │                  │
│ │ une photo    │  │ en direct    │                  │
│ └──────┬───────┘  └──────┬───────┘                  │
└────────┼──────────────────┼───────────────────────┘
         │                  │
     Sélect            Prendre
     image             photo
         │                  │
         └────────┬─────────┘
                  ↓
         Conversion Base64
                  ↓
         Appel API Gemini
                  ↓
    ┌────────────────────────┐
    │ Analyse par IA (2-5s)  │
    └────────────┬───────────┘
                 ↓
    Affichage des résultats
    - Nom ✓
    - Ingrédients ✓
    - Étapes ✓
                 │
         ┌───────┴───────┐
         │               │
      [Retry]        [Ajouter]
         │               │
         ↓               ↓
      Reset       Sauvegarde
                  Fermeture modal
                  Retour accueil
```

## 🛠️ État des composants

### RecipeScanner

| Prop | Type | Obligatoire | Description |
|------|------|-------------|-------------|
| `onRecipeExtracted` | function | ✅ | Callback avec recette |
| `onClose` | function | ✅ | Callback pour fermer |

### RecipeManager

| État | Type | Valeurs |
|------|------|---------|
| `showScanner` | boolean | true/false |
| `currentPage` | string | 'search'/'add'/'view' |

## 🚀 Optimisations futures

```
1. Compression image
   └─ Réduire taille avant envoi API

2. Cache résultats
   └─ Éviter double appel même image

3. OCR local
   └─ Pré-extraction avant IA

4. Multi-language
   └─ Détecter langue automatiquement

5. ML local
   └─ Réduire appels API
```

## 📈 Performance

| Métrique | Valeur |
|----------|--------|
| Conversion Base64 | < 100ms |
| Appel API Gemini | 2-5 secondes |
| Parsing réponse | < 50ms |
| **Total** | **~2-6 secondes** |

## 🔗 Dépendances

```
react@18.2.0
└─ react-dom@18.2.0

lucide-react@0.263.1
└─ Icons (Camera, Plus, etc)

Gemini API
└─ Via fetch() natif (pas de package npm)

Tailwind CSS
└─ Styling (via @apply)
```

---

**Créé le** : 30 novembre 2024
**Version** : 1.0
