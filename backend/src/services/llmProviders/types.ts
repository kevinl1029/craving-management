import type { StageKey } from '../../types/stage.js';
import type { ConversationRequestBody } from '../../types/conversation.js';

export interface ProviderReply {
  stage: StageKey;
  messages: string[];
}

export interface LLMProvider {
  isConfigured(): boolean;
  generate(payload: ConversationRequestBody): Promise<ProviderReply | null>;
  name: string;
}
