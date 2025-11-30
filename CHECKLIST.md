# ✅ Checklist Complète - Scanner de Recettes Gemini

## 🎯 Avant de commencer

### Prérequis
- [ ] Node.js et npm installés
- [ ] Projet React existant (Vite) fonctionnel
- [ ] Terminal accessible
- [ ] Éditeur de code (VS Code, etc.)
- [ ] Connexion Internet active

---

## 📥 Phase 1 : Installation (5 minutes)

### 1.1 Vérifier les fichiers
- [ ] `src/RecipeScanner.jsx` créé ✅
- [ ] `src/RecipeManager.jsx` modifié ✅
- [ ] Tous les `.md` créés ✅

**Commande** :
```bash
ls src/
# Doit afficher RecipeScanner.jsx et RecipeManager.jsx
```

### 1.2 Installer dépendances
- [ ] Exécuter `npm install`
- [ ] Pas d'erreurs dans la sortie
- [ ] `node_modules/` créé

```bash
cd c:\Users\natha\recettesdemouni
npm install
```

### 1.3 Vérifier les imports
- [ ] RecipeScanner.jsx importe React
- [ ] RecipeScanner.jsx importe les icones Lucide
- [ ] RecipeManager.jsx importe RecipeScanner

---

## 🧪 Phase 2 : Tests locaux (10 minutes)

