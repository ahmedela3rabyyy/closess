import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- NYX FIREBASE PROTOCOL CONFIGURATION ---
// يا باشا، بمجرد ما تعمل Project وتجيب الـ Config الحقيقي، استبدل البيانات دي فوراً.
const firebaseConfig = {
  apiKey: "AIzaSyCG163xXllByhAQedmXyjN8lHbo_PeF0U0",
  authDomain: "nyxapp-5313f.firebaseapp.com",
  projectId: "nyxapp-5313f",
  storageBucket: "nyxapp-5313f.firebasestorage.app",
  messagingSenderId: "754719712257",
  appId: "1:754719712257:web:1f5dfc7e75658eefd80c00",
  measurementId: "G-X31MBSEVVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
