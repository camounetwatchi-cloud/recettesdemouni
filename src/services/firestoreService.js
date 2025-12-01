import { 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  query,
  getDoc,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection Firestore pour les recettes
const RECIPES_COLLECTION = 'recipes';

// Fonction pour vérifier la connectivité réseau Firestore
const checkFirestoreConnection = async () => {
  try {
    // Forcer la reconnexion réseau
    await enableNetwork(db);
    console.log('🌐 Firebase: Réseau activé');
    return true;
  } catch (error) {
    console.error('❌ Firebase: Erreur réseau:', error);
    return false;
  }
};

// Récupérer toutes les recettes
export const getRecipes = async () => {
  try {
    console.log('🔥 Firebase: Chargement initial des recettes...');
    console.log('🔥 Firebase: Collection:', RECIPES_COLLECTION);
    console.log('🔥 Firebase: DB instance:', db ? '✓ OK' : '✗ NULL');
    console.log('🔥 Firebase: Project ID:', db?.app?.options?.projectId || 'INCONNU');
    
    // Vérifier la connexion
    await checkFirestoreConnection();
    
    const colRef = collection(db, RECIPES_COLLECTION);
    console.log('🔥 Firebase: Collection reference créée');
    
    const querySnapshot = await getDocs(colRef);
    console.log('🔥 Firebase: Query exécutée, docs:', querySnapshot.size);
    console.log('🔥 Firebase: Source des données:', querySnapshot.metadata.fromCache ? 'CACHE' : 'SERVEUR');
    
    const recipes = [];
    querySnapshot.forEach((doc) => {
      console.log('🔥 Firebase: Document trouvé:', doc.id);
      recipes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log(`✅ Firebase: ${recipes.length} recette(s) chargée(s)`);
    return recipes;
  } catch (error) {
    console.error('❌ Firebase: Erreur lors de la récupération des recettes:', error);
    console.error('❌ Firebase: Code erreur:', error.code);
    console.error('❌ Firebase: Message:', error.message);
    return [];
  }
};

// Écouter les changements en temps réel
export const onRecipesChange = (callback) => {
  try {
    console.log('🔥 Firebase: Mise en écoute des recettes en temps réel...');
    const q = query(collection(db, RECIPES_COLLECTION));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      console.log(`📊 Firebase: ${recipes.length} recette(s) reçue(s)`);
      callback(recipes);
    }, (error) => {
      console.error('❌ Firebase: Erreur du listener temps réel:', error);
    });
    return unsubscribe;
  } catch (error) {
    console.error('❌ Firebase: Erreur lors de l\'écoute des recettes:', error);
    return () => {};
  }
};

// Sauvegarder une recette
export const saveRecipe = async (recipe) => {
  try {
    const recipeId = recipe.id.toString();
    console.log('🔥 Firebase: Sauvegarde de la recette ID', recipeId);
    console.log('🔥 Firebase: Données à sauvegarder:', JSON.stringify(recipe).substring(0, 200));
    console.log('🔥 Firebase: Project ID utilisé:', db.app.options.projectId);
    
    // Forcer la connexion réseau avant d'écrire
    await checkFirestoreConnection();
    
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    console.log('🔥 Firebase: Document reference créée pour path:', docRef.path);
    
    const dataToSave = {
      ...recipe,
      updatedAt: new Date().toISOString()
    };
    
    console.log('🔥 Firebase: Appel setDoc en cours...');
    const startTime = Date.now();
    
    await setDoc(docRef, dataToSave);
    
    const endTime = Date.now();
    console.log(`✅ Firebase: Recette sauvegardée avec succès en ${endTime - startTime}ms`);
    
    // Vérification immédiate - relire le document
    console.log('🔍 Firebase: Vérification - lecture du document...');
    const savedDoc = await getDoc(docRef);
    
    console.log('🔍 Firebase: Source de vérification:', savedDoc.metadata.fromCache ? 'CACHE (pas encore sur serveur!)' : 'SERVEUR (confirmé!)');
    
    if (savedDoc.exists()) {
      console.log('✅ Firebase: Document vérifié, il EXISTE');
      console.log('🔥 Firebase: Données lues:', JSON.stringify(savedDoc.data()).substring(0, 100));
    } else {
      console.error('❌ Firebase: PROBLÈME - Le document N\'EXISTE PAS après sauvegarde!');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firebase: Erreur lors de la sauvegarde de la recette:', error);
    console.error('❌ Firebase: Code erreur:', error.code);
    console.error('❌ Firebase: Message:', error.message);
    console.error('❌ Firebase: Stack:', error.stack);
    throw error;
  }
};

// Sauvegarder plusieurs recettes
export const saveRecipes = async (recipes) => {
  try {
    console.log(`🔥 Firebase: Sauvegarde de ${recipes.length} recettes`);
    for (const recipe of recipes) {
      const recipeId = recipe.id.toString();
      await setDoc(doc(db, RECIPES_COLLECTION, recipeId), {
        ...recipe,
        updatedAt: new Date().toISOString()
      });
    }
    console.log('✅ Firebase: Toutes les recettes sauvegardées');
    return true;
  } catch (error) {
    console.error('❌ Firebase: Erreur lors de la sauvegarde des recettes:', error);
    throw error;
  }
};

// Supprimer une recette
export const deleteRecipe = async (recipeId) => {
  try {
    await deleteDoc(doc(db, RECIPES_COLLECTION, recipeId.toString()));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error);
    return false;
  }
};

// Mettre à jour une recette
export const updateRecipe = async (recipeId, updates) => {
  try {
    await updateDoc(doc(db, RECIPES_COLLECTION, recipeId.toString()), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recette:', error);
    return false;
  }
};
