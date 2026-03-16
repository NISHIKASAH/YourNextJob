
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider}  from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "yournextjob-33b85.firebaseapp.com",
  projectId: "yournextjob-33b85",
  storageBucket: "yournextjob-33b85.firebasestorage.app",
  messagingSenderId: "580990222347",
  appId: "1:580990222347:web:c2a07bc2d51c96c832470e"
};


const app = initializeApp(firebaseConfig);
const auth =  getAuth(app);
const provider =  new GoogleAuthProvider();

export {auth , provider}  ;


