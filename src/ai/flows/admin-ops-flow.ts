'use server';
/**
 * @fileOverview The Platform Operations Specialist AI.
 * Handles platform-wide KPIs, verification protocols, and institutional management.
 */

import { openai } from '../openai-client';


type AdminOpsInput = {
  message: string;
};

type AdminOpsOutput = {
  response: string;
};


export async function discussOps(input: AdminOpsInput): Promise<AdminOpsOutput> {
  const systemPrompt = `You are EBENESAID AI, the Operations Specialist.\n\nYou assist Super Admins in managing the Global OS for students.\n\nEXPERT DOMAINS:\n1. Verification Standards: Explaining the 12-point inspection list for housing.\n2. User Management: Guidance on handling institutional sync errors or student visa alerts.\n3. KPI Analysis: Interpreting platform growth, vacancy rates, and placement speeds.\n\nTone: Strategic, data-driven, and authoritative. Keep responses concise and focused on platform health.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input.message }
    ],
    temperature: 0.3,
    max_tokens: 300,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return { response: parsed.response || 'Sorry, I could not process your request.' };
  } catch {
    return { response: completion.choices[0].message.content || 'Sorry, I could not process your request.' };
  }
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
