import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
const firebaseConfig={
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain:"loginvirtualcourses-5db2d.firebaseapp.com",
  projectId:"loginvirtualcourses-5db2d",
  storageBucket:"loginvirtualcourses-5db2d.firebasestorage.app",
  messagingSenderId:"1053286140566",
  appId:"1:1053286140566:web:45d09ff5e86b84db1950b7"
};
const app=initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider}