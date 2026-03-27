// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginvirtualcourses-5db2d.firebaseapp.com",
  projectId: "loginvirtualcourses-5db2d",
  storageBucket: "loginvirtualcourses-5db2d.firebasestorage.app",
  messagingSenderId: "1053286140566",
  appId: "1:1053286140566:web:45d09ff5e86b84db1950b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth,provider}