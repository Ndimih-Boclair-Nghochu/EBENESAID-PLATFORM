'use server';
/**
 * @fileOverview The Compliance Specialist AI.
 * Specializes in document security, GDPR, and visa logistics.
 */

import { openai } from '../openai-client';


type DocumentSpecialistInput = {
  message: string;
};

type DocumentSpecialistOutput = {
  response: string;
};


export async function discussDocuments(input: DocumentSpecialistInput): Promise<DocumentSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Compliance Specialist.\n\nYou specialize ONLY in document security, data privacy, and administrative procedures (PMLP, visas).\n\nEXPERT DOMAINS:\n1. Bank-Grade Encryption: Explaining how our Document Wallet stays secure.\n2. Administrative Tasks: Guidance on Residence Permits and SIM registration.\n3. GDPR: Data privacy standards for international students in the EU.\n\nREFERRAL PROTOCOL:\n- For housing searches, refer to the 'Housing Specialist' in the Housing tab.\n- For general site help, refer to the 'Platform Navigator'.\n\nTone: Precise, secure, and reassuring. Keep responses under 3 sentences.`;

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
