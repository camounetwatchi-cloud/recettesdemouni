import React, { useState, useEffect } from 'react';
import { Search, Plus, ChefHat, MoreVertical, Camera } from 'lucide-react';
import RecipeScanner from './RecipeScanner';
import CategoryCloud from './components/CategoryCloud';
import { getRecipes, saveRecipe, saveRecipes, deleteRecipe, updateRecipe, onRecipesChange } from './services/firestoreService';

export default function RecipeManager() {
  const [currentPage, setCurrentPage] = useState('search');
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states pour ajouter une recette
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    // Charger les recettes depuis Firebase et écouter les changements en temps réel
    const loadData = async () => {
      try {
        // Charger les recettes une première fois
        const recipesData = await getRecipes();
        setRecipes(recipesData);
        setLoading(false);
        
        // Écouter les changements en temps réel
        const unsubscribe = onRecipesChange((updatedRecipes) => {
          setRecipes(updatedRecipes);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
        setLoading(false);
      }
    };
    
    const unsubscribePromise = loadData();
    
    return () => {
      unsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(null);
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  // Sauvegarder les recettes dans Firebase
  const saveRecipesFirebase = async (newRecipes) => {
    try {
      await saveRecipes(newRecipes);
      setRecipes(newRecipes);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Sauvegarder l'historique de recherche (stockage local)
  const saveSearchHistory = async (history) => {
    try {
      setSearchHistory(history);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  };

  // Rechercher une recette
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const foundRecipes = recipes.filter(recipe => {
      const recipeName = recipe.name.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      // Créer une regex qui cherche le mot complet avec des limites
      // \b = limite de mot, \s = espace, ou début/fin de chaîne
      const regex = new RegExp(`\\b${searchLower}\\b`, 'i');
      return regex.test(recipeName);
    });

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
      await deleteRecipe(recipeId);
      
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
    setSelectedRecipe(null);
  };

  // Ouvrir une recette en vue complète
  const handleOpenRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('view');
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
  const handleSubmitRecipe = async () => {
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
      await updateRecipe(editingRecipe.id, newRecipe);
      
      // Mettre à jour aussi dans l'historique
      const updatedHistory = searchHistory.map(r => r.id === editingRecipe.id ? newRecipe : r);
      saveSearchHistory(updatedHistory);
      
      setEditingRecipe(null);
    } else {
      // Nouvelle recette
      await saveRecipe(newRecipe);
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

    // Supprimer toutes les recettes
  const handleDeleteAllRecipes = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les recettes ? Cette action est irréversible.')) {
      await saveRecipes([]);
      await saveSearchHistory([]);
      alert('Toutes les recettes ont été supprimées.');
    }
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

  // Traiter une recette extraite du scanner
  const handleRecipeExtracted = async (extractedRecipe) => {
    try {
      console.log('📝 Recette extraite reçue:', extractedRecipe);
      
      const newRecipe = {
        id: Date.now(),
        name: extractedRecipe.name,
        ingredients: extractedRecipe.ingredients || [],
        steps: extractedRecipe.steps || [],
        servings: extractedRecipe.servings || '',
        cookTime: extractedRecipe.cookTime || '',
        prepTime: extractedRecipe.prepTime || '',
        difficulty: extractedRecipe.difficulty || '',
        createdAt: new Date().toISOString()
      };

      console.log('💾 Sauvegarde de la recette:', newRecipe);
      
      // Utiliser saveRecipe au lieu de saveRecipes pour plus de rapidité
      const saveResult = await saveRecipe(newRecipe);
      
      if (!saveResult) {
        throw new Error('Erreur Firebase lors de la sauvegarde');
      }
      
      console.log('✅ Recette sauvegardée avec succès! En attente de synchronisation...');
      
      // Attendre un peu que le listener Firestore mette à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🔄 Fermeture du scanner et actualisation de la page...');
      setShowScanner(false);
      setCurrentPage('search');
      alert('✅ Recette ajoutée avec succès ! 🎉');
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de la recette:', error);
      alert('Erreur: ' + (error.message || 'Impossible d\'ajouter la recette'));
    }
  };

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* Navbar - Sticky avec effet glassmorphism */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Logo - Plus grand et plus net */}
            <button
              onClick={() => {
                setCurrentPage('search');
                setSelectedRecipe(null);
              }}
              className="flex items-center gap-3 md:gap-4 text-amber-800 hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl shadow-md group-hover:shadow-lg transition-all">
                <ChefHat size={24} className="md:w-8 md:h-8 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl md:text-2xl font-bold tracking-tight text-stone-800">
                  Recettes de Mounie
                </span>
                <span className="text-xs text-stone-500 font-medium -mt-0.5">Le cahier de famille</span>
              </div>
              <span className="text-lg font-bold text-stone-800 sm:hidden">
                Mounie
              </span>
            </button>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              {/* Bouton Trouver - Style contour/outline */}
              <button
                onClick={() => {
                  setCurrentPage('search');
                  setEditingRecipe(null);
                  setRecipeName('');
                  setIngredients([{ name: '', quantity: '' }]);
                  setSteps(['']);
                  setSelectedRecipe(null);
                }}
                className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === 'search'
                    ? 'bg-amber-700 text-white shadow-sm hover:bg-amber-800'
                    : 'border border-stone-300 text-stone-600 hover:border-orange-400 hover:text-amber-800 hover:bg-orange-50'
                }`}
              >
                <Search size={18} />
                <span>Trouver</span>
              </button>

              {/* Bouton Scanner - Style plein (action principale) */}
              <button
                onClick={() => setShowScanner(true)}
                className="px-5 lg:px-6 py-2.5 lg:py-3 rounded-full font-medium text-white bg-amber-700 hover:bg-amber-800 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
              >
                <Camera size={18} />
                <span>Scanner</span>
              </button>

              {/* Bouton Ajouter - Style lien simple */}
              <button
                onClick={() => {
                  setCurrentPage('add');
                  setEditingRecipe(null);
                  setRecipeName('');
                  setIngredients([{ name: '', quantity: '' }]);
                  setSteps(['']);
                  setSelectedRecipe(null);
                }}
                className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentPage === 'add'
                    ? 'bg-amber-700 text-white shadow-sm hover:bg-amber-800'
                    : 'text-stone-500 hover:text-amber-800 hover:bg-stone-100'
                }`}
              >
                <Plus size={18} />
                <span>Ajouter</span>
              </button>
            </div>
            
            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2.5 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Menu déroulant mobile avec animation */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileMenu ? 'max-h-48 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex flex-col gap-2 pt-2">
              {/* Scanner en premier sur mobile (action principale) */}
              <button
                onClick={() => {
                  setShowScanner(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 rounded-full font-medium text-white bg-amber-700 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Camera size={20} />
                Scanner une recette
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentPage('search');
                    setEditingRecipe(null);
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                    currentPage === 'search'
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'border border-stone-300 text-stone-600'
                  }`}
                >
                  <Search size={18} />
                  Trouver
                </button>
                
                <button
                  onClick={() => {
                    setCurrentPage('add');
                    setEditingRecipe(null);
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                    currentPage === 'add'
                      ? 'bg-amber-700 text-white shadow-sm'
                      : 'text-stone-500 bg-stone-100'
                  }`}
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Compteur de recettes - Bandeau subtil */}
      <div className="bg-stone-100/50 border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-4 py-2 text-center">
          <span className="text-sm md:text-base text-stone-600 font-medium">
            Chef Mounie, c'est plus de <span className="font-semibold text-amber-800">{recipes.length}</span> recette{recipes.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {currentPage === 'view' && selectedRecipe ? (
          /* Vue détaillée d'une recette */
          <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-xl shadow-sm p-8 border border-orange-200/40">
            <button
              onClick={() => {
                setCurrentPage('search');
                setSelectedRecipe(null);
              }}
              className="mb-6 px-4 py-2 text-amber-800 hover:bg-orange-100 rounded-lg transition-colors font-medium"
            >
              ← Retour aux recettes
            </button>

            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-stone-800">
                {selectedRecipe.name}
              </h1>
              
              {/* Menu 3 points */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(showMenu === selectedRecipe.id ? null : selectedRecipe.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={24} className="text-gray-500" />
                </button>
                
                {showMenu === selectedRecipe.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => handleEditRecipe(selectedRecipe)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-t-lg"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteRecipe(selectedRecipe.id);
                        setCurrentPage('search');
                        setSelectedRecipe(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Ingrédients */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-700 mb-4">Ingrédients</h2>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="text-stone-600 text-lg">
                    • <span className="font-medium text-stone-700">{ing.name}</span>: {ing.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Étapes */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-700 mb-4">Étapes de préparation</h2>
              <ol className="space-y-4">
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-semibold">
                      {idx + 1}
                    </span>
                    <p className="text-stone-600 text-lg pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips & Astuces */}
            {selectedRecipe.tips && selectedRecipe.tips.length > 0 ? (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-amber-800 mb-4">
                  Tips & Astuces
                </h2>
                <ul className="space-y-3">
                  {selectedRecipe.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-3 text-stone-600">
                      <span className="text-amber-700 font-medium">•</span>
                      <p className="text-base leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border border-dashed border-stone-200 rounded-xl p-6 bg-stone-50/50">
                <h2 className="text-lg font-medium text-stone-400 mb-2">
                  Tips & Astuces
                </h2>
                <p className="text-stone-400 italic text-sm">Aucune astuce pour cette recette.</p>
              </div>
            )}
          </div>
        ) : currentPage === 'search' ? (
          <div>
            {/* Nuage de mots avec barre de recherche intégrée */}
            <CategoryCloud 
              recipes={recipes} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
            />

            {/* Toutes les recettes par ordre alphabétique - 3 par ligne */}
            {recipes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-stone-700">
                    {searchTerm ? 'Résultats filtrés' : 'Toutes les recettes'}
                  </h2>
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSearchHistory([]);
                      }}
                      className="px-4 py-2 bg-stone-200 text-stone-600 rounded-lg hover:bg-stone-300 transition-colors font-medium text-sm"
                    >
                      ✕ Supprimer le filtre
                    </button>
                  )}
                </div>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {[...recipes]
                    .filter(recipe => {
                      if (!searchTerm.trim()) return true;
                      const recipeName = recipe.name.toLowerCase();
                      const searchLower = searchTerm.toLowerCase();
                      // Utiliser une regex pour chercher le mot complet
                      const regex = new RegExp(`\\b${searchLower}\\b`, 'i');
                      return regex.test(recipeName);
                    })
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((recipe, idx) => (
                    <div
                      key={`recipe-${recipe.id}-${idx}`}
                      onClick={() => handleOpenRecipe(recipe)}
                      className="bg-gradient-to-br from-white to-orange-50/20 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(217,119,6,0.15)] p-4 transition-all duration-200 relative cursor-pointer border border-orange-200/40 hover:border-orange-300/60 hover:-translate-y-0.5"
                    >
                      {/* Menu 3 points */}
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(showMenu === recipe.id ? null : recipe.id);
                          }}
                          className="p-1.5 hover:bg-orange-100 rounded-full transition-colors"
                        >
                          <MoreVertical size={18} className="text-stone-400" />
                        </button>
                        
                        {showMenu === recipe.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-md border border-stone-200 z-20">
                            <button
                              onClick={() => handleEditRecipe(recipe)}
                              className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-600 text-sm rounded-t-lg"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 text-sm rounded-b-lg"
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Titre de la recette */}
                      <h3 className="text-lg font-semibold text-stone-800 pr-8 leading-tight tracking-tight">
                        {recipe.name}
                      </h3>
                      
                      {/* Séparateur fin */}
                      <div className="h-px bg-stone-100 my-2.5"></div>
                      
                      {/* Ingrédients en 2 colonnes */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        {recipe.ingredients.slice(0, 8).map((ing, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-stone-500 leading-relaxed">
                            <span className="text-stone-300 mt-0.5">•</span>
                            <span className="truncate">
                              <span className="font-medium text-stone-600">{ing.name}</span>
                              {ing.quantity && <span className="text-stone-400"> {ing.quantity}</span>}
                            </span>
                          </div>
                        ))}
                        {recipe.ingredients.length > 8 && (
                          <div className="col-span-2 text-xs text-stone-400 mt-1">
                            +{recipe.ingredients.length - 8} autres...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingRecipe ? 'Mettre à jour la recette' : 'Enregistrer la recette'}
            </h2>
            
            <div className="space-y-6">
              {/* Nom de la recette */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom de la recette
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  placeholder="Ex: Tarte aux pommes"
                />
              </div>

              {/* Ingrédients */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Ingrédients
                </label>
                {ingredients.map((ing, index) => (
                  <div key={`ingredient-${index}`} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ing.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                      placeholder="Nom de l'ingrédient"
                    />
                    <input
                      type="text"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                      className="w-32 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                  <div key={`step-${index}`} className="flex gap-2 mb-2">
                    <span className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg font-semibold">
                      {index + 1}
                    </span>
                    <textarea
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
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
                onClick={handleSubmitRecipe}
                className="w-full px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-semibold text-lg"
              >
                {editingRecipe ? 'Mettre à jour la recette' : 'Enregistrer la recette'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal du Scanner */}
      {showScanner && (
        <RecipeScanner
          onRecipeExtracted={handleRecipeExtracted}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
