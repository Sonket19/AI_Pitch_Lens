// frontend/context/AppContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Import your Firebase auth object

// 1. Define the shape of your User
export interface AppUser {
  id: string;
  email: string | null;
  name: string | null;
}

// 2. Define the shape of your Context's state
interface AppContextState {
  user: AppUser | null;
  isLoading: boolean;
  loadingMessage: string | null;
  error: string | null;
  setUser: (user: AppUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  setLoadingMessage: (message: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// 3. Create the Context
const AppContext = createContext<AppContextState | undefined>(undefined);

// 4. Create the Provider (This is the most important part)
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading on init
  const [loadingMessage, setLoadingMessage] = useState<string | null>("Initializing...");
  const [error, setError] = useState<string | null>(null);

  // --- THIS IS THE AUTH LISTENER FROM STEP 3 ---
  // We put it here, in the provider, so it runs once
  // and manages the user state for the entire app.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        const appUser: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        };
        setUser(appUser);
      } else {
        // User is logged out
        setUser(null);
      }
      setIsLoading(false); // Auth check is complete
      setLoadingMessage(null);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array so it only runs once

  const clearError = () => setError(null);

  // This is the value that all components will receive
  const value = {
    user,
    isLoading,
    loadingMessage,
    error,
    setUser,
    setIsLoading,
    setLoadingMessage,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 5. Create the custom hook (this is what your components use)
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};