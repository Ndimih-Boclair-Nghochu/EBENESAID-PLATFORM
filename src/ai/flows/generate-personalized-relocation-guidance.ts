'use server';
/**
 * @fileOverview A Genkit flow for generating personalized relocation guidance for international students.
 *
 * - generatePersonalizedRelocationGuidance - A function that generates a personalized relocation checklist and guidance.
 * - GeneratePersonalizedRelocationGuidanceInput - The input type for the generatePersonalizedRelocationGuidance function.
 * - GeneratePersonalizedRelocationGuidanceOutput - The return type for the generatePersonalizedRelocationGuidance function.
 */

import { openai } from '../openai-client';


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
    return {
      checklist: [],
      guidance: completion.choices[0].message.content || 'Sorry, I could not process your request.'
    };
  }
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
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
