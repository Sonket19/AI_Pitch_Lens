const FUNCTIONS_BASE =
process.env.NEXT_PUBLIC_FUNCTIONS_BASE ??
"http://127.0.0.1:5001/pitch-lens-ai/us-central1";

/** Call your HTTPS function to start analysis */
export async function requestAnalysis(dealId: string) {
const res = await fetch(`${FUNCTIONS_BASE}/queueAnalysis`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ dealId }),
});
if (!res.ok) throw new Error(`queueAnalysis failed: ${res.status} ${await res.text()}`);
return res.json();
}
