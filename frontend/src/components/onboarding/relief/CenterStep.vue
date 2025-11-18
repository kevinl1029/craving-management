<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';
import { onboardingScript } from '../../../scripts/onboardingScript';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const breathPhase = ref<'inhale' | 'exhale'>('exhale');
const breathCycle = ref(0);
const isComplete = ref(false);
const introPhase = ref<'preface' | 'breathe'>('preface');
const gradientVisible = ref(false);
const introTextVisible = ref(false);
const orbVisible = ref(false);
let phaseTimer: ReturnType<typeof setTimeout> | null = null;
let introTimer: ReturnType<typeof setTimeout> | null = null;
let gradientTimer: ReturnType<typeof setTimeout> | null = null;
let orbTimer: ReturnType<typeof setTimeout> | null = null;
let introPhaseTimer: ReturnType<typeof setTimeout> | null = null;
let breathingStartTimer: ReturnType<typeof setTimeout> | null = null;

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
  introTimer = setTimeout(() => {
    introTextVisible.value = true;
  }, 200);

  orbTimer = setTimeout(() => {
    orbVisible.value = true;
  }, 300);

  introPhaseTimer = setTimeout(() => {
    introPhase.value = 'breathe';
  }, prefaceDuration);

  breathingStartTimer = setTimeout(() => {
    runBreathingCycle();
  }, prefaceDuration);
});

onUnmounted(() => {
  if (phaseTimer) {
    clearTimeout(phaseTimer);
  }
  if (introTimer) {
    clearTimeout(introTimer);
  }
  if (gradientTimer) {
    clearTimeout(gradientTimer);
  }
  if (orbTimer) {
    clearTimeout(orbTimer);
  }
  if (introPhaseTimer) {
    clearTimeout(introPhaseTimer);
  }
  if (breathingStartTimer) {
    clearTimeout(breathingStartTimer);
  }
});
</script>

<template>
  <div class="center-stage">
    <StageShell>
      <template #visual>
        <div class="visual" :class="{ 'visual--visible': orbVisible }">
          <div class="visual-inner" :class="`phase-${breathPhase}`">
            <div class="orb-container">
              <div class="orb"></div>
            </div>
          </div>
        </div>
      </template>

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
  transition: transform 5s ease-in-out, filter 5s ease-in-out;
}

.visual-inner.phase-inhale {
  transform: scale(1.35);
  filter: drop-shadow(0 0 24.3px rgba(255, 255, 255, 0.35));
}

.visual-inner.phase-exhale {
  transform: scale(1.15);
  filter: drop-shadow(0 0 20.7px rgba(255, 255, 255, 0.35));
}



.orb-container {
  position: relative;
  width: 100%;
  height: 100%;
}


.orb {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.18) 55%,
    rgba(74, 157, 168, 0.2) 90%
  );
  backdrop-filter: blur(18px);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.35), inset 0 0 30px rgba(255, 255, 255, 0.35);
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
