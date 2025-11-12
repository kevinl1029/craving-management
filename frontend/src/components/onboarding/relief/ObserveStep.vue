<template>
  <div class="observe-wrapper">
    <div class="observe-bg"></div>

    <div class="observe-hud">
      <span class="observe-hud-label">craving intensity</span>
      <span class="observe-hud-value">{{ percentLeft }}%</span>
    </div>

    <StageShell class="observe-content">
      <template #visual>
        <div
          class="observe-orb-layer"
          :style="{
            transform: `translateY(${currentOffset}px) scale(${currentScale})`,
            transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), filter 1.5s ease-out',
            filter: `drop-shadow(0 0 ${18 * currentScale}px rgba(255, 255, 255, 0.35))`
          }"
        >
          <div class="observe-orb"></div>
          <div
            v-for="r in activeRipples"
            :key="r.id"
            class="observe-ripple"
            :style="{ '--ripple-scale': r.scale }"
          ></div>
        </div>
      </template>

      <template #narrative>
        <StageNarrative :title="instruction" subtitle="Let it swell, peak, and ease back down. Notice how the wave is smaller than when you started.">
          <p class="observe-hint">
            Keep your attention on the wave losing power.
          </p>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

const cycleMs = 3000;
const maxCycles = 10;
const startingBaseScale = 1;
const endingBaseScale = 0.5;
const initialAmplitude = 0.35;
const bobPixels = 6;

type Ripple = {
  id: number;
  scale: number;
};

const currentScale = ref(startingBaseScale);
const currentOffset = ref(0);
const currentCycle = ref(0);
const instruction = ref('Watch the craving swell and then settle…');
const activeRipples = ref<Ripple[]>([]);
const percentLeft = ref(100);

let timer: ReturnType<typeof setTimeout> | null = null;
let rippleId = 0;
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
      instruction.value = 'Notice how small and quiet it is now.';
      currentScale.value = endingBaseScale;
      currentOffset.value = 0;
      percentLeft.value = Math.round(endingBaseScale * 100);
      setTimeout(() => emit('complete'), 1500);
    }
    return;
  }

  const baseScale = getBaseScaleForCycle(cycle);
  const amplitudeDecay = Math.pow(0.8, cycle);
  const thisAmplitude = initialAmplitude * amplitudeDecay;

  percentLeft.value = Math.round(baseScale * 100);

  currentScale.value = baseScale + thisAmplitude;
  currentOffset.value = -bobPixels * amplitudeDecay;

  const thisRippleId = rippleId++;
  activeRipples.value.push({
    id: thisRippleId,
    scale: 1.4 + 0.4 * amplitudeDecay
  });

  window.setTimeout(() => {
    activeRipples.value = activeRipples.value.filter((r) => r.id !== thisRippleId);
  }, 1500);

  window.setTimeout(() => {
    currentScale.value = baseScale;
    currentOffset.value = 0;
  }, cycleMs / 2);

  if (cycle === 2) {
    instruction.value = 'See how each wave lands smaller than the last.';
  } else if (cycle === 5) {
    instruction.value = 'You’re just watching it lose power.';
  } else if (cycle === 8) {
    instruction.value = 'Now it’s almost gone.';
  }

  currentCycle.value = cycle + 1;
  timer = window.setTimeout(runCycle, cycleMs);
};

onMounted(() => {
  runCycle();
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
  background: none;
}

.observe-bg {
  position: absolute;
  inset: 0;
  background: none;
}

.observe-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.observe-orb-layer {
  position: relative;
  width: var(--visual-size);
  height: var(--visual-size);
}

.observe-orb-inner {
  position: absolute;
  width: 100%;
  height: 100%;
}
.observe-orb {
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

.observe-ripple {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  pointer-events: none;
  animation: ripple 1.5s ease-out forwards;
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

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.85;
  }
  100% {
    transform: scale(var(--ripple-scale, 1.5));
    opacity: 0;
  }
}
</style>
