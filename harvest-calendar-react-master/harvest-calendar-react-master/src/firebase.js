// src/firebase.js
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"; // add this if you need auth

const firebaseConfig = {
  apiKey: "",
  authDomain: "nenass-c55f0.firebaseapp.com",
  projectId: "nenass-c55f0",
  storageBucket: "nenass-c55f0.appspot.com",
  messagingSenderId: "961332354476",
  appId: "1:961332354476:android:809ee9c9fce74b7f642e09"
};

firebase.initializeApp(firebaseConfig);

// Export Firestore database
export const db = firebase.firestore();

// Export firebase itself for auth usage
export { firebase };
