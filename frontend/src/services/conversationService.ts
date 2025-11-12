import type { StageKey } from '../lib/stages';
import { getNextStage } from '../lib/stages';

export interface ConversationPayload {
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';
const SHOULD_MOCK_CONVERSATION = import.meta.env.VITE_USE_CONVERSATION_MOCK === 'true';

export async function sendConversation(
  payload: ConversationPayload
): Promise<ConversationResponse> {
  if (SHOULD_MOCK_CONVERSATION) {
    const nextStage = getNextStage(payload.stage) ?? undefined;
    return {
      stage: payload.stage,
      messages: [
        'This is a mock response from the Ascend Freedom Coach.',
        `You said: "${payload.userInput}"`
      ],
      nextStage,
      source: 'script'
    };
  }

  const response = await fetch(`${API_BASE_URL}/conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Conversation request failed');
  }

  return (await response.json()) as ConversationResponse;
}
