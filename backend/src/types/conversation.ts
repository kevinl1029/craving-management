import type { StageKey } from './stage.js';

export interface ConversationRequestBody {
  sessionId: string;
  stage: StageKey;
  userInput: string;
  metadata?: {
    cravingIntensity?: number;
    mode?: 'voice' | 'text';
  };
}

export interface ConversationResponse {
  stage: StageKey;
  messages: string[];
  nextStage?: StageKey;
  source: 'llm' | 'script';
}
