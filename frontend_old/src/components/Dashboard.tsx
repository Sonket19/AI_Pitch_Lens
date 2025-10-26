// src/components/Dashboard.tsx
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import PersonaPicker from "./PersonaPicker";
import CustomizePersonaModal from "./CustomizePersonaModal";
import InputPanel from "./InputPanel";
import HistoryList from "./HistoryList";

const Dashboard: React.FC = () => {
  const { customWeights, setCustomWeights, startAnalysis, analyzing } = useAppContext();
  const [showWeights, setShowWeights] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    await startAnalysis();
    navigate("/analysis");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Upload Pitch Deck</h2>
        <p className="text-stone-500 mt-2">
          Analyze from different investor perspectives. Upload a PDF, paste an email, or attach audio.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-5 card">
          <div className="p-6">
            <PersonaPicker onCustomClick={() => setShowWeights(true)} />
            <div className="mt-6">
              <InputPanel />
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className={`mt-6 w-full btn-primary ${analyzing ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {analyzing ? "Analyzing…" : "Analyze Deck"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Analysis History</h3>
        <HistoryList />
      </div>

      {/* Custom Weights Modal */}
      <CustomizePersonaModal
        open={showWeights}
        onClose={() => setShowWeights(false)}
        value={customWeights}
        onChange={setCustomWeights}
        onApply={() => setShowWeights(false)}
      />
    </div>
  );
};

export default Dashboard;
