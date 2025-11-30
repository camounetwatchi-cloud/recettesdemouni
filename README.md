# 🍳 Recettes de Mouni

Application de gestion de recettes de cuisine avec scanner IA.

## ✨ Fonctionnalités

- 📸 **Scanner de recettes** - Prenez une photo d'une recette et l'IA extrait automatiquement les informations
- 🔍 **Recherche** - Recherchez dans vos recettes par nom ou ingrédient
- ☁️ **Synchronisation cloud** - Vos recettes sont synchronisées sur tous vos appareils via Firebase
- 📱 **Responsive** - Fonctionne sur mobile, tablette et desktop

## 🚀 Démarrage rapide

### Installation

```bash
npm install
npm run dev
```

### Configuration

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez vos clés API (voir ci-dessous)
3. Redémarrez le serveur de développement

```env
# Google Gemini API (pour le scanner)
VITE_GOOGLE_API_KEY=votre_cle_api_google

# Firebase (pour la synchronisation)
VITE_FIREBASE_API_KEY=votre_cle_firebase
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## 🛠️ Technologies

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase Firestore** - Base de données cloud
- **Google Gemini API** - Analyse IA des images

## 🔐 Sécurité

⚠️ **IMPORTANT** : Ne commitez **JAMAIS** vos clés API dans Git !

- Les clés doivent être dans `.env.local` (exclu de Git via `.gitignore`)
- Pour la production (Vercel), ajoutez les clés dans Environment Variables

## 📁 Structure

```
src/
├── App.jsx              # Composant principal
├── RecipeManager.jsx    # Gestionnaire de recettes
├── RecipeScanner.jsx    # Scanner IA
├── config.js            # Configuration centralisée
├── firebase.js          # Configuration Firebase
├── services/
│   └── firestoreService.js  # Service Firestore
└── components/
    └── CategoryCloud.jsx    # Nuage de catégories
```

## 🌐 Déploiement

L'application est déployée sur Vercel : https://recettesdemouni.vercel.app/

## 📄 License

MIT
