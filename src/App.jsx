// src/App.jsx

import RecipeManager from './RecipeManager';
// Assurez-vous d'importer votre fichier CSS principal si vous utilisez Tailwind (voir point 2)
import './index.css'; 

export default function App() {
  // Le composant RecipeManager est maintenant la seule chose affichée par App.
  return <RecipeManager />;
}
