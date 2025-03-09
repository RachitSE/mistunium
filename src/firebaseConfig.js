// src/firebaseConfig.
// 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByMOTy42gSJYW8g-r-3WhXsG5a1ZK34VA",
  authDomain: "memoryapp-2a6d6.firebaseapp.com",
  projectId: "memoryapp-2a6d6",
  storageBucket: "memoryapp-2a6d6.firebasestorage.app",
  messagingSenderId: "763767132671",
  appId: "1:763767132671:web:cd093e1bb260de0b5f17ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
