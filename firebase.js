// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmREOgpLWfFunt3_WjVKcHZ_eN4yEC14A",
  authDomain: "inventory-images-92ba1.firebaseapp.com",
  projectId: "inventory-images-92ba1",
  storageBucket: "inventory-images-92ba1.appspot.com",
  messagingSenderId: "755571409256",
  appId: "1:755571409256:web:31035c8c445dbfa5f296dd",
  measurementId: "G-E9QRRRKRB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};