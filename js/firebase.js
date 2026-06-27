// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2ZREXkX8XmxYfsvTJIOQ37iTWfdi_-Vo",
  authDomain: "jomjual-352b1.firebaseapp.com",
  projectId: "jomjual-352b1",
  storageBucket: "jomjual-352b1.firebasestorage.app",
  messagingSenderId: "904380737279",
  appId: "1:904380737279:web:ba6b0a3eda10591dde0eca",
  measurementId: "G-189L245JE5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Keep user logged in even after browser closes
setPersistence(auth, browserLocalPersistence);