import OpenAI from 'openai';
import { appConfig } from '../../config/env.js';
import type { LLMProvider } from './types.js';

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (client) return client;
  if (!appConfig.openAiApiKey) return null;
  client = new OpenAI({ apiKey: appConfig.openAiApiKey });
  return client;
}

export const openAIProvider: LLMProvider = {
  name: 'openai',
  isConfigured() {
    return Boolean(appConfig.openAiApiKey);
  },
  async generate({ payload, model, systemPrompt, userPrompt }) {
    const api = getClient();
    if (!api) return null;

    try {
      const completion = await api.chat.completions.create({
        model,
        temperature: 0.7,
        max_tokens: 240,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      });

      const content = completion.choices?.[0]?.message?.content?.trim();
      if (!content) return null;

      const messages = content
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        stage: payload.stage,
        messages
      };
    } catch (error) {
      console.error('OpenAI conversation error', error);
      return null;
    }
  }
};
