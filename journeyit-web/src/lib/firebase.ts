import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLjCi1i-ye7kF2toRrB0-Sn22LTpiZGEg",
  authDomain: "journeyit-49045.firebaseapp.com",
  projectId: "journeyit-49045",
  storageBucket: "journeyit-49045.firebasestorage.app",
  messagingSenderId: "126748208025",
  appId: "1:126748208025:web:f25cd131be95a06facc108",
  measurementId: "G-5H79BZTQY0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
