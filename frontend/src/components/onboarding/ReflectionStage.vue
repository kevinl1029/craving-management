<template>
  <div class="reflection-wrapper">
    <div class="ambient-background"></div>

    <StageShell :visual="false">
      <template #narrative>
        <ScriptedNarrative
          stageId="reflection"
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
  console.log('[ReflectionStage] Scene changed:', payload.sceneId);
}

function handleCtaClick(payload: { sceneId: string; ctaId: string }) {
  emit('cta', { stageId: 'reflection', ...payload });
}

function handleStageComplete() {
  emit('complete');
}
</script>

<style scoped>
.reflection-wrapper {
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
  top: 50%;
  left: 50%;
  width: 20rem;
  height: 20rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(16, 78, 84, 0.04) 40%,
    rgba(16, 78, 84, 0) 70%
  );
  filter: blur(30px);
  animation: gentle-pulse 8s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.reflection-wrapper > :deep(.stage-shell) {
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .ambient-background::before {
    width: 16rem;
    height: 16rem;
  }
}
</style>
