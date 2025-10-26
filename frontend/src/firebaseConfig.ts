// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAf2qg-ci1sQYbraiRD3Z7qyNcLS4K9wPQ",
  authDomain: "pitch-lens-ai.firebaseapp.com",
  projectId: "pitch-lens-ai",
  storageBucket: "pitch-lens-ai.appspot.com",
  messagingSenderId: "961681022980",
  appId: "1:961681022980:web:bafac0aa16b380526a9551",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1"); // <-- add this
