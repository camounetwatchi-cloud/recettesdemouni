# 🧪 Tests et Dépannage

## ✅ Checklist de vérification

### Avant le premier test

- [ ] Tous les fichiers créés/modifiés
- [ ] `npm install` exécuté
- [ ] Serveur `npm run dev` lancé
- [ ] Navigateur sur `http://localhost:5173`
- [ ] Console sans erreurs

### Test basique

1. **Bouton apparaît**
   - Vérifiez présence du bouton vert "Scanner une recette"
   - Location : Navbar en haut à droite

2. **Modal s'ouvre**
   - Cliquez sur "Scanner une recette"
   - Une fenêtre modale doit apparaître

3. **Options d'upload**
   - Deux boutons : "Importer une photo" et "Prendre une photo"
   - Cliquez pour sélectionner/capturer

## 📸 Images de test

### Bonnes images pour tester

✅ Recettes claires, bien lisibles
✅ Texte noir sur fond blanc
✅ Bonne résolution (1920x1080 minimum)
✅ Format : JPG, PNG

### Mauvaises images

❌ Photos floues
❌ Texte trop petit
❌ Plusieurs pages sur une image
❌ Rotation bizarre
❌ Contre-jour

**Où trouver des images de test** :
- Google Images : "recette cuisine photo"
- Pinterest : Recettes avec texte visible
- Livre de cuisine scanné

## 🐛 Erreurs courantes et solutions

### Erreur 1 : "API key not defined"

**Symptôme** :
```
TypeError: API_KEY is not defined
```

**Cause** : La clé API n'est pas trouvée

**Solution** :
```javascript
// ✗ Mauvais
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// ✓ Correct - Assurez-vous d'avoir .env.local
VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ
```

Redémarrez `npm run dev`

### Erreur 2 : "400 Bad Request"

**Symptôme** :
```
Erreur lors de l'appel API Gemini
```

**Cause** : Format d'image incorrect

**Solutions** :
- Vérifiez que c'est bien une image
- Testez avec JPG au lieu de PNG
- Vérifiez taille < 20MB
- Vérifiez que `mimeType` est correct

### Erreur 3 : "JSON parse error"

**Symptôme** :
```
JSON.parse error
```

**Cause** : L'IA n'a pas retourné du JSON valide

**Solutions** :
- Utilisez une meilleure image
- Assurez-vous que le texte de recette est visible
- Vérifiez le prompt dans le code

### Erreur 4 : "Aucune réponse de l'API"

**Symptôme** :
```
Aucune réponse de l'API Gemini
```

**Cause** : Problème serveur ou quota dépassé

**Solutions** :
```bash
# Vérifiez votre connexion Internet
# Testez une autre image
# Vérifiez la console (F12 > Network)
# Vérifiez les quotas Google Cloud
```

### Erreur 5 : "Modal ne s'ouvre pas"

**Symptôme** : Bouton clickable mais rien ne se passe

**Cause** : État `showScanner` non mis à jour

**Solutions** :
```javascript
// Vérifiez dans RecipeManager.jsx que :
// 1. showScanner est défini
const [showScanner, setShowScanner] = useState(false);

// 2. Le bouton appelle setShowScanner(true)
<button onClick={() => setShowScanner(true)}>

// 3. La condition de rendu est là
{showScanner && <RecipeScanner ... />}
```

## 🔍 Debugging

### Activer les logs

Modifiez `RecipeScanner.jsx` pour ajouter des console.log :

```javascript
// Ligne 47 - Avant l'appel API
console.log('Image Base64:', imageBase64.substring(0, 50) + '...');

// Ligne 80 - Après la réponse
console.log('Réponse API:', data);
console.log('Texte brut:', responseText);

// Ligne 90 - Après parsing
console.log('Recette parsée:', recipe);
```

Puis ouvrez F12 > Console pour voir les logs.

### Vérifier les headers de requête

1. Ouvrez F12 > Network
2. Effectuez un scan
3. Cherchez le requête avec URL contenant "generativelanguage"
4. Vérifiez :
   - Status : 200 ✓
   - Content-Type : application/json
   - Body : Votre requête JSON

