/**
 * Onboarding Script Configuration
 *
 * Central configuration for scene-based narrative stages in the onboarding flow.
 * Defines all scenes, timing, and CTAs for Reflection, Teaser, and Conversion stages.
 */

export type StageId = 'entry' | 'relief' | 'reflection' | 'teaser' | 'conversion' | 'cognitive_reframe';

export interface SceneLine {
  text: string;
}

export interface SceneCTA {
  id: string;          // e.g. 'reflection_continue', 'teaser_see_insight'
  label: string;       // button text
  variant?: 'primary' | 'secondary';
}

export interface SceneConfig {
  id: string;
  lines: SceneLine[];  // 1–3 lines per scene
  dwellMs: number;     // time to stay on screen if auto-advance
  autoAdvance: boolean;
  ctas?: SceneCTA[];   // usually only on final scene per stage
}

export interface StageConfig {
  id: StageId;
  scenes: SceneConfig[];
}

export const onboardingScript: Record<StageId, StageConfig> = {
  // Entry + Relief can be filled later if/when we refactor them into this system.
  entry: { id: 'entry', scenes: [] },
  relief: { id: 'relief', scenes: [] },

  cognitive_reframe: {
    id: 'cognitive_reframe',
    scenes: [
      {
        id: 'cognitive_reframe_scene_1',
        dwellMs: 4000,
        autoAdvance: true,
        lines: [
          { text: "Freedom is already happening." },
          { text: "You just let your body return to balance." },
        ],
      },
      {
        id: 'cognitive_reframe_scene_2',
        dwellMs: 4000,
        autoAdvance: true,
        lines: [
          { text: "Each time you stay present," },
          { text: "the craving wave loses more of its power." },
        ],
      },
      {
        id: 'cognitive_reframe_scene_3',
        dwellMs: 4000,
        autoAdvance: true,
        lines: [
          { text: "What you felt wasn't a need —" },
          { text: "just a passing signal from your body." },
        ],
      },
    ],
  },

  reflection: {
    id: 'reflection',
    scenes: [
      {
        id: 'reflection_scene_1',
        dwellMs: 3500,
        autoAdvance: true,
        lines: [
          { text: 'Feel this calm.' },
          { text: 'The wave has passed.' },
        ],
      },
      {
        id: 'reflection_scene_2',
        dwellMs: 3500,
        autoAdvance: true,
        lines: [
          { text: 'Your body just rebalanced itself.' },
          { text: 'Nothing was wrong with you.' },
        ],
      },
      {
        id: 'reflection_scene_3',
        dwellMs: 0, // waits for user CTA
        autoAdvance: false,
        lines: [
          { text: "Cravings don't appear at random." },
          { text: 'Want to see the real cause?' },
        ],
        ctas: [
          {
            id: 'reflection_continue',
            label: 'Continue',
            variant: 'primary',
          },
        ],
      },
    ],
  },

  teaser: {
    id: 'teaser',
    scenes: [
      {
        id: 'teaser_scene_1',
        dwellMs: 3500,
        autoAdvance: true,
        lines: [
          { text: 'You handled that craving beautifully.' },
          { text: 'You stayed present the whole time.' },
        ],
      },
      {
        id: 'teaser_scene_2',
        dwellMs: 3500,
        autoAdvance: true,
        lines: [
          { text: "There's one simple misunderstanding" },
          { text: 'that makes nicotine feel powerful.' },
        ],
      },
      {
        id: 'teaser_scene_3',
        dwellMs: 0,
        autoAdvance: false,
        lines: [
          { text: 'Once you see it clearly,' },
          { text: 'cravings lose almost all their grip.' },
        ],
        ctas: [
          {
            id: 'teaser_see_insight',
            label: 'See the first insight — Free',
            variant: 'primary',
          },
        ],
      },
    ],
  },

  conversion: {
    id: 'conversion',
    scenes: [
      {
        id: 'conversion_scene_1',
        dwellMs: 4000,
        autoAdvance: true,
        lines: [
          { text: "You've created real relief today." },
          { text: 'Now learn how to remove cravings completely —' },
          { text: 'through clarity, not willpower.' },
        ],
      },
      {
        id: 'conversion_scene_2',
        dwellMs: 0,
        autoAdvance: false,
        lines: [
          { text: '6 short guided insights' },
          { text: 'that dissolve every nicotine myth' },
          { text: 'and unlock genuine freedom.' },
        ],
        ctas: [
          {
            id: 'conversion_start_journey',
            label: 'Start the Freedom Journey',
            variant: 'primary',
          },
          {
            id: 'conversion_try_lesson',
            label: 'Try Lesson 1 Free',
            variant: 'secondary',
          },
        ],
      },
    ],
  },
};
