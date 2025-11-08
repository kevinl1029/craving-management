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
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}

.pill.active {
  background: rgba(252, 74, 26, 0.85);
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(252, 74, 26, 0.3);
}
</style>
