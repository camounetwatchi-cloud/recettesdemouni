// Script pour importer les recettes du cahier rouge dans Firestore
// Exécuter avec: node scripts/importRecipes.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Configuration Firebase Admin (utilise les credentials du projet)
const serviceAccount = {
  projectId: 'recettesdemounie',
};

// Initialiser Firebase Admin avec les credentials par défaut
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'recettesdemounie'
});

const db = admin.firestore();

async function importRecipes() {
  try {
    console.log('📖 Lecture du fichier recettes-cahierRouge.json...');
    const recipesPath = path.join(__dirname, '..', 'recettes-cahierRouge.json');
    const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
    console.log(`✅ ${recipesData.length} recettes trouvées`);

    // 1. Supprimer toutes les recettes existantes
    console.log('\n🗑️  Suppression des recettes existantes...');
    const existingRecipes = await db.collection('recipes').get();
    const deletePromises = existingRecipes.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${existingRecipes.size} recettes supprimées`);

    // 2. Ajouter les nouvelles recettes
    console.log('\n📝 Import des recettes du cahier rouge...');
    const batch = db.batch();
    let count = 0;
    
    for (const recipe of recipesData) {
      const docRef = db.collection('recipes').doc(recipe.id.toString());
      batch.set(docRef, {
        ...recipe,
        updatedAt: new Date().toISOString()
      });
      count++;
      
      // Firebase limite les batch à 500 opérations
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`   ${count} recettes importées...`);
      }
    }
    
    // Commit final
    await batch.commit();
    console.log(`\n🎉 Import terminé ! ${count} recettes importées avec succès !`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

importRecipes();
