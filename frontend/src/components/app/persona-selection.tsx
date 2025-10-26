'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomPersonaModal } from '@/components/app/custom-persona-modal';
import type { Persona, CustomWeights } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, Cpu, Banknote, SlidersHorizontal } from 'lucide-react';

interface PersonaSelectionProps {
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona) => void;
  onCustomWeightsSave: (weights: CustomWeights) => void;
}

const personaOptions: { name: Persona, icon: React.ReactNode, description: string }[] = [
  { name: 'SaaS VC', icon: <Bot className="h-6 w-6" />, description: "Focus on ARR, churn, and sales efficiency." },
  { name: 'Deep Tech VC', icon: <Cpu className="h-6 w-6" />, description: "Focus on patents, tech defensibility, and R&D." },
  { name: 'Fintech VC', icon: <Banknote className="h-6 w-6" />, description: "Focus on regulations, transaction volume, and security." },
];

export function PersonaSelection({ selectedPersona, onSelectPersona, onCustomWeightsSave }: PersonaSelectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCustomSelect = () => {
    setIsModalOpen(true);
  };

  const handleCustomSave = (weights: CustomWeights) => {
    onCustomWeightsSave(weights);
    onSelectPersona('Custom');
    setIsModalOpen(false);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Analyze as a...</h2>
      <p className="text-muted-foreground mb-8">Select a persona to tailor the AI's analysis to your investment thesis.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {personaOptions.map((option) => (
          <Card
            key={option.name}
            onClick={() => onSelectPersona(option.name)}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              selectedPersona === option.name ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'
            )}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <div className="mb-3 text-primary">{option.icon}</div>
              <h3 className="text-lg font-semibold">{option.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </CardContent>
          </Card>
        ))}
        <Card
          onClick={handleCustomSelect}
          className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              selectedPersona === 'Custom' ? 'ring-2 ring-primary shadow-lg' : 'ring-1 ring-border'
            )}
        >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div className="mb-3 text-primary"><SlidersHorizontal className="h-6 w-6" /></div>
                <h3 className="text-lg font-semibold">Custom...</h3>
                <p className="text-sm text-muted-foreground mt-1">Define your own analysis weightage.</p>
            </CardContent>
        </Card>
      </div>

      <CustomPersonaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCustomSave}
      />
    </div>
  );
}
