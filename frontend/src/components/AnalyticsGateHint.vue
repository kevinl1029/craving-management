<template>
  <div class="gate" :class="{ active: analyticsEnabled }">
    <span v-if="analyticsEnabled">Analytics active</span>
    <span v-else>Analytics disabled (local preview)</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const analyticsEnabled = computed(() => window.__ASCEND_FLAGS__?.analytics ?? false);
</script>

<style scoped>
.gate {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  background: rgba(13, 92, 99, 0.7);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.25);
}

.gate.active {
  background: rgba(76, 219, 172, 0.75);
  color: rgba(13, 52, 54, 0.9);
}
</style>
