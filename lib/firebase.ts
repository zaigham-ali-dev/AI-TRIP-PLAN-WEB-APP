import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern for Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Robust sign-out function invoking Firebase signOut(auth) and clearing session caches.
 */
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("user_session");
      localStorage.removeItem("auth_user");
    }
  } catch (error) {
    console.error("Error during Firebase signOut:", error);
    throw error;
  }
};

export { auth, db };
