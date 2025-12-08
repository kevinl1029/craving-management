<template>
  <div class="release-wrapper">
    <StageShell class="release-content">
      <!-- Visual slot is empty, orb is in parent -->
      <template #visual></template>

      <template #narrative>
        <StageNarrative :title="instruction" :subtitle="subtitle">
          <p class="release-hint">
            {{ hint }}
          </p>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
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

// Get text and timing from script
const scriptConfig = onboardingScript.relief_release;
const initialInstruction = scriptConfig.scenes[0]?.lines[0]?.text || 'Now, let it go.';
const subtitle = scriptConfig.scenes[0]?.lines[1]?.text || 'Imagine the craving dissolving into nothing.';
const hint = scriptConfig.scenes[0]?.lines[2]?.text || 'Watch it break apart and fade away.';
const cycle1Text = scriptConfig.scenes[1]?.lines[0]?.text || "It's breaking apart.";
const cycle2Text = scriptConfig.scenes[2]?.lines[0]?.text || 'Fading into nothing.';
const finalText = scriptConfig.scenes[3]?.lines[0]?.text || 'Gone.';
const finalDwellMs = scriptConfig.scenes[3]?.dwellMs || 2500;

// Animation timing driven by script dwellMs
const cycleMs = scriptConfig.scenes[0]?.dwellMs || 5000;
const maxCycles = 4;

const cycleProgress = ref(0);
const currentCycle = ref(0);
const instruction = ref(initialInstruction);
const animationsStarted = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;
let animationFrame: number | null = null;
let finished = false;

const runCycle = () => {
  const cycle = currentCycle.value;
  if (cycle >= maxCycles) {
    if (!finished) {
      finished = true;
      instruction.value = finalText;
      cycleProgress.value = 1;
      setTimeout(() => emit('complete'), finalDwellMs);
    }
    return;
  }

  if (cycle === 1) {
    instruction.value = cycle1Text;
  } else if (cycle === 2) {
    instruction.value = cycle2Text;
  }

  currentCycle.value = cycle + 1;
  timer = window.setTimeout(runCycle, cycleMs);
};

const animate = () => {
  if (finished) return;
  
  // Linearly increase progress over the total duration (approx 3 cycles * cycleMs)
  // We want to reach 1.0 by the time the text says "Gone"
  const totalDuration = cycleMs * 3;
  const increment = 16 / totalDuration; // 60fps approx
  
  cycleProgress.value = Math.min(1, cycleProgress.value + increment);
  
  animationFrame = requestAnimationFrame(animate);
};

// Sync local progress to parent orb state
watch(cycleProgress, (newVal) => {
  props.orbState.mode = 'release';
  props.orbState.progress = newVal;
}, { immediate: true });

onMounted(() => {
  // Initialize orb state
  props.orbState.mode = 'release';
  props.orbState.progress = 0;
  props.orbState.opacity = 1;

  // Delay 1 second before starting to let user adjust
  window.setTimeout(() => {
    animationsStarted.value = true;
    runCycle();
    animate();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    window.clearTimeout(timer);
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.release-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.release-content {
  position: relative;
  width: 100%;
}


</style>
