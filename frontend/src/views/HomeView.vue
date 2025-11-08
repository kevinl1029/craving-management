<template>
  <main class="home">
    <section class="hero">
      <h1>Feeling a craving right now?</h1>
      <p>Tap below and we will ride the wave together in less than two minutes.</p>
      <div class="actions">
        <button class="primary" @click="startSession">Yes — help me now</button>
        <button class="secondary" @click="exploreLater">No, just exploring</button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function startSession() {
  router.push({ name: 'session', query: { stage: 'entry' } });
}

function exploreLater() {
  router.push({ name: 'session', query: { stage: 'entry', mode: 'explore' } });
}
</script>

<style scoped>
.home {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  text-align: center;
}

.hero {
  max-width: 520px;
  background: rgba(13, 92, 99, 0.35);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
}

h1 {
  margin: 0 0 1rem;
  font-size: 2.75rem;
}

p {
  margin: 0 0 2rem;
  color: rgba(255, 255, 255, 0.85);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.primary {
  padding: 1rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
}

.secondary {
  padding: 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
}
</style>
