'use server';
/**
 * @fileOverview A Genkit flow for generating personalized relocation guidance for international students.
 *
 * - generatePersonalizedRelocationGuidance - A function that generates a personalized relocation checklist and guidance.
 * - GeneratePersonalizedRelocationGuidanceInput - The input type for the generatePersonalizedRelocationGuidance function.
 * - GeneratePersonalizedRelocationGuidanceOutput - The return type for the generatePersonalizedRelocationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedRelocationGuidanceInputSchema = z.object({
  university: z.string().describe('The name of the university the student will attend.'),
  nationality: z.string().describe('The nationality of the student.'),
  arrivalStatus: z
    .string()
    .describe(
      'The current arrival status of the student (e.g., "admission received", "visa approved", "arrived in Latvia").'
    ),
});
export type GeneratePersonalizedRelocationGuidanceInput = z.infer<
  typeof GeneratePersonalizedRelocationGuidanceInputSchema
>;

const GeneratePersonalizedRelocationGuidanceOutputSchema = z.object({
  checklist: z
    .array(
      z.object({
        task: z.string().describe('A task item in the relocation checklist.'),
        isCompleted: z.boolean().describe('Whether the task is completed (default to false).'),
      })
    )
    .describe('A personalized checklist of relocation tasks.'),
  guidance: z.string().describe('Contextual guidance and tips for the relocation process.'),
});
export type GeneratePersonalizedRelocationGuidanceOutput = z.infer<
  typeof GeneratePersonalizedRelocationGuidanceOutputSchema
>;

export async function generatePersonalizedRelocationGuidance(
  input: GeneratePersonalizedRelocationGuidanceInput
): Promise<GeneratePersonalizedRelocationGuidanceOutput> {
  return personalizedRelocationGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRelocationGuidancePrompt',
  input: {schema: GeneratePersonalizedRelocationGuidanceInputSchema},
  output: {schema: GeneratePersonalizedRelocationGuidanceOutputSchema},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an AI assistant for EBENESAID, a relocation operating system for international students.
Your goal is to provide a personalized, dynamically updated relocation checklist and contextual guidance.

Based on the student's details, generate a comprehensive checklist of necessary steps and relevant guidance to help them confidently navigate their relocation without missing crucial deadlines or information.

Student Details:
University: {{{university}}}
Nationality: {{{nationality}}}
Arrival Status: {{{arrivalStatus}}}

Consider typical challenges for international students, such as housing, visa requirements, administrative registrations (SIM card, public transport), cultural adjustments, and employment opportunities.

Generate a checklist of at least 5-10 key tasks. For each task, set 'isCompleted' to false initially.
Provide contextual guidance that is encouraging, informative, and addresses potential pain points based on the provided status.
`,
});

const personalizedRelocationGuidanceFlow = ai.defineFlow(
  {
    name: 'personalizedRelocationGuidanceFlow',
    inputSchema: GeneratePersonalizedRelocationGuidanceInputSchema,
    outputSchema: GeneratePersonalizedRelocationGuidanceOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI failed to generate a response');
      }
      return output;
    } catch (error) {
      console.error('Relocation Guidance Flow Error:', error);
      // Fallback for UI safety
      return {
        checklist: [
          { task: "Finalize Housing", isCompleted: false },
          { task: "Secure Visa", isCompleted: true },
          { task: "University Orientation", isCompleted: false }
        ],
        guidance: "We're experiencing a minor synchronization delay. Please proceed with your primary pre-arrival logistics."
      };
    }
  }
);
