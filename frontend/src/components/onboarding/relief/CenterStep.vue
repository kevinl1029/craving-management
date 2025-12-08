<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';
import { onboardingScript } from '../../../scripts/onboardingScript';
import type { OrbState } from '../../../types/OrbState';

const props = defineProps<{
  orbState: OrbState;
}>();

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const breathPhase = ref<'inhale' | 'exhale'>('exhale');
const breathCycle = ref(0);
const isComplete = ref(false);
const introPhase = ref<'preface' | 'breathe'>('preface');
const introTextVisible = ref(false);
let phaseTimer: ReturnType<typeof setTimeout> | null = null;
let introTimer: ReturnType<typeof setTimeout> | null = null;
let introPhaseTimer: ReturnType<typeof setTimeout> | null = null;
let breathingStartTimer: ReturnType<typeof setTimeout> | null = null;
let fadeInterval: ReturnType<typeof setInterval> | null = null;

const runBreathingCycle = () => {
  const phaseDurations: Record<typeof breathPhase.value, number> = {
    inhale: inhaleDuration,
    exhale: exhaleDuration
  };

  // Complete after 3.5 cycles (end on final inhale at scale 1.35)
  if (breathCycle.value >= 3 && breathPhase.value === 'inhale') {
    // Stay on inhale (scale 1.35) and complete after full inhale duration
    if (!isComplete.value) {
      isComplete.value = true;
      setTimeout(() => emit('complete'), inhaleDuration);
    }
    return;
  }

  // For the very first transition, move immediately from exhale to inhale
  const delay = breathCycle.value === 0 && breathPhase.value === 'exhale' ? 0 : phaseDurations[breathPhase.value];

  phaseTimer = setTimeout(() => {
    if (breathPhase.value === 'inhale') {
      breathPhase.value = 'exhale';
    } else {
      breathPhase.value = 'inhale';
      breathCycle.value++;
    }
  }, delay);
};

// Sync local breath phase to parent orb state
watch(breathPhase, (newPhase) => {
  props.orbState.mode = 'breathe';
  props.orbState.phase = newPhase;
}, { immediate: true });

watch([breathPhase, breathCycle], () => {
  if (phaseTimer) {
    clearTimeout(phaseTimer);
  }
  runBreathingCycle();
});

// Get text and timing from script
const scriptConfig = onboardingScript.relief_center;
const prefaceText = scriptConfig.scenes[0]?.lines[0]?.text || "Let's start with one slow breathing reset.";
const prefaceDuration = scriptConfig.scenes[0]?.dwellMs || 5200;
const inhaleText = scriptConfig.scenes[1]?.lines[0]?.text || 'Breathe in…';
const inhaleDuration = scriptConfig.scenes[1]?.dwellMs || 5000;
const exhaleText = scriptConfig.scenes[2]?.lines[0]?.text || 'Breathe out…';
const exhaleDuration = scriptConfig.scenes[2]?.dwellMs || 5000;

const getInstructionText = () => {
  switch (breathPhase.value) {
    case 'inhale':
      return inhaleText;
    case 'exhale':
      return exhaleText;
    default:
      return 'Keep breathing…';
  }
};

onMounted(() => {
  // Initialize orb state
  props.orbState.mode = 'breathe';
  props.orbState.phase = 'exhale';
  
  // Fade in orb
  // We use a simple interval or requestAnimationFrame to animate opacity
  let opacity = 0;
  fadeInterval = setInterval(() => {
    opacity += 0.02;
    if (opacity >= 1) {
      opacity = 1;
      if (fadeInterval) clearInterval(fadeInterval);
    }
    props.orbState.opacity = opacity;
  }, 16);

  introTimer = setTimeout(() => {
    introTextVisible.value = true;
  }, 200);

  introPhaseTimer = setTimeout(() => {
    introPhase.value = 'breathe';
  }, prefaceDuration);

  breathingStartTimer = setTimeout(() => {
    runBreathingCycle();
  }, prefaceDuration);
});

onUnmounted(() => {
  if (phaseTimer) clearTimeout(phaseTimer);
  if (introTimer) clearTimeout(introTimer);
  if (introPhaseTimer) clearTimeout(introPhaseTimer);
  if (breathingStartTimer) clearTimeout(breathingStartTimer);
  if (fadeInterval) clearInterval(fadeInterval);
});
</script>

<template>
  <div class="center-stage">
    <StageShell>
      <!-- Visual slot is empty, orb is in parent -->
      <template #visual></template>

      <template #narrative>
        <StageNarrative>
          <div class="instruction-container" :class="{ 'instruction-container--visible': introTextVisible }">
            <transition name="instruction-fade" mode="out-in">
              <p :key="introPhase" class="instruction-text">
                {{ introPhase === 'preface' ? prefaceText : getInstructionText() }}
              </p>
            </transition>
          </div>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

.center-stage {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}


 .visual {
  position: relative;
  width: var(--visual-size);
  height: var(--visual-size);
  margin: 0 auto;
  transform: scale(0);
  opacity: 0;
  transition: transform 5s ease, opacity 5s ease;
}

.visual--visible {
  transform: scale(1);
  opacity: 1;
}

.visual-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.instruction-container {
  text-align: center;
  color: #fff;
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  padding: 0 clamp(1rem, 6vw, 2.5rem);
  opacity: 0;
  min-height: 3.5rem;
  transition: opacity 1.2s ease;
}

.instruction-container--visible {
  opacity: 1;
}

.instruction-fade-enter-active,
.instruction-fade-leave-active {
  transition: opacity 0.35s ease;
}

.instruction-fade-enter-from,
.instruction-fade-leave-to {
  opacity: 0;
}


.waves-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 2s ease-out;
}

.waves-container--fading {
  opacity: 0;
}
</style>
