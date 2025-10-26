import { signInAnonymously } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import { auth, db, storage } from "@/firebaseConfig";
import { AnalysisStatus, DealData } from "@/types/deal";

function normalizeDeal(id: string | undefined, data: Record<string, unknown>): DealData {
  const status = (data.status as AnalysisStatus | undefined) ?? "uploaded";

  return {
    id,
    userId: String((data.userId as string | undefined) ?? ""),
    filename: String((data.filename as string | undefined) ?? ""),
    storagePath: String((data.storagePath as string | undefined) ?? ""),
    gcsPath: (data.gcsPath as string | undefined) ?? (data.gcs_path as string | undefined),
    fileUrl: (data.fileUrl as string | undefined) ?? (data.file_url as string | undefined),
    status,
    createdAt: data.createdAt as DealData["createdAt"],
    updatedAt: data.updatedAt as DealData["updatedAt"],
    errorMessage:
      (data.errorMessage as string | undefined) ??
      (data.error_message as string | undefined) ??
      undefined,
    fullText: (data.fullText as string | undefined) ?? (data.full_text as string | undefined),
    analysis: data.analysis as DealData["analysis"],
  };
}

async function ensureUser() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const credential = await signInAnonymously(auth);
  if (!credential.user) {
    throw new Error("Unable to authenticate user");
  }

  return credential.user;
}

/** Upload PDF with progress, return storage path + URL */
export async function uploadPdfToStorage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ storagePath: string; gcsPath: string; downloadURL: string }> {
  const user = await ensureUser();

  return new Promise((resolve, reject) => {
    const uid = user.uid ?? "anon";
    const storagePath = `deals/${uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || "application/pdf",
    });

    task.on(
      "state_changed",
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      (err) => reject(err),
      async () => {
        const bucket =
          task.snapshot.ref.bucket ||
          (storage.app.options && "storageBucket" in storage.app.options
            ? (storage.app.options.storageBucket as string | undefined)
            : undefined);

        if (!bucket) {
          reject(new Error("Storage bucket is not configured"));
          return;
        }

        resolve({
          storagePath,
          gcsPath: `gs://${bucket}/${storagePath}`,
          downloadURL: await getDownloadURL(task.snapshot.ref),
        });
      },
    );
  });
}

/** Create Firestore deal doc and return its id */
export async function createDealDoc(params: {
  filename: string;
  storagePath: string;
  gcsPath: string;
  fileUrl: string;
}): Promise<string> {
  const user = await ensureUser();
  const ref = await addDoc(collection(db, "deals"), {
    userId: user.uid,
    filename: params.filename,
    storagePath: params.storagePath,
    gcsPath: params.gcsPath,
    fileUrl: params.fileUrl,
    status: "uploaded",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Omit<DealData, "id">);

  return ref.id;
}

/** Watch a deal live */
export function watchDeal(dealId: string, cb: (deal: DealData | null) => void) {
  return onSnapshot(doc(db, "deals", dealId), (snap) => {
    if (!snap.exists()) {
      cb(null);
      return;
    }

    cb(normalizeDeal(snap.id, snap.data()));
  });
}

/** Recent deals for current user */
export async function getRecentDeals(limitCount = 10): Promise<DealData[]> {
  const user = await ensureUser();
  const uid = user.uid;
  const q = query(
    collection(db, "deals"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeDeal(d.id, d.data()));
}

/** Mark queued (optional) */
export async function markDealQueued(dealId: string) {
  await updateDoc(doc(db, "deals", dealId), {
    status: "queued",
    updatedAt: serverTimestamp(),
  });
}
