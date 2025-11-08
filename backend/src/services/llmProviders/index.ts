import { openAIProvider } from './openaiProvider.js';
import type { ConversationRequestBody } from '../../types/conversation.js';
import type { LLMProvider, ProviderReply } from './types.js';
import { appConfig } from '../../config/env.js';

const providers: Record<string, LLMProvider> = {
  openai: openAIProvider
  // future providers can be added here, e.g. anthropic: anthropicProvider
};

const DEFAULT_PROVIDER = 'openai';

function resolveProvider(): LLMProvider | null {
  const key = appConfig.llmProvider?.toLowerCase() ?? DEFAULT_PROVIDER;
  const provider = providers[key];

  if (!provider) {
    console.warn(`LLM provider "${key}" is not recognized. Falling back to default.`);
    return providers[DEFAULT_PROVIDER] ?? null;
  }

  if (!provider.isConfigured()) {
    console.warn(`LLM provider "${provider.name}" is not configured. Falling back to scripted responses.`);
    return null;
  }

  return provider;
}

export async function generateWithProvider(
  payload: ConversationRequestBody
): Promise<ProviderReply | null> {
  const provider = resolveProvider();
  if (!provider) return null;

  return provider.generate(payload);
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}

export function getConfiguredProviderName(): string {
  const key = appConfig.llmProvider?.toLowerCase() ?? DEFAULT_PROVIDER;
  return providers[key]?.name ?? DEFAULT_PROVIDER;
}
