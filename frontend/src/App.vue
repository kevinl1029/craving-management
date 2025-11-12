<template>
  <div class="app-shell">
    <router-view />
    <AnalyticsGateHint />
  </div>
</template>

<script setup lang="ts">
import AnalyticsGateHint from './components/AnalyticsGateHint.vue';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  color: #ffffff;
}
</style>
