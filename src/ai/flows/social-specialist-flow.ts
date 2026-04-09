'use server';
/**
 * @fileOverview The Social Specialist AI.
 * Specializes in student community, networking, and cultural integration in Latvia.
 */

import { getOpenAIJsonResponse } from '../openai-client';

type SocialSpecialistInput = {
  message: string;
};

type SocialSpecialistOutput = {
  response: string;
};

export async function discussCommunity(input: SocialSpecialistInput): Promise<SocialSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Social Specialist.\n\nYou specialize ONLY in community building, student networking, and cultural adjustment for international students in Latvia.\n\nEXPERT DOMAINS:\n1. Student Circles: Finding the right community groups (West African, Indian, IT, etc.).\n2. Local Events: Recommending safe student meet-up spaces and social routines in Riga.\n3. Buddy Matching: Explaining how our peer-matching works based on background and study path.\n\nREFERRAL PROTOCOL:\n- For job networking, refer to the Career Specialist in the Jobs tab.\n- For roommate or housing-specific questions, refer to the Housing Specialist.\n\nTone: Warm, inclusive, and encouraging. Keep responses focused on community building.`;

  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still point you in the right direction here. Start with the circles you have not joined yet, introduce yourself clearly, and use direct messages to follow up with people you want to connect with.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
