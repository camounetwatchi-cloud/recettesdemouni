import React, { useState, useEffect } from 'react';
import { Search, Plus, ChefHat, MoreVertical } from 'lucide-react';

export default function RecipeManager() {
  const [currentPage, setCurrentPage] = useState('search');
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Form states pour ajouter une recette
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

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

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(null);
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

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

  // Supprimer une recette
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      const updatedRecipes = recipes.filter(r => r.id !== recipeId);
      await saveRecipes(updatedRecipes);
      
      // Retirer aussi de l'historique de recherche
      const updatedHistory = searchHistory.filter(r => r.id !== recipeId);
      saveSearchHistory(updatedHistory);
      
      setShowMenu(null);
    }
  };

  // Modifier une recette
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setRecipeName(recipe.name);
    setIngredients(recipe.ingredients);
    setSteps(recipe.steps);
    setCurrentPage('add');
    setShowMenu(null);
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
      id: editingRecipe ? editingRecipe.id : Date.now(),
      name: recipeName,
      ingredients: validIngredients,
      steps: validSteps,
      createdAt: editingRecipe ? editingRecipe.createdAt : new Date().toISOString()
    };

    if (editingRecipe) {
      // Mise à jour d'une recette existante
      const updatedRecipes = recipes.map(r => r.id === editingRecipe.id ? newRecipe : r);
      await saveRecipes(updatedRecipes);
      
      // Mettre à jour aussi dans l'historique
      const updatedHistory = searchHistory.map(r => r.id === editingRecipe.id ? newRecipe : r);
      saveSearchHistory(updatedHistory);
      
      setEditingRecipe(null);
    } else {
      // Nouvelle recette
      await saveRecipes([...recipes, newRecipe]);
    }

    // Réinitialiser le formulaire
    setRecipeName('');
    setIngredients([{ name: '', quantity: '' }]);
    setSteps(['']);
    
    alert('Recette enregistrée avec succès !');
    setCurrentPage('search');
  };

  // Exporter les recettes en JSON
const handleExportRecipes = () => {
  const dataStr = JSON.stringify(recipes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `recettes-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Importer des recettes depuis un fichier JSON
const handleImportRecipes = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const importedRecipes = JSON.parse(event.target.result);
      if (Array.isArray(importedRecipes)) {
        await saveRecipes([...recipes, ...importedRecipes]);
        alert(`${importedRecipes.length} recette(s) importée(s) avec succès !`);
      }
    } catch (error) {
      alert('Erreur lors de l\'importation du fichier');
    }
  };
  reader.readAsText(file);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-orange-600">
              <ChefHat size={32} />
              <span className="text-xl font-bold">Recettes de mounie</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setCurrentPage('search');
                  setEditingRecipe(null);
                  setRecipeName('');
                  setIngredients([{ name: '', quantity: '' }]);
                  setSteps(['']);
                }}
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
                onClick={() => {
                  setCurrentPage('add');
                  setEditingRecipe(null);
                  setRecipeName('');
                  setIngredients([{ name: '', quantity: '' }]);
                  setSteps(['']);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'add'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Plus className="inline mr-2" size={18} />
                Ajouter une recette
              </button>
              <button
  onClick={handleExportRecipes}
  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-orange-100 transition-colors"
  disabled={recipes.length === 0}
>
  📥 Exporter
</button>
<label className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-orange-100 transition-colors cursor-pointer">
  📤 Importer
  <input
    type="file"
    accept=".json"
    onChange={handleImportRecipes}
    className="hidden"
  />
</label>
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

            {/* Historique de recherche */}
            {searchHistory.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Dernières recettes</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {searchHistory.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow relative"
                    >
                      {/* Menu 3 points */}
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(showMenu === recipe.id ? null : recipe.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical size={20} className="text-gray-500" />
                        </button>
                        
                        {showMenu === recipe.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button
                              onClick={() => handleEditRecipe(recipe)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-t-lg"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-orange-600 mb-3 pr-8">
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
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingRecipe ? 'Mettre à jour la recette' : 'Enregistrer la recette'}
            </h2>
            
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
                {editingRecipe ? 'Mettre à jour la recette' : 'Enregistrer la recette'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
