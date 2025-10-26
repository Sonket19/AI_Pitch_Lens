import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

import { getEnvValue } from "@/utils/env";

const firebaseConfig: FirebaseOptions = {
  apiKey: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_API_KEY", "VITE_FIREBASE_API_KEY"],
    { fallback: "AIzaSyAf2qg-ci1sQYbraiRD3Z7qyNcLS4K9wPQ" },
  ),
  authDomain: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN"],
    { fallback: "pitch-lens-ai.firebaseapp.com" },
  ),
  projectId: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID"],
    { fallback: "pitch-lens-ai" },
  ),
  storageBucket: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_STORAGE_BUCKET"],
    { fallback: "pitch-lens-ai.appspot.com" },
  ),
  appId: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_APP_ID", "VITE_FIREBASE_APP_ID"],
    { fallback: "1:961681022980:web:bafac0aa16b380526a9551" },
  ),
  messagingSenderId: getEnvValue(
    ["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "VITE_FIREBASE_MESSAGING_SENDER_ID"],
    { fallback: "961681022980" },
  ),
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const functionsRegion = getEnvValue(
  ["NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION", "VITE_FIREBASE_FUNCTIONS_REGION"],
  { fallback: "us-central1" },
);

export const functions = getFunctions(app, functionsRegion);
