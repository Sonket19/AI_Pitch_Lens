// src/context/AppContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type {
  AnalysisHistoryItem,
  PitchDeckAnalysis,
  ChatMessage,
  PersonaKey,
  ScoreWeightings,
  InputMethod,
} from "../types";

type UserLike = { email: string } | null;

type State = {
  user: UserLike;
  loading: boolean;

  // Persona + custom weights
  persona: PersonaKey;
  customWeights: ScoreWeightings;

  // Inputs
  inputMethod: InputMethod;
  emailText: string;
  audioFile: File | null;
  pdfFile: File | null;

  // Analysis
  analyzing: boolean;
  lastAnalysis: PitchDeckAnalysis | null;
  analysisHistory: AnalysisHistoryItem[];
  chat: ChatMessage[];
};

type Action =
  | { type: "INIT"; payload: Partial<State> }
  | { type: "LOGIN"; email: string }
  | { type: "LOGOUT" }
  | { type: "SET_PERSONA"; persona: PersonaKey }
  | { type: "SET_WEIGHTS"; weights: ScoreWeightings }
  | { type: "SET_INPUT_METHOD"; method: InputMethod }
  | { type: "SET_EMAIL_TEXT"; text: string }
  | { type: "SET_AUDIO_FILE"; file: File | null }
  | { type: "SET_PDF_FILE"; file: File | null }
  | { type: "SET_ANALYZING"; value: boolean }
  | { type: "SET_LAST_ANALYSIS"; analysis: PitchDeckAnalysis | null }
  | { type: "SET_HISTORY"; items: AnalysisHistoryItem[] }
  | { type: "PUSH_HISTORY"; item: AnalysisHistoryItem }
  | { type: "SET_CHAT"; chat: ChatMessage[] }
  | { type: "PUSH_CHAT"; message: ChatMessage };

const defaultWeights: ScoreWeightings = {
  teamStrength: 20,
  traction: 20,
  financialHealth: 20,
  marketOpportunity: 20,
  claimCredibility: 20,
};

// localStorage keys
const LS_USER = "pdai:user";
const LS_HISTORY = "pdai:history";
const LS_LAST_ANALYSIS = "pdai:lastAnalysis";
const LS_CHAT = "pdai:chat";
const LS_PERSONA = "pdai:persona";
const LS_WEIGHTS = "pdai:weights";

const initialState: State = {
  user: null,
  loading: true,
  persona: "saas",
  customWeights: defaultWeights,
  inputMethod: "pdf",
  emailText: "",
  audioFile: null,
  pdfFile: null,
  analyzing: false,
  lastAnalysis: null,
  analysisHistory: [],
  chat: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload };
    case "LOGIN":
      return { ...state, user: { email: action.email } };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_PERSONA":
      return { ...state, persona: action.persona };
    case "SET_WEIGHTS":
      return { ...state, customWeights: action.weights };
    case "SET_INPUT_METHOD":
      return { ...state, inputMethod: action.method };
    case "SET_EMAIL_TEXT":
      return { ...state, emailText: action.text };
    case "SET_AUDIO_FILE":
      return { ...state, audioFile: action.file };
    case "SET_PDF_FILE":
      return { ...state, pdfFile: action.file };
    case "SET_ANALYZING":
      return { ...state, analyzing: action.value };
    case "SET_LAST_ANALYSIS":
      return { ...state, lastAnalysis: action.analysis };
    case "SET_HISTORY":
      return { ...state, analysisHistory: action.items };
    case "PUSH_HISTORY":
      return { ...state, analysisHistory: [action.item, ...state.analysisHistory] };
    case "SET_CHAT":
      return { ...state, chat: action.chat };
    case "PUSH_CHAT":
      return { ...state, chat: [...state.chat, action.message] };
    default:
      return state;
  }
}

interface AppContextType extends State {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  setPersona: (p: PersonaKey) => void;
  setCustomWeights: (w: ScoreWeightings) => void;

  setInputMethod: (m: InputMethod) => void;
  setEmailText: (t: string) => void;
  setAudioFile: (f: File | null) => void;
  setPdfFile: (f: File | null) => void;

  setChat: React.Dispatch<React.SetStateAction<ChatMessage[]>>; // convenience for caller
  startAnalysis: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Boot from localStorage once
  useEffect(() => {
    const user = localStorage.getItem(LS_USER);
    const persona = (localStorage.getItem(LS_PERSONA) as PersonaKey) || "saas";
    const weights = JSON.parse(localStorage.getItem(LS_WEIGHTS) || "null") || defaultWeights;
    const last = JSON.parse(localStorage.getItem(LS_LAST_ANALYSIS) || "null");
    const history = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
    const chat = JSON.parse(localStorage.getItem(LS_CHAT) || "[]");

    dispatch({
      type: "INIT",
      payload: {
        user: user ? JSON.parse(user) : null,
        loading: false,
        persona,
        customWeights: weights,
        lastAnalysis: last,
        analysisHistory: history,
        chat,
      },
    });
  }, []);

  // Persist selective slices
  useEffect(() => {
    localStorage.setItem(LS_PERSONA, state.persona);
  }, [state.persona]);

  useEffect(() => {
    localStorage.setItem(LS_WEIGHTS, JSON.stringify(state.customWeights));
  }, [state.customWeights]);

  useEffect(() => {
    if (state.lastAnalysis) {
      localStorage.setItem(LS_LAST_ANALYSIS, JSON.stringify(state.lastAnalysis));
    }
  }, [state.lastAnalysis]);

  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(state.analysisHistory));
  }, [state.analysisHistory]);

  useEffect(() => {
    localStorage.setItem(LS_CHAT, JSON.stringify(state.chat));
  }, [state.chat]);

  const login = async (email: string, password: string) => {
    if (email === "test@user.com" && password === "password123") {
      localStorage.setItem(LS_USER, JSON.stringify({ email }));
      dispatch({ type: "LOGIN", email });
      return;
    }
    throw new Error("Invalid credentials");
  };

  const logout = () => {
    localStorage.removeItem(LS_USER);
    dispatch({ type: "LOGOUT" });
  };

  const setPersona = (p: PersonaKey) => dispatch({ type: "SET_PERSONA", persona: p });
  const setCustomWeights = (w: ScoreWeightings) => dispatch({ type: "SET_WEIGHTS", weights: w });

  const setInputMethod = (m: InputMethod) => dispatch({ type: "SET_INPUT_METHOD", method: m });
  const setEmailText = (t: string) => dispatch({ type: "SET_EMAIL_TEXT", text: t });
  const setAudioFile = (f: File | null) => dispatch({ type: "SET_AUDIO_FILE", file: f });
  const setPdfFile = (f: File | null) => dispatch({ type: "SET_PDF_FILE", file: f });

  // Provide a setChat API that callers can use with setState style
  const setChat: React.Dispatch<React.SetStateAction<ChatMessage[]>> = (updater) => {
    const next = typeof updater === "function" ? (updater as any)(state.chat) : updater;
    dispatch({ type: "SET_CHAT", chat: next });
  };

  const startAnalysis = async () => {
    if (state.analyzing) return;
    dispatch({ type: "SET_ANALYZING", value: true });
    try {
      const { runAnalysis } = await import("../services/gemini");
      const res = await runAnalysis({
        persona: state.persona,
        customWeights: state.persona === "custom" ? state.customWeights : undefined,
        inputMethod: state.inputMethod,
        pdfFile: state.pdfFile,
        emailText: state.emailText,
        audioFile: state.audioFile,
      });

      dispatch({ type: "SET_LAST_ANALYSIS", analysis: res });

      dispatch({
        type: "PUSH_HISTORY",
        item: { id: res.id, fileName: res.fileName, date: res.createdAtISO },
      });

      dispatch({
        type: "SET_CHAT",
        chat: [{ sender: "user", text: JSON.stringify({ persona: res.persona, customPersona: res.customPersona, analysis: res }) }],
      });
    } catch (e) {
      console.error(e);
      alert("Failed to analyze. (Prototype stub).");
    } finally {
      dispatch({ type: "SET_ANALYZING", value: false });
    }
  };

  const value: AppContextType = useMemo(
    () => ({
      ...state,
      login,
      logout,
      setPersona,
      setCustomWeights,
      setInputMethod,
      setEmailText,
      setAudioFile,
      setPdfFile,
      setChat,
      startAnalysis,
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
};
