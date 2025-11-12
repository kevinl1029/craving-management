<template>
  <div class="transcript">
    <div v-for="item in messages" :key="item.id" class="bubble" :class="item.author">
      <p>{{ item.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  id: string;
  author: 'coach' | 'user';
  text: string;
}

defineProps<{
  messages: ChatMessage[];
}>();
</script>

<style scoped>
.transcript {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

.bubble {
  max-width: 85%;
  padding: 1.25rem 1.5rem;
  border-radius: 24px;
  font-size: 1rem;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bubble.coach {
  align-self: flex-start;
  background: rgba(31, 108, 117, 0.85);
  color: #ffffff;
}

.bubble.user {
  align-self: flex-end;
  background: rgba(88, 164, 176, 0.75);
  color: #ffffff;
}
</style>
