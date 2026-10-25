// Brightora Technologies — Firebase Web SDK configuration.
// Web configuration is public by design. Security must be enforced by Firestore Rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6VivVoLOaFmDYLU1VlsqMKVJKLEBTQfc",
  authDomain: "brightora-a1154.firebaseapp.com",
  projectId: "brightora-a1154",
  storageBucket: "brightora-a1154.firebasestorage.app",
  messagingSenderId: "1093893033430",
  appId: "1:1093893033430:web:1f9e7040093575096c6877"
};

export const firebaseConfigured = true;
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const authPersistence = setPersistence(auth, browserLocalPersistence);
