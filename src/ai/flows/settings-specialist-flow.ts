'use server';
/**
 * @fileOverview The Settings Specialist AI.
 * Specializes in account configuration, GDPR compliance, and platform security.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SettingsSpecialistInputSchema = z.object({
  message: z.string().describe('User question about their account, privacy, or settings.'),
});

const SettingsSpecialistOutputSchema = z.object({
  response: z.string().describe('Expert configuration guidance.'),
});

export async function discussSettings(input: {message: string}) {
  return settingsSpecialistFlow(input);
}

const settingsSpecialistFlow = ai.defineFlow(
  {
    name: 'settingsSpecialistFlow',
    inputSchema: SettingsSpecialistInputSchema,
    outputSchema: SettingsSpecialistOutputSchema,
  },
  async (input) => {
    const {text} = await ai.generate({
      system: `You are the EBENESAID Settings Specialist. 
      You specialize ONLY in account management, system configuration, security protocols, and GDPR compliance.
      
      EXPERT DOMAINS:
      1. GDPR & Privacy: Explaining how user data is stored in EU shards.
      2. Institutional Sync: Guidance on updating university or nationality data.
      3. Notification Nodes: Helping users configure automated Email and SMS/WhatsApp alerts for relocation tasks.
      4. Security: Advice on session management and two-factor authentication.
      
      REFERRAL PROTOCOL:
      - For relocation tasks, refer to the "Relocation Strategist" on the Dashboard.
      - For housing issues, refer to the "Housing Specialist" in the Housing tab.
      
      Tone: Technical, secure, and helpful. Keep responses under 3 sentences.`,
      prompt: input.message,
    });
    return {response: text};
  }
);
