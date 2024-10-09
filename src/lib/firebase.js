// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDfvSJs3LO_gmDmEcT99AocqrcIFd5VPRw",
//   authDomain: "bug-busters-firebase.firebaseapp.com",
//   projectId: "bug-busters-firebase",
//   storageBucket: "bug-busters-firebase.appspot.com",
//   messagingSenderId: "117598043015",
//   appId: "1:117598043015:web:07d5ffedc99b53d6013122"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app)
// export const db = getFirestore()
// export const storage = getStorage()

//

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfvSJs3LO_gmDmEcT99AocqrcIFd5VPRw",
  authDomain: "bug-busters-firebase.firebaseapp.com",
  databaseURL: "https://bug-busters-firebase-default-rtdb.firebaseio.com",
  projectId: "bug-busters-firebase",
  storageBucket: "bug-busters-firebase.appspot.com",
  messagingSenderId: "117598043015",
  appId: "1:117598043015:web:07d5ffedc99b53d6013122",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
