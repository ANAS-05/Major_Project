const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCIbNQW5tLgNOT-i88AD6L427KoAeAY6iM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "journeyit2026.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "journeyit2026",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "journeyit2026.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "287030353663",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:287030353663:web:c989a25dccbd17273d76ca",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KYV6KM5WZW",
};

export default firebaseConfig;
