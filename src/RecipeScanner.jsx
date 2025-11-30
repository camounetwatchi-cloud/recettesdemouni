import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader, X, AlertCircle } from 'lucide-react';

export default function RecipeScanner({ onRecipeExtracted, onClose }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedRecipe, setExtractedRecipe] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Convertir image en base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
    });
  };

  // Extraire la recette de l'image avec Gemini
  const extractRecipeFromImage = async (imageBase64, mimeType) => {
    try {
      setLoading(true);
      setError(null);

      const prompt = `Analyse cette photo de recette de cuisine et extrait les informations en format JSON strict.

Retourne UNIQUEMENT un objet JSON valide (pas de texte avant ou après) avec cette structure:
{
  "name": "Nom de la recette",
  "ingredients": [
    {"name": "Ingredient 1", "quantity": "Quantité"},
    {"name": "Ingredient 2", "quantity": "Quantité"}
  ],
  "steps": [
    "Étape 1",
    "Étape 2"
  ],
  "servings": "Nombre de portions",
  "cookTime": "Temps de cuisson",
  "prepTime": "Temps de préparation",
  "difficulty": "Facile/Moyen/Difficile"
}

Important: 
- Extrait TOUS les ingrédients avec leurs quantités
- Extrait TOUTES les étapes de préparation
- Si une information n'est pas visible, mets une chaîne vide ""
- Retourne UNIQUEMENT le JSON, aucun texte supplémentaire`;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de l\'appel API Gemini');
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('Aucune réponse de l\'API Gemini');
      }

      const responseText = data.candidates[0].content.parts[0].text;

      // Nettoyer la réponse (enlever les blocs de code markdown si présents)
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      const recipe = JSON.parse(cleanedText);

      // Valider la structure
      if (!recipe.name || !recipe.ingredients || !recipe.steps) {
        throw new Error('La réponse ne contient pas les champs requis');
      }

      setExtractedRecipe(recipe);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'extraction de la recette');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer la sélection de fichier
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide');
        setLoading(false);
        return;
      }

      setImage(file);
      
      // Lire le fichier
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result?.split(',')[1];
          if (!base64) throw new Error('Impossible de lire le fichier');
          
          let mimeType = file.type;
          
          // Pour HEIC, convertir en JPEG
          if (file.type === 'image/heic' || file.type === 'image/heif') {
            mimeType = 'image/jpeg';
          }
          
          await extractRecipeFromImage(base64, mimeType);
        } catch (err) {
          setError(err.message || 'Erreur lors du traitement');
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Erreur de lecture du fichier');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Erreur: ' + (err.message || 'Problème inconnu'));
      setLoading(false);
    }
  };

  // Accepter et ajouter la recette
  const handleAcceptRecipe = () => {
    if (extractedRecipe) {
      onRecipeExtracted(extractedRecipe);
      resetForm();
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setImage(null);
    setExtractedRecipe(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Scanner de Recette</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!extractedRecipe ? (
            <>
              {/* Upload Area */}
              {!image && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Upload from file */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="p-6 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition"
                    >
                      <Upload size={32} className="text-blue-500" />
                      <span className="font-semibold text-gray-700">Importer une photo</span>
                      <span className="text-sm text-gray-500">JPG, PNG...</span>
                    </button>

                    {/* Camera */}
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={loading}
                      className="p-6 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition"
                    >
                      <Camera size={32} className="text-green-500" />
                      <span className="font-semibold text-gray-700">Prendre une photo</span>
                      <span className="text-sm text-gray-500">Caméra</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader size={40} className="text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-600">Analyse de la recette en cours...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800">Erreur</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                    {image && (
                      <button
                        onClick={resetForm}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Réessayer avec une autre image
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {image && !loading && (
                <div className="mb-6">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={resetForm}
                    className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Changer d'image
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Extracted Recipe Preview */}
              <div className="space-y-6">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la recette
                  </label>
                  <p className="text-lg text-gray-900 bg-gray-50 p-3 rounded">
                    {extractedRecipe.name}
                  </p>
                </div>

                {/* Infos supplémentaires */}
                <div className="grid grid-cols-2 gap-4">
                  {extractedRecipe.prepTime && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Préparation</label>
                      <p className="text-gray-600">{extractedRecipe.prepTime}</p>
                    </div>
                  )}
                  {extractedRecipe.cookTime && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Cuisson</label>
                      <p className="text-gray-600">{extractedRecipe.cookTime}</p>
                    </div>
                  )}
                  {extractedRecipe.servings && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Portions</label>
                      <p className="text-gray-600">{extractedRecipe.servings}</p>
                    </div>
                  )}
                  {extractedRecipe.difficulty && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Difficulté</label>
                      <p className="text-gray-600">{extractedRecipe.difficulty}</p>
                    </div>
                  )}
                </div>

                {/* Ingrédients */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Ingrédients ({extractedRecipe.ingredients.length})
                  </label>
                  <ul className="space-y-2 bg-gray-50 p-4 rounded">
                    {extractedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="text-gray-700">
                        {ing.quantity && <span className="font-semibold">{ing.quantity}</span>}{' '}
                        {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Étapes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Étapes ({extractedRecipe.steps.length})
                  </label>
                  <ol className="space-y-2 bg-gray-50 p-4 rounded list-decimal list-inside">
                    {extractedRecipe.steps.map((step, idx) => (
                      <li key={idx} className="text-gray-700">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition"
                >
                  Recommencer
                </button>
                <button
                  onClick={handleAcceptRecipe}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition flex items-center justify-center gap-2"
                >
                  ✓ Ajouter cette recette
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
