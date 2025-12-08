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

// Calculate total duration and milestones
const milestones = [
  scriptConfig.scenes[0]?.dwellMs || 5000,
  scriptConfig.scenes[1]?.dwellMs || 5000,
  scriptConfig.scenes[2]?.dwellMs || 5000,
  scriptConfig.scenes[3]?.dwellMs || 5000,
];
const totalAnimationDuration = milestones.reduce((a, b) => a + b, 0); // ~20s before final text

const currentScale = ref(1.35); // Not strictly used for render anymore, but kept for logic if needed
const instruction = ref(initialInstruction);
const percentLeft = ref(135);
const hudVisible = ref(false);

let animationFrame: number;
let startTime: number | null = null;
let finished = false;

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  
  // Update text based on elapsed time milestones
  if (elapsed < milestones[0]) {
    instruction.value = initialInstruction;
  } else if (elapsed < milestones[0] + milestones[1]) {
    instruction.value = cycle1Text;
  } else if (elapsed < milestones[0] + milestones[1] + milestones[2]) {
    instruction.value = cycle3Text;
  } else {
    instruction.value = cycle5Text;
  }

  if (elapsed >= totalAnimationDuration) {
    if (!finished) {
      finished = true;
      instruction.value = finalText;
      percentLeft.value = 50; // Final resting state (0.5 scale)
      setTimeout(() => emit('complete'), finalDwellMs);
    }
    return;
  }

  // Calculate intensity (Sine wave superimposed on linear decay)
  // "Up a bit, down further"
  const progress = elapsed / totalAnimationDuration; // 0 to 1
  
  // Linear decay from 135 to 50
  const startIntensity = 135;
  const endIntensity = 50;
  const linearDecay = startIntensity - (progress * (startIntensity - endIntensity));
  
  // Oscillation
  // ~5s period (matching text changes roughly)
  // Frequency: 2PI / 5000ms
  const period = 5000;
  const phase = (elapsed / period) * Math.PI * 2;
  const oscillation = Math.sin(phase) * 10; // +/- 10 intensity points
  
  // Dampen oscillation towards the end? Maybe slightly.
  const dampen = 1 - (progress * 0.5); // 1.0 -> 0.5
  
  let currentIntensity = linearDecay + (oscillation * dampen);
  
  // Clamp
  if (currentIntensity < 50) currentIntensity = 50;
  
  percentLeft.value = Math.round(currentIntensity);
  
  animationFrame = requestAnimationFrame(animate);
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

  // Delay 1 second before starting animation to let user adjust
  window.setTimeout(() => {
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
