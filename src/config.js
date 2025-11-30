/**
 * Configuration centralisée des variables d'environnement
 * Compatible avec Vite et Vercel
 * 
 * ⚠️ SÉCURITÉ: 
 * - Les clés API ne doivent JAMAIS être commitées dans Git
 * - Elles doivent être configurées dans Vercel Environment Variables
 * - Utilisez .env.local en local (jamais en prod)
 */

// Fonction pour obtenir une variable d'environnement de manière sécurisée
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

// Validation et logs de débogage
const logConfig = () => {
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  
  console.log('🔧 Configuration de l\'application:');
  console.log(`  Environnement: ${isProduction ? 'PRODUCTION' : isDevelopment ? 'DÉVELOPPEMENT' : 'INCONNU'}`);
  console.log(`  Google API Key: ${GOOGLE_API_KEY ? '✓ Configurée' : '✗ MANQUANTE'}`);
  console.log(`  Firebase: ${FIREBASE_CONFIG.projectId ? '✓ Configuré' : '✗ MANQUANT'}`);
  
  if (!GOOGLE_API_KEY) {
    console.error('❌ ERREUR: VITE_GOOGLE_API_KEY non configurée!');
    console.error('  - Vérifiez .env.local (développement)');
    console.error('  - Vérifiez Vercel Environment Variables (production)');
  }
  
  if (!FIREBASE_CONFIG.projectId) {
    console.error('❌ ERREUR: Configuration Firebase incomplète!');
  }
};

// Log la configuration au chargement
if (typeof window !== 'undefined') {
  logConfig();
}

export default {
  GOOGLE_API_KEY,
  FIREBASE_CONFIG,
};

