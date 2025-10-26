// src/components/HistoryList.tsx
import React from "react";
import { useAppContext } from "../context/AppContext";

const HistoryList: React.FC = () => {
  const { analysisHistory } = useAppContext();

  if (analysisHistory.length === 0) {
    return <div className="text-sm text-stone-500">No analyses yet.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {analysisHistory.map((h) => (
        <div key={h.id} className="card p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">{h.fileName}</div>
            <div className="text-xs text-stone-500">{new Date(h.date).toLocaleString()}</div>
          </div>
          <button
            className="btn-primary px-3 py-1.5"
            onClick={() => {
              window.location.href = "/analysis";
            }}
          >
            View Analysis
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
