'use server';
/**
 * @fileOverview The Compliance Specialist AI.
 * Specializes in document security, GDPR, and visa logistics.
 */

import { getOpenAIJsonResponse } from '../openai-client';


type DocumentSpecialistInput = {
  message: string;
};

type DocumentSpecialistOutput = {
  response: string;
};


export async function discussDocuments(input: DocumentSpecialistInput): Promise<DocumentSpecialistOutput> {
  const systemPrompt = `You are EBENESAID AI, the Compliance Specialist.\n\nYou specialize ONLY in document security, data privacy, and administrative procedures (PMLP, visas).\n\nEXPERT DOMAINS:\n1. Bank-Grade Encryption: Explaining how our Document Wallet stays secure.\n2. Administrative Tasks: Guidance on Residence Permits and SIM registration.\n3. GDPR: Data privacy standards for international students in the EU.\n\nREFERRAL PROTOCOL:\n- For housing searches, refer to the 'Housing Specialist' in the Housing tab.\n- For general site help, refer to the 'Platform Navigator'.\n\nTone: Precise, secure, and reassuring. Keep responses under 3 sentences.`;
  const response = await getOpenAIJsonResponse({
    systemPrompt,
    userMessage: input.message,
    fallbackResponse:
      'I can still guide you through document steps here. Make sure your passport, admission letter, and visa files are uploaded with clear names and valid links while the AI connection is being configured.',
  });

  return { response };
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
