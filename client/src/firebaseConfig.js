// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// IMPORTANT: Replace with your Firebase project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBIR_EfWnC5jtU9CJ3gcmBlrpt7XKGMTM",
    authDomain: "crop-disease-prediction-de575.firebaseapp.com",
    projectId: "crop-disease-prediction-de575",
    storageBucket: "crop-disease-prediction-de575.firebasestorage.app",
    messagingSenderId: "1053167826835",
    appId: "1:1053167826835:web:4b12e25d5861a0dd769a66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Export Google Provider

export default app; // Export the initialized app if needed elsewhere