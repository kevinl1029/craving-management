import type { ConversationRequestBody } from '../../types/conversation.js';
import type { StageKey } from '../../types/stage.js';

export interface ProviderReply {
  stage: StageKey;
  messages: string[];
}

export interface ProviderGenerateParams {
  payload: ConversationRequestBody;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}

export interface LLMProvider {
  name: string;
  isConfigured(): boolean;
  generate(params: ProviderGenerateParams): Promise<ProviderReply | null>;
}
