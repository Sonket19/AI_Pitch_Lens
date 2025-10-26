import React from 'react';
// FIX: Corrected import path
import { RiskAssessment } from '../../types';

interface Props {
    data: RiskAssessment;
}

const RiskAssessmentTab: React.FC<Props> = ({ data }) => {
    
    const getSeverityInfo = (severity: 'Low' | 'Medium' | 'High') => {
        switch (severity) {
            case 'High': 
                return {
                    className: 'bg-rose-100 text-rose-800 border-rose-200',
                    icon: (
                        <svg className="w-5 h-5 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-5.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'Medium': 
                return {
                    className: 'bg-amber-100 text-amber-800 border-amber-200',
                    icon: (
                        <svg className="w-5 h-5 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    )
                };
            case 'Low': 
                return {
                    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    icon: (
                         <svg className="w-5 h-5 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                    )
                };
            default: 
                return {
                    className: 'bg-stone-100 text-stone-800',
                    icon: null
                };
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-semibold text-stone-800">Risk Assessment</h3>
            <div className="space-y-4">
                {data.risks.map((item, index) => {
                    const { className, icon } = getSeverityInfo(item.severity);
                    return (
                        <div key={index} className="bg-zinc-50 p-4 rounded-lg border border-stone-200">
                            <div className="flex justify-between items-start mb-2 gap-4">
                                <h4 className="font-semibold text-stone-700 flex-grow">{item.risk}</h4>
                                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap border ${className}`}>
                                    {icon}
                                    {item.severity} Severity
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-stone-600 mb-1">Mitigation Strategy:</p>
                                <p className="text-stone-600 text-sm">{item.mitigation}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RiskAssessmentTab;
