# Configuration du Scanner de Recettes avec Gemini AI

## 🎯 Vue d'ensemble

Vous avez intégré une fonctionnalité permettant de scanner une photo de recette et de la convertir automatiquement en données JSON structurées. Cette fonctionnalité utilise l'API Google Gemini 2.0 Flash.

## 📋 Étapes à suivre

### 1. **Vérifier que tout est en place**

✅ Les fichiers suivants ont été créés/modifiés :
- `src/RecipeScanner.jsx` - Nouveau composant de scanner
- `src/RecipeManager.jsx` - Mise à jour avec intégration du scanner

### 2. **Installation des dépendances**

Votre `package.json` a besoin de lucide-react (déjà inclus) pour les icônes. Vérifiez que tout est installé :

```bash
npm install
```

### 3. **Clé API Gemini**

La clé API est déjà intégrée dans le code :
```
AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

⚠️ **IMPORTANT - Recommandations de sécurité :**

#### Option 1 : En Développement (Actuel)
La clé API est directement dans le code (OK pour développement local).

#### Option 2 : Pour la Production 🔒 (RECOMMANDÉ)
Créez un fichier `.env.local` à la racine du projet :

```
VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

Puis modifiez `src/RecipeScanner.jsx` ligne 8 :
```javascript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

Et mettez à jour votre `.gitignore` :
```
.env.local
```

### 4. **Démarrer l'application**

```bash
npm run dev
```

L'app sera disponible sur `http://localhost:5173` (ou le port indiqué).

## 🚀 Utilisation

### Scanner une recette

1. Cliquez sur le bouton **"Scanner une recette"** (bouton vert en haut à droite)
2. Deux options s'offrent à vous :
   - **Importer une photo** : Sélectionner une image de votre ordinateur
   - **Prendre une photo** : Utiliser votre caméra (sur mobile/tablette)

3. L'IA analyse automatiquement la photo et extrait :
   - Nom de la recette
   - Ingrédients avec quantités
   - Étapes de préparation
   - Temps de préparation/cuisson
   - Nombre de portions
   - Niveau de difficulté

4. Vérifiez les données extraites
5. Cliquez sur **"✓ Ajouter cette recette"** pour sauvegarder

## 📝 Format de données extrait

Le scanner retourne un objet JSON de ce format :

```json
{
  "name": "Tarte aux pommes",
  "ingredients": [
    {"name": "Farine", "quantity": "200g"},
    {"name": "Beurre", "quantity": "100g"}
  ],
  "steps": [
    "Préparer la pâte",
    "Éplucher les pommes",
    "Cuire au four 40 min"
  ],
  "servings": "4 portions",
  "cookTime": "40 minutes",
  "prepTime": "15 minutes",
  "difficulty": "Facile"
}
```

## 🛠️ Technologie utilisée

- **API Gemini 2.0 Flash** : Modèle IA de Google pour analyse d'images
- **React** : Framework UI
- **Vite** : Build tool
- **Tailwind CSS** : Styling
- **Lucide React** : Icons

## 🔧 Configuration avancée

### Modifier le prompt d'extraction

Si vous voulez changer comment l'IA extrait les données, modifiez le `prompt` dans `src/RecipeScanner.jsx` ligne 41-60.

### Ajouter des champs supplémentaires

1. Modifiez le prompt JSON attendu
2. Mettez à jour le type de recette dans `RecipeManager.jsx` ligne 202

## 📱 Limitations connues

1. **Qualité de l'image** : Les photos claires fonctionnent mieux
2. **Langue** : L'IA répond mieux avec du texte français visible
3. **Taille fichier** : Les images > 20MB peuvent avoir des problèmes
4. **CORS** : Fonctionne mieux sur HTTPS en production

## ⚠️ Dépannage

### "Erreur lors de l'appel API Gemini"
- Vérifiez votre connexion Internet
- Assurez-vous que la clé API est correcte
- Vérifiez les quotas API Google Cloud

### "La réponse ne contient pas les champs requis"
- L'image n'est pas claire
- Essayez avec une meilleure photo de recette
- Vérifiez que le texte de la recette est lisible

### "Erreur lors du traitement de l'image"
- Vérifiez que c'est bien une image
- Formats supportés : JPG, PNG, GIF, WEBP

## 🎓 Prochaines étapes possibles

1. **Ajouter une section "Tips & Astuces"** : Extraire aussi des conseils culinaires
2. **Reconnaissance d'images avancée** : Détecter automatiquement les ingrédients visibles
3. **Traduction multi-langues** : Scanner des recettes dans d'autres langues
4. **Base de données** : Sauvegarder dans Firebase/Supabase au lieu du localStorage
5. **API backend** : Créer un serveur pour sécuriser la clé API

## 📚 Ressources utiles

- [Documentation Gemini API](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

## 💡 Support

Pour toute question ou amélioration, consultez :
- La documentation Google AI Studio : https://aistudio.google.com
- Les exemples dans votre projet Google Cloud

---

**Version** : 1.0  
**Dernière mise à jour** : 30 novembre 2024
