'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-provider';
import type { Persona, CustomWeights, AnalysisResult } from '@/lib/types';
import { analyzePitchDeckAction } from '@/lib/actions';
import { PersonaSelection } from '@/components/app/persona-selection';
import { InputArea, InputContent } from '@/components/app/input-area';
import { AnalysisHistory } from '@/components/app/analysis-history';
import { Logo } from '@/components/app/logo';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UploadView() {
  const { setAppState, addToHistory, setCurrentAnalysis, user, setUser } = useAppContext();
  const [persona, setPersona] = useState<Persona | null>(null);
  const [customWeights, setCustomWeights] = useState<CustomWeights | undefined>();
  const [inputContent, setInputContent] = useState<InputContent>({ type: null, content: null, fileName: null });

  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!persona) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a persona.' });
      return;
    }
    if (!inputContent.content || !inputContent.type || !inputContent.fileName) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please provide a pitch deck.' });
      return;
    }

    setAppState('analyzing');
    
    const analysisInput = {
      inputContent: inputContent.content,
      inputType: inputContent.type,
      persona: persona,
      ...customWeights,
    };

    const result = await analyzePitchDeckAction(analysisInput);

    if (result.success && result.data) {
      const historyItem = {
        id: uuidv4(),
        fileName: inputContent.fileName,
        persona: persona,
        customWeights: persona === 'Custom' ? customWeights : undefined,
        date: new Date().toISOString(),
        analysis: result.data as AnalysisResult,
      };
      addToHistory(historyItem);
      setCurrentAnalysis(historyItem);
      setAppState('viewing');
      toast({ title: 'Analysis Complete', description: 'Your pitch deck has been analyzed.' });
    } else {
      setAppState('upload');
      toast({ variant: 'destructive', title: 'Analysis Failed', description: result.error });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <header className="flex justify-between items-center mb-8">
        <Logo />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Logged in as</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      <main className="space-y-12">
        <div className="p-8 border rounded-lg shadow-sm bg-card">
          <PersonaSelection
            selectedPersona={persona}
            onSelectPersona={setPersona}
            onCustomWeightsSave={setCustomWeights}
          />

          <div className="mt-8">
            <InputArea onContentChange={setInputContent} />
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!persona || !inputContent.content}
              className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Analyze Deck
            </Button>
          </div>
        </div>

        <AnalysisHistory />
      </main>
    </div>
  );
}
