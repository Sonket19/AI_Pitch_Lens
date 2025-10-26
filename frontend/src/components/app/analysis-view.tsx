'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/app-provider';
import { Button } from '@/components/ui/button';
import { AnalysisSidebar } from '@/components/app/analysis-sidebar';
import { ExecutiveSummary } from '@/components/analysis/executive-summary';
import { RiskAssessment } from '@/components/analysis/risk-assessment';
import { IndustryAnalysis } from '@/components/analysis/industry-analysis';
import { Financials } from '@/components/analysis/financials';
import { FounderConnect } from '@/components/analysis/founder-connect';
import { AiChatbot } from '@/components/analysis/ai-chatbot';
import { GenerateMemoModal } from '@/components/app/generate-memo-modal';
import { LogOut, ArrowLeft } from 'lucide-react';

export function AnalysisView() {
  const { currentAnalysis, setAppState, setUser, setFounderResponses, setChatHistory } = useAppContext();
  const [activeTab, setActiveTab] = useState('Executive Summary');
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);

  if (!currentAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">No analysis selected.</p>
        <Button onClick={() => setAppState('upload')} className="mt-4">
            Go to Upload
        </Button>
      </div>
    );
  }
  
  const handleAnalyzeAnother = () => {
    setAppState('upload');
    setFounderResponses('');
    setChatHistory([]);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Executive Summary':
        return <ExecutiveSummary analysis={currentAnalysis.analysis} />;
      case 'Risk Assessment':
        return <RiskAssessment analysis={currentAnalysis.analysis} />;
      case 'Industry Analysis':
        return <IndustryAnalysis analysis={currentAnalysis.analysis} />;
      case 'Financials':
        return <Financials analysis={currentAnalysis.analysis} />;
      case 'Founder Connect & Q&A':
        return <FounderConnect analysis={currentAnalysis.analysis} />;
      case 'AI Chatbot':
        return <AiChatbot />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AnalysisSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-card">
          <div>
            <h1 className="text-xl font-bold">{currentAnalysis.fileName}</h1>
            <p className="text-sm text-muted-foreground">
              Analysis from the perspective of a <span className="font-semibold text-primary">{currentAnalysis.persona}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsMemoModalOpen(true)}>Generate Memo</Button>
            <Button onClick={handleAnalyzeAnother}><ArrowLeft className="mr-2 h-4 w-4"/>Analyze Another Deck</Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-4 w-4"/></Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-muted/40">
          {renderTabContent()}
        </div>
      </main>
      <GenerateMemoModal isOpen={isMemoModalOpen} onClose={() => setIsMemoModalOpen(false)} />
    </div>
  );
}
