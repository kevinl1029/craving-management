<template>
  <div class="stage-narrative-content" :class="alignmentClass">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2 v-if="title">{{ title }}</h2>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    <p v-if="body" class="body">{{ body }}</p>
    <div v-if="$slots.default" class="slot-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    align?: 'center' | 'left';
  }>(),
  {
    align: 'center'
  }
);

const alignmentClass = computed(() => (props.align === 'left' ? 'align-left' : 'align-center'));
</script>

<style scoped>
.stage-narrative-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #ffffff;
}

.align-center {
  text-align: center;
  align-items: center;
}

.align-left {
  text-align: left;
  align-items: flex-start;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
}

h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

.subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
}

.body {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  line-height: 1.6;
}

.slot-container {
  width: 100%;
}
</style>
