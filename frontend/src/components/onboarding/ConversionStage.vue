<template>
  <div class="conversion-wrapper">
    <div class="ambient-background"></div>

    <StageShell :visual="false">
      <template #narrative>
        <ScriptedNarrative
          stageId="conversion"
          align="center"
          @sceneChange="handleSceneChange"
          @ctaClick="handleCtaClick"
          @stageComplete="handleStageComplete"
        />
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import StageShell from './StageShell.vue';
import ScriptedNarrative from './ScriptedNarrative.vue';

const emit = defineEmits<{
  (e: 'complete'): void;
  (e: 'cta', payload: { stageId: string; sceneId: string; ctaId: string }): void;
}>();

function handleSceneChange(payload: { sceneId: string }) {
  // Optional: analytics or debug logging
  console.log('[ConversionStage] Scene changed:', payload.sceneId);
}

function handleCtaClick(payload: { sceneId: string; ctaId: string }) {
  emit('cta', { stageId: 'conversion', ...payload });
}

function handleStageComplete() {
  emit('complete');
}
</script>

<style scoped>
.conversion-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
}

.ambient-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ambient-background::before {
  content: '';
  position: absolute;
  top: 30%;
  left: 50%;
  width: 16rem;
  height: 16rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(13, 148, 136, 0.15) 0%,
    rgba(15, 118, 110, 0.08) 35%,
    rgba(16, 78, 84, 0) 65%
  );
  filter: blur(25px);
  animation: subtle-glow 6s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.9;
  }
}

.conversion-wrapper > :deep(.stage-shell) {
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .ambient-background::before {
    width: 14rem;
    height: 14rem;
  }
}
</style>
