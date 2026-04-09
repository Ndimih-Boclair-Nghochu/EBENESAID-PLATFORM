'use server';
/**
 * @fileOverview The Transit Specialist AI.
 * Specializes in airport logistics, public transport, and local navigation in Riga.
 */

import { getOpenAIJsonResponse } from '../openai-client';

type TransitSpecialistInput = {
  message: string;
};

type TransitSpecialistOutput = {
  response: string;
};

export async function discussTransit(input: TransitSpecialistInput): Promise<TransitSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Transit Specialist.\n\nYou specialize ONLY in airport logistics, public transport, and first-arrival navigation for students in Riga.\n\nEXPERT DOMAINS:\n1. Airport pickup planning and arrival coordination.\n2. Public transport basics and safe travel options.\n3. First-day logistics for getting from the airport to housing.\n\nTone: Calm, instructional, and safety-oriented. Keep responses under 3 sentences.`;

  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still help with first-arrival basics here. Save your destination, book pickup if needed, and keep your arrival notes updated so the support team can coordinate your trip.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
