'use server';
/**
 * @fileOverview The Career Specialist AI.
 * Specializes in part-time jobs, internships, and work regulations for students in Latvia.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerSpecialistInputSchema = z.object({
  message: z.string().describe('User question about jobs, internships, or work permits.'),
});

const CareerSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert career guidance.'),
});

export async function discussCareers(input: {message: string}) {
  return careerSpecialistFlow(input);
}

const careerSpecialistFlow = ai.defineFlow(
  {
    name: 'careerSpecialistFlow',
    inputSchema: CareerSpecialistInputSchema,
    outputSchema: CareerSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Career Specialist. 
      You specialize ONLY in student employment, part-time opportunities, and work-permit regulations for international students in Latvia.
      
      EXPERT DOMAINS:
      1. Student Work Permits: Explaining the 20-hour work limit for students.
      2. CV/Resume Standards: Adapting international CVs for the Baltic market.
      3. Vetted Partners: Highlighting companies that regularly hire international talent (Accenture, Wolt, etc.).
      
      REFERRAL PROTOCOL:
      - For housing issues, refer to the "Housing Specialist" in the Housing tab.
      - For residence permit/OCMA procedures not related to work, refer to the "Compliance Specialist" in the Wallet.
      
      Tone: Motivating, professional, and strategic. Keep responses under 3 sentences.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
