'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/app-provider';
import { generateMemoAction } from '@/lib/actions';
import { Clipboard, Check } from 'lucide-react';
import React from 'react';

interface GenerateMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GenerateMemoModal({ isOpen, onClose }: GenerateMemoModalProps) {
  const { currentAnalysis } = useAppContext();
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!currentAnalysis) return;
    setIsLoading(true);
    setMemo('');

    const response = await generateMemoAction(JSON.stringify(currentAnalysis.analysis), currentAnalysis.persona);

    setIsLoading(false);
    if (response.success && response.data) {
      setMemo(response.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate memo.' });
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(memo);
    setIsCopied(true);
    toast({title: 'Copied to clipboard!'});
    setTimeout(() => setIsCopied(false), 2000);
  }

  // Reset state when modal is closed/opened
  React.useEffect(() => {
    if(isOpen) {
        setMemo('');
        setIsLoading(false);
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Investment Memo</DialogTitle>
          <DialogDescription>
            Generate a formal investment memo based on the AI analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
            {memo || isLoading ? (
                 <ScrollArea className="h-full border rounded-md p-4">
                     {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-2">
                                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-muted-foreground">Generating memo...</p>
                            </div>
                        </div>
                     )}
                     <pre className="whitespace-pre-wrap font-body text-sm">{memo}</pre>
                </ScrollArea>
            ) : (
                <div className="flex items-center justify-center h-full border rounded-lg bg-muted/50">
                    <Button onClick={handleGenerate}>Generate Memo</Button>
                </div>
            )}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={handleCopy} disabled={!memo || isCopied}>
                {isCopied ? <Check className="mr-2 h-4 w-4"/> : <Clipboard className="mr-2 h-4 w-4"/>}
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
