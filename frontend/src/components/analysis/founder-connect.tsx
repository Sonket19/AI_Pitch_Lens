'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { AnalysisResult } from '@/lib/types';
import { useAppContext } from '@/context/app-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MessageSquare, Mail, Link } from 'lucide-react';

interface FounderConnectProps {
  analysis: AnalysisResult;
}

export function FounderConnect({ analysis }: FounderConnectProps) {
  const { setFounderResponses, currentAnalysis } = useAppContext();
  const [founderEmail, setFounderEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answers, setAnswers] = useState('');

  const questions = analysis.founderConnectQA.followUpQuestions;

  const handleDraftEmail = () => {
    const subject = `Follow-up on ${currentAnalysis?.fileName || 'your pitch'}`;
    const body = `Hi,\n\nThanks for sharing your pitch deck. I have a few follow-up questions for you:\n\n${questions.join('\n\n')}\n\nBest regards,`;
    const mailtoLink = `mailto:${founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };
  
  const handleSaveAnswers = () => {
    setFounderResponses(answers);
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary" />
            AI-Generated Follow-up Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4 list-decimal pl-5">
            {questions.map((q, index) => (
              <li key={index} className="text-muted-foreground">{q}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="text-primary" />
            Connect with Founder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="founder-email">Founder's Email</Label>
                <Input id="founder-email" type="email" placeholder="founder@startup.com" value={founderEmail} onChange={e => setFounderEmail(e.target.value)} />
            </div>
            <div className="flex gap-2">
                <Button onClick={handleDraftEmail} disabled={!founderEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Draft Email in Gmail
                </Button>
                 <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                    <Link className="mr-2 h-4 w-4" />
                    Integrate Founder's Answers
                </Button>
            </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Integrate Founder's Answers</DialogTitle>
                <DialogDescription>Paste the founder's replies here. The AI will use this context in the chatbot.</DialogDescription>
            </DialogHeader>
            <Textarea 
                className="min-h-[300px]" 
                placeholder="Paste the founder's answers here..."
                value={answers}
                onChange={e => setAnswers(e.target.value)}
            />
            <DialogFooter>
                <Button onClick={handleSaveAnswers}>Save and Update Context</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
