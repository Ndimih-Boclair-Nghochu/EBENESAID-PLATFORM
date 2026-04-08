'use server';
/**
 * @fileOverview The Career Specialist AI.
 * Specializes in part-time jobs, internships, and work regulations for students in Latvia.
 */

import { openai } from '../openai-client';


type CareerSpecialistInput = {
  message: string;
};

type CareerSpecialistOutput = {
  response: string;
};


export async function discussCareers(input: CareerSpecialistInput): Promise<CareerSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Career Specialist.\n\nYou specialize ONLY in student employment, part-time opportunities, and work-permit regulations for international students in Latvia.\n\nEXPERT DOMAINS:\n1. Student Work Permits: Explaining the 20-hour work limit for students.\n2. CV/Resume Standards: Adapting international CVs for the Baltic market.\n3. Vetted Partners: Highlighting companies that regularly hire international talent (Accenture, Wolt, etc.).\n\nREFERRAL PROTOCOL:\n- For housing issues, refer to the 'Housing Specialist' in the Housing tab.\n- For residence permit/OCMA procedures not related to work, refer to the 'Compliance Specialist' in the Wallet.\n\nTone: Motivating, professional, and strategic. Keep responses under 3 sentences.`;

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
