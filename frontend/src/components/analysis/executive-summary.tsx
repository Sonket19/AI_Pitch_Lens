'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisResult } from '@/lib/types';
import { ThumbsUp, ThumbsDown, BookText } from 'lucide-react';

interface ExecutiveSummaryProps {
  analysis: AnalysisResult;
}

export function ExecutiveSummary({ analysis }: ExecutiveSummaryProps) {
  const { executiveSummary } = analysis;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText className="text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{executiveSummary.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <ThumbsUp />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {executiveSummary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ThumbsUp className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ThumbsDown />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {executiveSummary.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ThumbsDown className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
