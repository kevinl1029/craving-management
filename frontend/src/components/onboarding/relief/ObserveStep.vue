<template>
  <div class="observe-wrapper">
    <div class="observe-hud" :class="{ 'observe-hud--visible': hudVisible }">
      <span class="observe-hud-label">craving intensity</span>
      <span class="observe-hud-value">{{ percentLeft }}%</span>
    </div>

    <StageShell class="observe-content">
      <!-- Visual slot is empty, orb is in parent -->
      <template #visual></template>

      <template #narrative>
        <StageNarrative :title="instruction" :subtitle="subtitle">
          <p class="observe-hint">
            {{ hint }}
          </p>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
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
const scriptConfig = onboardingScript.relief_observe;
const initialInstruction = scriptConfig.scenes[0]?.lines[0]?.text || 'Watch the craving swell and then settle…';
const subtitle = scriptConfig.scenes[0]?.lines[1]?.text || 'Let it swell, peak, and ease back down. Notice how the wave is smaller than when you started.';
const hint = scriptConfig.scenes[0]?.lines[2]?.text || 'Keep your attention on the wave losing power.';
const cycle1Text = scriptConfig.scenes[1]?.lines[0]?.text || 'See how each wave lands smaller than the last.';
const cycle3Text = scriptConfig.scenes[2]?.lines[0]?.text || "You're just watching it lose power.";
const cycle5Text = scriptConfig.scenes[3]?.lines[0]?.text || "Now it's almost gone.";
const finalText = scriptConfig.scenes[4]?.lines[0]?.text || 'Notice how small and quiet it is now.';
const finalDwellMs = scriptConfig.scenes[4]?.dwellMs || 2500;

// Animation timing driven by script dwellMs (controls both text display and wave cycles)
const cycleMs = scriptConfig.scenes[0]?.dwellMs || 5000;
const maxCycles = 6;
const startingBaseScale = 1.35;
const endingBaseScale = 0.5;
const initialAmplitude = 0.35;
const bobPixels = 6;

const currentScale = ref(startingBaseScale);
const currentOffset = ref(0);
const currentCycle = ref(0);
const instruction = ref(initialInstruction);
const percentLeft = ref(135);
const animationsStarted = ref(false);
const hudVisible = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;
let finished = false;

const getBaseScaleForCycle = (cycle: number) => {
  if (cycle >= maxCycles) return endingBaseScale;
  const t = cycle / (maxCycles - 1);
  return startingBaseScale + t * (endingBaseScale - startingBaseScale);
};

const runCycle = () => {
  const cycle = currentCycle.value;
  if (cycle >= maxCycles) {
    if (!finished) {
      finished = true;
      instruction.value = finalText;
      currentScale.value = endingBaseScale;
      currentOffset.value = 0;
      percentLeft.value = Math.round(endingBaseScale * 100);
      setTimeout(() => emit('complete'), finalDwellMs);
    }
    return;
  }

  const baseScale = getBaseScaleForCycle(cycle);
  const amplitudeDecay = Math.pow(0.8, cycle);
  const thisAmplitude = initialAmplitude * amplitudeDecay;

  percentLeft.value = Math.round(baseScale * 100);

  currentScale.value = baseScale;
  currentOffset.value = 0;

  window.setTimeout(() => {
    currentScale.value = baseScale - thisAmplitude;
    currentOffset.value = bobPixels * amplitudeDecay;
  }, cycleMs / 2);

  if (cycle === 1) {
    instruction.value = cycle1Text;
  } else if (cycle === 3) {
    instruction.value = cycle3Text;
  } else if (cycle === 5) {
    instruction.value = cycle5Text;
  }

  currentCycle.value = cycle + 1;
  timer = window.setTimeout(runCycle, cycleMs);
};

// Sync local percentLeft to parent orb state
watch(percentLeft, (newVal) => {
  props.orbState.mode = 'observe';
  props.orbState.intensity = newVal;
}, { immediate: true });

onMounted(() => {
  // Initialize orb state
  props.orbState.mode = 'observe';
  props.orbState.intensity = 135;
  props.orbState.opacity = 1;

  // Fade in HUD after a brief delay
  window.setTimeout(() => {
    hudVisible.value = true;
  }, 200);

  // Delay 1 second before starting pulsing to let user adjust
  window.setTimeout(() => {
    animationsStarted.value = true;
    runCycle();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    window.clearTimeout(timer);
  }
});
</script>

<style scoped>
.observe-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.observe-content {
  position: relative;
  width: 100%;
}

.observe-orb-layer {
  position: relative;
  width: var(--visual-size);
  height: var(--visual-size);
}

.observe-hint {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.observe-hud {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(2, 25, 27, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 20;
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 800ms ease-out;
}

.observe-hud--visible {
  opacity: 1;
}

.observe-hud-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.45);
}

.observe-hud-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}
</style>
