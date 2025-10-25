import React from 'react';
// FIX: Corrected import path
import { IndustryAnalysis } from '../../types';

interface Props {
    data: IndustryAnalysis;
}

const IndustryTab: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-2xl font-semibold text-stone-800 mb-2">Industry Benchmarking</h3>
                <p className="text-stone-600 leading-relaxed">{data.benchmarking}</p>
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-stone-800 mb-2">Competitors</h3>
                <ul className="list-disc list-inside space-y-2 text-stone-600">
                    {data.competitors.map((competitor, index) => (
                        <li key={index}>{competitor}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default IndustryTab;
