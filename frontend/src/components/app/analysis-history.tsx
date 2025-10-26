'use client';

import { useAppContext } from '@/context/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AnalysisHistory() {
  const { history, setAppState, setCurrentAnalysis } = useAppContext();

  const handleViewAnalysis = (itemId: string) => {
    const itemToView = history.find(item => item.id === itemId);
    if (itemToView) {
      setCurrentAnalysis(itemToView);
      setAppState('viewing');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6" />
          Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                    <FileText className="h-6 w-6 text-primary"/>
                    <div>
                        <p className="font-semibold">{item.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                            Analyzed {formatDistanceToNow(new Date(item.date), { addSuffix: true })} as a {item.persona}
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => handleViewAnalysis(item.id)}>
                  View Analysis
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No analysis history found.</p>
            <p className="text-sm text-muted-foreground">Your analyzed pitch decks will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
