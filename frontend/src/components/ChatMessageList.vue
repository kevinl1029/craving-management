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
  padding: 1.5rem;
}

.bubble {
  max-width: 80%;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  font-size: 1rem;
  line-height: 1.5;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.bubble.coach {
  align-self: flex-start;
  background: rgba(13, 92, 99, 0.7);
}

.bubble.user {
  align-self: flex-end;
  background: rgba(252, 74, 26, 0.85);
}
</style>
