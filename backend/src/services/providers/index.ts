import { openAIProvider } from './openai.js';
import type { LLMProvider } from './types.js';

const providers: Record<string, LLMProvider> = {
  openai: openAIProvider
};

export function getProvider(key: string): LLMProvider | null {
  const normalized = key.toLowerCase();
  const provider = providers[normalized];

  if (!provider) {
    console.warn(`LLM provider "${key}" is not registered.`);
    return null;
  }

  if (!provider.isConfigured()) {
    console.warn(`LLM provider "${provider.name}" is not configured.`);
    return null;
  }

  return provider;
}

export function listAvailableProviders(): string[] {
  return Object.keys(providers);
}
