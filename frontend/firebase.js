// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "vingo-food-delivery-5a78b.firebaseapp.com",
  projectId: "vingo-food-delivery-5a78b",
  storageBucket: "vingo-food-delivery-5a78b.firebasestorage.app",
  messagingSenderId: "683271096134",
  appId: "1:683271096134:web:fed9e786ca5c4b46934747"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app, auth}