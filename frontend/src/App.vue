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
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #0d5c63 0%, #4abdac 100%);
  color: #ffffff;
}
</style>
