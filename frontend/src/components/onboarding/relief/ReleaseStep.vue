<template>
  <div class="release-wrapper">
    <div :style="bgStyle"></div>

    <StageShell class="release-content">
      <template #visual>
        <div class="release-visual">
          <div class="release-orb-wrapper" v-if="orbOpacity > 0.02">
            <div :style="orbStyle"></div>
            <div
              v-for="r in ripples"
              :key="r.id"
              class="release-ripple"
              :style="getRippleStyle(r)"
            ></div>
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
          eyebrow="release"
          :title="instruction"
          subtitle="Your tension is represented by the orb — watch it disappear completely."
        />
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

type Ripple = { id: number; scale: number };
type Particle = { id: number; x: number; size: number; dur: number };

const cycleMs = 3000;
const totalCycles = 8;

const ripples = ref<Ripple[]>([]);
const particles = ref<Particle[]>([]);
const instruction = ref('Let each breath carry tension away.');
const cycleProgress = ref(0);

let timerRef: ReturnType<typeof setTimeout> | null = null;
let rippleId = 0;
let particleId = 0;
let completed = false;

const bgStyle = computed(() => ({
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle at top, #104e54 0%, #041f21 100%)',
  transition: 'filter 2s ease',
  filter: `brightness(${1 + cycleProgress.value * 0.12})`
}));

const orbScale = computed(() => {
  const start = 0.55;
  const end = 0;
  return start + (end - start) * cycleProgress.value;
});

const orbOpacity = computed(() => 1 - cycleProgress.value);

const orbLayerStyle = computed(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '13rem',
  height: '13rem',
  transform: `translate(-50%, -50%) scale(${orbScale.value})`,
  opacity: orbOpacity.value,
  transition: 'transform 2s ease, opacity 2s ease',
  zIndex: 10
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

const getRippleStyle = (r: Ripple) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: '9999px',
  border: '1px solid rgba(255,255,255,0.35)',
  pointerEvents: 'none',
  animation: 'ripple 1.5s ease-out forwards',
  '--ripple-scale': r.scale
});

const getParticleStyle = (p: Particle) => ({
  position: 'absolute',
  top: '48%',
  left: `calc(50% + ${p.x}px)`,
  width: `${p.size}px`,
  height: `${p.size}px`,
  background: 'rgba(236,252,255,0.7)',
  borderRadius: '9999px',
  animationName: 'particle-fall',
  animationTimingFunction: 'ease-out',
  animationDuration: `${p.dur}ms`,
  zIndex: 5,
  pointerEvents: 'none'
});

const addRipple = (scale = 1.5) => {
  const id = rippleId++;
  ripples.value.push({ id, scale });
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id);
  }, 1600);
};

const addParticles = (count = 5) => {
  for (let i = 0; i < count; i++) {
    const id = particleId++;
    const x = (Math.random() - 0.5) * 80;
    const size = 2.5 + Math.random() * 2;
    const dur = 1800 + Math.random() * 900;
    particles.value.push({ id, x, size, dur });
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
      setTimeout(() => emit('complete'), 1200);
    }
    return;
  }

  addRipple(1.5 + next * 0.05);
  addParticles(6 + next);
  cycleProgress.value = next / totalCycles;

  if (next === 2) instruction.value = 'Feel gravity drawing it down.';
  if (next === 4) instruction.value = 'Every exhale releases more.';
  if (next === 6) instruction.value = 'You’re lighter now.';
  if (next === 8) instruction.value = 'All tension has fallen away.';

  timerRef = setTimeout(() => runCycle(next), cycleMs);
};

onMounted(() => {
  runCycle(0);
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
  background: none;
}

.release-content {
  position: relative;
  z-index: 2;
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
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(var(--ripple-scale, 1.5)) translateY(35px);
    opacity: 0;
  }
}

@keyframes particle-fall {
  0% {
    transform: translateY(0px);
    opacity: 0.8;
  }
  100% {
    transform: translateY(160px);
    opacity: 0;
  }
}
</style>
