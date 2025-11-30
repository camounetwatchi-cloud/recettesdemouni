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
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-xl shadow-md p-8 mb-8 border-2 border-orange-200">
      {/* Titre au-dessus */}
      <h3 className="text-center text-lg font-bold text-gray-800 mb-6">
        Une envie particulière...?
      </h3>
      
      {/* Conteneur principal */}
      <div className="flex flex-col items-center gap-2">
        {/* HAUT - 10, 6, 3 éléments */}
        
        {/* Ligne 1 - 10 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {categories.slice(0, 10).map((category, idx) => (
            <CategoryTag 
              key={`t1-${category.name}-${idx}`}
              category={category}
              idx={idx}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 2 - 6 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {categories.slice(10, 16).map((category, idx) => (
            <CategoryTag 
              key={`t2-${category.name}-${idx}`}
              category={category}
              idx={idx + 10}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 3 - 3 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {categories.slice(16, 19).map((category, idx) => (
            <CategoryTag 
              key={`t3-${category.name}-${idx}`}
              category={category}
              idx={idx + 16}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="w-full max-w-md mt-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-2 border-orange-300">
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch && onSearch(searchTerm)}
                placeholder="Rechercher une recette..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm md:text-base"
              />
              <button
                onClick={() => onSearch && onSearch(searchTerm)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* BAS - 3, 6, 10 éléments (inverse du haut) */}

        {/* Ligne 1 - 3 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center mt-4">
          {categories.slice(19, 22).map((category, idx) => (
            <CategoryTag 
              key={`b1-${category.name}-${idx}`}
              category={category}
              idx={idx + 19}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 2 - 6 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {categories.slice(22, 28).map((category, idx) => (
            <CategoryTag 
              key={`b2-${category.name}-${idx}`}
              category={category}
              idx={idx + 22}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>

        {/* Ligne 3 - 10 éléments */}
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {categories.slice(28, 38).map((category, idx) => (
            <CategoryTag 
              key={`b3-${category.name}-${idx}`}
              category={category}
              idx={idx + 28}
              onClick={() => handleCategoryClick(category.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher une étiquette de catégorie
function CategoryTag({ category, idx, onClick }) {
  const colors = [
    'bg-orange-100 text-orange-700 hover:bg-orange-200',
    'bg-amber-100 text-amber-700 hover:bg-amber-200',
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'bg-red-100 text-red-700 hover:bg-red-200',
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-rose-100 text-rose-700 hover:bg-rose-200',
  ];
  
  const sizeClasses = [
    'text-xs px-2 py-1',
    'text-sm px-2.5 py-1.5',
    'text-base px-3 py-1.5',
    'text-lg px-4 py-2 font-semibold',
    'text-xl px-5 py-2.5 font-bold',
  ];

  const colorClass = colors[idx % colors.length];

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[category.size - 1]}
        ${colorClass}
        rounded-full font-medium transition-all duration-300
        hover:scale-110 hover:shadow-md active:scale-95
        cursor-pointer whitespace-nowrap
      `}
      title={`${category.frequency} recette(s) contenant "${category.name}"`}
    >
      {category.name}
    </button>
  );
}
