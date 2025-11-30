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
    const querySnapshot = await getDocs(collection(db, RECIPES_COLLECTION));
    const recipes = [];
    querySnapshot.forEach((doc) => {
      recipes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return recipes;
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error);
    return [];
  }
};

// Écouter les changements en temps réel
export const onRecipesChange = (callback) => {
  try {
    const q = query(collection(db, RECIPES_COLLECTION));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(recipes);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Erreur lors de l\'écoute des recettes:', error);
    return () => {};
  }
};

// Sauvegarder une recette
export const saveRecipe = async (recipe) => {
  try {
    const recipeId = recipe.id.toString();
    await setDoc(doc(db, RECIPES_COLLECTION, recipeId), {
      ...recipe,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la recette:', error);
    return false;
  }
};

// Sauvegarder plusieurs recettes
export const saveRecipes = async (recipes) => {
  try {
    for (const recipe of recipes) {
      const recipeId = recipe.id.toString();
      await setDoc(doc(db, RECIPES_COLLECTION, recipeId), {
        ...recipe,
        updatedAt: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des recettes:', error);
    return false;
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
