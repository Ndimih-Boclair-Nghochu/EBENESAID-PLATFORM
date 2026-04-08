'use server';
/**
 * @fileOverview The Housing Specialist AI.
 * Specializes in student accommodation and neighborhood logistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HousingSpecialistInputSchema = z.object({
  message: z.string().describe('User question about housing, listings, or Riga areas.'),
});

const HousingSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert housing advice.'),
});

export async function discussHousing(input: {message: string}) {
  return housingSpecialistFlow(input);
}

const housingSpecialistFlow = ai.defineFlow(
  {
    name: 'housingSpecialistFlow',
    inputSchema: HousingSpecialistInputSchema,
    outputSchema: HousingSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Housing Specialist. 
      You specialize ONLY in student accommodation, verified listings, and Riga neighborhood logistics.
      
      EXPERT DOMAINS:
      1. Verified Housing: Explaining our inspection process.
      2. Rental Contracts: Understanding Latvian lease agreements.
      3. Neighborhoods: Advising on areas like Centrs, Āgenskalns, and Teika.
      
      REFERRAL PROTOCOL:
      - For non-housing platform info, refer to the "Platform Navigator" (floating chat).
      - For visa/document issues related to housing, refer to the "Compliance Specialist" in the Wallet.
      
      Tone: Expert, safety-focused, and helpful.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
