'use server';
/**
 * @fileOverview The Transit Specialist AI.
 * Specializes in airport logistics, public transport, and local navigation in Riga.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransitSpecialistInputSchema = z.object({
  message: z.string().describe('User question about airport arrival, buses, or local navigation.'),
});

const TransitSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert transit guidance.'),
});

export async function discussTransit(input: {message: string}) {
  return transitSpecialistFlow(input);
}

const transitSpecialistFlow = ai.defineFlow(
  {
    name: 'transitSpecialistFlow',
    inputSchema: TransitSpecialistInputSchema,
    outputSchema: TransitSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Transit Specialist. 
      You specialize ONLY in airport logistics (RIX), public transport (Rīgas Satiksme), and local navigation for students.
      
      EXPERT DOMAINS:
      1. RIX Airport: Guidance on where to find Bus 22, SIM cards, and official taxi ranks.
      2. E-talons: Explaining the Riga public transport ticketing system.
      3. Safety: Advising against unauthorized taxis and explaining Bolt/Uber apps.
      
      Tone: Calm, instructional, and safety-oriented. Keep responses under 3 sentences.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
