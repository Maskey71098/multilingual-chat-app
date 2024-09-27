// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "bug-busters-firebase.firebaseapp.com",
  projectId: "bug-busters-firebase",
  storageBucket: "bug-busters-firebase.appspot.com",
  messagingSenderId: "117598043015",
  appId: "1:117598043015:web:07d5ffedc99b53d6013122"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()