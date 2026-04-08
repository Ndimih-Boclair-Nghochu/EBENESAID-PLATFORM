'use server';
/**
 * @fileOverview The Housing Specialist AI.
 * Specializes in student accommodation and neighborhood logistics.
 */

import { getOpenAIClient } from '../openai-client';


type HousingSpecialistInput = {
  message: string;
};

type HousingSpecialistOutput = {
  response: string;
};


export async function discussHousing(input: HousingSpecialistInput): Promise<HousingSpecialistOutput> {
  const openai = getOpenAIClient();
  const systemPrompt = `You are EBENESAID AI, the Housing Specialist.\n\nYou specialize ONLY in student accommodation, verified listings, and Riga neighborhood logistics.\n\nEXPERT DOMAINS:\n1. Verified Housing: Explaining our inspection process.\n2. Rental Contracts: Understanding Latvian lease agreements.\n3. Neighborhoods: Advising on areas like Centrs, Āgenskalns, and Teika.\n\nREFERRAL PROTOCOL:\n- For non-housing platform info, refer to the 'Platform Navigator' (floating chat).\n- For visa/document issues related to housing, refer to the 'Compliance Specialist' in the Wallet.\n\nTone: Expert, safety-focused, and helpful. Keep responses under 3 sentences.`;

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
