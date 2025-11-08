import posthog from 'posthog-js';

let isInitialized = false;

export function initAnalytics() {
  if (isInitialized) return;
  const enabled = window.__ASCEND_FLAGS__?.analytics;
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!enabled || !key) return;

  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false
  });

  isInitialized = true;
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!isInitialized) return;
  posthog.capture(event, properties);
}
