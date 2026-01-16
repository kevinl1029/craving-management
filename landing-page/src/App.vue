<script setup lang="ts">
import { onMounted, ref } from 'vue';

const showStickyCta = ref(false);
const expandedFaq = ref<number | null>(null);
const email = ref('');

// Handle CTA clicks (analytics can be added later)
function handleCtaClick(_ctaName: string, _destination: string) {
  // TODO: Add analytics tracking when ready
}

// Toggle FAQ accordion
function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index;
}

// Smooth scroll to section
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Handle email submission (UI only for now)
function handleEmailSubmit(e: Event) {
  e.preventDefault();
  // TODO: Integrate with email service
  console.log('Email submitted:', email.value);
  alert('Thanks! We\'ll be in touch.');
  email.value = '';
}

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

  // Sequential stacked line animation
  const stackedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.stacked-line');
        lines.forEach((line, index) => {
          setTimeout(() => {
            line.classList.add('visible');
          }, index * 350); // 350ms gap between each line
        });
        stackedObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stacked-lines').forEach(el => {
    stackedObserver.observe(el);
  });

  // Smart sticky CTA behavior
  const heroSection = document.querySelector('.hero');
  const pricingSection = document.querySelector('.pricing-section');
  const finalCtaSection = document.querySelector('.final-cta-section');

  const ctaObserverOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const ctaObserver = new IntersectionObserver((entries) => {
    let heroVisible = false;
    let pricingVisible = false;
    let finalCtaVisible = false;

    entries.forEach(entry => {
      if (entry.target.classList.contains('hero')) {
        heroVisible = entry.isIntersecting;
      }
      if (entry.target.classList.contains('pricing-section')) {
        pricingVisible = entry.isIntersecting;
      }
      if (entry.target.classList.contains('final-cta-section')) {
        finalCtaVisible = entry.isIntersecting;
      }
    });

    // Hide sticky CTA when hero, pricing, or final CTA section is visible
    showStickyCta.value = !heroVisible && !pricingVisible && !finalCtaVisible;
  }, ctaObserverOptions);

  if (heroSection) ctaObserver.observe(heroSection);
  if (pricingSection) ctaObserver.observe(pricingSection);
  if (finalCtaSection) ctaObserver.observe(finalCtaSection);

});

const faqItems = [
  {
    question: "When does the program start?",
    answer: "Founding members get access in Spring 2026. You'll be first to know when it's ready."
  },
  {
    question: "What if the product never launches?",
    answer: "If we haven't launched by Summer 2026, you get an automatic full refund. But we're committed—founding members are why we're building this."
  },
  {
    question: "What if it doesn't work for me?",
    answer: "Full refund within 30 days of starting. No questions, no hassle."
  },
  {
    question: "Can I do this while still vaping?",
    answer: "Yes—we encourage it. This isn't about forcing yourself to stop. You'll naturally stop once the illusions dissolve. Most people have their last vape as part of the program, not before it."
  },
  {
    question: "Do I need to set aside a lot of time?",
    answer: "Each session is about 10-15 minutes. Check-ins are 2-3 minutes. You can do this during a lunch break or after the kids are in bed."
  },
  {
    question: "What happens after the program?",
    answer: "You'll get check-ins at 30, 60, and 90 days to make sure the shift is sticking. And you can always come back if you need a refresher."
  }
];
</script>

