<template>
  <div class="checkin-stage">
    <!-- lingering afterglow -->
    <div :class="['afterglow', { faded: hasEntered }]"></div>

    <StageShell class="checkin-content" :visual="false">
      <template #narrative>
        <StageNarrative>
          <transition name="checkin-fade" mode="out-in">
            <div v-if="showContent" key="content" class="content">
              <h2>{{ title }}</h2>
              <p class="sub">{{ subtitle }}</p>

              <div class="floating-scale-wrapper" :class="{ 'dial-active': isDialMode }">
                <div class="dial-indicator" aria-hidden="true" v-if="isDialMode"></div>
                <div
                  ref="dialContainer"
                  class="floating-scale"
                  :class="{ 'dial-mode': isDialMode }"
                >
                  <button
                    v-for="n in numbers"
                    :key="n"
                    class="float-number"
                    type="button"
                    :data-value="n"
                    :style="{
                      animationDelay: `${(n - 1) * 0.12}s`,
                      ...dialStyle(n)
                    }"
                    :class="{ 'is-selected': selected === n }"
                    @click="select(n)"
                  >
                    {{ n }}
                  </button>
                </div>
              </div>

              <p v-if="selected !== null" class="confirmation" v-html="confirmationText.replace('{value}', `<strong>${selected}</strong>`)"></p>
            </div>
          </transition>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    confirmationText?: string;
  }>(),
  {
    title: 'Notice how the craving feels now.',
    subtitle: 'On a scale of 1 to 10, where would you put it?',
    confirmationText: 'Got it — logging {value}. You did that yourself.'
  }
);

const emit = defineEmits<{
  (e: 'selected', value: number): void;
}>();

const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
const selected = ref<number | null>(null);
const showContent = ref(true);
const hasEntered = ref(false);
const dialContainer = ref<HTMLElement | null>(null);
const dialValue = ref(5);
const isDialMode = ref(false);

let mediaQuery: MediaQueryList | null = null;
let activeDialEl: HTMLElement | null = null;
let scrollFrame = 0;

const setDialMode = (event?: MediaQueryListEvent) => {
  isDialMode.value = event ? event.matches : mediaQuery?.matches ?? false;
};

onMounted(() => {
  setTimeout(() => {
    hasEntered.value = true;
  }, 300);

  if (typeof window === 'undefined') return;

  mediaQuery = window.matchMedia('(max-width: 640px)');
  setDialMode();
  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', setDialMode);
  } else {
    mediaQuery.addListener(setDialMode);
  }
});

onBeforeUnmount(() => {
  detachDialListeners();
  if (mediaQuery) {
    if ('removeEventListener' in mediaQuery) {
      mediaQuery.removeEventListener('change', setDialMode);
    } else {
      mediaQuery.removeListener(setDialMode);
    }
  }
});

function select(n: number) {
  if (!showContent.value) return;
  dialValue.value = n;
  centerDialOn(n);
  selected.value = n;
  showContent.value = false;
  window.setTimeout(() => {
    emit('selected', n);
  }, 2500);
}

watch(
  () => [isDialMode.value, dialContainer.value],
  () => {
    detachDialListeners();
    if (isDialMode.value && dialContainer.value) {
      nextTick(() => {
        attachDialListeners();
        centerDialOn(selected.value ?? dialValue.value, 'auto');
        updateDialValue();
      });
    }
  }
);

function attachDialListeners() {
  if (!dialContainer.value || typeof window === 'undefined') return;
  activeDialEl = dialContainer.value;
  activeDialEl.addEventListener('scroll', handleDialScroll, { passive: true });
  window.addEventListener('resize', updateDialValue);
  window.addEventListener('keydown', handleKeyDown);
}

function detachDialListeners() {
  if (activeDialEl) {
    activeDialEl.removeEventListener('scroll', handleDialScroll);
    activeDialEl = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateDialValue);
    window.removeEventListener('keydown', handleKeyDown);
  }
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }
}

