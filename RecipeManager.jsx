import React, { useState, useEffect } from 'react';
import { Search, Plus, ChefHat } from 'lucide-react';

export default function RecipeManager() {
  const [currentPage, setCurrentPage] = useState('search');
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Form states pour ajouter une recette
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);

useEffect(() => {
  const loadData = async () => {
    try {
      const recipesData = await window.storage.get('recipes');
      if (recipesData && recipesData.value) {
        setRecipes(JSON.parse(recipesData.value));
      }
    } catch (error) {
      console.log('Aucune recette sauvegardée');
      setRecipes([]);
    }

    try {
      const historyData = await window.storage.get('search-history');
      if (historyData && historyData.value) {
        setSearchHistory(JSON.parse(historyData.value));
      }
    } catch (error) {
      console.log('Aucun historique');
      setSearchHistory([]);
    }
  };
  loadData();
}, []);

  // Sauvegarder les recettes
  const saveRecipes = async (newRecipes) => {
    try {
      await window.storage.set('recipes', JSON.stringify(newRecipes));
      setRecipes(newRecipes);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Sauvegarder l'historique de recherche
  const saveSearchHistory = async (history) => {
    try {
      await window.storage.set('search-history', JSON.stringify(history));
      setSearchHistory(history);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  };

  // Rechercher une recette
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const foundRecipes = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foundRecipes.length > 0) {
      const newHistory = [
        ...foundRecipes,
        ...searchHistory.filter(r => !foundRecipes.find(f => f.id === r.id))
      ].slice(0, 10);
      saveSearchHistory(newHistory);
    }
  };

  // Ajouter un ingrédient
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  // Modifier un ingrédient
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Supprimer un ingrédient
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Ajouter une étape
  const addStep = () => {
    setSteps([...steps, '']);
  };

  // Modifier une étape
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // Supprimer une étape
  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Soumettre une nouvelle recette
  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    
    if (!recipeName.trim()) {
      alert('Veuillez entrer un nom de recette');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
    const validSteps = steps.filter(step => step.trim());

    if (validIngredients.length === 0) {
      alert('Veuillez ajouter au moins un ingrédient');
      return;
    }

    if (validSteps.length === 0) {
      alert('Veuillez ajouter au moins une étape');
      return;
    }

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      ingredients: validIngredients,
      steps: validSteps,
      createdAt: new Date().toISOString()
    };

    await saveRecipes([...recipes, newRecipe]);

    // Réinitialiser le formulaire
    setRecipeName('');
    setIngredients([{ name: '', quantity: '' }]);
    setSteps(['']);
    
    alert('Recette ajoutée avec succès !');
    setCurrentPage('search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-orange-600">
              <ChefHat size={32} />
              <span className="text-xl font-bold">Mes Recettes</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'search'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Search className="inline mr-2" size={18} />
                Trouver une recette
              </button>
              <button
                onClick={() => setCurrentPage('add')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'add'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Plus className="inline mr-2" size={18} />
                Ajouter une recette
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'search' ? (
          <div>
            {/* Barre de recherche */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Rechercher une recette..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Liste des dernières recettes recherchées */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {searchHistory.length > 0 ? 'Dernières recherches' : 'Aucune recherche récente'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchHistory.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-orange-600 mb-3">
                      {recipe.name}
                    </h3>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Ingrédients:</h4>
                      <ul className="space-y-1">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">
                            • {ing.quantity} {ing.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une nouvelle recette</h2>
            
            <form onSubmit={handleSubmitRecipe} className="space-y-6">
              {/* Nom de la recette */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom de la recette
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Tarte aux pommes"
                />
              </div>

              {/* Ingrédients */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Ingrédients
                </label>
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Nom de l'ingrédient"
                    />
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Quantité"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Ajouter un ingrédient
                </button>
              </div>

              {/* Étapes */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Étapes de préparation
                </label>
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="px-3 py-2 bg-orange-100 text-orange-600 rounded-lg font-semibold">
                      {index + 1}
                    </span>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Décrivez cette étape..."
                      rows="2"
                    />
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  + Ajouter une étape
                </button>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg"
              >
                Enregistrer la recette
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