## 🧬 Test de bout en bout

### Scénario 1 : Scan simple

1. Prenez une photo d'une recette écrite à la main
2. Uploadez-la
3. Attendez 2-5 secondes
4. Vérifiez que les données sont correctes
5. Cliquez "Ajouter"
6. Vérifiez dans "Toutes les recettes" que c'est ajouté

**Résultat attendu** : ✅ Recette ajoutée avec succès

### Scénario 2 : Scan caméra

1. Cliquez "Prendre une photo"
2. Photographiez une recette
3. Acceptez la photo
4. L'IA l'analyse
5. Vérifiez les résultats
6. Cliquez "Ajouter"

**Résultat attendu** : ✅ Recette disponible

### Scénario 3 : Correction données

1. Scannez une recette
2. Vérifiez les données
3. Cliquez "Recommencer"
4. Uploadez une meilleure image
5. Les données sont meilleures
6. Cliquez "Ajouter"

**Résultat attendu** : ✅ Recette correct ajoutée

### Scénario 4 : Gestion erreurs

1. Uploadez une image qui n'est pas une recette
2. L'IA doit afficher un message d'erreur
3. Cliquez "Réessayer"
4. Uploadez une vraie recette
5. Ça fonctionne

**Résultat attendu** : ✅ Gestion d'erreur correcte

## 📊 Test de performance

### Mesurer le temps

Ouvrez DevTools (F12) > Performance et enregistrez :

1. Cliquez sur scanner
2. Sélectionnez image
3. Attendez résultats
4. Stoppez l'enregistrement

**Temps attendu** :
- Upload image : < 1s
- Analyse IA : 2-5s
- Parse résultat : < 100ms
- Total : ~2-6s

## 🎨 Test visuel

### Mobile

1. Ouvrez sur téléphone : `http://YOUR_IP:5173`
2. Testez le bouton "Prendre une photo"
3. Vérifiez l'UI sur petit écran
4. Testez landscape/portrait

**Résultat attendu** : ✅ Responsive et utilisable

### Desktop

1. Testez sur 1920x1080
2. Testez sur 1366x768
3. Testez sur 1024x768

**Résultat attendu** : ✅ Interface adaptée

## 📝 Logs à collecter pour support

Si vous avez un problème, fournissez :

```
1. Screenshot du message d'erreur
2. Sortie de la console (F12 > Console)
3. Onglet Network > Request/Response
4. Image utilisée (anonymisée)
5. Navigateur + OS
6. Version de Node.js : node --version
```

## ✨ Tests spéciaux

### Test sans Internet

1. Désactivez Internet
2. Cliquez scanner
3. Sélectionnez image
4. Devrait afficher "Erreur lors de l'appel API Gemini"

**Résultat attendu** : ✅ Message d'erreur approprié

### Test avec clé invalide

Modifiez temporairement la clé API :
```javascript
const API_KEY = 'INVALID_KEY_123';
```

1. Cliquez scanner
2. Sélectionnez image
3. Devrait afficher une erreur d'authentification

**Résultat attendu** : ✅ Erreur d'auth détectée

### Test image grande

Uploadez une image de 10MB+

**Résultat attendu** :
- ✅ Fonctionne (< 20MB)
- ❌ Erreur (> 20MB)

## 🎓 Commandes de débogage utiles

```bash
# Vérifier Node.js
node --version
npm --version

# Vérifier les dépendances
npm list

# Reconstruire les modules
npm ci

# Nettoyer le cache Vite
rm -r node_modules/.vite

# Vérifier les ports
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux
```

## 🔔 Alertes importantes

⚠️ **Ne jamais commiter la clé API** :
```bash
git status
# Si .env.local apparaît, roulez :
git rm --cached .env.local
```

⚠️ **Vérifiez les quotas Google Cloud** :
- Allez à [console.cloud.google.com](https://console.cloud.google.com)
- Vérifiez usage vs quota

⚠️ **Testez sur une recette réelle** :
- Ne testez pas avec du Lorem Ipsum
- Utilisez une vraie recette écrite

---

**Dernière mise à jour** : 30 novembre 2024
