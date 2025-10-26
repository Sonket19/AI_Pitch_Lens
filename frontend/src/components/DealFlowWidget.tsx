// src/components/DealFlowWidget.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { uploadPdfToStorage, createDealDoc, watchDeal, DealData } from '../services/deals';

const DealFlowWidget: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dealId, setDealId] = useState<string>('');
  const [deal, setDeal] = useState<DealData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const disabled = useMemo(() => !file, [file]);

  useEffect(() => {
    if (!dealId) return;
    const off = watchDeal(
      dealId,
      (d) => setDeal(d),
      (e) => setError(String(e?.message || e))
    );
    return () => off();
  }, [dealId]);

  async function handleStart() {
    try {
      setError(null);
      if (!file) return;

      // 1) Upload to Storage -> get gs:// path
      const { storagePath, gcsPath, downloadURL } = await uploadPdfToStorage(file);

      // 2) Create Firestore doc -> triggers Cloud Functions
      const id = await createDealDoc({ filename: file.name, storagePath, gcsPath, fileUrl: downloadURL });

      setDealId(id);
    } catch (e: any) {
      setError(e?.message || 'Failed to start analysis');
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">Start a new analysis</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm"
      />

      <button
        onClick={handleStart}
        disabled={disabled}
        className={`w-full py-2 rounded-lg text-white ${
          disabled ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-95'
        }`}
      >
        Upload & Analyze
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

        {dealId && (
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm">
            <div><span className="font-semibold">Deal ID:</span> {dealId}</div>
            <div><span className="font-semibold">Status:</span> {deal?.status || 'waiting...'}</div>

            {deal?.status === 'error' && (
              <div className="text-red-700 mt-2">
                <span className="font-semibold">Error:</span> {deal?.errorMessage || 'Unknown error'}
              </div>
            )}

            {deal?.status === 'completed' && deal?.analysis && (
              <div className="mt-3 space-y-1">
                <div className="font-semibold">Analysis Ready ✅</div>
                <div className="text-slate-700">
                  <div><span className="font-semibold">Risk:</span> {deal.analysis.risk || 'N/A'}</div>
                  <div><span className="font-semibold">Financials:</span> {deal.analysis.financials || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default DealFlowWidget;
