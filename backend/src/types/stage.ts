export type StageKey = 'entry' | 'relief' | 'reflection' | 'teaser' | 'conversion';

export interface StageScript {
  intent: string;
  tone: string;
  coachMessages: string[];
  userPrompts: string[];
  improvNotes: string[];
}

export interface AdaptiveScriptConfig {
  version: string;
  stages: Record<StageKey, StageScript>;
}
