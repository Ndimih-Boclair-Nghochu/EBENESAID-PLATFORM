'use server';
/**
 * @fileOverview The Settings Specialist AI.
 * Specializes in account configuration, GDPR compliance, and platform security.
 */

import { getOpenAIJsonResponse } from '../openai-client';

type SettingsSpecialistInput = {
  message: string;
};

type SettingsSpecialistOutput = {
  response: string;
};

export async function discussSettings(input: SettingsSpecialistInput): Promise<SettingsSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Settings Specialist.\n\nYou specialize ONLY in account management, system configuration, security protocols, and GDPR compliance.\n\nEXPERT DOMAINS:\n1. Privacy: Explaining how profile data is stored and used.\n2. Institutional Sync: Guidance on updating university or nationality data.\n3. Notifications: Helping users understand which account details affect platform flows.\n4. Security: Advice on sessions, account access, and safe profile updates.\n\nREFERRAL PROTOCOL:\n- For relocation tasks, refer to the dashboard guidance.\n- For housing-specific questions, refer to the Housing Specialist.\n\nTone: Technical, secure, and helpful. Keep responses under 3 sentences.`;

  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still help with account basics here. Keep your email, phone, university, and country fields current, then save the profile so jobs, support, and delivery flows use the right information.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
