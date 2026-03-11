'use client';

import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ModelInfoPage() {
  const modelMetrics = [
    { label: 'Model Type', value: 'Random Forest' },
    { label: 'Training Accuracy', value: '89%' },
    { label: 'Testing Accuracy', value: '87%' },
  ];

  const datasetInfo = {
    name: 'PIMA Indians Diabetes Dataset',
    records: 768,
    features: 8,
  };

  const features = [
    'Pregnancies',
    'Glucose',
    'Blood Pressure',
    'Skin Thickness',
    'Insulin',
    'BMI',
    'Diabetes Pedigree Function',
    'Age',
  ];

  const featureImportance = [
    { name: 'Glucose', importance: 28 },
    { name: 'BMI', importance: 24 },
    { name: 'Age', importance: 18 },
    { name: 'Insulin', importance: 12 },
    { name: 'Pregnancies', importance: 8 },
    { name: 'Blood Pressure', importance: 6 },
    { name: 'Skin Thickness', importance: 3 },
    { name: 'Diabetes Pedigree', importance: 1 },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Model Information
            </h2>
            <p className="text-muted-foreground mt-2">
              Technical details about the diabetes prediction model
            </p>
          </div>

          {/* Model Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {modelMetrics.map((metric, index) => (
              <Card key={index} className="border border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-foreground">
                    {metric.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dataset Information */}
          <Card className="border border-border bg-card mb-8">
            <CardHeader>
              <CardTitle>Dataset Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dataset Name</p>
                <p className="text-foreground font-medium">
                  {datasetInfo.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Records
                  </p>
                  <p className="text-foreground text-lg font-semibold">
                    {datasetInfo.records}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Features Used
                  </p>
                  <p className="text-foreground text-lg font-semibold">
                    {datasetInfo.features}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border border-border bg-card mb-8">
            <CardHeader>
              <CardTitle>Features Used for Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Importance */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle>Feature Importance Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Relative importance of each feature in predicting diabetes risk
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={featureImportance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={140} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="importance" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card className="border border-border bg-card mt-8">
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                The Random Forest model was trained using a binary classification
                approach on the PIMA Indians Diabetes Dataset, a well-established
                benchmark in healthcare AI research.
              </p>
              <p>
                The model achieves 87% accuracy on testing data through ensemble
                learning, combining multiple decision trees to improve prediction
                robustness and reduce overfitting.
              </p>
              <p>
                Feature importance is calculated using mean decrease in impurity,
                revealing that glucose level and BMI are the strongest predictors
                of diabetes risk in this dataset.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
