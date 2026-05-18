import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDLjCi1i-ye7kF2toRrB0-Sn22LTpiZGEg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "journeyit-49045.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "journeyit-49045",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "journeyit-49045.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "126748208025",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:126748208025:web:f25cd131be95a06facc108",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5H79BZTQY0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
