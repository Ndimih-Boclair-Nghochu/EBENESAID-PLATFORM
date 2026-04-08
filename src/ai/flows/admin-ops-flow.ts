'use server';
/**
 * @fileOverview The Platform Operations Specialist AI.
 * Handles platform-wide KPIs, verification protocols, and institutional management.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminOpsInputSchema = z.object({
  message: z.string().describe('The admin\'s question about platform operations or data.'),
});

const AdminOpsOutputSchema = z.object({
  response: z.string().describe('Expert operational guidance.'),
});

export async function discussOps(input: {message: string}) {
  return adminOpsFlow(input);
}

const adminOpsFlow = ai.defineFlow(
  {
    name: 'adminOpsFlow',
    inputSchema: AdminOpsInputSchema,
    outputSchema: AdminOpsOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Operations Specialist. 
      You assist Super Admins in managing the Global OS for students.
      
      EXPERT DOMAINS:
      1. Verification Standards: Explaining the 12-point inspection list for housing.
      2. User Management: Guidance on handling institutional sync errors or student visa alerts.
      3. KPI Analysis: Interpreting platform growth, vacancy rates, and placement speeds.
      
      Tone: Strategic, data-driven, and authoritative. Keep responses concise and focused on platform health.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
