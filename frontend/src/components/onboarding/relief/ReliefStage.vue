<template>
  <div class="relief-shell">
    <CheckInStep
      v-if="currentStep === 'pre-intensity'"
      stage-id="relief_pre_intensity"
      eyebrow-label="before we begin"
      confirmation-text="Got it — starting at {value}. Let's begin."
      @selected="handlePreIntensity"
    />

    <CenterStep v-else-if="currentStep === 'center'" @complete="advanceFrom('center')" />
    <ObserveStep v-else-if="currentStep === 'observe'" @complete="advanceFrom('observe')" />
    <ReleaseStep v-else-if="currentStep === 'release'" @complete="advanceFrom('release')" />
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CenterStep from './CenterStep.vue';
import ObserveStep from './ObserveStep.vue';
import ReleaseStep from './ReleaseStep.vue';
import CognitiveReframeStep from './CognitiveReframeStep.vue';
import CheckInStep from './CheckInStep.vue';

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
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
