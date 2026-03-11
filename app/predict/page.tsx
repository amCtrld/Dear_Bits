'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FieldGroup, FieldLabel } from '@/components/ui/field';

export default function PredictPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pregnancies: 0,
    glucose: 120,
    bloodPressure: 80,
    skinThickness: 20,
    insulin: 80,
    bmi: 25,
    diabetesPedigree: 0.5,
    age: 35,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (key: string, value: number[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleInputChange = (key: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - in production, this would call your ML model API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store results and navigate
    sessionStorage.setItem('predictionData', JSON.stringify(formData));
    router.push('/results');
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Enter Patient Data
            </h2>
            <p className="text-muted-foreground mt-2">
              Provide the following clinical indicators for diabetes risk assessment
            </p>
          </div>

          <Card className="border border-border bg-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Pregnancies */}
                <FieldGroup>
                  <FieldLabel>Pregnancies</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.pregnancies}
                    onChange={(e) =>
                      handleInputChange('pregnancies', parseInt(e.target.value))
                    }
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Number of pregnancies
                  </p>
                </FieldGroup>

                {/* Glucose Level */}
                <FieldGroup>
                  <div className="flex justify-between items-center">
                    <FieldLabel>Glucose Level</FieldLabel>
                    <span className="text-sm font-semibold text-foreground">
                      {formData.glucose} mg/dL
                    </span>
                  </div>
                  <Slider
                    value={[formData.glucose]}
                    onValueChange={(value) =>
                      handleSliderChange('glucose', value)
                    }
                    min={70}
                    max={200}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: 70–200 mg/dL
                  </p>
                </FieldGroup>

                {/* Blood Pressure */}
                <FieldGroup>
                  <div className="flex justify-between items-center">
                    <FieldLabel>Blood Pressure</FieldLabel>
                    <span className="text-sm font-semibold text-foreground">
                      {formData.bloodPressure} mmHg
                    </span>
                  </div>
                  <Slider
                    value={[formData.bloodPressure]}
                    onValueChange={(value) =>
                      handleSliderChange('bloodPressure', value)
                    }
                    min={40}
                    max={140}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: 40–140 mmHg
                  </p>
                </FieldGroup>

                {/* Skin Thickness */}
                <FieldGroup>
                  <FieldLabel>Skin Thickness</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.skinThickness}
                    onChange={(e) =>
                      handleInputChange('skinThickness', parseInt(e.target.value))
                    }
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Triceps skin thickness in mm
                  </p>
                </FieldGroup>

                {/* Insulin Level */}
                <FieldGroup>
                  <FieldLabel>Insulin Level</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    max="900"
                    step="1"
                    value={formData.insulin}
                    onChange={(e) =>
                      handleInputChange('insulin', parseInt(e.target.value))
                    }
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    2-hour serum insulin in mu U/ml
                  </p>
                </FieldGroup>

                {/* BMI */}
                <FieldGroup>
                  <div className="flex justify-between items-center">
                    <FieldLabel>BMI</FieldLabel>
                    <span className="text-sm font-semibold text-foreground">
                      {formData.bmi.toFixed(1)} kg/m²
                    </span>
                  </div>
                  <Slider
                    value={[formData.bmi]}
                    onValueChange={(value) => handleSliderChange('bmi', value)}
                    min={15}
                    max={50}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: 15–50 kg/m²
                  </p>
                </FieldGroup>

                {/* Diabetes Pedigree Function */}
                <FieldGroup>
                  <FieldLabel>Diabetes Pedigree Function</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    max="2.5"
                    step="0.01"
                    value={formData.diabetesPedigree}
                    onChange={(e) =>
                      handleInputChange('diabetesPedigree', parseFloat(e.target.value))
                    }
                    className="bg-input text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Genetic predisposition score (0–2.5)
                  </p>
                </FieldGroup>

                {/* Age */}
                <FieldGroup>
                  <div className="flex justify-between items-center">
                    <FieldLabel>Age</FieldLabel>
                    <span className="text-sm font-semibold text-foreground">
                      {formData.age} years
                    </span>
                  </div>
                  <Slider
                    value={[formData.age]}
                    onValueChange={(value) => handleSliderChange('age', value)}
                    min={18}
                    max={90}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: 18–90 years
                  </p>
                </FieldGroup>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    {isLoading ? 'Processing...' : 'Predict Diabetes Risk'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
