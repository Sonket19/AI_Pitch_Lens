import type { Timestamp } from "firebase/firestore";

export interface User {
  name: string;
  email: string;
}

export interface ImageData {
  mimeType: string;
  data: string;
}

export interface ExecutiveSummary {
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface RiskAssessment {
  risks: {
    risk: string;
    severity: "Low" | "Medium" | "High";
    mitigation: string;
  }[];
}

export interface IndustryAnalysis {
  benchmarking: string;
  competitors: string[];
}

export interface FinancialAnalysis {
  keyMetrics: {
    name: string;
    value: string;
  }[];
  fundingRequest: string;
  projections: string;
}

export interface FounderResponse {
  question: string;
  answer: string;
}

export interface ScoreWeightings {
  teamStrength: number;
  traction: number;
  financialHealth: number;
  marketOpportunity: number;
  claimCredibility: number;
}

export interface PitchDeckAnalysis {
  id: string;
  fileName: string;
  persona: string;
  customPersona?: ScoreWeightings;
  executiveSummary: ExecutiveSummary;
  riskAssessment: RiskAssessment;
  industryAnalysis: IndustryAnalysis;
  financialAnalysis: FinancialAnalysis;
  followUpQuestions: {
    questions: string[];
    founderEmail: string;
  };
  founderResponses?: FounderResponse[];
}

export interface ChatMessage {
  sender: "user" | "model";
  text: string;
}

export interface AnalysisHistoryItem {
  id: string;
  fileName: string;
  date: string;
}

// 🔹 DealData used in Dashboard.tsx
export interface DealAnalysis {
  risk?: string;
  financials?: string;
}

export interface DealData {
  dealId: string;
  gcsPath: string;
  status: "processing" | "text_extracted" | "completed" | "error";
  createdAt: Timestamp;
  full_text?: string;
  analysis?: DealAnalysis;
  error_message?: string;
}
