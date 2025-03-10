import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyByMOTy42gSJYW8g-r-3WhXsG5a1ZK34VA",
    authDomain: "memoryapp-2a6d6.firebaseapp.com",
    projectId: "memoryapp-2a6d6",
    storageBucket: "memoryapp-2a6d6.appspot.com", // <-- Fixed here!
    messagingSenderId: "763767132671",
    appId: "1:763767132671:web:cd093e1bb260de0b5f17ca",
};  

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
