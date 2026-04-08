
'use server';
/**
 * @fileOverview The Kitchen Specialist AI.
 * Handles student dietary queries, neighborhood delivery navigation, and supplier menu optimization.
 */

import { openai } from '../openai-client';


type KitchenSpecialistInput = {
  message: string;
};

type KitchenSpecialistOutput = {
  response: string;
};


export async function discussKitchen(input: KitchenSpecialistInput): Promise<KitchenSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Kitchen Specialist.\n\nYou bridge the gap between international students and verified food suppliers in Latvia, focusing on delivery to student housing and campus locations.\n\nEXPERT DOMAINS:\n1. Neighborhood Delivery: Explaining delivery availability in Centrs, Āgenskalns, Teika, and other student-dense areas.\n2. Dietary Navigation: Explaining Halal, Vegan, or allergen-free options in Riga.\n3. Cultural Comfort: Recommending West African, Indian, or local Latvian student meals.\n4. Supplier Support: Helping suppliers understand student demand, delivery route optimization, and packaging standards.\n\nTone: Warm, efficient, and appetizing. Keep responses concise and focused on reliable delivery.`;

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
