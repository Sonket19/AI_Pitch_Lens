"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { uploadPdfToStorage, createDealDoc, watchDeal } from "@/services/deals";
import { requestAnalysis } from "@/services/api";
import { DealData } from "@/types/deal";

export default function DealFlowWidget() {
const [fileName, setFileName] = React.useState("");
const [progress, setProgress] = React.useState(0);
const [deal, setDeal] = React.useState<DealData | null>(null);
const [error, setError] = React.useState<string | null>(null);
const [loading, setLoading] = React.useState(false);

const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
const file = acceptedFiles?.[0];
if (!file) return;
setError(null); setDeal(null); setFileName(file.name); setProgress(0); setLoading(true);

try {
const { storagePath, gcsPath, downloadURL } = await uploadPdfToStorage(file, setProgress);
const dealId = await createDealDoc({ filename: file.name, storagePath, gcsPath, fileUrl: downloadURL });

// If your Cloud Function is an HTTPS endpoint, keep this call:
await requestAnalysis(dealId);

const unsub = watchDeal(dealId, (d) => {
setDeal(d);
if (!d || d.status === "completed" || d.status === "error") {
unsub(); setLoading(false);
}
});
} catch (e: any) {
console.error(e); setError(e?.message ?? "Upload failed"); setLoading(false);
}
}, []);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
onDrop, multiple: false, accept: { "application/pdf": [] },
});

return (
<div className="mx-auto w-full max-w-3xl space-y-4">
<div {...getRootProps()} className={`rounded-lg border-2 border-dashed p-10 text-center transition
${isDragActive ? "border-indigo-400 bg-indigo-50" : "border-gray-300 bg-white"}`}>
<input {...getInputProps()} />
<p className="text-gray-600">Drag & drop a <span className="font-medium">PDF</span> here, or click to select.</p>
<p className="mt-1 text-xs text-gray-400">Max 1 file. PDF only.</p>
</div>

{fileName && (
<div className="rounded-md border p-4">
<div className="flex items-center justify-between">
<div>
<div className="text-sm text-gray-400">Selected</div>
<div className="font-medium">{fileName}</div>
</div>
<div className="text-sm text-gray-500">{progress}%</div>
</div>
<div className="mt-2 h-2 w-full rounded bg-gray-100">
<div className="h-2 rounded bg-indigo-600 transition-[width]" style={{ width: `${progress}%` }}/>
</div>
</div>
)}

{loading && (
<div className="rounded-md border bg-white p-4">
<p className="text-sm text-gray-600">Waiting for analysis…</p>
<p className="text-xs text-gray-400">Status: {deal?.status ?? "uploaded"}</p>
</div>
)}

{deal && !loading && (
<div className="rounded-md border bg-white p-4">
<div className="flex items-center justify-between">
<div>
<div className="text-sm text-gray-400">Deal</div>
<div className="font-medium">{deal.filename}</div>
</div>
<span className={`rounded-full px-2 py-1 text-xs ${
deal.status === "completed"
? "bg-green-100 text-green-700"
: deal.status === "error"
? "bg-red-100 text-red-700"
: "bg-yellow-100 text-yellow-700"
}`}> 
{deal.status}
</span>
</div>
{deal.errorMessage && <p className="mt-2 text-sm text-red-600">{deal.errorMessage}</p>}
</div>
)}

{error && (
<div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
)}
</div>
);
}
