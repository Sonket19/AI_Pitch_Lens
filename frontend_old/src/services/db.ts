import type { FirestoreDataConverter } from "firebase/firestore";
import type { DealData } from "../types";

export const dealConverter: FirestoreDataConverter<DealData> = {
  toFirestore(d: DealData) {
    return d;
  },
  fromFirestore(snap, opts) {
    const data = snap.data(opts);
    return {
      dealId: data.dealId,
      gcsPath: data.gcsPath,
      status: data.status,
      createdAt: data.createdAt,
      full_text: data.full_text,
      analysis: data.analysis,
      error_message: data.error_message,
    } as DealData;
  },
};
