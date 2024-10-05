
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  apiKey: "AIzaSyDfvSJs3LO_gmDmEcT99AocqrcIFd5VPRw",
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