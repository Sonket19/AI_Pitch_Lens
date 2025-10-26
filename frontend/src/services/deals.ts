import { auth, db, storage } from "@/firebaseConfig";
import {
addDoc, collection, doc, onSnapshot, orderBy, query,
serverTimestamp, where, getDocs, limit, updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { DealData } from "@/types/deal";

/** Upload PDF with progress, return storage path + URL */
export function uploadPdfToStorage(
file: File,
onProgress?: (pct: number) => void
): Promise<{ storagePath: string; downloadURL: string }> {
return new Promise((resolve, reject) => {
const uid = auth.currentUser?.uid ?? "anon";
const storagePath = `decks/${uid}/${Date.now()}_${file.name}`;
const storageRef = ref(storage, storagePath);
const task = uploadBytesResumable(storageRef, file, { contentType: file.type || "application/pdf" });

task.on("state_changed",
(snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
(err) => reject(err),
async () => resolve({ storagePath, downloadURL: await getDownloadURL(task.snapshot.ref) })
);
});
}

/** Create Firestore deal doc and return its id */
export async function createDealDoc(params: {
filename: string; storagePath: string; fileUrl: string;
}): Promise<string> {
const user = auth.currentUser;
if (!user) throw new Error("Not authenticated");
const ref = await addDoc(collection(db, "deals"), {
userId: user.uid,
filename: params.filename,
storagePath: params.storagePath,
fileUrl: params.fileUrl,
status: "uploaded",
createdAt: serverTimestamp(),
updatedAt: serverTimestamp(),
} as Omit<DealData, "id" | "createdAt">);
return ref.id;
}

/** Watch a deal live */
export function watchDeal(dealId: string, cb: (deal: DealData | null) => void) {
return onSnapshot(doc(db, "deals", dealId), (snap) => {
if (!snap.exists()) { cb(null); return; }
cb({ id: snap.id, ...(snap.data() as DealData) });
});
}

/** Recent deals for current user */
export async function getRecentDeals(limitCount = 10): Promise<DealData[]> {
const uid = auth.currentUser?.uid;
if (!uid) return [];
const q = query(
collection(db, "deals"),
where("userId", "==", uid),
orderBy("createdAt", "desc"),
limit(limitCount)
);
const snap = await getDocs(q);
return snap.docs.map(d => ({ id: d.id, ...(d.data() as DealData) }));
}

/** Mark queued (optional) */
export async function markDealQueued(dealId: string) {
await updateDoc(doc(db, "deals", dealId), { status: "queued", updatedAt: serverTimestamp() });
}
