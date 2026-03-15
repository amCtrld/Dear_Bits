import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a clinical research AI assistant integrated into a diabetes early detection system. Your role is to provide a brief, personalized health insight based on a patient's clinical indicators and the prediction result from a Random Forest classifier trained on the PIMA Indians Diabetes Dataset.

Rules:
- Be concise: respond in 3–4 sentences maximum.
- Never diagnose. Always frame findings as "indicators suggest" or "data points to".
- Highlight the 1–2 most significant risk factors from the patient's input values.
- Provide one actionable lifestyle or follow-up recommendation.
- Mention that this is a research tool and professional medical advice should be sought.
- Use a professional, calm, and informative tone.
- Do not use markdown formatting, bullet points, or headers. Write in plain flowing prose.
- Reference the specific clinical values when relevant (e.g., "Your glucose level of 180 mg/dL is above the typical threshold").`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigree, age, probability, riskLevel } = body;

    const userMessage = `Patient clinical data:
- Pregnancies: ${pregnancies}
- Plasma Glucose: ${glucose} mg/dL
- Blood Pressure: ${bloodPressure} mmHg
- Skin Thickness: ${skinThickness} mm
- Insulin: ${insulin} μU/mL
- BMI: ${bmi} kg/m²
- Diabetes Pedigree Function: ${diabetesPedigree}
- Age: ${age} years

Model prediction: ${probability}% probability of diabetes (${riskLevel} risk).

Provide a brief personalized health insight based on these indicators.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 250,
      temperature: 0.4,
    });

    const insight = completion.choices[0]?.message?.content ?? '';

    return NextResponse.json({ insight });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate insight';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
