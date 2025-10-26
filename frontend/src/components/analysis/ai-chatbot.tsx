'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/app-provider';
import { getChatbotResponseAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiChatbot() {
  const { currentAnalysis, chatHistory, addChatMessage, setChatHistory, founderResponses } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  useEffect(() => {
    // Clear chat history when analysis changes
    setChatHistory([]);
  }, [currentAnalysis, setChatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentAnalysis) return;
    
    const userMessage = { role: 'user' as const, content: input };
    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    const response = await getChatbotResponseAction({
      analysis: JSON.stringify(currentAnalysis.analysis),
      persona: currentAnalysis.persona,
      question: input,
      founderResponses: founderResponses || undefined,
    });
    
    setIsLoading(false);

    if (response.success && response.data) {
      const modelMessage = { role: 'model' as const, content: response.data.advice };
      addChatMessage(modelMessage);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: response.error });
      // Remove the user message if the API call failed
      setChatHistory(chatHistory.slice(0, -1));
    }
  };
  
  const suggestedQuestions = [
    "What's your final recommendation: invest or pass?",
    "Summarize the biggest risks.",
    "Is the valuation reasonable?",
    "How does this compare to other companies in the space?",
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  }

  return (
    <Card className="h-[75vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary"/>
            AI Investment Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {chatHistory.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                {message.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot size={20}/></div>}
                <div className={cn("max-w-lg p-3 rounded-lg", message.role === 'user' ? 'bg-primary/90 text-primary-foreground' : 'bg-muted')}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center"><User size={20}/></div>}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot size={20}/></div>
                <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                    </div>
                </div>
              </div>
            )}
             {chatHistory.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Ask me anything about this pitch deck.</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedQuestions.map(q => (
                    <Button key={q} variant="outline" size="sm" onClick={() => handleSuggestionClick(q)} className="text-left justify-start">
                      <CornerDownLeft className="mr-2 h-3 w-3" />
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4"/>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
