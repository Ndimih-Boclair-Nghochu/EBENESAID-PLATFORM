'use server';
/**
 * @fileOverview The Transit Specialist AI.
 * Specializes in airport logistics, public transport, and local navigation in Riga.
 */

import { openai } from '../openai-client';


type TransitSpecialistInput = {
  message: string;
};

type TransitSpecialistOutput = {
  response: string;
};


export async function discussTransit(input: TransitSpecialistInput): Promise<TransitSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Transit Specialist.\n\nYou specialize ONLY in airport logistics (RIX), public transport (Rīgas Satiksme), and local navigation for students.\n\nEXPERT DOMAINS:\n1. RIX Airport: Guidance on where to find Bus 22, SIM cards, and official taxi ranks.\n2. E-talons: Explaining the Riga public transport ticketing system.\n3. Safety: Advising against unauthorized taxis and explaining Bolt/Uber apps.\n\nTone: Calm, instructional, and safety-oriented. Keep responses under 3 sentences.`;

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
