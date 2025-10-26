'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, HistoryItem, AppState, AnalysisResult, ChatMessage } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  appState: AppState;
  setAppState: (state: AppState) => void;
  currentAnalysis: HistoryItem | null;
  setCurrentAnalysis: (item: HistoryItem | null) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  founderResponses: string;
  setFounderResponses: (responses: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('investor-ai-user', null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('investor-ai-history', []);
  const [appState, setAppState] = useState<AppState>('login');
  const [currentAnalysis, setCurrentAnalysis] = useState<HistoryItem | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [founderResponses, setFounderResponses] = useState('');

  // This state will help us avoid hydration mismatches.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setAppState(user ? 'upload' : 'login');
    }
  }, [user, isClient]);

  const addToHistory = (item: HistoryItem) => {
    setHistory([item, ...history]);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory(prev => [...prev, message]);
  }

  const value = {
    user: isClient ? user : null,
    setUser,
    history,
    addToHistory,
    appState: isClient ? appState : 'login',
    setAppState,
    currentAnalysis,
    setCurrentAnalysis,
    chatHistory,
    setChatHistory,
    addChatMessage,
    founderResponses,
    setFounderResponses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
