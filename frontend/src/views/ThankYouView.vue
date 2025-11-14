<template>
  <main class="thank-you">
    <section class="message">
      <h1>Welcome to Your Freedom Journey</h1>
      <p class="primary-message">
        Thank you for taking this important step toward genuine, lasting freedom from nicotine.
      </p>
      <p class="secondary-message">
        You'll receive a confirmation email from Stripe shortly with your subscription details.
      </p>
      <p class="next-steps">
        We're preparing your personalized program and will be in touch soon with next steps.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
// Thank you page after successful Stripe checkout
</script>

<style scoped>
.thank-you {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  text-align: center;
  background: linear-gradient(180deg, #104e54 0%, #041f21 100%);
}

.message {
  max-width: 600px;
  background: rgba(13, 92, 99, 0.35);
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
}

h1 {
  margin: 0 0 1.5rem;
  font-size: 2.5rem;
  line-height: 1.2;
}

.primary-message {
  margin: 0 0 1.5rem;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
}

.secondary-message {
  margin: 0 0 1rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1rem;
}

.next-steps {
  margin: 1.5rem 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
}
</style>
