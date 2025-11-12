import type { ConversationRequestBody, ConversationResponse } from '../types/conversation.js';
import type { StageKey, StageScript } from '../types/stage.js';
import { loadAdaptiveScript } from '../scripts/loadScript.js';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import { resolveLLMPolicy } from './llmPolicy.js';
import { getProvider } from './providers/index.js';

const NEXT_STAGE: Record<StageKey, StageKey | null> = {
  entry: 'relief',
  relief: 'reflection',
  reflection: 'teaser',
  teaser: 'conversion',
  conversion: null
};

const DEFAULT_PLACEHOLDER =
  'We are still configuring the live Freedom Coach. This message was generated from the static script so you can continue the flow.';

function buildSystemPrompt(stageScript: StageScript): string {
  const coachHints = stageScript.coachMessages.map((msg) => `• ${msg}`).join('\n');
  const improvNotes = stageScript.improvNotes.map((note) => `- ${note}`).join('\n');
  const userPrompts = stageScript.userPrompts.map((prompt) => `- ${prompt}`).join('\n');

  return [
    SYSTEM_PROMPT,
    '',
    `Stage intent: ${stageScript.intent}`,
    `Desired tone: ${stageScript.tone}`,
    '',
    'Coach hints:',
    coachHints,
    '',
    'Follow-up suggestions:',
    userPrompts,
    '',
    'Improv notes:',
    improvNotes
  ]
    .filter(Boolean)
    .join('\n');
}

function buildUserPrompt(payload: ConversationRequestBody): string {
  const contextLines = [
    `Stage: ${payload.stage}`,
    payload.metadata?.cravingIntensity !== undefined
      ? `Craving intensity: ${payload.metadata.cravingIntensity}`
      : 'Craving intensity: unknown',
    payload.metadata?.mode ? `Interaction mode: ${payload.metadata.mode}` : 'Interaction mode: unknown'
  ];

  return [
    'Live context:',
    contextLines.join('\n'),
    '',
    'User input:',
    payload.userInput
  ].join('\n');
}

async function callProvider(
  payload: ConversationRequestBody,
  stageScript: StageScript
): Promise<string[] | null> {
  const { providerKey, model } = await resolveLLMPolicy({
    stage: payload.stage,
    mode: payload.metadata?.mode
  });

  const provider = getProvider(providerKey);
  if (!provider) {
    return null;
  }

  const providerReply = await provider.generate({
    payload,
    model,
    systemPrompt: buildSystemPrompt(stageScript),
    userPrompt: buildUserPrompt(payload)
  });

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

  const providerMessages = await callProvider(payload, stageScript);

  const messages =
    providerMessages && providerMessages.length > 0
      ? providerMessages
      : buildFallbackMessages(payload, stageScript.coachMessages[0] ?? "Let's take this one moment at a time.");

  const source: 'llm' | 'script' =
    providerMessages && providerMessages.length > 0 ? 'llm' : 'script';

  const nextStage = NEXT_STAGE[payload.stage] ?? null;

  return {
    stage: payload.stage,
    messages,
    nextStage: nextStage ?? undefined,
    source
  };
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
