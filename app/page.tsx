'use client';

import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const metrics = [
    {
      title: 'Model Accuracy',
      value: '87%',
      description: 'Testing accuracy on PIMA dataset',
    },
    {
      title: 'Dataset Size',
      value: '768',
      description: 'Total records analyzed',
    },
    {
      title: 'Last Prediction',
      value: 'High Risk',
      subvalue: '78%',
      description: 'Probability of diabetes',
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground text-center text-balance">
              AI-Based Diabetes Early Detection System
            </h2>
            <p className="text-center text-muted-foreground mt-4">
              Research-powered prediction model using clinical indicators
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className="border border-border bg-card hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-semibold text-foreground">
                        {metric.value}
                      </div>
                      {metric.subvalue && (
                        <div className="text-lg text-primary font-medium">
                          {metric.subvalue}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link href="/predict">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Start Prediction
              </Button>
            </Link>
          </div>

          {/* Information Section */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">About This System</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    This AI system uses a Random Forest model trained on the PIMA
                    Indians Diabetes Dataset to predict diabetes risk.
                  </p>
                  <p>
                    Enter patient clinical indicators to receive an immediate risk
                    assessment backed by research-grade machine learning.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-3">
                  <p>
                    The system analyzes 8 key medical features including glucose
                    levels, BMI, and age.
                  </p>
                  <p>
                    Results are presented as risk probabilities to support clinical
                    decision-making.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
