<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    visual?: boolean;
  }>(),
  {
    visual: true
  }
);
</script>

<template>
  <section class="stage-shell" :class="{ 'stage-shell--no-visual': !visual }">
    <div v-if="visual" class="stage-visual">
      <slot name="visual" />
    </div>
    <div class="stage-narrative">
      <slot name="narrative" />
    </div>
  </section>
</template>

<style scoped>
:root {
  --visual-size: clamp(12rem, 40vw, 18rem);
}

.stage-shell {
  position: relative;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: minmax(var(--visual-size), 50vh) auto;
  grid-template-columns: 1fr;
  justify-items: center;
  padding: clamp(1.5rem, 4vw, 3rem) 1.5rem;
  row-gap: clamp(1.5rem, 4vw, 2.5rem);
}

.stage-shell--no-visual {
  grid-template-rows: auto;
  align-content: center;
  padding: 2rem 1.5rem;
}

.stage-visual {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-narrative {
  width: min(640px, 90vw);
  max-height: clamp(12rem, 35vh, 18rem);
  overflow: hidden;
}

.stage-shell--no-visual .stage-narrative {
  max-height: none;
  overflow: visible;
}

.stage-narrative ::v-deep(.stage-narrative-content) {
  height: 100%;
  overflow-y: auto;
}
</style>
