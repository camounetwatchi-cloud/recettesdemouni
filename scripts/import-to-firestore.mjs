// Script Node.js pour importer les recettes du cahier rouge dans Firestore
// Exécuter avec: node scripts/import-to-firestore.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGz2VheDvzTg3sz5ckOSMOdokSwhOEQF0",
  authDomain: "recettesdemounie.firebaseapp.com",
  projectId: "recettesdemounie",
  storageBucket: "recettesdemounie.appspot.com",
  messagingSenderId: "990826026708",
  appId: "1:990826026708:web:78445f9f-55bb-4663-b629-2c5f168e5981"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importRecipes() {
  try {
    // 1. Lire le fichier JSON
    console.log('📖 Lecture du fichier recettes-cahierRouge.json...');
    const recipesPath = join(__dirname, '..', 'recettes-cahierRouge.json');
    const recipesData = JSON.parse(readFileSync(recipesPath, 'utf8'));
    console.log(`✅ ${recipesData.length} recettes trouvées\n`);

    // 2. Supprimer toutes les recettes existantes
    console.log('🗑️  Suppression des recettes existantes...');
    const existingSnapshot = await getDocs(collection(db, 'recipes'));
    let deleteCount = 0;
    for (const docSnap of existingSnapshot.docs) {
      await deleteDoc(doc(db, 'recipes', docSnap.id));
      deleteCount++;
    }
    console.log(`✅ ${deleteCount} recettes supprimées\n`);

    // 3. Importer les nouvelles recettes
    console.log('📝 Import des recettes du cahier rouge...');
    let count = 0;
    
    for (const recipe of recipesData) {
      const recipeDoc = {
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || [],
        tips: recipe.tips || [],
        tag: recipe.tag || 'Cahier rouge',
        createdAt: recipe.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'recipes', recipe.id.toString()), recipeDoc);
      count++;
      
      if (count % 20 === 0) {
        console.log(`   ${count} recettes importées...`);
      }
    }

    console.log(`\n🎉 Import terminé ! ${count} recettes importées avec succès !`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

importRecipes();
