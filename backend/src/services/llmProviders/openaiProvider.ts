import OpenAI from 'openai';
import { appConfig } from '../../config/env.js';
import type { ConversationRequestBody } from '../../types/conversation.js';
import { loadAdaptiveScript } from '../../scripts/loadScript.js';
import { SYSTEM_PROMPT } from '../../prompts/systemPrompt.js';
import type { ProviderReply, LLMProvider } from './types.js';
import type { StageScript } from '../../types/stage.js';

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (client) return client;
  if (!appConfig.openAiApiKey) return null;
  client = new OpenAI({ apiKey: appConfig.openAiApiKey });
  return client;
}

function buildUserPrompt(payload: ConversationRequestBody, stageConfig: StageScript): string {
  const improvNotes = stageConfig.improvNotes.map((note: string) => `- ${note}`).join('\n');
  const coachHints = stageConfig.coachMessages.map((msg: string) => `• ${msg}`).join('\n');
  const contextLines = [
    `Stage: ${payload.stage}`,
    payload.metadata?.cravingIntensity !== undefined
      ? `Craving intensity: ${payload.metadata.cravingIntensity}`
      : 'Craving intensity: unknown',
    payload.metadata?.mode ? `Interaction mode: ${payload.metadata.mode}` : 'Interaction mode: unknown',
    `User input: ${payload.userInput}`
  ];

  return [
    `Intent: ${stageConfig.intent}`,
    `Tone: ${stageConfig.tone}`,
    '',
    'Coach hints:',
    coachHints,
    '',
    'Improv notes:',
    improvNotes,
    '',
    'Live context:',
    contextLines.join('\n')
  ].join('\n');
}

export const openAIProvider: LLMProvider = {
  name: 'openai',
  isConfigured() {
    return Boolean(appConfig.openAiApiKey);
  },
  async generate(payload) {
    const api = getClient();
    if (!api) return null;

    const script = await loadAdaptiveScript();
    const stageScript = script.stages[payload.stage];
    if (!stageScript) return null;

    const userPrompt = buildUserPrompt(payload, stageScript);

    try {
      const completion = await api.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 240,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
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
      } satisfies ProviderReply;
    } catch (error) {
      console.error('OpenAI conversation error', error);
      return null;
    }
  }
};
