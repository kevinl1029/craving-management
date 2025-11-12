<template>
  <div class="stage-progress">
    <div
      v-for="stageKey in stages"
      :key="stageKey"
      class="pill"
      :class="{ active: stageKey === activeStage }"
    >
      {{ stageLabels[stageKey] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { stageLabels, stageOrder, type StageKey } from '../lib/stages';

defineProps<{
  activeStage: StageKey;
}>();

const stages = stageOrder;
</script>

<style scoped>
.stage-progress {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.pill {
  padding: 0.6rem 1.25rem;
  border-radius: 999px;
  background: rgba(88, 164, 176, 0.6);
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  cursor: pointer;
}

.pill.active {
  background: rgba(165, 111, 78, 0.95);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(165, 111, 78, 0.4);
}
</style>
