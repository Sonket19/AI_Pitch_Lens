'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { CustomWeights } from '@/lib/types';

interface CustomPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weights: CustomWeights) => void;
}

const initialWeights: CustomWeights = {
  teamStrengthWeight: 20,
  tractionWeight: 20,
  financialHealthWeight: 20,
  marketOpportunityWeight: 20,
  claimCredibilityWeight: 20,
};

export function CustomPersonaModal({ isOpen, onClose, onSave }: CustomPersonaModalProps) {
  const [weights, setWeights] = useState<CustomWeights>(initialWeights);

  const totalWeight = useMemo(() => {
    return Object.values(weights).reduce((sum, value) => sum + value, 0);
  }, [weights]);

  const handleSliderChange = (key: keyof CustomWeights, value: number[]) => {
    setWeights(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleSave = () => {
    if (totalWeight === 100) {
      onSave(weights);
    }
  };

  const weightKeys = Object.keys(weights) as (keyof CustomWeights)[];
  const labels = {
    teamStrengthWeight: 'Team Strength',
    tractionWeight: 'Traction',
    financialHealthWeight: 'Financial Health',
    marketOpportunityWeight: 'Market Opportunity',
    claimCredibilityWeight: 'Claim Credibility',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Score Weightage</DialogTitle>
          <DialogDescription>
            Adjust the sliders to match your investment thesis. The total must equal 100%.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {weightKeys.map(key => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={key}>{labels[key]}</Label>
                <span className="text-sm font-medium text-primary">{weights[key]}%</span>
              </div>
              <Slider
                id={key}
                max={100}
                step={5}
                value={[weights[key]]}
                onValueChange={(value) => handleSliderChange(key, value)}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <div className="w-full flex justify-between items-center">
             <div className="text-sm font-bold">
                Total Weight: <span className={totalWeight === 100 ? 'text-green-600' : 'text-destructive'}>{totalWeight}%</span>
             </div>
            <Button onClick={handleSave} disabled={totalWeight !== 100}>
              Apply &amp; Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
