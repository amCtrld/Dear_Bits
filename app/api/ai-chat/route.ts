import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a knowledgeable health assistant integrated into a diabetes early detection research platform called "Dear_Bits". The platform uses a Random Forest classifier trained on the PIMA Indians Diabetes Dataset (768 records, 8 clinical features) to predict diabetes risk.

Your role and rules:
- Answer questions about diabetes, the 8 clinical indicators (Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree Function, Age), risk factors, prevention, and the machine learning model used.
- Provide evidence-based, factual health information.
- Be concise: 2–5 sentences for simple questions, up to a short paragraph for complex ones.
- NEVER diagnose or prescribe treatment. Always advise the user to consult a healthcare professional for personal medical decisions.
- If asked about unrelated topics, politely redirect: "I'm specialised in diabetes health information and the Dear_Bits prediction model. I'd be happy to help with questions in that area."
- Use a warm, professional, and approachable tone.
- When discussing the model, you can mention: it's a Random Forest classifier, uses GridSearchCV for hyperparameter tuning, trained on the PIMA Indians Diabetes Dataset with 768 samples and 8 features, and outputs a probability score.
- Do not use markdown formatting. Write in plain text.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Limit conversation history to last 20 messages to control token usage
    const recentMessages = messages.slice(-20);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recentMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content ?? '';

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
