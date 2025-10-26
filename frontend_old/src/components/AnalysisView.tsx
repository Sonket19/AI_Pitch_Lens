
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ExecutiveSummaryTab from './tabs/ExecutiveSummaryTab';
import RiskAssessmentTab from './tabs/RiskAssessmentTab';
import IndustryTab from './tabs/IndustryTab';
import FinancialsTab from './tabs/FinancialsTab';
import ConnectTab from './tabs/ConnectTab';
import ChatbotTab from './tabs/ChatbotTab';
import InvestmentMemoModal from './InvestmentMemoModal';
import { AnalysisHistoryItem } from '../types';

type Tab = 'Summary' | 'Risk' | 'Industry' | 'Financials' | 'Connect' | 'Chat';

const AnalysisView: React.FC = () => {
    const { currentAnalysis, startNewAnalysis, analysisHistory, loadAnalysisFromHistory } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('Summary');
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    if (!currentAnalysis) {
        return (
            <div className="text-center">
                <p>No analysis loaded. Please upload a pitch deck.</p>
                <button onClick={startNewAnalysis} className="mt-4 bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-800 transition-colors">
                    Start New Analysis
                </button>
            </div>
        );
    }

    const tabs: { name: Tab, label: string }[] = [
        { name: 'Summary', label: 'Executive Summary' },
        { name: 'Risk', label: 'Risk Assessment' },
        { name: 'Industry', label: 'Industry Analysis' },
        { name: 'Financials', label: 'Financials' },
        { name: 'Connect', label: 'Founder Connect' },
        { name: 'Chat', label: 'AI Chatbot' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Summary':
                return <ExecutiveSummaryTab data={currentAnalysis.executiveSummary} />;
            case 'Risk':
                return <RiskAssessmentTab data={currentAnalysis.riskAssessment} />;
            case 'Industry':
                return <IndustryTab data={currentAnalysis.industryAnalysis} />;
            case 'Financials':
                return <FinancialsTab data={currentAnalysis.financialAnalysis} />;
            case 'Connect':
                return <ConnectTab questions={currentAnalysis.followUpQuestions.questions} email={currentAnalysis.followUpQuestions.founderEmail} />;
            case 'Chat':
                return <ChatbotTab />;
            default:
                return null;
        }
    };

    const handleHistorySelect = (id: string) => {
        loadAnalysisFromHistory(id);
        setIsHistoryOpen(false);
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <p className="text-sm text-stone-500">Analysis for:</p>
                    <h2 className="text-3xl font-bold text-stone-800">{currentAnalysis.fileName}</h2>
                    <p className="text-sm text-stone-600 mt-1">Persona: <span className="font-semibold">{currentAnalysis.persona}</span></p>
                </div>
                <div className="flex items-center gap-2">
                     <div className="relative">
                        <button 
                            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                            className="bg-white border border-stone-300 text-stone-700 font-semibold py-2 px-4 rounded-md hover:bg-zinc-100 transition-colors text-sm"
                        >
                            History ({analysisHistory.length})
                        </button>
                        {isHistoryOpen && analysisHistory.length > 0 && (
                             <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-stone-200 z-10">
                                <ul className="py-1">
                                    {analysisHistory.map((item: AnalysisHistoryItem) => (
                                        <li key={item.id} onClick={() => handleHistorySelect(item.id)} className="px-4 py-2 text-sm text-stone-700 hover:bg-zinc-100 cursor-pointer">
                                            <p className="font-semibold truncate">{item.fileName}</p>
                                            <p className="text-xs text-stone-500">{new Date(item.date).toLocaleString()}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                     <button 
                        onClick={() => setIsMemoModalOpen(true)}
                        className="bg-white border border-stone-300 text-stone-700 font-semibold py-2 px-4 rounded-md hover:bg-zinc-100 transition-colors text-sm"
                    >
                        Generate Memo
                    </button>
                    <button 
                        onClick={startNewAnalysis} 
                        className="bg-stone-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-stone-800 transition-colors text-sm"
                    >
                        Analyze Another
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-stone-200">
                <div className="border-b border-stone-200">
                    <nav className="flex flex-wrap -mb-px px-4 sm:px-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${activeTab === tab.name 
                                        ? 'border-stone-600 text-stone-700' 
                                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                                    }
                                    mr-8 last:mr-0
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-6 md:p-8">
                    {renderTabContent()}
                </div>
            </div>
            
            {isMemoModalOpen && (
                <InvestmentMemoModal 
                    analysis={currentAnalysis}
                    onClose={() => setIsMemoModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AnalysisView;
