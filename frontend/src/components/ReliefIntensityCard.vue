<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>

    <div class="slider">
      <label :for="id">Intensity: {{ value }}</label>
      <input
        :id="id"
        type="range"
        min="1"
        max="10"
        step="1"
        v-model.number="value"
      />
      <div class="scale">
        <span>1</span>
        <span>10</span>
      </div>
    </div>

    <button class="cta" @click="submit" :disabled="!value">{{ ctaLabel }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  title: string;
  subtitle: string;
  ctaLabel: string;
}>();

const emit = defineEmits<{ (e: 'submit', value: number): void }>();

const value = ref<number>(7);
const id = `intensity-${Math.random().toString(36).slice(2, 7)}`;

function submit() {
  if (value.value) {
    emit('submit', value.value);
  }
}
</script>

<style scoped>
.card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 1.75rem;
  margin: 1.5rem;
  color: #ffffff;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
}

p {
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.75);
}

.slider {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

input[type='range'] {
  width: 100%;
  accent-color: #fc4a1a;
}

.scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.cta {
  margin-top: 1.75rem;
  width: 100%;
  padding: 0.85rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

.cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
