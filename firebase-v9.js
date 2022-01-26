import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "",
  authDomain: "clone-593b1.firebaseapp.com",
  projectId: "clone-593b1",
  storageBucket: "clone-593b1.appspot.com",
  messagingSenderId: "436777700221",
  appId: "1:436777700221:web:5352a8e5c833a230415a14",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
