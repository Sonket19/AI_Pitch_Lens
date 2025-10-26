import type { FieldValue, Timestamp } from "firebase/firestore";

export type AnalysisStatus =
  | "uploaded"
  | "queued"
  | "processing"
  | "text_extracted"
  | "completed"
  | "error";

export type DealAnalysis = {
  risk?: string;
  financials?: string;
  [key: string]: unknown;
};

export type DealData = {
  id?: string;
  userId: string;
  filename: string;
  storagePath: string;
  gcsPath?: string;
  fileUrl?: string;
  status: AnalysisStatus;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  errorMessage?: string;
  fullText?: string;
  analysis?: DealAnalysis;
};
