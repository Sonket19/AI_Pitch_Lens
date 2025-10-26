'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalysisResult } from '@/lib/types';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface FinancialsProps {
  analysis: AnalysisResult;
}

const metricIcons: { [key: string]: React.ReactNode } = {
  arr: <TrendingUp className="text-primary" />,
  mrr: <TrendingUp className="text-primary" />,
  users: <Users className="text-primary" />,
  customers: <Users className="text-primary" />,
  revenue: <DollarSign className="text-primary" />,
  default: <Target className="text-primary" />,
};

const getMetricIcon = (metric: string) => {
  const lowerMetric = metric.toLowerCase();
  for (const key in metricIcons) {
    if (lowerMetric.includes(key)) {
      return metricIcons[key];
    }
  }
  return metricIcons.default;
};

export function Financials({ analysis }: FinancialsProps) {
  const { financials } = analysis;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financials.keyMetrics.map((metric, index) => {
                const [key, ...valueParts] = metric.split(':');
                const value = valueParts.join(':').trim();
                return (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="mt-1">{getMetricIcon(key)}</div>
                        <div>
                            <p className="font-semibold text-card-foreground">{key}</p>
                            <p className="text-muted-foreground">{value}</p>
                        </div>
                    </div>
                );
            })}
             {financials.keyMetrics.length === 0 && <p className="text-muted-foreground col-span-full">No key metrics identified.</p>}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funding Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{financials.fundingRequest}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projections Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{financials.projectionsAnalysis}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