function handleDialScroll() {
  if (!isDialMode.value || typeof window === 'undefined') return;
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame);
  }
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    updateDialValue();
  });
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isDialMode.value || selected.value !== null) return;

  if (event.key === 'ArrowLeft' && dialValue.value > 1) {
    event.preventDefault();
    centerDialOn(dialValue.value - 1);
  } else if (event.key === 'ArrowRight' && dialValue.value < 10) {
    event.preventDefault();
    centerDialOn(dialValue.value + 1);
  }
}

function updateDialValue() {
  if (!isDialMode.value || !activeDialEl) return;
  const buttons = activeDialEl.querySelectorAll<HTMLButtonElement>('.float-number');
  if (!buttons.length) return;
  const centerPoint = activeDialEl.scrollLeft + activeDialEl.clientWidth / 2;
  let closestValue = numbers[0];
  let smallestDistance = Number.POSITIVE_INFINITY;

  buttons.forEach((button) => {
    const value = Number(button.dataset.value);
    if (!value) return;
    const buttonCenter = button.offsetLeft + button.offsetWidth / 2;
    const distance = Math.abs(buttonCenter - centerPoint);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestValue = value;
    }
  });

  // Add haptic feedback on value change
  if (closestValue !== dialValue.value) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  dialValue.value = closestValue;
}

function centerDialOn(value: number | null, behavior: ScrollBehavior = 'smooth') {
  if (!value || !isDialMode.value) return;
  const targetContainer = activeDialEl ?? dialContainer.value;
  if (!targetContainer) return;
  const targetButton = targetContainer.querySelector<HTMLButtonElement>(`.float-number[data-value="${value}"]`);
  if (!targetButton) return;

  // Immediately update dialValue for instant bracket alignment
  dialValue.value = value;

  const targetCenter = targetButton.offsetLeft + targetButton.offsetWidth / 2;
  const desiredScrollLeft = targetCenter - targetContainer.clientWidth / 2;

  if ('scrollTo' in targetContainer) {
    targetContainer.scrollTo({ left: desiredScrollLeft, behavior });
  } else {
    targetContainer.scrollLeft = desiredScrollLeft;
  }

  // Update after scroll completes for 'auto' behavior
  if (behavior === 'auto') {
    nextTick(() => updateDialValue());
  }
}

function dialStyle(n: number) {
  if (!isDialMode.value) return {};
  const distance = Math.abs(n - dialValue.value);
  const scale = distance === 0 ? 1.35 : distance === 1 ? 1.15 : distance === 2 ? 0.98 : 0.88;
  const opacity = distance === 0 ? 1 : distance === 1 ? 0.82 : distance === 2 ? 0.6 : 0.4;
  const translate = distance === 0 ? '-6px' : distance === 1 ? '-3px' : '0px';

  return {
    '--dial-scale': scale,
    '--dial-opacity': opacity,
    '--dial-translate': translate
  };
}

const { title, subtitle, confirmationText } = props;
</script>

<style scoped>
.checkin-stage {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  overflow-x: hidden;
  overflow-y: auto;
}

.afterglow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14rem;
  height: 14rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(16, 78, 84, 0) 70%);
  filter: blur(8px);
  opacity: 0.8;
  transition: opacity 1s ease;
  pointer-events: none;
}

.afterglow.faded {
  opacity: 0.3;
}

