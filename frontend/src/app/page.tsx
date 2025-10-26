"use client";
import DealFlowWidget from "@/components/deals/DealFlowWidget";

export default function Page() {
return (
<main className="mx-auto max-w-5xl space-y-8 p-6">
<section>
<h1 className="mb-2 text-2xl font-semibold">Upload Pitch Deck</h1>
<p className="mb-6 text-sm text-gray-500">Upload a PDF to start AI analysis.</p>
<DealFlowWidget />
</section>
</main>
);
}
