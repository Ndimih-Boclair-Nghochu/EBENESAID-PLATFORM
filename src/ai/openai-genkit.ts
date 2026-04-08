import { genkit } from 'genkit';
import { openai } from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [openai({ apiKey: process.env.OPENAI_API_KEY })],
  model: 'openai/gpt-4o', // Use GPT-4o for best results
});
