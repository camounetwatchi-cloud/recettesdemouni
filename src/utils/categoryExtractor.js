// Extrait les catégories récurrentes des noms de recettes
// Ces mots-clés seront utilisés pour créer un nuage de mots dynamique

// Fonction utilitaire pour normaliser le texte (enlever accents et mettre en minuscules)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const COMMON_CATEGORIES = [
  'gâteau', 'gateau', 'tarte', 'cake', 'biscuit', 'cookie', 'brownie',
  'crème', 'creme', 'mousse', 'flan', 'soufflé', 'souffle', 'panna cotta',
  'salade', 'soupe', 'potage', 'velouté', 'velute', 'bisque',
  'pâtes', 'pates', 'risotto', 'couscous', 'polenta',
  'poulet', 'poule', 'lapin', 'veau', 'bœuf', 'beef', 'porc', 'viande',
  'poisson', 'salmon', 'trout', 'sole', 'cabillaud', 'morue', 'fruits de mer',
  'riz', 'blé', 'orge', 'maïs', 'semoule',
  'pain', 'brioche', 'focaccia', 'baguette',
  'pizza', 'tarte', 'quiche', 'clafoutis',
  'confiture', 'compote', 'marmelade',
  'sauce', 'coulis', 'mayonnaise', 'vinaigrette', 'béarnaise', 'bearnaise',
  'omelette', 'œufs', 'oeufs',
  'fromage', 'chèvre', 'chevre', 'mozzarella', 'brie', 'camembert',
  'fruits', 'pomme', 'poire', 'orange', 'citron', 'cerise', 'fraise', 'framboise',
  'chocolat', 'vanille', 'caramel', 'miel', 'amande', 'noisette', 'noix',
  'farci', 'grillé', 'grille', 'poêlé', 'poele', 'braisé', 'braise', 'mijoté', 'mijote',
  'gratinée', 'gratinee', 'flambée', 'flambee',
  'tempura', 'frit', 'rôti', 'roti', 'fumé', 'fume',
  'terrine', 'pâté', 'pate', 'rillettes', 'jambon',
  'navettes', 'beignets', 'crêpes', 'crepes', 'gaufres',
  'oreillettes', 'profiteroles', 'éclair', 'eclair', 'meringue',
  'tiramisu', 'bavarois', 'charlotte', 'mille-feuille', 'choux',
  'coq au vin', 'blanquette', 'navarin', 'cassoulet', 'choucroute',
  'bouillabaisse', 'ratatouille', 'confit', 'terrine', 'galantine'
];

// Fonction pour extraire les catégories présentes dans les noms de recettes
export function extractCategoriesFromRecipes(recipes) {
  const categoryCount = {};

  recipes.forEach(recipe => {
    const normalizedRecipeName = normalizeText(recipe.name);
    
    COMMON_CATEGORIES.forEach(category => {
      // Recherche de sous-chaîne insensible à la casse et aux accents
      const normalizedCategory = normalizeText(category);
      if (normalizedRecipeName.includes(normalizedCategory)) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
  });

  // Retourner les catégories triées par fréquence
  return Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50) // Augmenter à 50 catégories pour remplir plus d'espace
    .map(([category, count]) => ({
      name: category,
      frequency: count,
      // Normaliser la fréquence pour obtenir une taille (1 à 5)
      size: Math.ceil((count / recipes.length) * 5) + 1
    }));
}

// Fonction pour obtenir les catégories en format mélangé visuellement
export function getShuffledCategories(categories) {
  // Mélanger les catégories pour un effet nuage plus naturel
  return [...categories].sort(() => Math.random() - 0.5);
}