<template>
  <main class="landing-page">

    <!-- 1. HERO -->
    <section class="section hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-eyebrow">You're closer than you think</span>
          <h1 class="hero-title">Become someone who <em>doesn't want</em> nicotine anymore</h1>
          <p class="hero-subtitle">Imagine walking past your vape and feeling... nothing. That's where this goes.</p>
          <div class="hero-actions">
            <a href="#pricing" class="btn btn-primary" @click="handleCtaClick('hero_cta', '#pricing')">
              I'm ready
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <p class="price-note"><strong>$199</strong> founding member price · 30-day guarantee</p>
            <a href="#moment" class="secondary-cta" @click.prevent="scrollToSection('moment')">
              Show me how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. THE MOMENT YOU'RE IN RIGHT NOW -->
    <section id="moment" class="section content-section fade-in">
      <div class="container content-container">
        <h2 class="section-title">You know this feeling</h2>
        <p class="section-text">It's the middle of a workday and you're already thinking about it. Or maybe it's after a client dinner, or before a big call, or the moment you finally walk through your front door.</p>
        <p class="section-text">You've tried to quit. After this deadline. After this quarter. After things calm down. But it never feels like the right time.</p>
        <p class="section-text">And every failed attempt adds another layer of proof that maybe you're just... someone who needs this.</p>
        <p class="pull-quote">You're not weak. You're just fighting the wrong battle.</p>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 3. THE REAL REASON YOU'RE STILL HOOKED -->
    <section class="section content-section fade-in">
      <div class="container content-container">
        <h2 class="section-title">The real reason you're still hooked</h2>
        <p class="section-text">You've tried before. Maybe patches, maybe cold turkey, maybe sheer force of will. And when it didn't stick, you blamed yourself.</p>
        <p class="section-text">But here's what nobody told you: nicotine's physical grip is weak. The withdrawal is mild—comparable to a slight hunger pang that passes in seconds. That's not what's keeping you hooked.</p>
        <p class="pull-quote">What keeps you reaching for it isn't physical. It's psychological.</p>

        <div class="stacked-lines beliefs">
          <p class="stacked-line">It's the beliefs.</p>
          <p class="stacked-line">That it relaxes you.</p>
          <p class="stacked-line">That it helps you focus.</p>
          <p class="stacked-line">That you'll always want it.</p>
          <p class="stacked-line">That quitting means suffering.</p>
        </div>

        <p class="section-text">These aren't truths. They're illusions—ones that nicotine taught you to believe. And once you see them clearly, they lose their power.</p>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 4. HOW IT WORKS -->
    <section class="section content-section fade-in">
      <div class="container content-container">
        <div class="centered-statement">
          <p>This isn't an app that tracks your cravings.</p>
          <p class="emphasis">It's a conversation.</p>
        </div>

        <p class="section-text">Over about two weeks, you'll talk through the beliefs that keep nicotine in control—personalized to your life, your triggers, the specific moments when you reach for it.</p>

        <div class="stacked-lines observations">
          <p class="stacked-line intro">You'll start to notice things.</p>
          <p class="stacked-line arrow">→ The "stress relief" that's actually just withdrawal ending.</p>
          <p class="stacked-line arrow">→ The "focus" that's actually your attention being held hostage.</p>
          <p class="stacked-line arrow">→ The "identity" that was never true in the first place.</p>
        </div>

        <p class="section-text">And somewhere along the way, the wanting quiets down. Not because you're fighting it. Because there's nothing left to want.</p>

        <p class="pull-quote">You won't quit nicotine. You'll just... stop wanting it.</p>

        <div class="whats-included">
          <p class="included-item">✓ Voice conversations personalized to you, over ~2 weeks</p>
          <p class="included-item">✓ Brief daily check-ins between sessions</p>
          <p class="included-item">✓ A final session that marks the moment you're free</p>
          <p class="included-item">✓ Follow-up support at 30, 60, and 90 days</p>
        </div>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 5. WHO THIS IS FOR -->
    <section class="section content-section fade-in">
      <div class="container content-container">
        <h2 class="section-title">This isn't for everyone</h2>

        <div class="stacked-lines disqualifications">
          <p class="stacked-line">If you're looking for patches, gum, or nicotine replacement—this isn't that.</p>
          <p class="stacked-line">If you want to "cut back" rather than be done completely—this isn't that either.</p>
          <p class="stacked-line">If you're not ready to look honestly at why you reach for nicotine—you're not ready for this.</p>
        </div>

        <div class="qualification-break"></div>

        <div class="stacked-lines qualifications">
          <p class="stacked-line">But if you've built a life you're proud of—a career, a family, something real—and nicotine feels like the one thing that doesn't fit anymore...</p>
          <p class="stacked-line">If you're tired of stepping away from the table, the meeting, the moment to get your fix...</p>
          <p class="stacked-line">If you've tried willpower and want to understand why it never stuck...</p>
        </div>

        <p class="closing-line">This was built for you.</p>
      </div>
    </section>

    <div class="container"><div class="divider"></div></div>

    <!-- 6. FOUNDER STORY -->
    <section class="section content-section founder-section fade-in">
      <div class="container content-container">
        <h2 class="section-title">Why I built this</h2>
        <p class="section-text">I vaped for years. It started casually. Then it was always there—before meetings, after meals, during every break. I didn't think of myself as "addicted." I just... needed it.</p>
        <p class="section-text">Every attempt ended the same way—a few days of white-knuckling, then that thought: "just one."</p>
        <p class="section-text">I read about the psychology. I understood it logically—that nicotine doesn't relieve stress, it creates it. That the "focus" is just withdrawal ending. It all made sense.</p>
        <p class="section-text">But understanding it wasn't enough.</p>
        <p class="section-text">What finally worked was journaling. Writing through <em>my</em> triggers. <em>My</em> beliefs. The specific moments when I reached for it. Once I personalized it—made it about my life, not abstract theory—everything clicked. The wanting just... stopped.</p>
        <p class="section-text">That was three years ago. I haven't had a craving since. Not because I'm resisting—because there's nothing to resist.</p>
        <p class="pull-quote">Not through discipline. Through clarity.</p>
        <p class="section-text">I built Unhooked because you deserve that same shift. But you shouldn't have to journal your way there alone. That's what the conversations are for—to help you see <em>your</em> illusions, in <em>your</em> life, until there's nothing left to want.</p>
        <p class="section-text closing-statement">This was built for you.</p>
        <p class="founder-signature">— Kevin</p>
      </div>
    </section>

    <!-- 7. PRICING -->
    <section id="pricing" class="section pricing-section fade-in">
      <div class="container">
        <div class="pricing-card">
          <span class="founding-badge">Founding Member</span>
          <h3 class="pricing-title">Freedom from nicotine</h3>

          <div class="price">
            <div class="price-amount"><sup>$</sup>199</div>
          </div>
          <p class="value-anchor">Less than a month of vaping, to never want it again.</p>

          <p class="pricing-description">The complete program: conversations, check-ins, your final session, and follow-up support for the first 90 days.</p>

          <a href="/checkout" class="btn btn-primary btn-full" @click="handleCtaClick('pricing_cta', '/checkout')">
            Become a founding member
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>

          <p class="guarantee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            30-day money-back guarantee. If you don't feel the shift, email us. Full refund, no questions.
          </p>

          <p class="launch-note">📅 Launching Spring 2026 — founding member pricing available until public launch.</p>
        </div>
      </div>
    </section>

    <!-- 8. FAQ -->
    <section class="section faq-section fade-in">
      <div class="container content-container">
        <h2 class="section-title">Questions you might have</h2>

        <div class="faq-list">
          <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="faq-item"
            :class="{ 'expanded': expandedFaq === index }"
          >
            <button class="faq-question" @click="toggleFaq(index)">
              <span>{{ item.question }}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="faq-icon"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. FINAL CTA + EMAIL CAPTURE -->
    <section class="section final-cta-section fade-in">
      <div class="container content-container">
        <!-- Path A: Ready Now -->
        <div class="final-cta-primary">
          <h2 class="final-cta-headline">Ready to become someone who doesn't want it anymore?</h2>
          <a href="/checkout" class="btn btn-primary btn-large" @click="handleCtaClick('final_cta', '/checkout')">
            Become a founding member — $199
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <p class="final-cta-subtext">30-day guarantee · Founding member pricing until launch</p>
        </div>

        <!-- Path B: Not Yet -->
        <div class="final-cta-secondary">
          <h3 class="email-headline">Not ready yet?</h3>
          <p class="email-body">Get one email that might change how you see nicotine. No spam. Just a taste of what we do.</p>
          <form class="email-form" @submit="handleEmailSubmit">
            <input
              type="email"
              v-model="email"
              placeholder="Your email"
              class="email-input"
              required
            />
            <button type="submit" class="btn btn-secondary">Send it to me</button>
          </form>
        </div>
      </div>
    </section>

    <!-- 10. FOOTER -->
    <footer class="footer">
      <div class="container">
        <p class="footer-copyright">&copy; {{ new Date().getFullYear() }} Unhooked</p>
        <div class="footer-links">
          <a href="/privacy">Privacy</a>
          <span class="footer-divider">·</span>
          <a href="/terms">Terms</a>
          <span class="footer-divider">·</span>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>

    <!-- Mobile Sticky CTA -->
    <div class="sticky-cta" :class="{ 'visible': showStickyCta }">
      <a href="/checkout" class="btn btn-primary btn-block" @click="handleCtaClick('sticky_cta', '/checkout')">
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

