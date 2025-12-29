<script setup lang="ts">
import { onMounted } from 'vue';

// Scroll-triggered animations
onMounted(() => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
});
</script>

<template>
  <main class="landing-page">

    <!-- 1. HERO -->
    <section class="section hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-eyebrow">You're closer than you think</span>
          <h1 class="hero-title">Become someone who <em>doesn't want</em> nicotine anymore</h1>
          <p class="hero-subtitle">No white-knuckling. No counting days. Just the quiet relief of not wanting it anymore.</p>
          <div class="hero-actions">
            <a href="#pricing" class="btn btn-primary">
              I'm ready
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <p class="price-note"><strong>$49</strong> founding member price · 30-day guarantee</p>
          </div>
        </div>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 2. THE REAL REASON -->
    <section class="section content-section fade-in">
      <div class="container">
        <h2 class="section-title">The real reason you're still hooked</h2>
        <p class="section-text">You've tried before. Maybe patches, maybe cold turkey, maybe sheer force of will. And when it didn't stick, you blamed yourself.</p>
        <p class="pull-quote">What keeps you reaching for it isn't physical. It's psychological.</p>
        <p class="section-text">Nicotine's physical grip is weak. The withdrawal is mild—comparable to a slight hunger pang. But the beliefs feel unshakeable. That it relaxes you. That it helps you focus. That you'll always want it.</p>
        <p class="section-text">These aren't truths. They're myths that nicotine taught you to believe. And once you see them clearly, they lose their power.</p>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 3. THE ILLUSIONS -->
    <section class="section content-section fade-in">
      <div class="container">
        <h2 class="section-title">6 illusions you're about to see through</h2>
        <p class="section-text">Nicotine keeps its grip through illusions—beliefs that feel true until you really look at them. That it calms you down. That it helps you concentrate. That quitting means a lifetime of resisting.</p>
        <p class="section-text">Over 5-7 days, we'll walk through each one together—in a conversation personalized to your life. Your triggers. The specific moments when you reach for it. The stories you've told yourself about why you need it.</p>
        <p class="pull-quote">One by one, the illusions dissolve. And so does the wanting.</p>
      </div>
    </section>

    <!-- 4. PRICING -->
    <section id="pricing" class="section pricing-section fade-in">
      <div class="container">
        <div class="pricing-card">
          <span class="founding-badge">Founding Member</span>
          <h3 class="pricing-title">Freedom from nicotine</h3>

          <div class="price">
            <div class="price-amount"><sup>$</sup>49</div>
          </div>
          <p class="value-anchor">Less than a week of vaping, to never want it again.</p>

          <div class="pricing-features">
            <div class="pricing-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>5-7 day guided experience, personalized to you</span>
            </div>
            <div class="pricing-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Check-ins at 30, 60, and 90 days</span>
            </div>
          </div>

          <a href="/checkout" class="btn btn-primary btn-full">
            Now I'm ready
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <p class="guarantee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            30-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Ascend. Built with care for people ready to be free.</p>
      </div>
    </footer>

    <!-- Mobile Sticky CTA -->
    <div class="sticky-cta">
      <a href="/checkout" class="btn btn-primary btn-block">
        I'm ready
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </main>
</template>

<style scoped>
/* Component-specific overrides & layouts */

/* Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Sticky CTA (Mobile Only) */
.sticky-cta {
  display: none; /* Hidden by default on desktop */
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(4, 31, 33, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-glass-border);
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.btn-block {
  display: flex;
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  justify-content: center;
  gap: 10px;
}

/* Divider */
.divider {
  width: 60px;
  height: 1px;
  background: var(--color-glass-border);
  margin: 0 auto;
}

/* Typography */
.hero {
  padding: 80px 0 100px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow {
  display: inline-block;
  color: var(--color-primary-end);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 24px;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.2s;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  max-width: 800px;
  margin: 0 auto 28px;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.4s;
}

.hero-title em {
  font-style: italic;
  color: var(--color-primary-end);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  max-width: 520px;
  margin: 0 auto 48px;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.6s;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards 0.8s;
}

.price-note {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.price-note strong {
  color: var(--color-text-primary);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

/* Content Sections */
.content-section {
  padding: 80px 0;
  max-width: 800px;
  margin: 0 auto;
}

.section-text {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 24px;
}

.pull-quote {
  font-size: 1.75rem;
  color: var(--color-primary-end);
  line-height: 1.3;
  margin: 48px 0;
  text-align: center;
  font-style: italic;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 36px;
  border-radius: var(--radius-button);
  font-size: 1.05rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-start), var(--color-primary-end));
  color: #fff;
  box-shadow: 0 4px 24px rgba(252, 74, 26, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 32px rgba(252, 74, 26, 0.4);
}

.btn-primary svg {
  transition: transform 0.3s ease;
}

.btn-primary:hover svg {
  transform: translateX(4px);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

/* Pricing Section */
.pricing-section {
  padding: 80px 0 120px;
}

.pricing-card {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  max-width: 480px;
  margin: 0 auto;
  padding: 56px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(252, 74, 26, 0.25),
    0 0 100px rgba(247, 183, 51, 0.15);
}

.pricing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-start), var(--color-primary-end));
}

.founding-badge {
  display: inline-block;
  background: rgba(247, 183, 51, 0.15);
  color: var(--color-primary-end);
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 28px;
}

.pricing-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.price {
  margin-bottom: 12px;
}

.price-amount {
  font-size: 4rem;
  color: var(--color-text-primary);
  line-height: 1;
  font-weight: 700;
}

.price-amount sup {
  font-size: 1.5rem;
  vertical-align: super;
  margin-right: 2px;
}

.value-anchor {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-bottom: 32px;
}

.pricing-features {
  text-align: left;
  margin-bottom: 36px;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-glass-border);
}

.pricing-feature:last-child {
  border-bottom: none;
}

.pricing-feature svg {
  color: var(--color-primary-end);
  flex-shrink: 0;
}

.pricing-feature span {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

.guarantee {
  margin-top: 20px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.guarantee svg {
  color: var(--color-primary-end);
}

/* Footer */
.footer {
  padding: 3rem 0;
  border-top: 1px solid var(--color-glass-border);
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
  text-align: center;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sticky-cta {
    display: block;
    animation: slideUp 0.5s ease-out;
  }

  /* Add padding to bottom of page so sticky CTA doesn't cover footer content */
  .footer {
    padding-bottom: 6rem;
  }

  .hero {
    padding: 60px 0 80px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .section-text {
    font-size: 1rem;
  }

  .pull-quote {
    font-size: 1.5rem;
  }

  .pricing-card {
    padding: 40px 28px;
  }

  .price-amount {
    font-size: 3rem;
  }

  .content-section {
    padding: 60px 0;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
