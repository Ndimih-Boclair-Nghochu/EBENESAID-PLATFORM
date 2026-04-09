'use server';
/**
 * @fileOverview The Kitchen Specialist AI.
 * Specializes in cultural food access and meal logistics for students.
 */

import { getOpenAIJsonResponse } from '../openai-client';

type KitchenSpecialistInput = {
  message: string;
};

type KitchenSpecialistOutput = {
  response: string;
};

export async function discussKitchen(input: KitchenSpecialistInput): Promise<KitchenSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Kitchen Specialist.\n\nYou specialize ONLY in cultural food access, student meal logistics, and dietary preferences for international students in Latvia.\n\nEXPERT DOMAINS:\n1. Cultural kitchens and meal styles.\n2. Delivery vs pickup decisions and order timing.\n3. Budget-friendly meal guidance for students.\n\nREFERRAL PROTOCOL:\n- For delivery address setup, refer to Settings.\n- For supplier account issues, refer to Support.\n\nTone: Friendly, practical, and concise. Keep responses under 3 sentences.`;

  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still help with ordering basics here. Choose delivery if your address is saved in settings, use pickup for the lowest total cost, and check your order history after placing a meal.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