/* Stacked line animations */
.stacked-line {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stacked-line.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Sticky CTA (Mobile Only) */
.sticky-cta {
  display: none;
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
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1),
              opacity 0.3s ease;
  pointer-events: none;
}

.sticky-cta.visible {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
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

.secondary-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  margin-top: 8px;
  transition: color 0.3s ease;
}

.secondary-cta:hover {
  color: var(--color-primary-end);
}

.secondary-cta svg {
  transition: transform 0.3s ease;
}

.secondary-cta:hover svg {
  transform: translateY(3px);
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
}

.content-container {
  max-width: 680px;
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

/* Stacked Lines */
.stacked-lines {
  margin: 48px 0;
}

.stacked-lines .stacked-line {
  color: var(--color-text-secondary);
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.stacked-lines.beliefs .stacked-line:first-child {
  color: var(--color-text-primary);
  font-weight: 500;
  margin-bottom: 28px;
}

.stacked-lines.observations .stacked-line.intro {
  color: var(--color-text-primary);
  font-weight: 500;
  margin-bottom: 24px;
}

.stacked-lines.observations .stacked-line.arrow {
  padding-left: 8px;
  color: var(--color-text-secondary);
}

.stacked-lines.observations .stacked-line.arrow::first-letter {
  color: var(--color-primary-end);
}

/* Centered Statement (How It Works opening) */
.centered-statement {
  text-align: center;
  margin-bottom: 48px;
  padding: 40px 0;
}

.centered-statement p {
  font-size: 1.3rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.centered-statement p.emphasis {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
  margin-bottom: 0;
}

/* What's Included */
.whats-included {
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--color-glass-border);
}

.included-item {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 12px;
}

/* Qualification section */
.qualification-break {
  height: 64px;
}

.stacked-lines.disqualifications .stacked-line,
.stacked-lines.qualifications .stacked-line {
  margin-bottom: 28px;
}

.closing-line {
  font-size: 1.4rem;
  color: var(--color-text-primary);
  font-weight: 500;
  margin-top: 48px;
  text-align: center;
}

/* Founder Section */
.founder-section .section-text {
  margin-bottom: 20px;
}

.founder-section .section-text em {
  font-style: italic;
  color: var(--color-text-primary);
}

.founder-section .closing-statement {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  font-weight: 500;
  margin-top: 32px;
}

.founder-signature {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  margin-top: 24px;
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

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border: 1px solid var(--color-glass-border);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-large {
  padding: 20px 48px;
  font-size: 1.1rem;
}

/* Pricing Section */
.pricing-section {
  padding: 80px 0;
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
  font-size: 0.8rem;
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
  margin-bottom: 24px;
}

.pricing-description {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.guarantee {
  margin-top: 20px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  text-align: left;
}

.guarantee svg {
  color: var(--color-primary-end);
  flex-shrink: 0;
  margin-top: 2px;
}

.launch-note {
  margin-top: 20px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
}

.faq-list {
  margin-top: 32px;
}

.faq-item {
  border-bottom: 1px solid var(--color-glass-border);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.05rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: color 0.3s ease;
}

.faq-question:hover {
  color: var(--color-primary-end);
}

.faq-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
  color: var(--color-text-secondary);
}

.faq-item.expanded .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq-item.expanded .faq-answer {
  max-height: 300px;
  padding-bottom: 24px;
}

.faq-answer p {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.7;
}

/* Final CTA Section */
.final-cta-section {
  padding: 100px 0;
  text-align: center;
}

.final-cta-primary {
  margin-bottom: 80px;
}

.final-cta-headline {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.final-cta-subtext {
  margin-top: 16px;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.final-cta-secondary {
  padding-top: 48px;
  border-top: 1px solid var(--color-glass-border);
  max-width: 480px;
  margin: 0 auto;
}

.email-headline {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.email-body {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin-bottom: 24px;
}

.email-form {
  display: flex;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.email-input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-button);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.email-input::placeholder {
  color: var(--color-text-tertiary);
}

.email-input:focus {
  outline: none;
  border-color: var(--color-primary-end);
  background: rgba(255, 255, 255, 0.12);
}

/* Footer */
.footer {
  padding: 3rem 0;
  border-top: 1px solid var(--color-glass-border);
  text-align: center;
}

.footer-copyright {
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.footer-links a {
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--color-text-secondary);
}

.footer-divider {
  color: var(--color-text-tertiary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sticky-cta {
    display: block;
  }

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

  .stacked-lines .stacked-line {
    font-size: 1.05rem;
  }

  .centered-statement p {
    font-size: 1.15rem;
  }

  .centered-statement p.emphasis {
    font-size: 1.3rem;
  }

  .closing-line {
    font-size: 1.25rem;
  }

  .email-form {
    flex-direction: column;
  }

  .email-input,
  .email-form .btn {
    width: 100%;
  }

  .final-cta-section {
    padding: 80px 0;
  }

  .final-cta-primary {
    margin-bottom: 60px;
  }

  .btn-large {
    padding: 18px 32px;
    font-size: 1rem;
  }
}
</style>
