<template>
  <div class="chat-input-shell">
    <div class="chat-input-inner" :class="{ 'is-disabled': disabled }">
      <input
        v-model="model"
        type="text"
        class="chat-input-field"
        :placeholder="placeholder"
        :disabled="disabled"
        @keyup.enter="emitSubmit"
      />

      <button
        v-if="showMic"
        class="icon-btn mic-btn"
        type="button"
        :class="{ 'is-active': isListening }"
        :disabled="disabled"
        @click="$emit('mic-toggle')"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        <span class="sr-only">Toggle mic (stub)</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    isListening?: boolean;
    showMic?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: 'Speak or type your thought…',
    disabled: false,
    isListening: false,
    showMic: true
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit', value: string): void;
  (e: 'mic-toggle'): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

function emitSubmit(): void {
  if (props.disabled) return;
  const text = model.value.trim();
  if (!text) return;

  emit('submit', text);
  model.value = '';
}
</script>

<style scoped>
.chat-input-shell {
  width: 100%;
  padding: 0;
}

.chat-input-inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(31, 108, 117, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.9rem 1.25rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.chat-input-inner.is-disabled {
  opacity: 0.6;
}

.chat-input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1rem;
}

.chat-input-field::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.icon-btn {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  transition: 0.2s ease-out;
  cursor: pointer;
  flex-shrink: 0;
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.mic-btn.is-active {
  background: rgba(88, 164, 176, 0.3);
  color: #fff;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

@media (max-width: 480px) {
  .chat-input-shell {
    padding: 0;
  }
}
</style>
