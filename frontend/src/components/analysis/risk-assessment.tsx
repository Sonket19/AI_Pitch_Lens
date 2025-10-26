'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalysisResult } from '@/lib/types';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

interface RiskAssessmentProps {
  analysis: AnalysisResult;
}

const severityMap = {
  High: {
    icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
    badge: 'destructive',
    color: 'hsl(var(--destructive))',
  },
  Medium: {
    icon: <ShieldQuestion className="h-5 w-5 text-yellow-500" />,
    badge: 'secondary',
    color: '#f59e0b',
  },
  Low: {
    icon: <ShieldCheck className="h-5 w-5 text-green-500" />,
    badge: 'default',
    color: '#22c55e',
  },
};

export function RiskAssessment({ analysis }: RiskAssessmentProps) {
  const { riskAssessment } = analysis;

  const riskSummary = riskAssessment.risks.reduce((acc, risk) => {
    acc[risk.severity] = (acc[risk.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(riskSummary).map(([name, value]) => ({
    name,
    value,
    fill: severityMap[name as keyof typeof severityMap]?.color || '#ccc',
  }));

  const chartConfig = {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Risk Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
                    <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {chartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    </PieChart>
                </ChartContainer>
            ) : (
                <p className="text-muted-foreground">No risk data to display in chart.</p>
            )}
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Identified Risks</h3>
        {riskAssessment.risks.map((risk, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                        {severityMap[risk.severity]?.icon}
                        {risk.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{risk.description}</CardDescription>
                  </div>
                 {/* @ts-ignore */}
                <Badge variant={severityMap[risk.severity]?.badge} className="ml-4 whitespace-nowrap">{risk.severity}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Mitigation Strategy</h4>
              <p className="text-sm text-muted-foreground">{risk.mitigationStrategy}</p>
            </CardContent>
          </Card>
        ))}
         {riskAssessment.risks.length === 0 && <p className="text-muted-foreground">No risks were identified.</p>}
      </div>
    </div>
  );
}
