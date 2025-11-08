<template>
  <section class="session">
    <StageProgress :active-stage="currentStage" />

    <ReliefIntensityCard
      v-if="showBeforePrompt"
      title="Before we start, how strong is it?"
      subtitle="Use the slider to rate your craving from 1 (barely there) to 10 (overpowering)."
      cta-label="Log intensity"
      @submit="setBeforeIntensity"
    />

    <ReliefIntensityCard
      v-else-if="showAfterPrompt"
      title="How does the craving feel now?"
      subtitle="Give the intensity another rating so we can track how much it dropped."
      cta-label="Log updated intensity"
      @submit="setAfterIntensity"
    />

    <div class="transcript-wrapper">
      <ChatMessageList :messages="messages" />
    </div>

    <div v-if="ctaButtonVisible" class="cta-banner">
      <button class="teaser-cta" @click="openConversionModal">
        Start Freedom Lesson 1 — Free Preview
      </button>
    </div>

    <ChatInputBar @submit="handleSubmit" :disabled="inputDisabled" />
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
import ChatInputBar from '../components/ChatInputBar.vue';
import ChatMessageList from '../components/ChatMessageList.vue';
import StageProgress from '../components/StageProgress.vue';
import ReliefIntensityCard from '../components/ReliefIntensityCard.vue';
import ConversionModal from '../components/ConversionModal.vue';
import type { StageKey } from '../lib/stages';
import { getNextStage } from '../lib/stages';
import { sendConversation } from '../services/conversationService';
import {
  createSession as createSessionApi,
  updateSession as updateSessionApi,
  type UpdateSessionPayload,
  recordConversion as recordConversionApi
} from '../services/sessionService';

interface MessageItem {
  id: string;
  author: 'coach' | 'user';
  text: string;
}

const route = useRoute();

const currentStage = ref<StageKey>('entry');
const sessionId = ref(crypto.randomUUID());
const sessionReady = ref(false);
const showConversionModal = ref(false);
const messages = ref<MessageItem[]>([
  {
    id: crypto.randomUUID(),
    author: 'coach',
    text: 'I am the Ascend Freedom Coach. Tell me what the craving feels like and we will move through it together.'
  }
]);

const reliefRatings = reactive({
  before: null as number | null,
  after: null as number | null
});

const awaitingAfterRating = ref(false);

if (typeof route.query.stage === 'string') {
  const stageValue = route.query.stage.toLowerCase();
  if (['entry', 'relief', 'reflection', 'teaser', 'conversion'].includes(stageValue)) {
    currentStage.value = stageValue as StageKey;
  }
}

const showBeforePrompt = computed(() => currentStage.value === 'relief' && reliefRatings.before === null);
const showAfterPrompt = computed(() => awaitingAfterRating.value && reliefRatings.after === null);
const inputDisabled = computed(
  () => !sessionReady.value || showBeforePrompt.value || showAfterPrompt.value
);
const ctaButtonVisible = computed(() => ['teaser', 'conversion'].includes(currentStage.value));

watch(currentStage, (newStage, oldStage) => {
  if (oldStage === 'relief' && newStage !== 'relief' && reliefRatings.after === null) {
    awaitingAfterRating.value = true;
  }
  if (newStage === 'relief') {
    awaitingAfterRating.value = false;
  }
  if (newStage === 'conversion') {
    openConversionModal();
  }
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

onMounted(() => {
  bootstrapSession().catch((error) => {
    console.warn('Failed to bootstrap session', error);
    sessionReady.value = true; // allow the flow even if persistence fails
  });
});

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

function appendMessage(author: 'coach' | 'user', text: string) {
  messages.value = [
    ...messages.value,
    {
      id: crypto.randomUUID(),
      author,
      text
    }
  ];
}

function setBeforeIntensity(value: number) {
  reliefRatings.before = value;
  appendMessage('user', `Craving intensity logged at ${value}/10.`);
  void persistSession({ intensityBefore: value, stage: currentStage.value });
}

function setAfterIntensity(value: number) {
  reliefRatings.after = value;
  awaitingAfterRating.value = false;
  appendMessage('user', `Craving intensity now feels like ${value}/10.`);
  void persistSession({ intensityAfter: value, stage: currentStage.value });
}

async function handleSubmit(text: string) {
  const userMessage: MessageItem = {
    id: crypto.randomUUID(),
    author: 'user',
    text
  };
  messages.value = [...messages.value, userMessage];

  try {
    const intensity = currentStage.value === 'relief' ? reliefRatings.before : reliefRatings.after;

    const response = await sendConversation({
      sessionId: sessionId.value,
      stage: currentStage.value,
      userInput: text,
      metadata: {
        mode: 'text',
        cravingIntensity: intensity ?? undefined
      }
    });

    const coachMessages = response.messages.map((line) => ({
      id: crypto.randomUUID(),
      author: 'coach' as const,
      text: line
    }));

    messages.value = [...messages.value, ...coachMessages];

    const targetStage = response.nextStage ?? getNextStage(currentStage.value) ?? currentStage.value;
    currentStage.value = targetStage;
    void persistSession({ stage: targetStage, endSession: targetStage === 'conversion' });

    if (response.followUpQuestions?.length) {
      appendMessage('coach', response.followUpQuestions[0]!);
    }
  } catch (error) {
    console.error(error);
    appendMessage('coach', 'Something went wrong reaching the coach. Take a breath — we will try again in a moment.');
  }
}
</script>

<style scoped>
.session {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
  min-height: 100vh;
}

.transcript-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.cta-banner {
  display: flex;
  justify-content: center;
  margin: 0 1.5rem 1.5rem;
}

.teaser-cta {
  border: none;
  border-radius: 999px;
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  box-shadow: 0 20px 40px rgba(252, 74, 26, 0.35);
  cursor: pointer;
}
</style>
