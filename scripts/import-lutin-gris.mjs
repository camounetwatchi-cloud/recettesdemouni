import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Config same as import-to-firestore.mjs
const firebaseConfig = {
  apiKey: "AIzaSyDGz2VheDvzTg3sz5ckOSMOdokSwhOEQF0",
  authDomain: "recettesdemounie.firebaseapp.com",
  projectId: "recettesdemounie",
  storageBucket: "recettesdemounie.appspot.com",
  messagingSenderId: "990826026708",
  appId: "1:990826026708:web:78445f9f-55bb-4663-b629-2c5f168e5981"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importLutinGris() {
  try {
    console.log('📖 Lecture du fichier recettes-lutinGris.json...');
    const recipesPath = join(__dirname, '..', 'recettes-lutinGris.json');
    const recipesData = JSON.parse(readFileSync(recipesPath, 'utf8'));
    console.log(`✅ ${recipesData.length} recettes trouvées\n`);

    console.log('📝 Import (upsert) des recettes Lutin Gris dans la collection `recipes`...');
    let count = 0;
    for (const recipe of recipesData) {
      const recipeDoc = {
        ...recipe,
        // Marquer ces recettes comme "Notales" pour les distinguer dans le site
        tag: 'Notales',
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'recipes', recipe.id.toString()), recipeDoc);
      count++;
      if (count % 20 === 0) console.log(`   ${count} recettes importées...`);
    }

    console.log(`\n🎉 Import terminé ! ${count} recettes importées/à jour.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  }
}

importLutinGris();
