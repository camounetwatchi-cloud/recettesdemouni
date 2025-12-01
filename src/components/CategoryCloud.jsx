import React, { useMemo } from 'react';
import { extractCategoriesFromRecipes, getShuffledCategories } from '../utils/categoryExtractor';
import { Search } from 'lucide-react';

export default function CategoryCloud({ recipes, searchTerm, setSearchTerm, onSearch }) {
  // Extraire et mélanger les catégories depuis les recettes
  const categories = useMemo(() => {
    if (recipes.length === 0) return [];
    const extracted = extractCategoriesFromRecipes(recipes);
    return getShuffledCategories(extracted);
  }, [recipes]);

  const handleCategoryClick = (categoryName) => {
    // Mettre à jour le terme de recherche
    setSearchTerm(categoryName);
    // Déclencher la recherche immédiatement
    setTimeout(() => onSearch && onSearch(categoryName), 0);
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8 border border-stone-200">
      {/* Titre au-dessus */}
      <h3 className="text-center text-lg md:text-xl font-semibold text-stone-700 mb-6 tracking-tight">
        Une envie particulière ?
      </h3>
      
      {/* Conteneur principal avec séparateur subtil autour de la recherche */}
      <div className="flex flex-col items-center gap-3">
        {/* HAUT - 10, 6, 3 éléments */}
        
        {/* Ligne 1 - 10 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(0, 10).map((category, idx) => (
            <CategoryTag 
              key={`t1-${category.name}-${idx}`}
              category={category}
              lineNumber={1}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 2 - 6 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(10, 16).map((category, idx) => (
            <CategoryTag 
              key={`t2-${category.name}-${idx}`}
              category={category}
              lineNumber={2}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 3 - 3 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(16, 19).map((category, idx) => (
            <CategoryTag 
              key={`t3-${category.name}-${idx}`}
              category={category}
              lineNumber={3}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Séparateur subtil */}
        <div className="w-full max-w-lg my-4">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
        </div>

        {/* Barre de recherche - Cadre net et distinct */}
        <div className="w-full max-w-md">
          <div className="bg-stone-50 rounded-2xl shadow-sm p-4 border border-stone-200">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch(searchTerm)}
                placeholder="Rechercher une recette..."
                className="flex-1 px-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 text-sm md:text-base font-medium placeholder:text-stone-400"
              />
              <button
                onClick={() => onSearch && onSearch(searchTerm)}
                className="px-5 py-2.5 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-all shadow-sm hover:shadow font-medium"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Séparateur subtil */}
        <div className="w-full max-w-lg my-4">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
        </div>

        {/* BAS - 3, 6, 10 éléments (inverse du haut) */}

        {/* Ligne 1 - 3 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(19, 22).map((category, idx) => (
            <CategoryTag 
              key={`b1-${category.name}-${idx}`}
              category={category}
              lineNumber={3}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 2 - 6 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(22, 28).map((category, idx) => (
            <CategoryTag 
              key={`b2-${category.name}-${idx}`}
              category={category}
              lineNumber={2}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 3 - 10 éléments */}
        <div className="w-full flex flex-wrap gap-2.5 justify-center">
          {categories.slice(28, 38).map((category, idx) => (
            <CategoryTag 
              key={`b3-${category.name}-${idx}`}
              category={category}
              lineNumber={1}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une étiquette de catégorie - Style pilule amélioré
function CategoryTag({ category, lineNumber, onClick }) {
  // Couleurs par ligne - palette douce et harmonisée
  // Ligne 1: ambre doux, Ligne 2: beige, Ligne 3: gris chaud
  const lineColors = {
    1: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200',
    2: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100',
    3: 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200',
  };
  
  const sizeClasses = [
    'text-xs px-3 py-1.5',
    'text-sm px-3.5 py-1.5',
    'text-base px-4 py-2',
    'text-lg px-5 py-2 font-semibold',
    'text-xl px-6 py-2.5 font-bold',
  ];

  const colorClass = lineColors[lineNumber] || lineColors[1];

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[category.size - 1]}
        ${colorClass}
        rounded-full font-medium transition-all duration-200
        border shadow-sm
        hover:scale-105 hover:shadow-md hover:-translate-y-0.5
        active:scale-95
        cursor-pointer whitespace-nowrap
      `}
      title={`${category.frequency} recette(s) contenant "${category.name}"`}
    >
      {category.name}
    </button>
  );
}
