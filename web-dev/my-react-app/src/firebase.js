// firebase.js

// Import core Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Import services you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtFvbwp0BKxP9MUb2Oj5rIwSsnkLzNqcU",
  authDomain: "game-sales-predictor.firebaseapp.com",
  projectId: "game-sales-predictor",
  storageBucket: "game-sales-predictor.firebasestorage.app",
  messagingSenderId: "1097133615515",
  appId: "1:1097133615515:web:18abb34f89ecf0483c993e",
  measurementId: "G-PB46MGFJ9Y"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Optional analytics (works only on localhost or deployed HTTPS)
const analytics = getAnalytics(app);

// Export services so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
