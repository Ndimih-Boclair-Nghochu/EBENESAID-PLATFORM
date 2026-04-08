'use server';
/**
 * @fileOverview A Genkit flow for generating personalized summaries of accommodation listings.
 *
 * - generateAccommodationSummary - A function that generates a summary of an accommodation listing based on user preferences.
 * - GenerateAccommodationSummaryInput - The input type for the generateAccommodationSummary function.
 * - GenerateAccommodationSummaryOutput - The return type for the generateAccommodationSummary function.
 */

import { openai } from '../openai-client';


export type GenerateAccommodationSummaryInput = {
  accommodationListing: string;
  userPreferences: {
    universityProximity?: string;
    preferredNationalities?: string[];
    budget?: string;
  };
};

export type GenerateAccommodationSummaryOutput = {
  summary: string;
  pros: string[];
  cons: string[];
  matchScore: number;
};


export async function generateAccommodationSummary(
  input: GenerateAccommodationSummaryInput
): Promise<GenerateAccommodationSummaryOutput> {
  const systemPrompt = `You are EBENESAID AI, the Accommodation Summary Specialist.\n\nYour task is to analyze an accommodation listing and provide a personalized summary, highlighting its key features, pros, and cons based on the user's specific preferences. Also, provide a match score from 0-10 indicating how well the accommodation fits the user's criteria.\n\nOutput JSON with these fields: summary (string), pros (string[]), cons (string[]), matchScore (number 0-10).`;

  const userPrompt = `--- Accommodation Listing ---\n${input.accommodationListing}\n\n--- User Preferences ---\nUniversity Proximity: ${input.userPreferences.universityProximity || ''}\nPreferred Nationalities: ${(input.userPreferences.preferredNationalities || []).join(', ')}\nBudget: ${input.userPreferences.budget || ''}`;

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
      summary: parsed.summary || '',
      pros: parsed.pros || [],
      cons: parsed.cons || [],
      matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 0,
    };
  } catch {
    return {
      summary: completion.choices[0].message.content || 'Sorry, I could not process your request.',
      pros: [],
      cons: [],
      matchScore: 0,
    };
  }
}

// Genkit/Google Gemini logic removed. Now powered by OpenAI.
