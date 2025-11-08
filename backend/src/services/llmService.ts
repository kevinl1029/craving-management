import type { ConversationRequestBody, ConversationResponse } from '../types/conversation.js';
import type { StageKey } from '../types/stage.js';
import { loadAdaptiveScript } from '../scripts/loadScript.js';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import { generateWithProvider } from './llmProviders/index.js';

const NEXT_STAGE: Record<StageKey, StageKey | null> = {
  entry: 'relief',
  relief: 'reflection',
  reflection: 'teaser',
  teaser: 'conversion',
  conversion: null
};

const DEFAULT_PLACEHOLDER =
  'We are still configuring the live Freedom Coach. This message was generated from the static script so you can continue the flow.';

async function callProvider(payload: ConversationRequestBody): Promise<string[] | null> {
  const providerReply = await generateWithProvider(payload);
  if (!providerReply || providerReply.messages.length === 0) {
    return null;
  }

  return providerReply.messages;
}

function buildFallbackMessages(payload: ConversationRequestBody, primary: string): string[] {
  const messages = [primary];

  if (payload.stage === 'relief' && payload.metadata?.cravingIntensity !== undefined) {
    messages.push(
      `You rated this craving a ${payload.metadata.cravingIntensity}. Each rating helps us track how the waves are shrinking.`
    );
  }

  messages.push(DEFAULT_PLACEHOLDER);
  return messages;
}

export async function generateCoachResponse(
  payload: ConversationRequestBody
): Promise<ConversationResponse> {
  const script = await loadAdaptiveScript();
  const stageScript = script.stages[payload.stage];

  if (!stageScript) {
    throw new Error(`Unknown stage: ${payload.stage}`);
  }

  const providerMessages = await callProvider(payload);

  const messages =
    providerMessages && providerMessages.length > 0
      ? providerMessages
      : buildFallbackMessages(payload, stageScript.coachMessages[0] ?? "Let's take this one moment at a time.");

  const nextStage = NEXT_STAGE[payload.stage] ?? null;

  return {
    stage: payload.stage,
    messages,
    nextStage: nextStage ?? undefined,
    followUpQuestions: stageScript.userPrompts.slice(0, 1)
  };
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
