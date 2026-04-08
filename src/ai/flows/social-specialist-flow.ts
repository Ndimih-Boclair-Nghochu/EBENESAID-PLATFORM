'use server';
/**
 * @fileOverview The Social Specialist AI.
 * Specializes in student community, networking, and cultural integration in Latvia.
 */

import { openai } from '../openai-client';


type SocialSpecialistInput = {
  message: string;
};

type SocialSpecialistOutput = {
  response: string;
};


export async function discussCommunity(input: SocialSpecialistInput): Promise<SocialSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Social Specialist.\n\nYou specialize ONLY in community building, student networking, and cultural adjustment for international students in Latvia.\n\nEXPERT DOMAINS:\n1. Student Circles: Finding the right community groups (West African, Indian, IT, etc.).\n2. Local Events: Recommending hotspots like Kaņepes Kultūras centrs or Vērmanes Garden.\n3. Buddy Matching: Explaining how our AI peer-matching algorithm works based on origin and university.\n\nREFERRAL PROTOCOL:\n- For job networking, refer to the 'Career Specialist' in the Jobs tab.\n- For finding roommates specifically for housing, refer to the 'Housing Specialist'.\n\nTone: Warm, inclusive, and encouraging. Keep responses focused on community building.`;

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
