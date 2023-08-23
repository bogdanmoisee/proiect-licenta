// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/storage';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1jkORPN77--2vI0qpzQsAK5o3nc_v0gY",
  authDomain: "licenta-8c974.firebaseapp.com",
  databaseURL: "https://licenta-8c974-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "licenta-8c974",
  storageBucket: "licenta-8c974.appspot.com",
  messagingSenderId: "937781679144",
  appId: "1:937781679144:web:3c785663d36ebd614bd11d",
  measurementId: "G-00WSJ68Q8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };