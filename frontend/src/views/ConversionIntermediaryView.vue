<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'request-early-access', email: string): void;
}>();

const showEmailInput = ref(false);
const email = ref('');

function handlePrimaryCtaClick() {
  // TODO: Replace with actual Stripe checkout link
  window.location.href = 'https://buy.stripe.com/test_123456789';
}

function handleSecondaryCtaClick() {
  showEmailInput.value = true;
}

function handleEmailSubmit() {
  if (email.value) {
    emit('request-early-access', email.value);
    // Optionally, provide user feedback, e.g., show a thank you message
    alert(`Thank you! We will notify ${email.value} about early access.`);
    showEmailInput.value = false;
  }
}

function handleBackClick() {
  emit('back');
}
</script>

<template>
  <div class="intermediary-wrapper">
    <div class="ambient-background"></div>
    <div class="intermediary-card">
      <div class="card-content">
        <span class="eyebrow-text">Freedom Journey</span>
        <h1>6 short guided insights that dissolve every nicotine myth</h1>
        <p class="intro-paragraph">
          In the session you just completed, your body rebalanced on its own. These 6 insights
          explain why that happens — and show you how to make cravings lose their power permanently.
        </p>

        <h2 class="section-label">What you’ll get</h2>
        <ul class="feature-list">
          <li>6 bite-sized lessons (2–3 min each)</li>
          <li>Calm, guided audio + on-screen support</li>
          <li>Myth-by-myth breakdown of nicotine’s “tricks”</li>
          <li>Lifetime access, no subscription</li>
        </ul>

        <div class="comparison-row">
          <div class="comparison-col">
            <h3 class="comparison-title">Today</h3>
            <ul>
              <li>You rode out a craving</li>
              <li>You felt your system settle</li>
            </ul>
          </div>
          <div class="comparison-col">
            <h3 class="comparison-title">Next</h3>
            <ul>
              <li>See exactly why cravings appear</li>
              <li>Learn how to stop fearing them</li>
            </ul>
          </div>
        </div>

        <hr class="divider" />

        <div class="price-summary">
          <div class="price-details">
            <p class="price-title">Freedom Journey – The Easy Way Experience</p>
            <p class="price-subtext">One-time unlock • 6 insights • Lifetime access</p>
          </div>
          <div class="price-amount">$39</div>
        </div>

        <button class="cta-primary" @click="handlePrimaryCtaClick">
          Continue to Secure Checkout
        </button>

        <div v-if="!showEmailInput" class="secondary-cta-wrapper">
          <button class="cta-secondary" @click="handleSecondaryCtaClick">
            Not ready yet – send me early access instead
          </button>
        </div>
        <div v-else class="email-capture-wrapper">
          <input type="email" v-model="email" placeholder="Enter your email" class="email-input" />
          <button class="email-submit-button" @click="handleEmailSubmit">Notify me</button>
        </div>

        <div class="microcopy">
          <p>This preview uses Stripe test mode – your card will NOT be charged during early testing.</p>
          <p>Secure payment experience powered by Stripe.</p>
        </div>
      </div>
    </div>
    <a href="#" @click.prevent="handleBackClick" class="back-link">Back to craving session</a>
  </div>
</template>

<style scoped>
/* Reusing styles from TeaserStage.vue for consistency */
.intermediary-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #104e54 0%, #041f21 100%);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  box-sizing: border-box;
}

.ambient-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.ambient-background::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 24rem;
  height: 24rem;
  transform: translateX(-50%);
  background: radial-gradient(
    ellipse at bottom,
    rgba(13, 148, 136, 0.12) 0%,
    rgba(15, 118, 110, 0.08) 30%,
    rgba(16, 78, 84, 0) 60%
  );
  filter: blur(35px);
  animation: upward-drift 10s ease-in-out infinite;
}

@keyframes upward-drift {
  0% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
  50% { transform: translateX(-50%) translateY(-20px); opacity: 0.85; }
  100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
}
/* --- End of reused styles --- */

.intermediary-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 720px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  padding: clamp(2rem, 5vw, 3.5rem);
  color: #2c3e50;
  margin: 2rem 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

.eyebrow-text {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #10766d; /* Teal color from gradient */
}

h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin: -0.5rem 0 0;
}

.intro-paragraph {
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.section-label {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #555;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
  display: inline-block;
  align-self: center;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  text-align: left;
  display: inline-block;
  font-size: 1rem;
  line-height: 1.8;
}

.feature-list li {
  position: relative;
  padding-left: 1.5rem;
}

.feature-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #FC4A1A; /* Coral CTA color */
  font-weight: bold;
}

.comparison-row {
  display: flex;
  gap: 2rem;
  background-color: #f8f8f8;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

.comparison-col {
  flex: 1;
  text-align: left;
}

.comparison-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.comparison-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comparison-col ul li {
  position: relative;
  padding-left: 1.25rem;
}

.comparison-col ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10766d;
}

.divider {
  border: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 1rem 0;
}

.price-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 0.75rem;
}

.price-details {
  text-align: left;
}

.price-title {
  font-weight: 600;
  font-size: 1.125rem;
  margin: 0;
}

.price-subtext {
  font-size: 0.875rem;
  color: #555;
  margin: 0.25rem 0 0;
}

.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #041f21;
}

.cta-primary {
  background-color: #FC4A1A;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
}

.cta-primary:hover {
  background-color: #e04216;
}

.secondary-cta-wrapper {
  margin-top: -0.5rem;
}

.cta-secondary {
  background: none;
  border: none;
  color: #555;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}

.email-capture-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-top: -0.5rem;
}

.email-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.email-submit-button {
  background-color: #555;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.microcopy {
  font-size: 0.8rem;
  color: #777;
  line-height: 1.5;
}

.microcopy p {
  margin: 0.25rem 0;
}

.back-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.875rem;
  margin-top: 1.5rem;
  z-index: 1;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .intermediary-wrapper {
    padding: 1.5rem 1rem;
  }
  .intermediary-card {
    padding: 2rem;
  }
  .comparison-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style>
