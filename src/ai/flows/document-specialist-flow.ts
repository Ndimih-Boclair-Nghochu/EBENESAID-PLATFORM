'use server';
/**
 * @fileOverview The Compliance Specialist AI.
 * Specializes in document security, GDPR, and visa logistics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentSpecialistInputSchema = z.object({
  message: z.string().describe('User question about documents, security, or PMLP procedures.'),
});

const DocumentSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert compliance guidance.'),
});

export async function discussDocuments(input: {message: string}) {
  return documentSpecialistFlow(input);
}

const documentSpecialistFlow = ai.defineFlow(
  {
    name: 'documentSpecialistFlow',
    inputSchema: DocumentSpecialistInputSchema,
    outputSchema: DocumentSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Compliance Specialist. 
      You specialize ONLY in document security, data privacy, and administrative procedures (PMLP, visas).
      
      EXPERT DOMAINS:
      1. Bank-Grade Encryption: Explaining how our Document Wallet stays secure.
      2. Administrative Tasks: Guidance on Residence Permits and SIM registration.
      3. GDPR: Data privacy standards for international students in the EU.
      
      REFERRAL PROTOCOL:
      - For housing searches, refer to the "Housing Specialist" in the Housing tab.
      - For general site help, refer to the "Platform Navigator".
      
      Tone: Precise, secure, and reassuring.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
