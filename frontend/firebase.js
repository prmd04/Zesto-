// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "zesto-92661.firebaseapp.com",
  projectId: "zesto-92661",
  storageBucket: "zesto-92661.firebasestorage.app",
  messagingSenderId: "951886392357",
  appId: "1:951886392357:web:be772a0d4aee0356b0a3cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export  {auth,app};