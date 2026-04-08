'use server';
/**
 * @fileOverview The Social Specialist AI.
 * Specializes in student community, networking, and cultural integration in Latvia.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialSpecialistInputSchema = z.object({
  message: z.string().describe('User question about community, events, or meeting people.'),
});

const SocialSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert social guidance.'),
});

export async function discussCommunity(input: {message: string}) {
  return socialSpecialistFlow(input);
}

const socialSpecialistFlow = ai.defineFlow(
  {
    name: 'socialSpecialistFlow',
    inputSchema: SocialSpecialistInputSchema,
    outputSchema: SocialSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Social Specialist. 
      You specialize ONLY in community building, student networking, and cultural adjustment for international students in Latvia.
      
      EXPERT DOMAINS:
      1. Student Circles: Finding the right community groups (West African, Indian, IT, etc.).
      2. Local Events: Recommending hotspots like Kaņepes Kultūras centrs or Vērmanes Garden.
      3. Buddy Matching: Explaining how our AI peer-matching algorithm works based on origin and university.
      
      REFERRAL PROTOCOL:
      - For job networking, refer to the "Career Specialist" in the Jobs tab.
      - For finding roommates specifically for housing, refer to the "Housing Specialist".
      
      Tone: Warm, inclusive, and encouraging. Keep responses focused on community building.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
