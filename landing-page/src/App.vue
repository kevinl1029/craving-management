<script setup lang="ts">
// No complex script needed for this static landing page for now
// Navigation logic is handled via simple anchor links and window.location
</script>

<template>
  <main class="landing-page">
    
    <!-- 1. HERO SECTION -->
    <section class="section hero">
      <div class="container hero-layout">
        <div class="hero-content">
          <h1 class="hero-title">End Nicotine Cravings — <br class="desktop-only" />Starting Today</h1>
          <p class="hero-subhead">
            A calming experience that helps you ride out cravings and shows you a path to complete freedom.
          </p>
          <div class="hero-actions">
            <!-- Points to the main app's onboarding route -->
            <a href="/session?stage=entry" class="btn btn-primary">Try Craving Relief</a>
            <a href="#about" class="btn btn-secondary">Learn More</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="phone-mockup-placeholder">
            <div class="orb-placeholder"></div>
            <p>Ascend Companion</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. WHAT ASCEND IS (Simple Summary Band) -->
    <section class="section summary-band">
      <div class="container">
        <div class="summary-grid">
          <div class="summary-item">
            <h3>When a craving hits</h3>
            <p>Ascend gives you a moment to breathe, settle, and feel more in control.</p>
          </div>
          <div class="summary-item">
            <h3>As you calm down</h3>
            <p>You'll start to see that the craving isn’t a monster — it’s just a sensation passing through.</p>
          </div>
          <div class="summary-item">
            <h3>And the more you learn</h3>
            <p>The more the desire itself begins to fade, until freedom feels completely natural.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. WHY ASCEND WORKS (Lightweight Credibility) -->
    <section class="section benefits">
      <div class="container">
        <h2 class="section-title text-center">Why Ascend Works</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Understanding, not willpower</h3>
            <p>Cravings fade when you see what they really are.</p>
          </div>
          <div class="benefit-card">
            <h3>Behavioral science–aligned</h3>
            <p>Urge surfing, reframing, and breath‑based calm.</p>
          </div>
          <div class="benefit-card">
            <h3>Modern guidance</h3>
            <p>Conversational AI that personalizes tone and pacing.</p>
          </div>
          <div class="benefit-card">
            <h3>A proven philosophy</h3>
            <p>Inspired by Easy Way principles of dissolving desire.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. ABOUT ASCEND (Company Trust) -->
    <section id="about" class="section about">
      <div class="container text-center">
        <h2 class="section-title">About Ascend</h2>
        <p class="about-text">
          Ascend is a small, modern wellness studio focused on freeing people from nicotine. We combine behavioral science with calm, conversational experiences that help shift your mindset — gently and permanently.
        </p>
      </div>
    </section>

    <!-- 6. FAQ (Objection-Handling) -->
    <section class="section faq">
      <div class="container">
        <h2 class="section-title text-center">Common Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>Does this work for vaping?</h4>
            <p>Yes. Cravings follow the same pattern regardless of the source.</p>
          </div>
          <div class="faq-item">
            <h4>Do I need an account?</h4>
            <p>No signup required to try the relief session.</p>
          </div>
          <div class="faq-item">
            <h4>Is this medical?</h4>
            <p>Ascend offers behavioral guidance, not medical treatment.</p>
          </div>
          <div class="faq-item">
            <h4>What happens after I try it?</h4>
            <p>You get a preview of the Freedom Path and options to continue.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. FINAL CTA SECTION -->
    <section class="section final-cta">
      <div class="container text-center">
        <h2 class="cta-title">Try Craving Relief — Right Now</h2>
        <a href="/session?stage=entry" class="btn btn-primary btn-large">Start Free Session</a>
        <p class="cta-subtext">No account. Works in under a minute.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Ascend. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </div>
    </footer>
  </main>
</template>

<style scoped>
/* Component-specific overrides & layouts */

/* Typography */
.hero-title {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subhead {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  max-width: 480px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 3rem;
  color: var(--color-text-primary);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: var(--radius-button);
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s;
  text-align: center;
}

.btn:hover {
  transform: scale(1.02);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-start), var(--color-primary-end));
  color: #fff;
  box-shadow: 0 4px 12px rgba(252, 74, 26, 0.3);
}

.btn-secondary {
  border: 1px solid var(--color-text-tertiary);
  color: var(--color-text-secondary);
  margin-left: 1rem;
}

.btn-secondary:hover {
  color: #fff;
  border-color: #fff;
}

.btn-large {
  font-size: 1.25rem;
  padding: 1rem 2.5rem;
}

/* Layouts */
.hero-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.phone-mockup-placeholder {
  width: 280px;
  height: 560px;
  background: rgba(0,0,0,0.2);
  border: 2px solid var(--color-glass-border);
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
  backdrop-filter: blur(5px);
}

.orb-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary-start), transparent 70%);
  opacity: 0.6;
  margin-bottom: 1rem;
}

/* Summary Band */
.summary-band {
  background: var(--color-glass-bg);
  border-top: 1px solid var(--color-glass-border);
  border-bottom: 1px solid var(--color-glass-border);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.summary-item h3 {
  color: var(--color-primary-end);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.summary-item p {
  color: var(--color-text-secondary);
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 2rem;
  border-radius: var(--radius-card);
  border: 1px solid var(--color-glass-border);
}

.benefit-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: #fff;
}

.benefit-card p {
  color: var(--color-text-tertiary);
  font-size: 0.95rem;
}

/* About */
.about-text {
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
}

/* FAQ */
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.faq-item {
  padding: 1.5rem;
  background: rgba(0,0,0,0.1);
  border-radius: 16px;
}

.faq-item h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.faq-item p {
  color: var(--color-text-tertiary);
}

/* Final CTA */
.final-cta {
  padding: 6rem 0;
}

.cta-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.cta-subtext {
  margin-top: 1.5rem;
  color: var(--color-text-tertiary);
  font-size: 0.9rem;
}

/* Footer */
.footer {
  padding: 3rem 0;
  border-top: 1px solid var(--color-glass-border);
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
}

.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a:hover {
  color: #fff;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-layout {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .desktop-only {
    display: none;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    gap: 1rem;
  }

  .btn-secondary {
    margin-left: 0;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
}
</style>