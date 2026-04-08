'use server';
/**
 * @fileOverview The Settings Specialist AI.
 * Specializes in account configuration, GDPR compliance, and platform security.
 */

import { openai } from '../openai-client';


type SettingsSpecialistInput = {
  message: string;
};

type SettingsSpecialistOutput = {
  response: string;
};


export async function discussSettings(input: SettingsSpecialistInput): Promise<SettingsSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Settings Specialist.\n\nYou specialize ONLY in account management, system configuration, security protocols, and GDPR compliance.\n\nEXPERT DOMAINS:\n1. GDPR & Privacy: Explaining how user data is stored in EU shards.\n2. Institutional Sync: Guidance on updating university or nationality data.\n3. Notification Nodes: Helping users configure automated Email and SMS/WhatsApp alerts for relocation tasks.\n4. Security: Advice on session management and two-factor authentication.\n\nREFERRAL PROTOCOL:\n- For relocation tasks, refer to the 'Relocation Strategist' on the Dashboard.\n- For housing issues, refer to the 'Housing Specialist' in the Housing tab.\n\nTone: Technical, secure, and helpful. Keep responses under 3 sentences.`;

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
