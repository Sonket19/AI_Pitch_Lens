import React from 'react';
// FIX: Corrected import path
import { ExecutiveSummary } from '../../types';

interface Props {
    data: ExecutiveSummary;
}

const ExecutiveSummaryTab: React.FC<Props> = ({ data }) => {
    const { summary, strengths, weaknesses } = data;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-2xl font-semibold text-stone-800 mb-2">Executive Summary</h3>
                <p className="text-stone-600 leading-relaxed">{summary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="flex items-center font-semibold text-emerald-700 mb-2">
                         <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM5 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM15 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5z" />
                            <path d="M3.5 2.75a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H3.5v-1.5z" />
                         </svg>
                        Strengths
                    </h4>
                    <ul className="space-y-2 text-stone-600 pl-7">
                        {strengths.map((item, index) => <li key={index} className="flex items-start"><span className="mr-2 text-emerald-500">✓</span><span>{item}</span></li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="flex items-center font-semibold text-rose-700 mb-2">
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        Weaknesses
                    </h4>
                    <ul className="space-y-2 text-stone-600 pl-7">
                        {weaknesses.map((item, index) => <li key={index} className="flex items-start"><span className="mr-2 text-rose-500">✗</span><span>{item}</span></li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveSummaryTab;
