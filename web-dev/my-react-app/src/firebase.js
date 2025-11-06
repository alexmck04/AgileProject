// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtFvbwp0BKxP9MUb2Oj5rIwSsnkLzNqcU",
  authDomain: "game-sales-predictor.firebaseapp.com",
  projectId: "game-sales-predictor",
  storageBucket: "game-sales-predictor.firebasestorage.app",
  messagingSenderId: "1097133615515",
  appId: "1:1097133615515:web:18abb34f89ecf0483c993e",
  measurementId: "G-PB46MGFJ9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);