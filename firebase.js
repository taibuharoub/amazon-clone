import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "clone-593b1.firebaseapp.com",
  projectId: "clone-593b1",
  storageBucket: "clone-593b1.appspot.com",
  messagingSenderId: "436777700221",
  appId: "1:436777700221:web:5352a8e5c833a230415a14",
};

// Initialize Firebase
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export default db;

/* Keep in mind: the compat libraries are a temporary solution 
that will be removed completely in a future major SDK version 
(such as version 10 or version 11). Your ultimate goal is to 
remove compat code and keep only version 9 modular-style code 
in your app. */
