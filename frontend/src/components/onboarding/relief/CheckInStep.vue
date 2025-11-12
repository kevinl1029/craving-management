<template>
  <div class="checkin-stage">
    <div class="bg"></div>

    <StageShell class="checkin-content">
      <template #narrative>
        <StageNarrative>
          <transition name="checkin-fade" mode="out-in">
            <div v-if="showContent" key="content" class="content">
              <p class="eyebrow">{{ eyebrowLabel }}</p>
              <h2>{{ title }}</h2>
              <p class="sub">{{ subtitle }}</p>

              <div class="choices">
                <button
                  v-for="n in 10"
                  :key="n"
                  class="choice"
                  type="button"
                  :class="{ active: selected === n }"
                  @click="select(n)"
                >
                  {{ n }}
                </button>
              </div>

              <p v-if="selected !== null" class="confirmation">
                {{ confirmationText.replace('{value}', String(selected)) }}
              </p>
            </div>
          </transition>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const props = withDefaults(
  defineProps<{
    eyebrowLabel?: string;
    title?: string;
    subtitle?: string;
    confirmationText?: string;
  }>(),
  {
    eyebrowLabel: 'check-in',
    title: 'How strong is the craving now?',
    subtitle: '1 = barely there, 10 = still intense.',
    confirmationText: 'Logging {value} — you did that yourself.'
  }
);

const emit = defineEmits<{
  (e: 'selected', value: number): void;
}>();

const selected = ref<number | null>(null);
const showContent = ref(true);

function select(n: number) {
  if (!showContent.value) return;
  selected.value = n;
  showContent.value = false;
  window.setTimeout(() => {
    emit('selected', n);
  }, 2500);
}

const { eyebrowLabel, title, subtitle, confirmationText } = props;
</script>

<style scoped>
.checkin-stage {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
}

.bg {
  position: absolute;
  inset: 0;
  opacity: 0.12;
}

 .checkin-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

/* removed visual orb */
.checkin-visual {
  width: clamp(10rem, 40vw, 16rem);
  height: clamp(10rem, 40vw, 16rem);
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
}

.checkin-visual-orb {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  animation: checkin-pulse 6s ease-in-out infinite;
}

@keyframes checkin-pulse {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

.content {
  position: relative;
  text-align: center;
  width: min(92vw, 32rem);
  padding: 0 clamp(1rem, 5vw, 2.5rem);
  color: #fff;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.sub {
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 1.4rem;
}

.choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
  gap: 0.5rem;
  justify-items: center;
}

.choice {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  width: 48px;
  height: 48px;
  color: #fff;
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease;
}

.choice:hover,
.choice.active {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-1px);
}

.confirmation {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.checkin-fade-enter-active,
.checkin-fade-leave-active {
  transition: opacity 1.5s ease;
}

.checkin-fade-enter-from,
.checkin-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .choice {
    width: 44px;
    height: 44px;
  }
}
</style>
