'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisResult } from '@/lib/types';
import { Factory, Trophy } from 'lucide-react';

interface IndustryAnalysisProps {
  analysis: AnalysisResult;
}

export function IndustryAnalysis({ analysis }: IndustryAnalysisProps) {
  const { industryAnalysis } = analysis;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="text-primary" />
            Industry Benchmarking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{industryAnalysis.industryBenchmarking}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary" />
            Competitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {industryAnalysis.competitors.length > 0 ? (
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              {industryAnalysis.competitors.map((competitor, index) => (
                <li key={index}>{competitor}</li>
              ))}
            </ul>
          ) : (
             <p className="text-muted-foreground">No competitors identified.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
