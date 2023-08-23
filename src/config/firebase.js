import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_SLK5nAgRixQqFfe2dCc2yvo6eQxXnq4",
  authDomain: "meyerdices.firebaseapp.com",
  projectId: "meyerdices",
  storageBucket: "meyerdices.appspot.com",
  messagingSenderId: "153320843171",
  appId: "1:153320843171:web:cf9d2cc0e863c902739c16",
  measurementId: "G-D11KT7ZMR3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize database
export const db = getFirestore(app);
