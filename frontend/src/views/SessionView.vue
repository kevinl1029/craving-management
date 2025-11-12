<template>
  <section class="session">
    <StageDebugBadge v-if="stageDebugVisible" :stage-label="stageLabel" :detail="stageDetail" />

    <div v-if="currentStage === 'entry'" class="stage-container">
      <EntryStage @start-relief="startReliefStage" @explore="handleEntryExplore" />
    </div>

    <div v-else-if="currentStage === 'relief'" class="stage-container">
      <ReliefStage
        :pre-intensity="reliefRatings.before"
        @pre-intensity-selected="handlePreIntensitySelection"
        @post-intensity-selected="handlePostIntensitySelection"
        @step-change="handleReliefStepChange"
        @complete="handleReliefFlowComplete"
      />
    </div>

    <div v-else class="coming-soon">
      <div class="coming-card">
        <p class="eyebrow">next up</p>
        <h2>Reflection + Teaser flows are cooking.</h2>
        <p>
          For now we’re focused on crafting the perfect Entry and Relief experience. Restart the journey to run another craving scenario.
        </p>
        <button type="button" @click="resetToEntry">Restart</button>
      </div>
    </div>

    <ConversionModal
      v-if="showConversionModal"
      @close="closeConversionModal"
      @checkout="handleCheckout"
      @waitlist="handleWaitlist"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ConversionModal from '../components/ConversionModal.vue';
import EntryStage from '../components/onboarding/EntryStage.vue';
import ReliefStage from '../components/onboarding/relief/ReliefStage.vue';
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

const currentStage = ref<StageKey>('entry');
const sessionId = ref(crypto.randomUUID());
const sessionReady = ref(false);
const showConversionModal = ref(false);
const reliefRatings = reactive({
  before: null as number | null,
  after: null as number | null
});
const stageDetail = ref<string | null>('Prompt');
const stageDebugVisible = import.meta.env.VITE_STAGE_DEBUG !== 'false';

if (typeof route.query.stage === 'string') {
  const stageValue = route.query.stage.toLowerCase();
  if (['entry', 'relief', 'reflection', 'teaser', 'conversion'].includes(stageValue)) {
    currentStage.value = stageValue as StageKey;
  }
}

const stageLabel = computed(() => stageLabels[currentStage.value]);

watch(
  currentStage,
  (newStage) => {
    if (newStage !== 'relief') {
      stageDetail.value = newStage === 'entry' ? 'Prompt' : null;
    }
    if (newStage === 'conversion') {
      openConversionModal();
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
const conversionLogged = ref(false);

function openConversionModal() {
  showConversionModal.value = true;
  if (!conversionLogged.value) {
    conversionLogged.value = true;
    void recordConversionApi(sessionId.value, { plan: 'freedom_journey', checkoutStarted: false });
  }
}

function closeConversionModal() {
  showConversionModal.value = false;
}

function handleWaitlist() {
  if (waitlistUrl) {
    window.open(waitlistUrl, '_blank', 'noopener');
  }
  closeConversionModal();
}

function handleCheckout() {
  void recordConversionApi(sessionId.value, { plan: 'freedom_journey', checkoutStarted: true });
  if (checkoutUrl) {
    window.open(checkoutUrl, '_blank', 'noopener');
  }
  closeConversionModal();
}

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
  currentStage.value = 'reflection';
  stageDetail.value = null;
  void persistSession({ stage: 'reflection' });
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

.stage-container,
.coming-soon {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
}

.stage-container > * {
  flex: 1;
}

.coming-card {
  align-self: center;
  background: rgba(4, 31, 33, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: 2.5rem;
  max-width: 480px;
  text-align: center;
  color: #fff;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.coming-card .eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.coming-card h2 {
  margin-bottom: 0.75rem;
}

.coming-card p {
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.coming-card button {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2.4rem;
  font-weight: 600;
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.coming-card button:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .coming-card {
    padding: 2rem;
  }
}
</style>
