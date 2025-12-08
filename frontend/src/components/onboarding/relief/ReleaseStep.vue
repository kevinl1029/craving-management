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
const initialInstruction = scriptConfig.scenes[0]?.lines[0]?.text || 'Let each breath carry tension away.';
const subtitle = scriptConfig.scenes[0]?.lines[1]?.text || 'Your tension is represented by the orb — watch it disappear completely.';
const hint = scriptConfig.scenes[0]?.lines[2]?.text || 'Watch it break apart and fade away.';

const textSequence = [
  initialInstruction,
  scriptConfig.scenes[1]?.lines[0]?.text || 'Feel gravity drawing it down.',
  scriptConfig.scenes[2]?.lines[0]?.text || 'Every exhale releases more.',
  scriptConfig.scenes[3]?.lines[0]?.text || "You're lighter now.",
];

const finalText = scriptConfig.scenes[4]?.lines[0]?.text || 'All tension has fallen away.';
const finalDwellMs = scriptConfig.scenes[4]?.dwellMs || 7200;

// Calculate milestones for text transitions
const milestones = [
  scriptConfig.scenes[0]?.dwellMs || 3000,
  scriptConfig.scenes[1]?.dwellMs || 6000,
  scriptConfig.scenes[2]?.dwellMs || 6000,
  scriptConfig.scenes[3]?.dwellMs || 6000,
];
const totalAnimationDuration = milestones.reduce((a, b) => a + b, 0);

const cycleProgress = ref(0);
const instruction = ref(initialInstruction);
const animationsStarted = ref(false);

let animationFrame: number;
let startTime: number | null = null;
let finished = false;

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  // Update text based on elapsed time milestones
  let cumulativeTime = 0;
  let currentTextIndex = 0;
  
  for (let i = 0; i < milestones.length; i++) {
    cumulativeTime += milestones[i];
    if (elapsed < cumulativeTime) {
      currentTextIndex = i;
      break;
    }
    // If we passed the last milestone, we remain on the last index until total duration check
    currentTextIndex = i; 
  }
  
  if (currentTextIndex < textSequence.length) {
    instruction.value = textSequence[currentTextIndex];
  }

  if (elapsed >= totalAnimationDuration) {
    if (!finished) {
      finished = true;
      instruction.value = finalText;
      cycleProgress.value = 1;
      setTimeout(() => emit('complete'), finalDwellMs);
    }
    return;
  }

  // Linear progress
  cycleProgress.value = Math.min(1, elapsed / totalAnimationDuration);
  
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
    requestAnimationFrame(animate);
  }, 1000);
});

onBeforeUnmount(() => {
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