.checkin-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.content {
  position: relative;
  text-align: center;
  width: 100%;
  max-width: 48rem;
  padding: 0 max(1rem, env(safe-area-inset-right)) 0 max(1rem, env(safe-area-inset-left));
  color: #fff;
  overflow-x: clip;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.sub {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.floating-scale-wrapper {
  position: relative;
  width: 100%;
}

.floating-scale {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  transform-style: preserve-3d;
  animation: float-row 9s ease-in-out infinite;
}

.floating-scale-wrapper.dial-active {
  position: relative;
  left: 50%;
  margin-left: -50vw;
  width: 100vw;
  margin-bottom: 2.5rem;
  overflow-x: clip;
  overflow-y: visible;
}

.floating-scale-wrapper.dial-active .floating-scale {
  margin-bottom: 0;
}

.dial-indicator {
  display: none;
}

.floating-scale-wrapper.dial-active .dial-indicator {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(5.5rem, 50vw);
  height: 4rem;
  pointer-events: none;
  z-index: 3;
}

.dial-indicator::before,
.dial-indicator::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 4px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0.3) 90%, transparent 100%);
  border-radius: 2px;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.9), 0 0 35px rgba(227, 255, 243, 0.7);
  animation: breathing-light 4s ease-in-out infinite;
}

.dial-indicator::before {
  top: 0;
}

.dial-indicator::after {
  bottom: 0;
  animation-delay: 0.5s;
}

.float-number {
  --dial-translate-final: var(--dial-translate, 0px);
  --dial-scale-final: var(--dial-scale, 1);
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.25rem;
  min-width: 2.4rem;
  min-height: 2.4rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  transform: translateY(var(--dial-translate-final)) scale(var(--dial-scale-final));
  will-change: transform, opacity;
  transition: transform 0.3s ease, color 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
  opacity: var(--dial-opacity, 0.78);
}

.float-number:hover {
  color: #fff;
  --dial-translate-final: calc(var(--dial-translate, 0px) - 2px);
  --dial-scale-final: calc(var(--dial-scale, 1) + 0.04);
}

.float-number.is-selected {
  color: #fff;
  --dial-translate-final: calc(var(--dial-translate, 0px) - 2px);
  --dial-scale-final: calc(var(--dial-scale, 1) + 0.05);
  opacity: 1;
  text-shadow: 0 0 16px rgba(227, 255, 243, 0.75);
}

.confirmation {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.confirmation strong {
  color: #fff;
}

.checkin-fade-enter-active,
.checkin-fade-leave-active {
  transition: opacity 1.5s ease;
}

.checkin-fade-enter-from,
.checkin-fade-leave-to {
  opacity: 0;
}

@keyframes float-row {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3px);
  }
}

@keyframes breathing-light {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) scaleX(0.98);
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.85), 0 0 30px rgba(227, 255, 243, 0.65);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scaleX(1.0);
    box-shadow: 0 0 28px rgba(255, 255, 255, 1), 0 0 48px rgba(227, 255, 243, 0.85);
  }
}

@media (max-width: 600px) {
  h2 {
    font-size: 1.3rem;
  }

  .sub {
    font-size: 0.85rem;
  }

  .floating-scale.dial-mode {
    --button-width: 3rem;
    --button-spacing: clamp(0.25rem, 2vw, 0.6rem);
    justify-content: flex-start;
    gap: 0;
    width: 100%;
    overflow-x: auto;
    padding: 0 calc(50vw - var(--button-width) / 2 - var(--button-spacing));
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    animation: none;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.15) 4%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 1) 22%, rgba(0, 0, 0, 1) 78%, rgba(0, 0, 0, 0.5) 90%, rgba(0, 0, 0, 0.15) 96%, transparent 100%);
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.15) 4%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 1) 22%, rgba(0, 0, 0, 1) 78%, rgba(0, 0, 0, 0.5) 90%, rgba(0, 0, 0, 0.15) 96%, transparent 100%);
  }

  .floating-scale.dial-mode::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }

  .floating-scale.dial-mode .float-number {
    flex: 0 0 auto;
    margin: 0 var(--button-spacing);
    min-width: 3rem;
    min-height: 3rem;
    font-size: 1.35rem;
    scroll-snap-align: center;
  }
}

@media (max-width: 430px) {
  .floating-scale.dial-mode {
    --button-width: 2.75rem;
  }

  .floating-scale.dial-mode .float-number {
    min-width: 2.75rem;
    min-height: 2.75rem;
    font-size: 1.15rem;
  }
}
</style>
