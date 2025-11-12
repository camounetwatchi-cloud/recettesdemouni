import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Mock de l'API storage pour le développement local
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value ? { key, value, shared: false } : null;
    },
    async set(key, value, shared = false) {
      localStorage.setItem(key, value);
      return { key, value, shared };
    },
    async delete(key, shared = false) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared };
    },
    async list(prefix = '', shared = false) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      return { keys, prefix, shared };
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
