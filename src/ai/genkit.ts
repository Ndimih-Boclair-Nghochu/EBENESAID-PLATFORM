import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const liveAiEnabled = process.env.EBENESAID_AI_MODE === 'live' && Boolean(process.env.GOOGLE_GENAI_API_KEY);

export const ai = genkit({
  plugins: liveAiEnabled ? [googleAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY })] : [],
  ...(liveAiEnabled ? { model: 'googleai/gemini-2.5-flash' } : {}),
});
