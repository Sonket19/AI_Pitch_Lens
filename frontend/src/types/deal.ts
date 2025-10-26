import { Timestamp } from "firebase/firestore";

export type AnalysisStatus = "uploaded" | "queued" | "processing" | "complete" | "error";

export type DealData = {
id?: string;
userId: string;
filename: string;
storagePath: string;
fileUrl?: string;
status: AnalysisStatus;
createdAt: Timestamp;
updatedAt?: Timestamp;
errorMessage?: string;
};
