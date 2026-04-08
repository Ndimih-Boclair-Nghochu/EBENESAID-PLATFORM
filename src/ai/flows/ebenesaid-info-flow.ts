'use server';
/**
 * @fileOverview The Platform Navigator AI.
 * Handles general inquiries and directs users to specialized modules with direct links.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EbenesaidInfoInputSchema = z.object({
  message: z.string().describe('The user\'s message about the platform or navigation.'),
});

const EbenesaidInfoOutputSchema = z.object({
  response: z.string().describe('The AI\'s response providing guidance or referral.'),
  links: z.array(z.object({
    title: z.string().describe('The display title of the link.'),
    path: z.string().describe('The relative path to the page (e.g., "/accommodation").'),
  })).optional().describe('Direct navigation links relevant to the user\'s inquiry.'),
});

export async function ebenesaidInfo(input: {message: string}) {
  return ebenesaidInfoFlow(input);
}

const ebenesaidInfoFlow = ai.defineFlow(
  {
    name: 'ebenesaidInfoFlow',
    inputSchema: EbenesaidInfoInputSchema,
    outputSchema: EbenesaidInfoOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      system: `You are the EBENESAID Platform Navigator. 
      Your specialty is helping users navigate the EBENESAID OS, finding features, and staying updated on platform news.
      
      KEY RESPONSIBILITIES:
      1. Explain WHAT EBENESAID is (The Global OS for International Students).
      2. Help users find specific modules: Housing, Docs, Jobs, Circle.
      3. Inform users that detailed AI specialist guidance is exclusively available in the Admin Ops Console for platform operators.
      
      NAVIGATIONAL MAPPING (Strictly use these paths):
      - Dashboard -> /dashboard
      - Housing/Accommodation -> /accommodation
      - Wallet/Documents/Docs -> /docs
      - Job Board/Jobs/Employment -> /jobs
      - Student Circle/Community/Social -> /community
      
      Output the 'links' array whenever the user is looking for or asking about a specific section mentioned in the mapping.
      
      Tone: Efficient, knowledgeable, and professional. Keep responses under 3 sentences.`,
      prompt: input.message,
    });
    return output!;
  }
);
