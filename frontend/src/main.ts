import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { initAnalytics } from './services/analytics';
import './styles/main.css';

type FeatureFlags = {
  analytics: boolean;
};

declare global {
  interface Window {
    __ASCEND_FLAGS__?: FeatureFlags;
  }
}

const flags: FeatureFlags = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
};

window.__ASCEND_FLAGS__ = flags;

if (flags.analytics) {
  initAnalytics();
}

const app = createApp(App);
app.use(router);
app.mount('#app');
