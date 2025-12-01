import { 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot,
  query
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection Firestore pour les recettes
const RECIPES_COLLECTION = 'recipes';

// Récupérer toutes les recettes
export const getRecipes = async () => {
  try {
    console.log('🔥 Firebase: Chargement initial des recettes...');
    console.log('🔥 Firebase: Collection:', RECIPES_COLLECTION);
    console.log('🔥 Firebase: DB instance:', db ? '✓ OK' : '✗ NULL');
    
    const colRef = collection(db, RECIPES_COLLECTION);
    console.log('🔥 Firebase: Collection reference créée');
    
    const querySnapshot = await getDocs(colRef);
    console.log('🔥 Firebase: Query exécutée, docs:', querySnapshot.size);
    
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
    
    const docRef = doc(db, RECIPES_COLLECTION, recipeId);
    console.log('🔥 Firebase: Document reference créée');
    
    await setDoc(docRef, {
      ...recipe,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Firebase: Recette sauvegardée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Firebase: Erreur lors de la sauvegarde de la recette:', error);
    console.error('❌ Firebase: Code erreur:', error.code);
    console.error('❌ Firebase: Message:', error.message);
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
