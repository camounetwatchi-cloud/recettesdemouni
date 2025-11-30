# 🔒 Guide de Sécurité - Gestion des Clés API

## ⚠️ Règles Essentielles

### ❌ JAMAIS faire ça:
- Ne commit **JAMAIS** les fichiers `.env.local` ou `.env` 
- Ne commit **JAMAIS** les clés API, tokens, ou credentials
- Ne commit **JAMAIS** les fichiers `*firebase-adminsdk*.json`
- Ne partage **JAMAIS** tes clés API en clair sur Discord/GitHub/Mail

### ✅ TOUJOURS faire ça:
- Stocke les clés **UNIQUEMENT** dans:
  - `.env.local` pour le développement local (exclu de Git)
  - **Vercel Environment Variables** pour la production
- Utilise le fichier `src/config.js` pour accéder aux variables
- Regénère une nouvelle clé API si tu penses qu'elle a été compromise

---

## 📋 Configuration Locale (Développement)

### 1. Créer `.env.local` à la racine du projet:

```env
# Google Gemini API
VITE_GOOGLE_API_KEY=AIzaSyBFvcP122qCDSoBuxtkn3kZG6RFI9A9AJM

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
VITE_FIREBASE_AUTH_DOMAIN=recettesdemounie.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=recettesdemounie
VITE_FIREBASE_STORAGE_BUCKET=recettesdemounie.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=990826026708
VITE_FIREBASE_APP_ID=1:990826026708:web:78445f9f-55bb-4663-b629-2c5f168e5981
```

### 2. Vérifier que `.gitignore` contient:
```
.env.local
.env.*.local
*firebase-adminsdk*.json
```

### 3. Redémarrer le dev server après créer `.env.local`:
```bash
npm run dev
```

---

## 🚀 Configuration Production (Vercel)

### 1. Ajouter les variables dans Vercel Dashboard:

1. Va sur https://vercel.com/dashboard
2. Clique sur ton projet `recettesdemouni`
3. Onglet **Settings** → **Environment Variables**
4. Ajoute chaque variable avec le scope: `Production`, `Preview`, `Development`

**Variables à ajouter:**
- `VITE_GOOGLE_API_KEY` 
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 2. Vercel va redéployer automatiquement ✓

---

## 🔑 Gestion des Clés Compromises

Si une clé a été exposée ou compromise:

### 1. Générer une nouvelle clé:
- **Google API Key**: https://console.cloud.google.com/ → APIs & Services → Credentials → Create New
- **Firebase**: https://console.firebase.google.com/ → Project Settings → Service Accounts

### 2. Mettre à jour immédiatement:
- `.env.local` (local)
- Vercel Environment Variables (production)

### 3. Supprimer l'ancienne clé partout

---

## 🛡️ Checklist de Sécurité

- [ ] `.env.local` existe et contient toutes les clés
- [ ] `.env.local` est dans `.gitignore`
- [ ] Aucun fichier `*firebase-adminsdk*.json` commité
- [ ] Toutes les variables sont dans Vercel Environment Variables
- [ ] `src/config.js` est utilisé pour accéder aux variables
- [ ] Pas de clés en dur dans le code (sauf via `config.js`)

---

## 📖 Utilisation dans le Code

**Bon ✓:**
```javascript
import { GOOGLE_API_KEY } from './config.js';

const fetchFromGemini = async (prompt) => {
  const response = await fetch(`https://api.gemini.com?key=${GOOGLE_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({ prompt })
  });
};
```

**Mauvais ✗:**
```javascript
// Ne JAMAIS faire ça:
const API_KEY = "AIzaSy..."; // Hardcoded!
const key = import.meta.env.VITE_GOOGLE_API_KEY; // Direct sans fallback!
```

---

## 🚨 En cas de Fuite

1. **Supprime immédiatement** la clé compromise dans Google Cloud/Firebase Console
2. **Génère une nouvelle clé**
3. **Mets à jour** `.env.local` et Vercel
4. **Force un redéploiement** sur Vercel
5. **Vérifie les logs** pour voir s'il y a eu accès non autorisé

---

## 📞 Questions?

Consulte:
- `.gitignore` - fichiers exclus de Git
- `src/config.js` - chargement sécurisé des variables
- `vite.config.js` - configuration Vite
