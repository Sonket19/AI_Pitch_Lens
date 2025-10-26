import React, { useState, useMemo } from 'react';
import { ScoreWeightings } from '../types';

interface Props {
    onSave: (weightings: ScoreWeightings) => void;
    onClose: () => void;
    initialWeightings: ScoreWeightings | null;
}

const CustomizePersonaModal: React.FC<Props> = ({ onSave, onClose, initialWeightings }) => {
    const [weights, setWeights] = useState<ScoreWeightings>(
        initialWeightings || {
            teamStrength: 20,
            traction: 20,
            financialHealth: 15,
            marketOpportunity: 20,
            claimCredibility: 25,
        }
    );

    const totalWeight = useMemo(() => {
        return Object.values(weights).reduce((sum, val) => sum + val, 0);
    }, [weights]);

    const handleWeightChange = (key: keyof ScoreWeightings, value: string) => {
        setWeights(prev => ({
            ...prev,
            [key]: parseInt(value, 10) || 0,
        }));
    };

    const handleSave = () => {
        if (totalWeight === 100) {
            onSave(weights);
        }
    };

    const factors: { key: keyof ScoreWeightings; label: string }[] = [
        { key: 'teamStrength', label: 'Team Strength' },
        { key: 'marketOpportunity', label: 'Market Opportunity' },
        { key: 'traction', label: 'Traction' },
        { key: 'claimCredibility', label: 'Claim Credibility' },
        { key: 'financialHealth', label: 'Financial Health' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-5 border-b border-stone-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3 text-stone-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M5 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 007 6.252V4zM5 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 007 12.252V10zM10 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 0012 6.252V4zM10 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158a1 1 0 00-.707-1.707V10zM15 4a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158A1 1 0 0017 6.252V4zM15 10a1 1 0 00-2 0v2.252a1 1 0 00.342.743l1.158 1.158a1 1 0 001.414 0l1.158-1.158a1 1 0 00-.707-1.707V10z" />
                        </svg>
                        <h2 className="text-xl font-bold text-stone-800">Customize Score Weightage</h2>
                    </div>
                     <button onClick={onClose} className="text-stone-500 hover:text-stone-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-stone-600 mb-6">Adjust the importance of each factor to tailor the AI's analysis. The total must be 100%.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {factors.map(({ key, label }) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-stone-700">{label}</label>
                                    <span className="text-sm font-semibold text-stone-800">{weights[key]}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={weights[key]}
                                    onChange={(e) => handleWeightChange(key, e.target.value)}
                                    className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-stone-700"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-zinc-50 border-t border-stone-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="text-sm font-medium text-stone-600 mr-2">Total Weight:</span>
                        <span className={`font-bold text-sm px-3 py-1 rounded-full ${totalWeight === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {totalWeight}%
                        </span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button onClick={onClose} type="button" className="py-2 px-4 font-semibold text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-zinc-100 transition-colors">
                            Close
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={totalWeight !== 100}
                            className="py-2 px-4 font-semibold text-white bg-stone-700 rounded-md hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                        >
                            Apply & Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizePersonaModal;
