<template>
  <div class="teaser-wrapper">
    <div class="ambient-background"></div>

    <StageShell :visual="false">
      <template #narrative>
        <ScriptedNarrative
          stageId="teaser"
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
  console.log('[TeaserStage] Scene changed:', payload.sceneId);
}

function handleCtaClick(payload: { sceneId: string; ctaId: string }) {
  emit('cta', { stageId: 'teaser', ...payload });
}

function handleStageComplete() {
  emit('complete');
}
</script>

<style scoped>
.teaser-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  overflow: hidden;
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
  bottom: 0;
  left: 50%;
  width: 24rem;
  height: 24rem;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at bottom,
    rgba(13, 148, 136, 0.12) 0%,
    rgba(15, 118, 110, 0.08) 30%,
    rgba(16, 78, 84, 0) 60%
  );
  filter: blur(35px);
  animation: upward-drift 10s ease-in-out infinite;
}

@keyframes upward-drift {
  0% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(-50%) translateY(-20px);
    opacity: 0.85;
  }
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.6;
  }
}

.teaser-wrapper > :deep(.stage-shell) {
  position: relative;
  z-index: 1;
}

@media (max-width: 600px) {
  .ambient-background::before {
    width: 18rem;
    height: 18rem;
  }
}
</style>
