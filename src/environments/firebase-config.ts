import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyA_MOFNAdGh8XEI...tu_clave",
  authDomain: "wimine-ventas-app.firebaseapp.com",
  projectId: "wimine-ventas-app",
  storageBucket: "wimine-ventas-app.appspot.com", // ← ✅ corregido: debe terminar en .appspot.com
  messagingSenderId: "263612912884",
  appId: "1:263612912884:web:351e3d70f1cfb1b7b3faa1",
  measurementId: "G-K72NQ94MLS"
};

// Puedes inicializar Firebase aquí si quieres una sola vez global
export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);
