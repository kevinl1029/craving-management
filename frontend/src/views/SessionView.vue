<template>
  <section class="session">
    <StageDebugBadge v-if="stageDebugVisible" :stage-label="stageLabel" :detail="stageDetail" />

    <div v-if="currentStage === 'entry'" class="stage-container">
      <EntryStage @start-relief="startReliefStage" @explore="handleEntryExplore" />
    </div>

    <div v-else-if="currentStage === 'relief'" class="stage-container">
      <ReliefStage
        :pre-intensity="reliefRatings.before"
        :initial-step="initialReliefStep"
        @pre-intensity-selected="handlePreIntensitySelection"
        @post-intensity-selected="handlePostIntensitySelection"
        @step-change="handleReliefStepChange"
        @complete="handleReliefFlowComplete"
      />
    </div>

    <div v-else-if="currentStage === 'reflection'" class="stage-container">
      <ReflectionStage @complete="handleReflectionComplete" @cta="handleStageCta" />
    </div>

    <div v-else-if="currentStage === 'teaser'" class="stage-container">
      <TeaserStage @complete="handleTeaserComplete" @cta="handleStageCta" />
    </div>

    <div v-else-if="currentStage === 'conversion'" class="stage-container">
      <ConversionStage @complete="handleConversionComplete" @cta="handleConversionCta" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EntryStage from '../components/onboarding/EntryStage.vue';
import ReliefStage from '../components/onboarding/relief/ReliefStage.vue';
import ReflectionStage from '../components/onboarding/ReflectionStage.vue';
import TeaserStage from '../components/onboarding/TeaserStage.vue';
import ConversionStage from '../components/onboarding/ConversionStage.vue';
import StageDebugBadge from '../components/onboarding/StageDebugBadge.vue';
import type { StageKey } from '../lib/stages';
import { stageLabels } from '../lib/stages';
import {
  createSession as createSessionApi,
  updateSession as updateSessionApi,
  type UpdateSessionPayload,
  recordConversion as recordConversionApi
} from '../services/sessionService';

type ReliefFlowStep = 'pre-intensity' | 'center' | 'observe' | 'release' | 'reframe' | 'checkin';

const reliefStepLabels: Record<ReliefFlowStep, string> = {
  'pre-intensity': 'Before Rating',
  center: 'Center',
  observe: 'Observe',
  release: 'Release',
  reframe: 'Reframe',
  checkin: 'Check-in'
};

const route = useRoute();
const router = useRouter();

const currentStage = ref<StageKey>('entry');
const sessionId = ref(crypto.randomUUID());
const sessionReady = ref(false);
const reliefRatings = reactive({
  before: null as number | null,
  after: null as number | null
});
const stageDetail = ref<string | null>('Prompt');
const stageDebugVisible = import.meta.env.VITE_STAGE_DEBUG !== 'false';
const initialReliefStep = ref<ReliefFlowStep | null>(null);

if (typeof route.query.stage === 'string') {
  const stageValue = route.query.stage.toLowerCase();
  if (['entry', 'relief', 'reflection', 'teaser', 'conversion'].includes(stageValue)) {
    currentStage.value = stageValue as StageKey;
  }
}

// Parse step query parameter for relief stage
if (typeof route.query.step === 'string') {
  const stepValue = route.query.step.toLowerCase();
  const validSteps: ReliefFlowStep[] = ['pre-intensity', 'center', 'observe', 'release', 'reframe', 'checkin'];
  if (validSteps.includes(stepValue as ReliefFlowStep)) {
    initialReliefStep.value = stepValue as ReliefFlowStep;
    // If step is specified, automatically set stage to relief
    currentStage.value = 'relief';
    // Set appropriate stage detail label
    stageDetail.value = reliefStepLabels[stepValue as ReliefFlowStep];
  }
}

const stageLabel = computed(() => stageLabels[currentStage.value]);

