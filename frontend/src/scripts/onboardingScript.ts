/**
 * Onboarding Script Configuration
 *
 * Central configuration for scene-based narrative stages in the onboarding flow.
 * Defines all scenes, timing, and CTAs for Reflection, Teaser, and Conversion stages.
 */

export type StageId = 'entry' | 'relief' | 'relief_pre_intensity' | 'relief_center' | 'relief_observe' | 'relief_release' | 'relief_checkin' | 'reflection' | 'teaser' | 'conversion' | 'cognitive_reframe';

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
  // Entry can be filled later if/when we refactor it into this system.
  entry: { id: 'entry', scenes: [] },

  // Main relief stage (container) - kept empty as it delegates to sub-stages
  relief: { id: 'relief', scenes: [] },

  // Relief sub-stages with narrative text
  relief_pre_intensity: {
    id: 'relief_pre_intensity',
    scenes: [
      {
        id: 'relief_pre_intensity_scene_1',
        dwellMs: 0,
        autoAdvance: false,
        lines: [
          { text: 'Notice how the craving feels right now.' },
          { text: 'On a scale of 1 to 10, where would you put it?' },
        ],
      },
    ],
  },

  relief_center: {
    id: 'relief_center',
    scenes: [
      {
        id: 'relief_center_scene_1',
        dwellMs: 5200, // Duration for preface text (before breathing begins)
        autoAdvance: true,
        lines: [
          { text: "Let's start with one slow breathing reset." },
        ],
      },
      {
        id: 'relief_center_scene_2',
        dwellMs: 5000, // Controls BOTH text display AND breathing orb expansion duration
        autoAdvance: true,
        lines: [
          { text: 'Breathe in…' },
        ],
      },
      {
        id: 'relief_center_scene_3',
        dwellMs: 5000, // Controls BOTH text display AND breathing orb contraction duration
        autoAdvance: true,
        lines: [
          { text: 'Breathe out…' },
        ],
      },
    ],
  },

  relief_observe: {
    id: 'relief_observe',
    scenes: [
      {
        id: 'relief_observe_scene_1',
        dwellMs: 5000, // Controls wave pulse cycle duration (6 cycles total)
        autoAdvance: true,
        lines: [
          { text: 'Watch the craving swell and then settle…' },
          { text: 'Let it swell, peak, and ease back down. Notice how the wave is smaller than when you started.' },
          { text: 'Keep your attention on the wave losing power.' },
        ],
      },
      {
        id: 'relief_observe_scene_2',
        dwellMs: 5000, // Text changes at cycle 1 (cycle duration inherited from scene 1)
        autoAdvance: true,
        lines: [
          { text: 'See how each wave lands smaller than the last.' },
        ],
      },
      {
        id: 'relief_observe_scene_3',
        dwellMs: 10000, // Text changes at cycle 3
        autoAdvance: true,
        lines: [
          { text: "You're just watching it lose power." },
        ],
      },
      {
        id: 'relief_observe_scene_4',
        dwellMs: 10000, // Text changes at cycle 5
        autoAdvance: true,
        lines: [
          { text: "Now it's almost gone." },
        ],
      },
      {
        id: 'relief_observe_scene_5',
        dwellMs: 2500, // Final display duration after all cycles complete
        autoAdvance: true,
        lines: [
          { text: 'Notice how small and quiet it is now.' },
        ],
      },
    ],
  },

  relief_release: {
    id: 'relief_release',
    scenes: [
      {
        id: 'relief_release_scene_1',
        dwellMs: 3000, // Controls particle release cycle duration (8 cycles total)
        autoAdvance: true,
        lines: [
          { text: 'Let each breath carry tension away.' },
          { text: 'Your tension is represented by the orb — watch it disappear completely.' },
        ],
      },
      {
        id: 'relief_release_scene_2',
        dwellMs: 6000, // Text changes at cycle 2 (cycle duration inherited from scene 1)
        autoAdvance: true,
        lines: [
          { text: 'Feel gravity drawing it down.' },
        ],
      },
      {
        id: 'relief_release_scene_3',
        dwellMs: 6000, // Text changes at cycle 4
        autoAdvance: true,
        lines: [
          { text: 'Every exhale releases more.' },
        ],
      },
      {
        id: 'relief_release_scene_4',
        dwellMs: 6000, // Text changes at cycle 6
        autoAdvance: true,
        lines: [
          { text: "You're lighter now." },
        ],
      },
      {
        id: 'relief_release_scene_5',
        dwellMs: 7200, // Final scene at cycle 8 - total duration for final text display
        autoAdvance: true,
        lines: [
          { text: 'All tension has fallen away.' },
        ],
      },
    ],
  },

  relief_checkin: {
    id: 'relief_checkin',
    scenes: [
      {
        id: 'relief_checkin_scene_1',
        dwellMs: 0,
        autoAdvance: false,
        lines: [
          { text: 'Notice how the craving feels now.' },
          { text: 'On a scale of 1 to 10, where would you put it?' },
        ],
      },
    ],
  },

  cognitive_reframe: {
    id: 'cognitive_reframe',
    scenes: [
      {
        id: 'cognitive_reframe_scene_1',
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
          { text: "What you felt wasn't a sign of deprivation" },
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
        dwellMs: 3500,
        autoAdvance: true,
        lines: [
          { text: 'Once you see it clearly,' },
          { text: 'cravings lose almost all their grip.' },
        ]
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
          { text: 'through a mindset shift, not willpower.' },
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
