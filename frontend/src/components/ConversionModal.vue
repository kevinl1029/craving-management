<template>
  <div class="backdrop" role="dialog" aria-modal="true">
    <div class="modal">
      <button class="close" @click="$emit('close')" aria-label="Close conversion dialog">&times;</button>

      <h2>Unlock the Freedom Journey – $39</h2>
      <p>
        Six guided conversations that dissolve nicotine myths and teach you Allen Carr’s Easy Way method.
        Includes lifetime access and bonus craving boosters.
      </p>

      <div class="cta-grid">
        <button class="primary" @click="$emit('checkout')">Continue to Checkout</button>
        <button class="secondary" @click="$emit('waitlist')">Join Waitlist</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 12, 20, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  padding: 2rem;
}

.modal {
  position: relative;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  color: #0d3435;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.45);
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: rgba(13, 92, 99, 0.12);
  color: #0d3435;
  font-size: 1.5rem;
  cursor: pointer;
}

h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

p {
  margin: 0 0 2rem;
  line-height: 1.6;
}

.cta-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.primary,
.secondary {
  width: 100%;
  padding: 0.95rem;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
}

.primary {
  background: linear-gradient(135deg, #fc4a1a, #f7b733);
  color: #ffffff;
}

.secondary {
  background: rgba(13, 92, 99, 0.1);
  color: #0d3435;
}
</style>
