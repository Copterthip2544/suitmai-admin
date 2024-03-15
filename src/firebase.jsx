// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKD0wrx0Eg9vms6Z8FmIyd-n3gomPk8gM",
  authDomain: "suitmai-a8acd.firebaseapp.com",
  projectId: "suitmai-a8acd",
  storageBucket: "suitmai-a8acd.appspot.com",
  messagingSenderId: "344351818168",
  appId: "1:344351818168:web:17d31d9bf619da18c3cf4d",
  measurementId: "G-NFWHNE0N9G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);