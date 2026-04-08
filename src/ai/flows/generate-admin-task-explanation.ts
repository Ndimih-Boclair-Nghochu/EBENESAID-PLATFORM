'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate clear, step-by-step explanations
 * for complex administrative tasks, customized to an international student's profile.
 *
 * - generateAdminTaskExplanation - A function that handles the explanation generation process.
 * - GenerateAdminTaskExplanationInput - The input type for the generateAdminTaskExplanation function.
 * - GenerateAdminTaskExplanationOutput - The return type for the generateAdminTaskExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdminTaskExplanationInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('A detailed description of the administrative task the student needs help with.'),
  studentNationality: z
    .string()
    .describe('The nationality of the international student.'),
  studentUniversity: z
    .string()
    .describe('The university the international student is enrolled in.'),
  studentCurrentLocation: z
    .string()
    .describe(
      'The current location of the student (e.g., "Riga, Latvia"). This helps contextualize local procedures.'
    ),
  additionalContext: z
    .string()
    .optional()
    .describe(
      'Any additional context or specific questions the student has about the task.'
    ),
});
export type GenerateAdminTaskExplanationInput = z.infer<
  typeof GenerateAdminTaskExplanationInputSchema
>;

const GenerateAdminTaskExplanationOutputSchema = z.object({
  explanation: z.string().describe('A step-by-step, plain language explanation of the task.'),
  estimatedTime: z
    .string()
    .optional()
    .describe('Estimated time to complete the task.'),
  requiredDocuments: z.array(z.string()).optional().describe('List of documents required.'),
  importantTips: z.array(z.string()).optional().describe('Important tips for completing the task.'),
});
export type GenerateAdminTaskExplanationOutput = z.infer<
  typeof GenerateAdminTaskExplanationOutputSchema
>;

export async function generateAdminTaskExplanation(
  input: GenerateAdminTaskExplanationInput
): Promise<GenerateAdminTaskExplanationOutput> {
  return generateAdminTaskExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdminTaskExplanationPrompt',
  input: {schema: GenerateAdminTaskExplanationInputSchema},
  output: {schema: GenerateAdminTaskExplanationOutputSchema},
  prompt: `You are an expert administrative guide for international students in Latvia.
Your goal is to provide clear, step-by-step explanations for complex administrative tasks in plain language.

Context:
- The student's nationality: {{{studentNationality}}}
- The student's university: {{{studentUniversity}}}
- The student's current location: {{{studentCurrentLocation}}}

Task to explain: {{{taskDescription}}}

Additional context from the student: {{{additionalContext}}}

Provide a comprehensive, step-by-step explanation. Include estimated time, required documents, and important tips. Use clear, simple language suitable for a non-native speaker. Format the output in a JSON object as described by the output schema.`,
});

const generateAdminTaskExplanationFlow = ai.defineFlow(
  {
    name: 'generateAdminTaskExplanationFlow',
    inputSchema: GenerateAdminTaskExplanationInputSchema,
    outputSchema: GenerateAdminTaskExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