### 2.1 Démarrer le serveur
- [ ] Exécuter `npm run dev`
- [ ] Aucune erreur de compilation
- [ ] URL affichée (exemple: http://localhost:5173)

```bash
npm run dev
```

### 2.2 Accéder à l'app
- [ ] Ouvrir le navigateur
- [ ] Naviguer à http://localhost:5173
- [ ] Page charge sans erreur
- [ ] Console (F12) sans erreurs rouges

### 2.3 Vérifier l'UI
- [ ] Logo "Recettes de mounie" visible
- [ ] Bouton "Scanner une recette" visible (vert)
- [ ] Bouton entre "Trouver" et "Ajouter"
- [ ] UI responsive sur mobile (Inspecter, mobile mode)

**Touches clavier** :
- F12 → DevTools
- Ctrl+Shift+I → Inspect
- Ctrl+Shift+M → Mode mobile

### 2.4 Tester le scanner
- [ ] Cliquer "Scanner une recette"
- [ ] Modal s'ouvre
- [ ] Voir "Importer une photo"
- [ ] Voir "Prendre une photo"
- [ ] Voir bouton X pour fermer

### 2.5 Tester upload
- [ ] Cliquer "Importer une photo"
- [ ] Sélecteur fichier s'ouvre
- [ ] Vérifier formats acceptés
- [ ] Annuler (Escape)

### 2.6 Tester fermeture
- [ ] Cliquer X ou Escape
- [ ] Modal se ferme
- [ ] Retour à la page principale

---

## 🎬 Phase 3 : Test réel avec image (15 minutes)

### 3.1 Préparer une image
- [ ] Avoir une photo de recette écrite
- [ ] Image claire et lisible
- [ ] Format JPG ou PNG
- [ ] Taille < 20MB
- [ ] Résolution décente (800x600 minimum)

**Sources d'images de test** :
- Google Images: "recette cuisine écrite"
- Pinterest: "handwritten recipes"
- Votre propre recette écrite

### 3.2 Scanner la recette
- [ ] Cliquer "Scanner une recette"
- [ ] Cliquer "Importer une photo"
- [ ] Sélectionner votre image
- [ ] Attendre (loader tournant)
- [ ] Attend 2-5 secondes

### 3.3 Vérifier les résultats
- [ ] Modal affiche nom recette
- [ ] Ingrédients visibles
- [ ] Étapes visibles
- [ ] Temps affichés (optionnel)
- [ ] Difficulté affichée (optionnel)

### 3.4 Valider ou corriger
- [ ] Revérifier les données
- [ ] Si OK → Cliquer "Ajouter cette recette"
- [ ] Si mauvais → Cliquer "Recommencer"

### 3.5 Vérifier la sauvegarde
- [ ] Cliquer "Ajouter"
- [ ] Modal ferme
- [ ] Message "Recette ajoutée avec succès"
- [ ] Retour page recherche
- [ ] Recette visible dans "Toutes les recettes"
- [ ] Recette dans "Dernières recherches"

---

## 📱 Phase 4 : Test Mobile (10 minutes)

### 4.1 Sur smartphone/tablette
- [ ] Ouvrir depuis mobile (même IP que PC)
- [ ] Naviguer à http://PC_IP:5173
- [ ] UI adaptée à mobile
- [ ] Toucher responsive

### 4.2 Tester caméra
- [ ] Cliquer "Scanner une recette"
- [ ] Cliquer "Prendre une photo"
- [ ] Caméra s'ouvre (si browser supporte)
- [ ] Photographier une recette
- [ ] Accepter la photo
- [ ] IA analyse

### 4.3 Vérifier les résultats
- [ ] Mêmes données qu'en desktop
- [ ] UI lisible sur petit écran
- [ ] Buttons cliquables (pas trop petits)

---

## 🔐 Phase 5 : Sécurité (5 minutes)

### 5.1 Vérifier la clé API actuelle
- [ ] Code contient API_KEY
- [ ] Clé : `AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ`
- [ ] Code fonctionne

### 5.2 Optionnel - Sécuriser pour production
- [ ] Créer `.env.local` à la racine
- [ ] Ajouter : `VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ`
- [ ] Modifier RecipeScanner.jsx ligne 8
- [ ] Tester que ça marche toujours
- [ ] `.gitignore` contient `.env.local`

```bash
# Créer .env.local
echo "VITE_GEMINI_API_KEY=AIzaSyB2etdOlkT4-k1R4Ir881dfyE5fTiAPBTQ" > .env.local

# Vérifier .gitignore
# Doit contenir ".env.local"
```

### 5.3 Vérifier que .env.local est ignoré
- [ ] `git status` ne montre pas `.env.local`
- [ ] `git ls-files` ne contient pas `.env.local`

```bash
git status
# Ne doit pas lister .env.local
```

---

## 📊 Phase 6 : Tests supplémentaires (optionnel)

### 6.1 Test d'erreur - Image invalide
- [ ] Télécharger un fichier non-image (.txt, .pdf)
- [ ] Devrait afficher "Veuillez sélectionner une image valide"

### 6.2 Test d'erreur - Image pas lisible
- [ ] Uploader photo floue ou non recette
- [ ] Devrait montrer erreur
- [ ] Proposer réessayer

### 6.3 Test - Offline
- [ ] Désactiver Internet
- [ ] Cliquer scanner
- [ ] Uploader image
- [ ] Devrait afficher "Erreur lors de l'appel API"

### 6.4 Test - Export/Import
- [ ] Cliquer "Exporter"
- [ ] Fichier JSON téléchargé
- [ ] Vérifier contenu recette
- [ ] Cliquer "Importer"
- [ ] Sélectionner JSON
- [ ] Vérifier recette importée

### 6.5 Test - Recherche
- [ ] Ajouter plusieurs recettes
- [ ] Barre recherche
- [ ] Taper nom recette
- [ ] Devrait filtrer

---

## 🚀 Phase 7 : Préparation Production

### 7.1 Build
- [ ] Exécuter `npm run build`
- [ ] Aucune erreur
- [ ] Dossier `dist/` créé
- [ ] Fichiers dans dist/ (index.html, js, css)

```bash
npm run build
ls dist/
```

### 7.2 Vérifier build
- [ ] `dist/index.html` existe
- [ ] `dist/assets/` contient fichiers JS
- [ ] Taille raisonnable (< 500KB gzip)

### 7.3 Tester build localement
- [ ] Exécuter `npm run preview`
- [ ] Ouvrir URL affichée
- [ ] Tester scanner
- [ ] Fonctionne comme dev

```bash
npm run preview
# Testera depuis dist/
```

### 7.4 Préparer déploiement
- [ ] Choisir plateforme (Vercel, Netlify, etc.)
- [ ] Créer compte si nécessaire
- [ ] Connecter repo GitHub (si utilisé)
- [ ] Ajouter variable d'env : `VITE_GEMINI_API_KEY`

---

## 📚 Phase 8 : Documentation

### 8.1 Lire la documentation
- [ ] Lire `QUICK_START.md` (5 min)
- [ ] Lire `ARCHITECTURE.md` (10 min)
- [ ] Lire `SECURITY_API_KEY.md` (5 min)
- [ ] Garder `TESTING.md` comme référence

### 8.2 Comprendre le flux
- [ ] Comprendre comment ça marche
- [ ] Savoir où se trouvent les fichiers
- [ ] Savoir où sauvegarder les données
- [ ] Savoir comment étendre

### 8.3 Bookmark les ressources
- [ ] Marquer fichiers `.md` comme favori
- [ ] Nota le Google Cloud Console lien
- [ ] Note l'API Gemini docs lien

---

## 🎓 Phase 9 : Utilisation quotidienne

### 9.1 Utilisation basique
- [ ] Scanner recettes régulièrement
- [ ] Vérifier données avant ajout
- [ ] Exporter régulièrement (sauvegarde)
- [ ] Importer depuis autre appareil

### 9.2 Maintenance
- [ ] Vérifier console pour erreurs (F12)
- [ ] Vérifier localStorage pas plein
- [ ] Supprimer recettes inutilisées
- [ ] Faire backups JSON

### 9.3 Améliorations
- [ ] Noter les problèmes rencontrés
- [ ] Suggérer de nouvelles fonctionnalités
- [ ] Contribuer améliorations (si open source)

---

## 🎁 Phase 10 : Bonus (optionnel)

### 10.1 Personnalisation UI
- [ ] Modifier couleurs (Tailwind)
- [ ] Ajouter logo/branding
- [ ] Changer polices
- [ ] Adapter layout

### 10.2 Ajouter fonctionnalités
- [ ] Tips & astuces (champ supplémentaire)
- [ ] Nutrition (calcul calories)
- [ ] Notes personnelles
- [ ] Favoris/étoiles
- [ ] Partage recettes

### 10.3 Optimiser performance
- [ ] Compresser images
- [ ] Cache résultats scans
- [ ] Lazy loading
- [ ] Code splitting

---

## ✅ Checklist finale - DÉPLOIEMENT

### Avant de déployer en production

- [ ] Aucune erreur en console (F12)
- [ ] `npm run build` réussi
- [ ] `.env.local` créé avec clé API
- [ ] `.gitignore` contient `.env.local`
- [ ] Git status clean (pas de .env.local)
- [ ] Scanner teste et fonctionne
- [ ] Vérifier quotas Google Cloud
- [ ] Lire SECURITY_API_KEY.md

### Déploiement

- [ ] Configuré plateforme (Vercel/Netlify)
- [ ] Ajouté variables d'env
- [ ] Push vers GitHub
- [ ] Build déclenché
- [ ] URL production générée
- [ ] Tester depuis production URL
- [ ] Scanner fonctionne en production

---

## 🆘 Troubleshooting rapide

| Problème | Checklist |
|----------|-----------|
| **Bouton invisible** | [ ] `npm run dev` running? [ ] F12 pas d'erreurs? |
| **Modal ne s'ouvre pas** | [ ] État showScanner? [ ] Cliquer bien? [ ] Console erreurs? |
| **"Erreur API"** | [ ] Internet OK? [ ] Clé API correcte? [ ] Image valide? |
| **Mauvais JSON** | [ ] Image lisible? [ ] Recette visible? [ ] Bonne image? |
| **Build échoue** | [ ] npm install OK? [ ] Syntax errors? [ ] import correct? |
| **Prod ne fonctionne pas** | [ ] Env var défini? [ ] .env.local ignoré? [ ] Build recent? |

---

## 🎯 Objectifs atteints

Une fois tout complété, vous aurez :

- ✅ Scanner de recettes fonctionnel
- ✅ Intégration Gemini réussie
- ✅ UI intuitive et utilisable
- ✅ Données sauvegardées
- ✅ Prêt pour production
- ✅ Entièrement documenté
- ✅ Testée et validée
- ✅ Extensible et maintenable

---

## 📞 Besoin d'aide?

1. **Erreur spécifique** → Voir `TESTING.md`
2. **Comprendre le code** → Voir `ARCHITECTURE.md`
3. **Sécurité** → Voir `SECURITY_API_KEY.md`
4. **Comment utiliser** → Voir `QUICK_START.md`
5. **Exemples de données** → Voir `JSON_EXAMPLES.md`

---

## 🎊 Félicitations!

Si vous avez complété cette checklist, vous êtes prêt à utiliser votre **Scanner de Recettes Gemini** ! 

```
🎉 À bientôt dans la cuisine! 👨‍🍳📸
```

---

**Créé le** : 30 novembre 2024  
**Statut** : ✅ À JOUR  
**Dernière révision** : Version 1.0
