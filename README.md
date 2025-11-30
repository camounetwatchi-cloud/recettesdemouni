# 🍳 Gestionnaire de Recettes avec Scanner IA

Gestionnaire de recettes avec scanner automatique utilisant l'IA Google Gemini pour convertir des photos de recettes en données structurées JSON.

## ✨ Fonctionnalités

- 📸 **Scanner de recettes** - Prenez une photo ou importez une image de recette
- 🤖 **Analyse IA** - Google Gemini 2.0 Flash extrait automatiquement les données
- 📋 **Données structurées** - Nom, ingrédients, étapes, temps, portions, difficulté
- 💾 **Stockage local** - Toutes les recettes sauvegardées dans localStorage
- 🔍 **Recherche** - Trouvez vos recettes facilement
- 📥📤 **Import/Export** - Sauvegardez et partagez vos recettes en JSON
- 📱 **Responsive** - Fonctionne sur desktop, tablette et mobile
- 🎨 **Interface moderne** - Tailwind CSS + Lucide Icons

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

### Production
```bash
npm run build
npm run preview
```

## 📸 Comment utiliser

1. **Cliquez sur "Scanner une recette"** (bouton vert en haut)
2. **Sélectionnez une image** :
   - Importer une photo de votre ordinateur
   - Ou prendre une photo avec votre caméra
3. **Attendez l'analyse** (2-5 secondes)
4. **Vérifiez les données** extraites
5. **Cliquez "Ajouter cette recette"** pour sauvegarder

L'IA extrait automatiquement :
- Nom de la recette
- Ingrédients avec quantités
- Étapes de préparation
- Temps (préparation + cuisson)
- Nombre de portions
- Niveau de difficulté

## 🛠️ Technologie

- **React 18.2.0** - Framework UI
- **Vite 4.3.9** - Build tool ultra-rapide
- **Tailwind CSS 3.3.0** - Styling utilitaire
- **Lucide React 0.263.1** - Icons
- **Google Gemini API** - Analyse IA des images

## 🔐 Configuration API

La clé API Google Gemini est intégrée et prête à l'emploi :
```
AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

**Pour la production** (recommandé), créez un fichier `.env.local` :
```
VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

Voir `SECURITY_API_KEY.md` pour plus de détails sur la sécurité.

## 📁 Structure du projet

```
src/
├── App.jsx              # Composant principal
├── RecipeManager.jsx    # Gestionnaire recettes
├── RecipeScanner.jsx    # Scanner IA (NOUVEAU)
├── index.css            # Styles Tailwind
└── main.jsx             # Point d'entrée
```

## 📚 Documentation

- **[DEMARRAGE.md](DEMARRAGE.md)** - Vue d'ensemble complète
- **[QUICK_START.md](QUICK_START.md)** - Démarrage en 5 minutes
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture système
- **[SCANNER_SETUP.md](SCANNER_SETUP.md)** - Installation détaillée
- **[SECURITY_API_KEY.md](SECURITY_API_KEY.md)** - Sécurité API
- **[TESTING.md](TESTING.md)** - Tests et troubleshooting
- **[JSON_EXAMPLES.md](JSON_EXAMPLES.md)** - Exemples de données
- **[CHECKLIST.md](CHECKLIST.md)** - Checklist complète
- **[INDEX.md](INDEX.md)** - Navigation documentation

## 🧪 Tests

```bash
# Développement avec hot-reload
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

## 🐛 Troubleshooting

**Le scanner ne fonctionne pas?**
- Vérifiez votre connexion Internet
- Assurez-vous d'utiliser une image claire
- Consultez `TESTING.md` pour solutions complètes

**L'API Gemini retourne une erreur?**
- Vérifiez la clé API
- Vérifiez les quotas Google Cloud
- Voir `SECURITY_API_KEY.md`

**Des questions?**
- Consultez `QUICK_START.md` pour commencer
- Consultez `INDEX.md` pour naviguer la documentation

## 🎯 Exemples

### Scanner une recette
1. Photo de recette écrite
2. IA extrait automatiquement
3. Données affichées pour vérification
4. Ajoutée à votre collection

### Export/Import
- **Exporter** : Télécharger toutes les recettes en JSON
- **Importer** : Charger des recettes depuis un fichier JSON
- Utile pour sauvegarder ou partager

### Recherche
- Tapez le nom d'une recette
- Filtre instantané
- Voir aussi l'historique de recherche

## 📱 Responsive Design

Fonctionne parfaitement sur :
- 💻 Desktop (1920x1080+)
- 📱 Tablet (768-1024px)
- 📱 Mobile (< 768px)
- 📱 Caméra mobile pour photos

## 🚀 Déploiement

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy
```

### GitHub Pages
```bash
npm run build
# Déployer le dossier dist/
```

N'oubliez pas d'ajouter la variable d'env `VITE_GEMINI_API_KEY` chez votre hébergeur!

## 💡 Fonctionnalités futures

- [ ] Ajouter des tips & astuces
- [ ] Calculer nutritionnel
- [ ] Notes personnelles
- [ ] Favoris / étoiles
- [ ] Partage de recettes
- [ ] Sync multi-appareils (Firebase)
- [ ] Recommandations IA

## 📄 License

Ce projet utilise :
- Google Gemini API
- React (MIT)
- Tailwind CSS (MIT)
- Lucide React (MIT)
- Vite (MIT)

## 🙋 Support

Pour toute question :
1. Consultez la documentation (fichiers `.md`)
2. Vérifiez les exemples dans `JSON_EXAMPLES.md`
3. Lisez le troubleshooting dans `TESTING.md`

## 🎉 Merci!

Merci d'utiliser le Scanner de Recettes Gemini! 

Nous espérons que cet outil facilite votre gestion de recettes. 

**À bientôt dans la cuisine! 👨‍🍳📸**

---

**Version** : 1.0  
**Dernière mise à jour** : 30 novembre 2024  
**Status** : ✅ Production Ready
