<template>
  <div class="relief-shell">
    <!-- Persistent Orb Background -->
    <div class="relief-background">
      <div class="orb-wrapper">
        <CravingOrb
          :mode="orbState.mode"
          :phase="orbState.phase"
          :intensity="orbState.intensity"
          :progress="orbState.progress"
          :opacity="orbState.opacity"
        />
      </div>
    </div>

    <div class="relief-content">
      <CheckInStep
        v-if="currentStep === 'pre-intensity'"
        stage-id="relief_pre_intensity"
        eyebrow-label="before we begin"
        confirmation-text="Got it — starting at {value}. Let's begin."
        @selected="handlePreIntensity"
      />

      <CenterStep 
        v-else-if="currentStep === 'center'" 
        :orb-state="orbState"
        @complete="advanceFrom('center')" 
      />
      <ObserveStep 
        v-else-if="currentStep === 'observe'" 
        :orb-state="orbState"
        @complete="advanceFrom('observe')" 
      />
      <ReleaseStep 
        v-else-if="currentStep === 'release'" 
        :orb-state="orbState"
        @complete="advanceFrom('release')" 
      />
      <CognitiveReframeStep
        v-else-if="currentStep === 'reframe'"
        @complete="advanceFrom('reframe')"
      />
      <CheckInStep
        v-else-if="currentStep === 'checkin'"
        stage-id="relief_checkin"
        eyebrow-label="check-in"
        confirmation-text="Got it — logging {value}. Calm you created yourself."
        @selected="handlePostIntensity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import CenterStep from './CenterStep.vue';
import ObserveStep from './ObserveStep.vue';
import ReleaseStep from './ReleaseStep.vue';
import CognitiveReframeStep from './CognitiveReframeStep.vue';
import CheckInStep from './CheckInStep.vue';
import CravingOrb from '../../visuals/CravingOrb.vue';
import type { OrbState } from '../../../types/OrbState';

const props = defineProps<{
  preIntensity: number | null;
  initialStep?: ReliefStageState | null;
}>();

const emit = defineEmits<{
  (e: 'pre-intensity-selected', value: number): void;
  (e: 'post-intensity-selected', value: number): void;
  (e: 'step-change', value: ReliefStageState): void;
  (e: 'complete'): void;
}>();

type ReliefStepKey = 'center' | 'observe' | 'release' | 'reframe' | 'checkin';
type ReliefStageState = ReliefStepKey | 'pre-intensity';

// Shared Orb State
const orbState = reactive<OrbState>({
  mode: 'idle',
  phase: 'exhale',
  intensity: 100,
  progress: 0,
  opacity: 0 // Start invisible for fade-in
});

// Determine initial step: use initialStep if provided, otherwise use preIntensity logic
const getInitialStep = (): ReliefStageState => {
  if (props.initialStep) {
    return props.initialStep;
  }
  return props.preIntensity == null ? 'pre-intensity' : 'center';
};

const currentStep = ref<ReliefStageState>(getInitialStep());

watch(
  () => props.preIntensity,
  (value) => {
    if (value != null && currentStep.value === 'pre-intensity') {
      currentStep.value = 'center';
    }
  }
);

const advanceFrom = (step: ReliefStepKey) => {
  switch (step) {
    case 'center':
      currentStep.value = 'observe';
      break;
    case 'observe':
      currentStep.value = 'release';
      break;
    case 'release':
      currentStep.value = 'reframe';
      break;
    case 'reframe':
      currentStep.value = 'checkin';
      break;
    case 'checkin':
      emit('complete');
      break;
  }
};

watch(
  currentStep,
  (value) => {
    emit('step-change', value);
  },
  { immediate: true }
);

const handlePreIntensity = (value: number) => {
  emit('pre-intensity-selected', value);
  window.setTimeout(() => {
    currentStep.value = 'center';
  }, 1000);
};

const handlePostIntensity = (value: number) => {
  emit('post-intensity-selected', value);
  advanceFrom('checkin');
};
</script>

<style scoped>
.relief-shell {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.relief-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orb-wrapper {
  /* Match the visual size/positioning of StageShell to align the orb */
  /* StageShell grid top row is minmax(var(--visual-size), 50vh) */
  /* We want the orb centered in that top area */
  width: 100%;
  height: 50vh; /* Approximate alignment with StageShell top row */
  min-height: clamp(12rem, 40vw, 18rem);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(1.5rem, 4vw, 3rem); /* Match StageShell padding-top */
}

.relief-content {
  position: relative;
  z-index: 1;
  height: 100%;
}
</style>
