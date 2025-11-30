# 🆘 Erreurs courantes et solutions

## ⚠️ Erreur: \"Bouton scanner ne s'affiche pas\"

### Symptômes
- Pas de bouton vert \"Scanner une recette\" en haut
- Boutons normaux présents (Trouver, Ajouter)

### Solutions
1. Vérifiez que `npm run dev` est bien lancé
2. Ouvrez F12 (DevTools)
3. Allez dans l'onglet Console
4. Vérifiez s'il y a des messages d'erreur en rouge
5. Si erreur: consultez TESTING.md

### Cause probable
- Erreur de compilation
- Problème d'import RecipeScanner

---

## ⚠️ Erreur: \"Modal ne s'ouvre pas quand je clique sur Scanner\"

### Symptômes
- Bouton présent
- Au clic: rien ne se passe
- Pas de message d'erreur visible

### Solutions
1. Ouvrez F12 > Console
2. Cliquez sur le bouton
3. Regardez s'il y a des erreurs
4. Actualiz la page (Ctrl+R)
5. Réessayez

### Cause probable
- État React non mis à jour
- Cache navigateur

---

## ⚠️ Erreur: \"Erreur lors de l'appel API Gemini\"

### Symptômes
- Scanner fonctionne
- Image sélectionnée
- Après 2-3 secondes: \"Erreur lors de l'appel API Gemini\"

### Solutions
1. **Vérifiez Internet**
   - Testez une autre page web
   - Redémarrez Internet

2. **Vérifiez la clé API**
   - Ouvrez F12 > Network
   - Cherchez requête \"generativelanguage\"
   - Vérifiez le status (200 = ok)

3. **Essayez une autre image**
   - Image précédente peut être corruptée
   - Téléchargez nouvelle image

4. **Redémarrez dev**
   ```bash
   Ctrl+C (dans terminal)
   npm run dev
   ```

### Cause probable
- Pas d'Internet
- Clé API invalide
- Quotas dépassés

---

## ⚠️ Erreur: \"JSON parse error\"

### Symptômes
- Image uploadée
- IA commence l'analyse
- Erreur: \"Impossible de parser JSON\"

### Solutions
1. **Utilisez meilleure image**
   - Recette doit être bien lisible
   - Pas de photo floue
   - Texte noir sur fond blanc

2. **Vérifiez que c'est une recette**
   - L'image doit contenir une recette
   - Pas du Lorem ipsum
   - Doit avoir: nom, ingrédients, étapes

3. **Réessayez**
   - Prenez meilleure photo
   - Clicker \"Recommencer\"
   - Réuploadez

### Cause probable
- Image pas assez lisible
- Pas une vraie recette

---

## ⚠️ Erreur: \"npm install échoue\"

### Symptômes
```
npm ERR! something went wrong
npm ERR! not ok code 0
```

### Solutions
1. **Nettoyez le cache npm**
   ```bash
   npm cache clean --force
   ```

2. **Supprimez et réinstallez**
   ```bash
   rm -r node_modules
   npm install
   ```

3. **Utilisez npm ci**
   ```bash
   npm ci
   ```

4. **Vérifiez Node.js**
   ```bash
   node --version
   npm --version
   ```
   Minimum: Node 14, npm 6

---

## ⚠️ Erreur: \"La recette s'ajoute mais disparaît après rechargement\"

### Symptômes
- Recette visible après ajout
- Actualiser la page
- Recette disparue

### Solutions
1. **Vérifiez localStorage**
   - F12 > Application > localStorage
   - Cherchez clé \"recipes\"
   - Doit avoir contenu JSON

2. **Problème permissions?**
   - Mode incognito désactive localStorage
   - Utilisez mode normal

3. **Stockage plein?**
   - F12 > Storage
   - Vérifiez usage localStorage
   - Si plein: exporter et vider

### Cause probable
- localStorage désactivé
- Mode incognito
- Storage plein

---

## ⚠️ Erreur: \"Build production échoue\"

### Symptômes
```bash
$ npm run build
Error during build
```

### Solutions
1. **Vérifiez la syntaxe**
   ```bash
   npm run build
   # Lire le message d'erreur entièrement
   ```

2. **Cherchez l'erreur dans le code**
   - Vérifiez RecipeScanner.jsx
   - Vérifiez RecipeManager.jsx
   - Consultez le numéro de ligne indiqué

3. **Nettoyez**
   ```bash
   rm -r dist
   npm run build
   ```

4. **Redémarrez**
   ```bash
   npm install
   npm run build
   ```

---

## ⚠️ Erreur: \"Image trop grande\"

### Symptômes
- Upload image
- Rien ne se passe
- Pas d'analyse

### Solutions
1. **Compressez l'image**
   - Utiliser outil de compression
   - Réduire résolution
   - Limiter à 2000x2000 pixels

2. **Convertissez format**
   - De PNG → JPG (plus petit)
   - Utiliser outil en ligne

3. **Vérifiez taille**
   - Doit être < 20MB
   - Généralement 1-5MB

---

## ⚠️ Erreur: \"Problème avec caméra mobile\"

### Symptômes
- Cliquer \"Prendre une photo\"
- Caméra ne s'ouvre pas
- Ou: Permission refusée

### Solutions
1. **Vérifiez permissions**
   - iOS: Settings > App > Permissions
   - Android: Settings > Apps > Permissions

2. **Utilisez HTTPS**
   - Caméra nécessite HTTPS
   - Sur localhost: OK
   - Sur production: doit être https://

3. **Essayez autre navigateur**
   - Chrome, Firefox, Safari
   - Certains browsers supportent mieux

---

## 🆘 BESOIN D'AIDE?

### Consultez
1. Ce fichier (ERREURS.md)
2. TESTING.md (Troubleshooting complet)
3. QUICK_START.md (Démarrage basique)
4. ARCHITECTURE.md (Comprendre le code)

### Étapes troubleshooting

1. **Ouvrez F12 (DevTools)**
   - Onglet Console
   - Onglet Network

2. **Reproduisez l'erreur**
   - Répétez exactement ce qui cause le problème

3. **Lisez le message d'erreur**
   - En rouge dans Console
   - Important: lire entièrement

4. **Cherchez solution**
   - Dans ce fichier
   - Dans TESTING.md

5. **Redémarrez si besoin**
   ```bash
   Ctrl+C
   npm run dev
   ```

---

## 📊 Tableau erreurs rapide

| Erreur | Cause probable | Solution |
|--------|----------------|----------|
| Bouton pas visible | Bug React | F12 > Console |
| Modal ferme | État oublié | Recharger |
| API erreur | Pas Internet | Vérifier connexion |
| JSON invalide | Image floue | Meilleure photo |
| localStorage vide | Mode incognito | Mode normal |
| Build échoue | Erreur syntaxe | Vérifier code |
| Caméra pas marche | Permissions | Autoriser app |

---

## ✅ VÉRIFICATION AVANT DE CHERCHER L'ERREUR

- [ ] `npm run dev` lancé?
- [ ] Page rechargée?
- [ ] F12 ouvert (console)?
- [ ] Pas d'erreur rouge?
- [ ] Internet connecté?
- [ ] Image valide?

Si **OUI** partout: le système fonctionne!

---

**Créé le**: 30 novembre 2024  
**Version**: 1.0
