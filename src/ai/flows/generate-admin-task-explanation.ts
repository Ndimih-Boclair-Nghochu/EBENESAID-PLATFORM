'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate clear, step-by-step explanations
 * for complex administrative tasks, customized to an international student's profile.
 *
 * - generateAdminTaskExplanation - A function that handles the explanation generation process.
 * - GenerateAdminTaskExplanationInput - The input type for the generateAdminTaskExplanation function.
 * - GenerateAdminTaskExplanationOutput - The return type for the generateAdminTaskExplanation function.
 */

import { getOpenAIClient } from '../openai-client';


export type GenerateAdminTaskExplanationInput = {
  taskDescription: string;
  studentNationality: string;
  studentUniversity: string;
  studentCurrentLocation: string;
  additionalContext?: string;
};

export type GenerateAdminTaskExplanationOutput = {
  explanation: string;
  estimatedTime?: string;
  requiredDocuments?: string[];
  importantTips?: string[];
};


export async function generateAdminTaskExplanation(
  input: GenerateAdminTaskExplanationInput
): Promise<GenerateAdminTaskExplanationOutput> {
  const openai = getOpenAIClient();
  const systemPrompt = `You are EBENESAID AI, the Admin Task Explainer.\n\nYour job is to generate clear, step-by-step explanations for complex administrative tasks, customized to an international student's profile.\n\nOutput JSON with these fields: explanation (string), estimatedTime (string, optional), requiredDocuments (string[], optional), importantTips (string[], optional).`;

  const userPrompt = `Task: ${input.taskDescription}\nNationality: ${input.studentNationality}\nUniversity: ${input.studentUniversity}\nLocation: ${input.studentCurrentLocation}\n${input.additionalContext ? `Additional: ${input.additionalContext}` : ''}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      explanation: parsed.explanation || 'No explanation available.',
      estimatedTime: parsed.estimatedTime,
      requiredDocuments: parsed.requiredDocuments,
      importantTips: parsed.importantTips,
    };
  } catch {
    return {
      explanation: completion.choices[0].message.content || 'Sorry, I could not process your request.'
    };
  }
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
