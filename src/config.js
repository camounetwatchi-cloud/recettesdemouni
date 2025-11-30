/**
 * Configuration centralisée des variables d'environnement
 * Compatible avec Vite et Vercel
 */

// Fonction pour obtenir une variable d'environnement
const getEnvVar = (key) => {
  const value = 
    import.meta.env[key] ||
    (typeof window !== 'undefined' && window.__ENV__?.[key]) ||
    (typeof process !== 'undefined' && process.env?.[key]);
  
  return value;
};

// Clé API Google Gemini
export const GOOGLE_API_KEY = getEnvVar('VITE_GOOGLE_API_KEY');

// Configuration Firebase
export const FIREBASE_CONFIG = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
};

// Validation
if (!GOOGLE_API_KEY) {
  console.error('❌ VITE_GOOGLE_API_KEY non configurée');
  console.error('Variables disponibles:', {
    'import.meta.env keys': Object.keys(import.meta.env).filter(k => k.includes('VITE')),
    'window.__ENV__ exists': typeof window !== 'undefined' && !!window.__ENV__
  });
}

if (!FIREBASE_CONFIG.projectId) {
  console.error('❌ Configuration Firebase incomplète');
}

export default {
  GOOGLE_API_KEY,
  FIREBASE_CONFIG,
};
