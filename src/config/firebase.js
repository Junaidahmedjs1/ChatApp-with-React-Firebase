import { initializeApp } from "firebase/app";
import { getAuth,  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxbMZAid1qtjI33bFRenHYswa70R8x9oM",
  authDomain: "chat-app-3a3a2.firebaseapp.com",
  projectId: "chat-app-3a3a2",
  storageBucket: "chat-app-3a3a2.firebasestorage.app",
  messagingSenderId: "376587851325",
  appId: "1:376587851325:web:97e6875721011744f6fc54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