watch(
  currentStage,
  (newStage) => {
    if (newStage !== 'relief') {
      stageDetail.value = newStage === 'entry' ? 'Prompt' : null;
    }
  },
  { immediate: true }
);

onMounted(() => {
  bootstrapSession().catch((error) => {
    console.warn('Failed to bootstrap session', error);
    sessionReady.value = true;
  });
});

async function bootstrapSession() {
  const response = await createSessionApi(currentStage.value);
  sessionId.value = response.sessionId;
  sessionReady.value = true;

  if (response.persisted) {
    console.info('Session persisted in Supabase');
  }

  void persistSession({ stage: currentStage.value });
}

async function persistSession(payload: UpdateSessionPayload) {
  if (!sessionReady.value) return;
  await updateSessionApi(sessionId.value, payload);
}

const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL;
const waitlistUrl = import.meta.env.VITE_WAITLIST_URL;

function setBeforeIntensity(value: number) {
  reliefRatings.before = value;
  void persistSession({ intensityBefore: value, stage: currentStage.value });
}

function setAfterIntensity(value: number) {
  reliefRatings.after = value;
  void persistSession({ intensityAfter: value, stage: currentStage.value });
}

function handlePreIntensitySelection(value: number) {
  setBeforeIntensity(value);
}

function handlePostIntensitySelection(value: number) {
  setAfterIntensity(value);
}

function handleReliefStepChange(step: ReliefFlowStep | 'pre-intensity') {
  stageDetail.value = reliefStepLabels[step];
}

function startReliefStage() {
  reliefRatings.before = null;
  reliefRatings.after = null;
  stageDetail.value = reliefStepLabels['pre-intensity'];
  currentStage.value = 'relief';
  void persistSession({ stage: 'relief' });
}

function handleEntryExplore() {
  // Explore path skips directly to teaser (bypasses relief and reflection)
  currentStage.value = 'teaser';
  stageDetail.value = null;
  void persistSession({ stage: 'teaser' });
}

function handleReliefFlowComplete() {
  currentStage.value = 'reflection';
  stageDetail.value = null;
  void persistSession({
    stage: 'reflection',
    intensityBefore: reliefRatings.before ?? undefined,
    intensityAfter: reliefRatings.after ?? undefined
  });
}

function handleReflectionComplete() {
  currentStage.value = 'teaser';
  stageDetail.value = null;
  void persistSession({ stage: 'teaser' });
}

function handleTeaserComplete() {
  currentStage.value = 'conversion';
  stageDetail.value = null;
  void persistSession({ stage: 'conversion' });
}

function handleConversionComplete() {
  // Conversion stage completion - currently just logs
  console.log('[SessionView] Conversion stage completed');
}

function handleStageCta(payload: { stageId: string; sceneId: string; ctaId: string }) {
  // Generic CTA handler for reflection and teaser stages
  console.log('[SessionView] CTA clicked:', payload);
}

function handleConversionCta(payload: { stageId: string; sceneId: string; ctaId: string }) {
  console.log('[SessionView] Conversion CTA clicked:', payload);

  // Record conversion event
  void recordConversionApi(sessionId.value, {
    plan: 'freedom_journey',
    checkoutStarted: payload.ctaId === 'conversion_start_journey'
  });

  // Handle different conversion CTAs
  if (payload.ctaId === 'conversion_start_journey') {
    router.push('/convert'); // Redirect to the new intermediary page
  } else if (payload.ctaId === 'conversion_try_lesson') {
    // TODO: Route to free lesson preview when available
    // Currently disabled for market validation phase
    console.log('[SessionView] Free lesson preview - coming soon');
  }
}

function resetToEntry() {
  currentStage.value = 'entry';
  stageDetail.value = 'Prompt';
  reliefRatings.before = null;
  reliefRatings.after = null;
  void persistSession({ stage: 'entry' });
}
</script>

<style scoped>
.session {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  color: #ffffff;
}

.stage-container {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
}

.stage-container > * {
  flex: 1;
}
</style>
