import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJDCuWGVbNLA75kWz2Wt_E32SxahOjgEw",
  authDomain: "livin-cs407.firebaseapp.com",
  projectId: "livin-cs407",
  storageBucket: "livin-cs407.appspot.com",
  messagingSenderId: "42343253132",
  appId: "1:42343253132:web:a04069c21c9b8c9cbd67a9",
  measurementId: "G-DPBD6Z65GJ"
};

// Initialize Firebase and Authentication
const firebaseapp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseapp)
const auth = getAuth(firebaseapp)


const app = createApp(App)

// Make db available globally
// app.config.globalProperties.$db = db

app.use(createPinia())
app.use(router)

app.mount('#app')
