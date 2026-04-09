'use server';
/**
 * @fileOverview The Housing Specialist AI.
 * Specializes in student accommodation and neighborhood logistics.
 */

import { getOpenAIJsonResponse } from '../openai-client';

type HousingSpecialistInput = {
  message: string;
};

type HousingSpecialistOutput = {
  response: string;
};

export async function discussHousing(input: HousingSpecialistInput): Promise<HousingSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Housing Specialist.\n\nYou specialize ONLY in student accommodation, verified listings, and Riga neighborhood logistics.\n\nEXPERT DOMAINS:\n1. Verified housing records and listing checks.\n2. Rental contracts and moving decisions.\n3. Neighborhood fit based on budget and commute.\n\nREFERRAL PROTOCOL:\n- For non-housing platform questions, refer to the platform guide.\n- For visa or document issues tied to housing, refer to the Compliance Specialist.\n\nTone: Expert, safety-focused, and helpful. Keep responses under 3 sentences.`;

  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still help with housing basics here. Review verified listings, compare budget and location carefully, and message the agent from the listing page if you want to move forward.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
