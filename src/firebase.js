// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ5olKodsZhDCmlu6oZyK1JppXQ8uDTlA",
  authDomain: "groove-a1c3e.firebaseapp.com",
  projectId: "groove-a1c3e",
  storageBucket: "groove-a1c3e.appspot.com",
  messagingSenderId: "961749763398",
  appId: "1:961749763398:web:7e1ba5a6c352c80f50d147"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
