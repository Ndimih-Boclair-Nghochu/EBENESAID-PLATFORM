import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

export async function getOpenAIJsonResponse(input: {
  systemPrompt: string;
  userMessage: string;
  fallbackResponse: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return input.fallbackResponse;
  }

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: input.model ?? 'gpt-4o',
      messages: [
        { role: 'system', content: input.systemPrompt },
        { role: 'user', content: input.userMessage },
      ],
      temperature: input.temperature ?? 0.3,
      max_tokens: input.maxTokens ?? 300,
      response_format: { type: 'json_object' },
    });

    try {
      const parsed = JSON.parse(completion.choices[0].message.content || '{}');
      return parsed.response || input.fallbackResponse;
    } catch {
      return completion.choices[0].message.content || input.fallbackResponse;
    }
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return input.fallbackResponse;
  }
}
