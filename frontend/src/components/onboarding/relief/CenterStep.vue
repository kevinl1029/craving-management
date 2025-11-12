<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const breathPhase = ref<'inhale' | 'exhale'>('inhale');
const breathCycle = ref(0);
const waves = ref<Array<{ id: number }>>([]);
const isComplete = ref(false);
const introPhase = ref<'preface' | 'breathe'>('preface');
const gradientVisible = ref(false);
const introTextVisible = ref(false);
const orbVisible = ref(false);

let waveIdCounter = 0;
let phaseTimer: ReturnType<typeof setTimeout> | null = null;
let waveInterval: ReturnType<typeof setInterval> | null = null;
let introTimer: ReturnType<typeof setTimeout> | null = null;
let gradientTimer: ReturnType<typeof setTimeout> | null = null;
let orbTimer: ReturnType<typeof setTimeout> | null = null;
let introPhaseTimer: ReturnType<typeof setTimeout> | null = null;
let breathingStartTimer: ReturnType<typeof setTimeout> | null = null;

const runBreathingCycle = () => {
  if (breathCycle.value >= 3) {
    if (!isComplete.value) {
      isComplete.value = true;
      setTimeout(() => emit('complete'), 1200);
    }
    return;
  }

  const phaseDurations: Record<typeof breathPhase.value, number> = {
    inhale: 5000,
    exhale: 5000
  };

  phaseTimer = setTimeout(() => {
    if (breathPhase.value === 'inhale') {
      breathPhase.value = 'exhale';
    } else {
      breathPhase.value = 'inhale';
      breathCycle.value++;
    }
  }, phaseDurations[breathPhase.value]);
};

watch([breathPhase, breathCycle], () => {
  if (phaseTimer) {
    clearTimeout(phaseTimer);
  }
  runBreathingCycle();
});

const createWave = () => {
  const wave = { id: waveIdCounter++ };
  waves.value.push(wave);

  setTimeout(() => {
    waves.value = waves.value.filter((w) => w.id !== wave.id);
  }, 3000);
};

const getInstructionText = () => {
  switch (breathPhase.value) {
    case 'inhale':
      return 'Breathe in…';
    case 'exhale':
      return 'Breathe out…';
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
  }, 5200);

  breathingStartTimer = setTimeout(() => {
    runBreathingCycle();
    createWave();
    waveInterval = setInterval(createWave, 1400);
  }, 5200);
});

onUnmounted(() => {
  if (phaseTimer) {
    clearTimeout(phaseTimer);
  }
  if (waveInterval) {
    clearInterval(waveInterval);
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
    <div class="background-base"></div>

    <StageShell>
      <template #visual>
        <div class="visual" :class="{ 'visual--visible': orbVisible }">
          <div class="visual-inner" :class="`phase-${breathPhase}`">
            <div class="waves-container">
              <div v-for="wave in waves" :key="wave.id" class="wave-ring"></div>
            </div>

            <div class="orb-container">
              <div class="orb">
                <div class="orb-glow"></div>
                <div class="orb-core"></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #narrative>
        <StageNarrative>
          <div class="instruction-container" :class="{ 'instruction-container--visible': introTextVisible }">
            <transition name="instruction-fade" mode="out-in">
              <p :key="introPhase" class="instruction-text">
                {{ introPhase === 'preface' ? "Let's start with one slow breathing reset." : getInstructionText() }}
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
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
}


.background-base,
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-base {
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
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
  transition: transform 5s ease-in-out;
}

.visual-inner.phase-inhale {
  transform: scale(1.05);
}

.visual-inner.phase-exhale {
  transform: scale(0.95);
}


.wave-ring {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transform: scale(0.35);
  transform-origin: center;
  animation: wave-expand 3s ease-out forwards;
}

@keyframes wave-expand {
  0% {
    transform: scale(0.35);
    opacity: 1;
    border-width: 2px;
  }
  60% {
    transform: scale(0.85);
    opacity: 0.4;
    border-width: 1px;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
    border-width: 0.5px;
  }
}

.orb-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.waves-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}


.orb-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
}

.orb-core {
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.3) 70%);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
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
}

.orb {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-inner.phase-inhale {
  transform: scale(1.05);
}

.visual-inner.phase-exhale {
  transform: scale(0.95);
}

.waves-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
