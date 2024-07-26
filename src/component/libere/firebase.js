// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {  getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  



const firebaseConfig = {
  apiKey: "AIzaSyCfMS54ijKWOCyyGmgaRsyVs1KxAbGfXcc",
  authDomain: "chat-app-ea290.firebaseapp.com",
  projectId: "chat-app-ea290",
  storageBucket: "chat-app-ea290.appspot.com",
  messagingSenderId: "166233431003",
  appId: "1:166233431003:web:96faefdf84ca28977265fe",
  measurementId: "G-H49JQETRE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore()
export const storage=getStorage()
