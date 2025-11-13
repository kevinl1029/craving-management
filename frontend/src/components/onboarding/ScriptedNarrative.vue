<template>
  <StageNarrative :align="align">
    <transition name="scene-fade" mode="out-in">
      <div v-if="isMounted && activeScene" :key="activeScene.id" class="scripted-narrative__scene">
        <div class="scripted-narrative__lines">
          <p
            v-for="(line, index) in activeScene.lines"
            :key="index"
            class="scripted-narrative__line"
          >
            {{ line.text }}
          </p>
        </div>

        <div v-if="activeScene.ctas && activeScene.ctas.length > 0" class="scripted-narrative__ctas">
          <button
            v-for="cta in activeScene.ctas"
            :key="cta.id"
            :class="['btn', `btn-${cta.variant || 'primary'}`, { disabled: isProcessingCTA }]"
            :disabled="isProcessingCTA"
            @click="onCtaClick(cta)"
          >
            {{ cta.label }}
          </button>
        </div>
      </div>
    </transition>
  </StageNarrative>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import StageNarrative from './StageNarrative.vue';
import { onboardingScript, type StageId, type SceneConfig, type SceneCTA } from '../../scripts/onboardingScript';

const props = withDefaults(
  defineProps<{
    stageId: StageId;
    align?: 'center' | 'left';
  }>(),
  {
    align: 'center'
  }
);

const emit = defineEmits<{
  (e: 'sceneChange', payload: { sceneId: string }): void;
  (e: 'ctaClick', payload: { sceneId: string; ctaId: string }): void;
  (e: 'stageComplete'): void;
}>();

// State
const currentSceneIndex = ref(0);
const isProcessingCTA = ref(false);
const isMounted = ref(false);
let advanceTimer: ReturnType<typeof setTimeout> | null = null;

// Computed
const stageConfig = computed(() => onboardingScript[props.stageId]);
const activeScene = computed<SceneConfig | null>(() => {
  if (!stageConfig.value || !stageConfig.value.scenes) return null;
  return stageConfig.value.scenes[currentSceneIndex.value] || null;
});

// Methods
const advanceToNextScene = () => {
  if (!stageConfig.value) return;

  const nextIndex = currentSceneIndex.value + 1;

  if (nextIndex >= stageConfig.value.scenes.length) {
    // No more scenes, emit completion
    emit('stageComplete');
    return;
  }

  currentSceneIndex.value = nextIndex;
  setupAutoAdvance();
};

const setupAutoAdvance = () => {
  // Clear any existing timer
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
  }

  if (!activeScene.value) return;

  // Emit scene change
  emit('sceneChange', { sceneId: activeScene.value.id });

  // Set up auto-advance if enabled
  if (activeScene.value.autoAdvance && activeScene.value.dwellMs > 0) {
    advanceTimer = setTimeout(() => {
      advanceToNextScene();
    }, activeScene.value.dwellMs);
  }
};

const onCtaClick = (cta: SceneCTA) => {
  if (isProcessingCTA.value || !activeScene.value) return;

  isProcessingCTA.value = true;

  // Emit CTA click event
  emit('ctaClick', {
    sceneId: activeScene.value.id,
    ctaId: cta.id
  });

  // Pause for 1-2 seconds before advancing
  const pauseDuration = 1500; // 1.5 seconds
  setTimeout(() => {
    advanceToNextScene();
    isProcessingCTA.value = false;
  }, pauseDuration);
};

// Lifecycle
onMounted(() => {
  // Validate stage config
  if (!stageConfig.value || !stageConfig.value.scenes || stageConfig.value.scenes.length === 0) {
    console.warn(`[ScriptedNarrative] No scenes found for stageId: ${props.stageId}`);
    emit('stageComplete');
    return;
  }

  // Trigger initial fade-in animation by setting isMounted on next tick
  nextTick(() => {
    isMounted.value = true;
    setupAutoAdvance();
  });
});

onBeforeUnmount(() => {
  // Clean up any pending timers
  if (advanceTimer) {
    clearTimeout(advanceTimer);
    advanceTimer = null;
  }
});

// Watch for stageId changes (defensive)
watch(() => props.stageId, () => {
  currentSceneIndex.value = 0;
  isMounted.value = false;
  nextTick(() => {
    isMounted.value = true;
    setupAutoAdvance();
  });
});
</script>

<style scoped>
.scripted-narrative__scene {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.scripted-narrative__lines {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scripted-narrative__line {
  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  line-height: 1.6;
  margin: 0;
}

.scripted-narrative__ctas {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

/* Scene fade transition */
.scene-fade-enter-active {
  transition: opacity 0.75s ease-out, transform 0.75s ease-out;
}

.scene-fade-leave-active {
  transition: opacity 0.6s ease-in, transform 0.6s ease-in;
}

.scene-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.scene-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Button styles */
.btn {
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  width: 100%;
}

.btn-primary {
  background: #fc4a1a;
  color: white;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover:not(.disabled) {
  transform: scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover:not(.disabled) {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .scripted-narrative__line {
    font-size: 1.05rem;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>
