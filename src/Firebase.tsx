// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIKRc1ttpl62UDC_8XeOrVxp4FOLLEhY8",
  authDomain: "zentask-33f36.firebaseapp.com",
  projectId: "zentask-33f36",
  storageBucket: "zentask-33f36.appspot.com",
  messagingSenderId: "252578935493",
  appId: "1:252578935493:web:601b9f22041b97a940b6ac",
  measurementId: "G-TZEDSC7D10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth };