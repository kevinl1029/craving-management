<template>
  <div class="release-wrapper">
    <StageShell class="release-content">
      <template #visual>
        <div class="release-visual">
          <div class="release-orb-wrapper" v-if="orbOpacity > 0.02" :style="orbWrapperStyle">
            <div :style="orbStyle"></div>
          </div>

          <div
            v-for="p in particles"
            :key="p.id"
            class="particle-fall"
            :style="getParticleStyle(p)"
          ></div>
        </div>
      </template>

      <template #narrative>
        <StageNarrative
          :title="instruction"
          :subtitle="subtitle"
        />
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';
import { onboardingScript } from '../../../scripts/onboardingScript';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

type Particle = {
  id: number;
  x: number;
  y: number;
  endX: number;
  endY: number;
  size: number;
  dur: number;
  opacity: number;
  active: boolean;
};

// Get text and timing from script
const scriptConfig = onboardingScript.relief_release;
const initialInstruction = scriptConfig.scenes[0]?.lines[0]?.text || 'Let each breath carry tension away.';
const subtitle = scriptConfig.scenes[0]?.lines[1]?.text || 'Your tension is represented by the orb — watch it disappear completely.';
const cycle2Text = scriptConfig.scenes[1]?.lines[0]?.text || 'Feel gravity drawing it down.';
const cycle4Text = scriptConfig.scenes[2]?.lines[0]?.text || 'Every exhale releases more.';
const cycle6Text = scriptConfig.scenes[3]?.lines[0]?.text || "You're lighter now.";
const cycle8Text = scriptConfig.scenes[4]?.lines[0]?.text || 'All tension has fallen away.';
const finalDwellMs = scriptConfig.scenes[4]?.dwellMs || 7200;

// Animation timing driven by script dwellMs (controls both text display and particle release cycles)
const cycleMs = scriptConfig.scenes[0]?.dwellMs || 3000;
const totalCycles = 8;

const particles = ref<Particle[]>([]);
const instruction = ref(initialInstruction);
const cycleProgress = ref(0);
const animationsStarted = ref(false);

let timerRef: ReturnType<typeof setTimeout> | null = null;
let particleId = 0;
let completed = false;

// Approximate visual size in pixels (midpoint of clamp range)
const VISUAL_SIZE_PX = 240; // clamp(12rem, 40vw, 18rem) ≈ 15rem = 240px

const orbScale = computed(() => {
  const start = 0.5;
  const end = 0;
  return start + (end - start) * cycleProgress.value;
});

const orbOpacity = computed(() => 1 - cycleProgress.value);

const orbWrapperStyle = computed(() => ({
  transform: `scale(${orbScale.value})`,
  opacity: orbOpacity.value,
  filter: `drop-shadow(0 0 ${18 * orbScale.value}px rgba(255, 255, 255, 0.35))`,
  transition: animationsStarted.value ? 'transform 2s ease, opacity 2s ease, filter 2s ease' : 'none'
}));

const orbStyle = computed(() => ({
  position: 'absolute',
  inset: 0,
  borderRadius: '9999px',
  background:
    'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.18) 55%, rgba(74,157,168,0.2) 90%)',
  backdropFilter: 'blur(18px)',
  boxShadow: '0 0 40px rgba(255,255,255,0.35), inset 0 0 30px rgba(255,255,255,0.35)'
}));

const getParticleStyle = (p: Particle) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: `${p.size}px`,
  height: `${p.size}px`,
  background: `rgba(236, 252, 255, ${p.opacity})`,
  borderRadius: '9999px',
  transform: `translate(${p.x}px, ${p.y}px)`,
  opacity: p.active ? 0 : p.opacity,
  transition: `transform ${p.dur}ms ease-out, opacity ${p.dur}ms linear`,
  zIndex: 5,
  pointerEvents: 'none'
});

const addParticles = (count: number) => {
  const currentRadius = (VISUAL_SIZE_PX / 2) * orbScale.value;

  for (let i = 0; i < count; i++) {
    const id = particleId++;

    // Random angle around orb circumference
    const angle = Math.random() * Math.PI * 2;

    // Start position: on orb edge
    const startX = Math.cos(angle) * currentRadius;
    const startY = Math.sin(angle) * currentRadius;

    // Initial velocity components
    const speedMultiplier = 0.2 + Math.random() * 0.8; // Vary particle speeds
    const velocityX = Math.cos(angle) * speedMultiplier * 120; // px/s outward
    const velocityY = -20 + Math.random() * 30; // Slightly upward to downward

    // Physics calculation
    const dur = 1500 + Math.random() * 800; // ms
    const t = dur / 1000; // Convert to seconds
    const gravity = 280; // px/s²

    const endX = startX + velocityX * t;
    const endY = startY + velocityY * t + 0.5 * gravity * t * t; // Parabolic arc

    // Particle properties
    const size = 2 + Math.random() * 4; // 2-6px
    const opacity = 0.6 + Math.random() * 0.2; // 0.6-0.8

    // Initialize at start position
    particles.value.push({ id, x: startX, y: startY, endX, endY, size, dur, opacity, active: false });

    // Trigger animation after browser paint (double rAF ensures initial state is painted)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const particle = particles.value.find((p) => p.id === id);
        if (particle) {
          particle.x = endX;
          particle.y = endY;
          particle.active = true;
        }
      });
    });

    setTimeout(() => {
      particles.value = particles.value.filter((p) => p.id !== id);
    }, dur);
  }
};

const runCycle = (current = 0) => {
  const next = current + 1;
  if (next > totalCycles) {
    if (!completed) {
      completed = true;
      // The final cycle has already run for cycleMs, so we subtract that from finalDwellMs
      const remainingTime = Math.max(0, finalDwellMs - cycleMs);
      setTimeout(() => emit('complete'), remainingTime);
    }
    return;
  }

  // Increase particle count as orb shrinks (creates "frantic" dissolution effect)
  const particleCount = 8 + next * 2; // 10, 12, 14, 16, 18, 20, 22, 24
  addParticles(particleCount);
  cycleProgress.value = next / totalCycles;

  if (next === 2) instruction.value = cycle2Text;
  if (next === 4) instruction.value = cycle4Text;
  if (next === 6) instruction.value = cycle6Text;
  if (next === 8) instruction.value = cycle8Text;

  timerRef = setTimeout(() => runCycle(next), cycleMs);
};

onMounted(() => {
  // Brief delay before enabling transitions and starting fade
  window.setTimeout(() => {
    animationsStarted.value = true;
    runCycle(0);
  }, 100);
});

onBeforeUnmount(() => {
  if (timerRef) clearTimeout(timerRef);
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

.release-visual {
  position: relative;
  width: var(--visual-size);
  height: var(--visual-size);
}

.release-orb-wrapper {
  position: absolute;
  inset: 0;
}
</style>
