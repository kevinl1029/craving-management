<template>
  <form class="input-bar" @submit.prevent="emitMessage">
    <input
      v-model="draft"
      type="text"
      placeholder="Tell the Freedom Coach how you feel..."
      autocomplete="off"
      :disabled="disabled"
    />
    <button type="submit" :disabled="disabled || !draft.trim()">Send</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', value: string): void;
}>();

const draft = ref('');

function emitMessage() {
  if (props.disabled) return;
  const value = draft.value.trim();
  if (!value) return;
  emit('submit', value);
  draft.value = '';
}

const disabled = computed(() => props.disabled ?? false);
</script>

<style scoped>
.input-bar {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(13, 92, 99, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

input {
  flex: 1;
  padding: 1rem 1.25rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1rem;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

button {
  padding: 1rem 1.75rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
