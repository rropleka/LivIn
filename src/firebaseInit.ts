// Import the functions you need from the SDKs you need
// import firebase from 'firebase'
import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "enter-api-key-here",
  authDomain: "livin-cs407.firebaseapp.com",
  projectId: "livin-cs407",
  storageBucket: "livin-cs407.appspot.com",
  messagingSenderId: "42343253132",
  appId: "1:42343253132:web:a04069c21c9b8c9cbd67a9",
  measurementId: "G-DPBD6Z65GJ"
};

// Initialize Firebase and Authentication
export const firebaseapp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseapp)
export default db
export const auth = getAuth(firebaseapp)
