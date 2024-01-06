// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-da709.firebaseapp.com",
  projectId: "mern-estate-da709",
  storageBucket: "mern-estate-da709.appspot.com",
  messagingSenderId: "558246346580",
  appId: "1:558246346580:web:d92d7576724bd4632ad2c1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
