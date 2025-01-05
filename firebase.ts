// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVL1NdP4XebdUcHleOV9m0h4OVbd2nsyo",
  authDomain: "next-serve-ease-otp.firebaseapp.com",
  projectId: "next-serve-ease-otp",
  storageBucket: "next-serve-ease-otp.firebasestorage.app",
  messagingSenderId: "632643407849",
  appId: "1:632643407849:web:5a82903c15657c7c9cc578",
  measurementId: "G-DTN5TB8FW5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };

