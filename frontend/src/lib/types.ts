import type { AnalyzePitchDeckOutput } from '@/ai/flows/analyze-pitch-deck';

export type AnalysisResult = AnalyzePitchDeckOutput;

export type Persona = 'SaaS VC' | 'Deep Tech VC' | 'Fintech VC' | 'Custom';

export type CustomWeights = {
  teamStrengthWeight: number;
  tractionWeight: number;
  financialHealthWeight: number;
  marketOpportunityWeight: number;
  claimCredibilityWeight: number;
};

export type HistoryItem = {
  id: string;
  fileName: string;
  persona: Persona;
  customWeights?: CustomWeights;
  date: string;
  analysis: AnalysisResult;
};

export type User = {
  email: string;
};

export type AppState = 'login' | 'upload' | 'analyzing' | 'viewing';

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};
