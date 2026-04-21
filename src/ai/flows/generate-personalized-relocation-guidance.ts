'use server';
/**
 * @fileOverview A Genkit flow for generating personalized relocation guidance for international students.
 *
 * - generatePersonalizedRelocationGuidance - A function that generates a personalized relocation checklist and guidance.
 * - GeneratePersonalizedRelocationGuidanceInput - The input type for the generatePersonalizedRelocationGuidance function.
 * - GeneratePersonalizedRelocationGuidanceOutput - The return type for the generatePersonalizedRelocationGuidance function.
 */

import { getOpenAIClient } from '../openai-client';


export type GeneratePersonalizedRelocationGuidanceInput = {
  university: string;
  nationality: string;
  arrivalStatus: string;
};

export type GeneratePersonalizedRelocationGuidanceOutput = {
  checklist: { task: string; isCompleted: boolean }[];
  guidance: string;
};


export async function generatePersonalizedRelocationGuidance(
  input: GeneratePersonalizedRelocationGuidanceInput
): Promise<GeneratePersonalizedRelocationGuidanceOutput> {
  if (!process.env.OPENAI_API_KEY) {
    return buildRelocationFallback(input);
  }

  const openai = getOpenAIClient();
  const systemPrompt = `You are EBENESAID AI, the Relocation Strategist.\n\nYour job is to generate a personalized relocation checklist and guidance for international students moving to Latvia.\n\nChecklist should be actionable, step-by-step, and tailored to the student's university, nationality, and arrival status.\n\nOutput JSON with two fields: checklist (array of {task, isCompleted}) and guidance (string with contextual tips).`;

  const userPrompt = `University: ${input.university}\nNationality: ${input.nationality}\nArrival Status: ${input.arrivalStatus}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  try {
    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      checklist: parsed.checklist || [],
      guidance: parsed.guidance || 'No guidance available.'
    };
  } catch {
    return buildRelocationFallback(input, completion.choices[0].message.content || undefined);
  }
}

function buildRelocationFallback(
  input: GeneratePersonalizedRelocationGuidanceInput,
  guidance?: string
): GeneratePersonalizedRelocationGuidanceOutput {
  const university = input.university || 'your university';
  const nationality = input.nationality || 'your home country';
  const arrivalStatus = input.arrivalStatus || 'planning your arrival';

  return {
    checklist: [
      { task: `Confirm your admission or invitation letter from ${university}`, isCompleted: false },
      { task: 'Prepare passport, insurance, and immigration documents', isCompleted: false },
      { task: 'Secure verified accommodation before travel', isCompleted: false },
      { task: 'Plan airport pickup and first-week transport in Latvia', isCompleted: false },
      { task: 'Upload key documents to your EBENESAID secure wallet', isCompleted: false },
      { task: 'Check student work and local registration requirements', isCompleted: false },
    ],
    guidance:
      guidance ||
      `You are currently ${arrivalStatus}. As a student relocating from ${nationality}, focus first on verified documents, housing confirmation, and arrival logistics for ${university}. EBENESAID test mode is active, so this guidance is safe to use for planning while provider credentials are not configured.`,
  };
}
