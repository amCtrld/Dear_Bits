'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

export default function ResultsPage() {
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('High');
  const [riskProbability, setRiskProbability] = useState(72);

  useEffect(() => {
    // In production, this would come from the prediction API
    const predictionData = sessionStorage.getItem('predictionData');
    if (predictionData) {
      // Simulate risk calculation based on input data
      const probability = Math.floor(Math.random() * 100);
      setRiskProbability(probability);

      if (probability < 35) {
        setRiskLevel('Low');
      } else if (probability < 65) {
        setRiskLevel('Medium');
      } else {
        setRiskLevel('High');
      }
    }
  }, []);

  const chartData = [
    { name: 'Low Risk', value: 30, color: '#16a34a' },
    { name: 'Medium Risk', value: 35, color: '#eab308' },
    { name: 'High Risk', value: 35, color: '#dc2626' },
  ];

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'Low':
        return '#16a34a';
      case 'Medium':
        return '#eab308';
      case 'High':
        return '#dc2626';
    }
  };

  const getRiskDescription = () => {
    switch (riskLevel) {
      case 'Low':
        return 'Current data suggests low probability of diabetes development. Continue with regular health monitoring.';
      case 'Medium':
        return 'Moderate risk indicators present. Medical consultation and lifestyle adjustments recommended.';
      case 'High':
        return 'Results indicate elevated diabetes risk. Immediate medical consultation is strongly advised.';
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Prediction Result
            </h2>
            <p className="text-muted-foreground mt-2">
              Risk assessment based on provided clinical indicators
            </p>
          </div>

          {/* Chart Card */}
          <Card className="border border-border bg-card mb-8">
            <CardHeader>
              <CardTitle>Diabetes Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

                {/* Risk Indicator */}
                <div className="mt-8 text-center">
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: getRiskColor() }}
                  >
                    {riskProbability}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current Risk Probability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card className="border border-border bg-card mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Results Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: getRiskColor() }}
                  >
                    {riskLevel} Risk
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Probability</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {riskProbability}%
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Clinical Assessment:
                </p>
                <p className="text-foreground text-base leading-relaxed">
                  {getRiskDescription()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Information Note */}
          <Card className="border border-border bg-card mb-8">
            <CardHeader>
              <CardTitle className="text-base">Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This prediction indicates the probability that the patient may
                develop diabetes based on the provided clinical indicators.
              </p>
              <p>
                This assessment is a research tool and should not replace
                professional medical diagnosis. Always consult with a healthcare
                provider for medical advice.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/predict">
              <Button variant="outline" className="border-border">
                Run Another Prediction
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
