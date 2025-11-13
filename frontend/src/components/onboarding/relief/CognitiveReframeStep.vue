<template>
  <div class="reframe-wrapper">
    <div class="bg"></div>

    <StageShell class="reframe-content" :visual="false">
      <template #visual>
        <div class="reframe-visual">
          <div class="reframe-orb"></div>
        </div>
      </template>

      <template #narrative>
        <StageNarrative title="Freedom is already happening.">
          <ul class="statements">
            <li
              v-for="(line, index) in lines"
              :key="line.id"
              :class="['statement', { active: index === currentIndex }]"
            >
              {{ line.text }}
            </li>
          </ul>
        </StageNarrative>
      </template>
    </StageShell>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import StageShell from '../StageShell.vue';
import StageNarrative from '../StageNarrative.vue';

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

type Line = {
  id: string;
  text: string;
  pauseMs: number;
};

const lines: Line[] = [
  {
    id: 'reframe-1',
    text: 'You’re not missing out on anything — this feeling is just your body rebalancing.',
    pauseMs: 4000
  },
  {
    id: 'reframe-2',
    text: 'Each time you stay present, the craving wave loses a little more power.',
    pauseMs: 4000
  },
  {
    id: 'reframe-3',
    text: 'Freedom isn’t somewhere else — it is happening right now inside you.',
    pauseMs: 4500
  }
];

const currentIndex = ref(0);
let timer: ReturnType<typeof setTimeout> | null = null;

const playNext = () => {
  if (currentIndex.value >= lines.length - 1) {
    emit('complete');
    return;
  }

  currentIndex.value += 1;
  queueNext();
};

const queueNext = () => {
  const currentLine = lines[currentIndex.value];
  if (!currentLine) return;

  timer = setTimeout(() => {
    if (currentIndex.value === lines.length - 1) {
      emit('complete');
      return;
    }
    playNext();
  }, currentLine.pauseMs);
};

onMounted(() => {
  queueNext();
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.reframe-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
}

.bg {
  position: absolute;
  inset: 0;
  opacity: 0.12;
}

.reframe-content {
  position: relative;
  z-index: 2;
  width: 100%;
  animation: fade-in-up 0.8s ease-out;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.statements {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.statement {
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.75);
  transition: transform 0.3s ease, color 0.3s ease, background 0.3s ease;
}

.statement.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(8px);
  transform: scale(1.015);
}

@media (max-width: 600px) {
  .title {
    font-size: 1.4rem;
  }

  .statement {
    font-size: 0.9rem;
    padding: 0.65rem 0.85rem;
    line-height: 1.5;
  }

  .statements {
    gap: 0.6rem;
  }
}
</style>
