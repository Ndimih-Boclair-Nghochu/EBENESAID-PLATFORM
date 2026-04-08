'use server';
/**
 * @fileOverview The Platform Navigator AI.
 * Handles general inquiries and directs users to specialized modules with direct links.
 */

import { openai } from '../openai-client';


type EbenesaidInfoInput = {
  message: string;
};

type EbenesaidInfoOutput = {
  response: string;
  links?: { title: string; path: string }[];
};


export async function ebenesaidInfo(input: EbenesaidInfoInput): Promise<EbenesaidInfoOutput> {
  const systemPrompt = `You are EBENESAID AI, the Platform Navigator.\n\nYour specialty is helping users navigate the EBENESAID OS, finding features, and staying updated on platform news.\n\nKEY RESPONSIBILITIES:\n1. Explain WHAT EBENESAID is (The Global OS for International Students).\n2. Help users find specific modules: Housing, Docs, Jobs, Circle.\n3. Inform users that detailed AI specialist guidance is exclusively available in the Admin Ops Console for platform operators.\n\nNAVIGATIONAL MAPPING (Strictly use these paths):\n- Dashboard -> /dashboard\n- Housing/Accommodation -> /accommodation\n- Wallet/Documents/Docs -> /docs\n- Job Board/Jobs/Employment -> /jobs\n- Student Circle/Community/Social -> /community\n\nOutput the 'links' array whenever the user is looking for or asking about a specific section mentioned in the mapping.\n\nTone: Efficient, knowledgeable, and professional. Keep responses under 3 sentences.`;

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

  // The OpenAI response will be a JSON object with 'response' and optional 'links'.
  try {
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      response: parsed.response || 'Sorry, I could not process your request.',
      links: parsed.links,
    };
  } catch {
    return {
      response: completion.choices[0].message.content || 'Sorry, I could not process your request.',
    };
  }
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
