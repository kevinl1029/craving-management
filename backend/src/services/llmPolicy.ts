import { appConfig } from '../config/env.js';
import { loadAdaptiveScript } from '../scripts/loadScript.js';
import type { StageKey } from '../types/stage.js';

type InteractionMode = 'voice' | 'text';

export interface LLMPolicyInput {
  stage: StageKey;
  mode?: InteractionMode;
}

export interface LLMPolicyDecision {
  providerKey: string;
  model: string;
}

const DEFAULT_PROVIDER = 'openai';
const MODE_MODEL_DEFAULTS: Partial<Record<InteractionMode, string>> = {
  voice: appConfig.llmDefaultModel
};

export async function resolveLLMPolicy(input: LLMPolicyInput): Promise<LLMPolicyDecision> {
  const script = await loadAdaptiveScript();
  const stageConfig = script.stages[input.stage];

  if (!stageConfig) {
    throw new Error(`LLM policy cannot resolve unknown stage: ${input.stage}`);
  }

  const providerKey = (stageConfig.llmProvider ?? appConfig.llmProvider ?? DEFAULT_PROVIDER).toLowerCase();
  const modeDefaultModel = input.mode ? MODE_MODEL_DEFAULTS[input.mode] : undefined;
  const model = stageConfig.llmModel ?? modeDefaultModel ?? appConfig.llmDefaultModel;

  return {
    providerKey,
    model
  };
}
