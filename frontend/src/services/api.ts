import { getEnvValue } from "@/utils/env";

const DEFAULT_BASE = "http://127.0.0.1:5001/pitch-lens-ai/us-central1";

const configuredBase = getEnvValue(
  ["NEXT_PUBLIC_FUNCTIONS_BASE", "VITE_API_BASE_URL"],
  { fallback: DEFAULT_BASE, trimTrailingSlash: true },
);

const queueEndpoint = configuredBase.endsWith("/queueAnalysis")
  ? configuredBase
  : `${configuredBase}/queueAnalysis`;

/** Call your HTTPS function to start analysis */
export async function requestAnalysis(dealId: string) {
  const res = await fetch(queueEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dealId }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`queueAnalysis failed: ${res.status} ${detail}`);
  }

  return res.json();
}
