import { Timestamp } from "firebase/firestore";

export type AnalysisStatus =
| "uploaded"
| "queued"
| "processing"
| "text_extracted"
| "completed"
| "error";

export type DealAnalysis = Record<string, string | undefined>;

export type DealData = {
id?: string;
userId: string;
filename: string;
storagePath: string;
gcsPath: string;
fileUrl?: string;
status: AnalysisStatus;
createdAt: Timestamp;
updatedAt?: Timestamp;
errorMessage?: string;
analysis?: DealAnalysis;
};
