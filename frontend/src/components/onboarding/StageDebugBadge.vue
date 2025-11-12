<template>
  <div class="stage-debug-badge">
    <div class="badge-content">
      <span class="badge-label">{{ stageLabel }}</span>
      <span v-if="detail" class="badge-detail">/ {{ detail }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stageLabel: string;
  detail?: string | null;
}>();
</script>

<style scoped>
.stage-debug-badge {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 50;
  pointer-events: none;
}

.badge-content {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  background: rgba(4, 31, 33, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f4fdfd;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.badge-label {
  font-weight: 600;
}

.badge-detail {
  opacity: 0.8;
}
</style>
