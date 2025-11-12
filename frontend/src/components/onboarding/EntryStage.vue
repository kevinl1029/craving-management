<template>
  <div class="entry-stage">
    <div class="bg-layer"></div>
    <div class="orb-glow"></div>

    <div class="content">
      <p class="eyebrow">craving companion</p>
      <h1 class="title">Feeling a craving right now?</h1>

      <div class="actions">
        <button class="btn-primary" type="button" @click="emit('start-relief')">
          Yes — help me now
        </button>
        <button class="btn-secondary" type="button" @click="emit('explore')">
          No, just exploring
        </button>
      </div>

      <p class="helper">
        Calm, non-judgmental space. We’ll guide you through a short relief exercise next.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'start-relief'): void;
  (e: 'explore'): void;
}>();
</script>

<style scoped>
.entry-stage {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 2rem 1rem;
}

.bg-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
}

.orb-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18rem;
  height: 18rem;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(16, 78, 84, 0) 70%);
  filter: blur(10px);
  pointer-events: none;
  animation: glow 6s ease-in-out infinite;
}

.content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 26rem;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out forwards;
}

.title {
  color: #fff;
  font-size: 1.9rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out forwards;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 16rem;
  animation: fadeInUp 0.8s 0.1s ease-out forwards;
}

.btn-primary {
  width: 100%;
  background: #fc4a1a;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  padding: 0.9rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s ease-out;
}

.btn-primary:hover {
  transform: scale(1.02);
}

.btn-secondary {
  width: 100%;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.15s ease-out;
}

.btn-secondary:hover {
  color: rgba(255, 255, 255, 1);
}

.helper {
  margin-top: 2.2rem;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
  line-height: 1.5;
  max-width: 20rem;
  animation: fadeIn 1s 0.25s ease-out forwards;
}

@keyframes glow {
  0%,
  100% {
    opacity: 0.55;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.06);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.6rem;
  }

  .actions {
    max-width: 100%;
  }
}
</style>
