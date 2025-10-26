import React from 'react';
// FIX: Corrected import path
import { FinancialAnalysis } from '../../types';

const MetricIcon: React.FC<{ name: string }> = ({ name }) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('arr') || lowerName.includes('mrr')) {
        return (
            <svg className="w-6 h-6 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
            </svg>
        );
    }
     if (lowerName.includes('user') || lowerName.includes('customer')) {
        return (
             <svg className="w-6 h-6 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12A3.75 3.75 0 1012 4.5a3.75 3.75 0 000 7.5z" />
            </svg>
        );
    }
    return (
        <svg className="w-6 h-6 text-stone-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
};

interface Props {
    data: FinancialAnalysis;
}

const FinancialsTab: React.FC<Props> = ({ data }) => {
    return (
        <div className="space-y-8 animate-fade-in">
             <h3 className="text-2xl font-semibold text-stone-800 mb-2">Financial Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                     <h4 className="font-semibold text-stone-700 mb-3">Key Metrics</h4>
                     {data.keyMetrics && data.keyMetrics.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {data.keyMetrics.map((metric, index) => (
                                <div key={index} className="bg-zinc-100 border border-stone-200 p-4 rounded-lg flex items-start space-x-4">
                                    <MetricIcon name={metric.name} />
                                    <div>
                                        <p className="text-sm text-stone-500">{metric.name}</p>
                                        <p className="text-xl font-bold text-stone-700">{metric.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-stone-500 italic">No key metrics were explicitly mentioned or found.</p>
                     )}
                </div>

                <div>
                    <h4 className="font-semibold text-stone-700 mb-3">Funding Request</h4>
                    <div className="bg-zinc-100 border border-stone-200 p-4 rounded-lg">
                        <p className="text-stone-700 leading-relaxed">{data.fundingRequest}</p>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-stone-700 mb-3">Projections Analysis</h4>
                <div className="bg-zinc-100 border border-stone-200 p-4 rounded-lg">
                    <p className="text-stone-700 leading-relaxed">{data.projections}</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialsTab;
