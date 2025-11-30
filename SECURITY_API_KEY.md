# 🔐 Guide de Sécurité - Clé API Gemini

## État actuel

Votre clé API est actuellement **intégrée directement dans le code** (`src/RecipeScanner.jsx`).

```javascript
const API_KEY = 'AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ';
```

## ⚠️ Risques

✗ **Développement local** : Acceptable  
✗ **Déploiement en production** : ⚠️ À RISQUE
- La clé est visible dans le code source
- Elle peut être exposée lors du commit Git
- Elle est visible dans les outils de développement (DevTools)
- Possibilité d'abus/charges API élevées

## ✅ Solutions recommandées par environnement

### 1️⃣ Option 1 : Variables d'environnement (RECOMMANDÉ)

**Étapes :**

#### Étape 1 : Créer le fichier `.env.local`

Créez un fichier à la racine du projet :

```
c:\Users\natha\recettesdemouni\.env.local
```

Contenu :
```
VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

#### Étape 2 : Mettre à jour `.gitignore`

Ouvrez `.gitignore` (ou créez-le s'il n'existe pas) et ajoutez :

```
# Variables d'environnement
.env.local
.env.*.local
```

#### Étape 3 : Modifier `RecipeScanner.jsx`

Remplacez la ligne :
```javascript
const API_KEY = 'AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ';
```

Par :
```javascript
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

#### Étape 4 : Redémarrer le serveur Vite

```bash
npm run dev
```

### 2️⃣ Option 2 : Backend proxy (PLUS SÉCURISÉ)

Pour la production, créez un backend qui gère l'API :

```javascript
// Exemple : backend route
app.post('/api/extract-recipe', async (req, res) => {
  const { imageBase64 } = req.body;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: imageBase64 } }
          ]
        }]
      })
    }
  );
  
  return res.json(await response.json());
});
```

Puis dans `RecipeScanner.jsx` :
```javascript
const response = await fetch('/api/extract-recipe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBase64, mimeType })
});
```

### 3️⃣ Option 3 : Google Cloud Restrictions (À faire immédiatement)

Dans Google Cloud Console :

1. Allez à [console.cloud.google.com](https://console.cloud.google.com)
2. Sélectionnez votre projet : `653371863060`
3. Allez à **API & Services > Credentials**
4. Sélectionnez votre clé API
5. Cliquez sur **Application restrictions** et définissez :
   - **Type** : Navigateur web (HTTP referrer)
   - **URL acceptées** : `http://localhost:5173/*` et votre domaine production
6. Sous **API restrictions**, sélectionnez uniquement l'API Gemini

## 🚀 Actions à faire MAINTENANT

### ✅ Checklist pour la production

- [ ] Créer `.env.local` avec la clé API
- [ ] Mettre à jour `RecipeScanner.jsx` pour utiliser `import.meta.env.VITE_GEMINI_API_KEY`
- [ ] Ajouter `.env.local` à `.gitignore`
- [ ] Configurer les restrictions de clé API dans Google Cloud
- [ ] Tester localement : `npm run dev`
- [ ] Builder : `npm run build`

### 📋 Checklist pour le déploiement

- [ ] Configurer les variables d'environnement chez votre hébergeur :
  - Vercel : Settings > Environment Variables
  - Netlify : Build & deploy > Environment
  - GitHub Pages : Settings > Secrets
  - etc.

## 🔄 Rotation de clé (si compromise)

1. Allez à [console.cloud.google.com](https://console.cloud.google.com)
2. Regénérez la clé API
3. Mettez à jour `.env.local`
4. Redéployez

## 📊 Monitoring

Vérifiez votre consommation API :
- [Google Cloud Console - Gemini API](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/)
- Onglet **Metrics** pour voir l'utilisation

## 📞 Support

Besoin d'aide ?
- Documentation Vite env : https://vitejs.dev/guide/env-and-mode.html
- Documentation Google Cloud : https://cloud.google.com/docs/authentication

---

**Créé le** : 30 novembre 2024  
**Priorité** : 🔴 HAUTE pour production
