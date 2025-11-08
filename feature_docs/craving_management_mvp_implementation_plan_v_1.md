# Craving Management MVP – Implementation Plan (v1.1)

**Product:** Ascend Nicotine Cessation – Craving Management (Onboarding MVP)

**Version:** 1.1  
**Owner:** Kevin Lee  
**Status:** Updated for Adaptive Script MVP  
**Scope:** Market validation MVP with LLM‑guided static script conversations (no RAG integration yet)

---

## 0) Updated Context

This revision reframes Phase 1 as an **Adaptive Script MVP** — an LLM‑driven, improvisational craving‑relief experience that follows a static core script rather than a hardcoded conversation tree or dynamic knowledge base retrieval.  

The goal remains **market validation**: to test if users will engage and pay for a craving‑relief and freedom‑framed experience. Optimization for efficacy, personalization, and analytics depth is intentionally deferred.

---

## 1) Architecture Overview (Simplified)

```
Frontend (React/Vue, your existing UI)
   ↕ REST API
Backend (Node.js + Express / FastAPI)
   ↳ LLM Orchestrator (improvises from static script)
   ↳ Simple DB (Supabase / Firebase / SQLite)
   ↳ Payment endpoint (Stripe / LemonSqueezy)
   ↳ Plug‑in analytics (PostHog / Plausible / Mixpanel)
```

**No event bus, RAG, or state classifier yet.**

---

## 2) LLM Conversation Model (Adaptive Script)

### Approach
- Use a **core script outline** (from *Craving‑First Onboarding Flow*) as the base.
- Each craving session has a stage label: `entry`, `relief`, `reflection`, `teaser`, `conversion`.
- The LLM improvises around the given script segment to produce natural, emotionally authentic dialogue.

### Example Invocation
```json
{
  "stage": "relief",
  "context": {
    "user_first_name": "Kevin",
    "craving_intensity": 7,
    "tone": "calm",
    "goal": "reduce craving"
  }
}
```

**System Prompt:**  
> “You are the Ascend Freedom Coach. You help people ride out nicotine cravings using calm reassurance and mental reframing. You improvise around the stage script below, keeping messages short, empathetic, and hopeful. Never use willpower or fear.”

The **script file** is a simple JSON with copy blocks per stage and optional improvisation hints.

---

## 3) Minimal Data Model

| Table | Fields |
|--------|---------|
| **users** | id, email |
| **sessions** | id, user_id, stage, start_time, end_time |
| **craving_events** | session_id, intensity_pre, intensity_post |
| **conversions** | session_id, cta_clicked |

Stored in Supabase or SQLite for now.

---

## 4) Analytics (Lightweight)

Skip event bus/warehouse for MVP. Use plug‑in analytics that can be dropped into the frontend.

### Recommended Tools
| Tool | Why |
|------|-----|
| **PostHog Cloud** | Plug‑and‑play JS SDK, funnel + retention views |
| **Plausible** | Super‑light, privacy‑friendly, cookie‑less |
| **Mixpanel** | Rich funnels, quick integration |
| **GA4** | Use if you already have setup experience |

**Recommendation:** start with **PostHog** for its ease and out‑of‑box dashboards.

Example client event:
```js
posthog.capture('cta_clicked', { plan: 'freedom_journey' })
```
No backend instrumentation required initially.

### Key Metrics
| Metric | Purpose |
|---------|----------|
| Sessions started | Entry funnel health |
| Sessions completed | Engagement depth |
| Avg craving relief (Δ intensity) | Product resonance |
| CTA clicks | Conversion interest |
| Payments/waitlist joins | Monetization signal |
| Repeat usage | Retention proxy |

---

## 5) MVP Build Sequence

**Sprint 0 (Week 1)**  
- Implement UI flow per Craving‑First Onboarding Flow (Stages 1–5).  
- Prepare analytics (PostHog) but enable **only** in staging/prod; keep disabled on localhost via env flag (e.g., `VITE_ENABLE_ANALYTICS=false`). Add just before beta.  
- Wire OpenAI LLM to static script JSON (local or stored in Supabase).  

**Sprint 1 (Weeks 2–3)**  
- Enable self‑reported craving intensity before/after.  
- Add CTA → checkout/waitlist form (Stripe/LemonSqueezy).  
- Basic Supabase tables for sessions + craving_events.  

**Sprint 2 (Week 4)**  
- Reflection + teaser stages.  
- Simple email reminders (Resend or Supabase functions).  
- Closed beta (10–30 users).

**Sprint 3 (Week 5)**  
- Add **voice companion feature** (speech recognition + text‑to‑speech) once chat MVP is stable.  
- Ensure graceful fallback to text chat.  
- Validate microphone permissions and user comfort.  
- Include short pilot of voice interactions in final beta build.  

### Validation Criteria
✅ ≥ 20 engaged users  
✅ ≥ 30 % click “Freedom Journey” CTA  
✅ ≥ 3 conversions or payment attempts

If thresholds are met → proceed to full KB integration + richer analytics.

---

## 6) Tool Stack Summary

### Voice Interaction Component
Incorporate a **voice companion experience** to make the craving session feel conversational and human. This should include:
- **Voice recognition** using the Web Speech API (continuous and push‑to‑talk modes).
- **Text‑to‑Speech (TTS)** playback of LLM responses.
- **Fallback** to text chat when mic access is denied.

This component can be scheduled for later in MVP development — ideally **after the base text chat experience is stable**, before closed beta. The goal is to demonstrate the voice interaction during beta to test emotional resonance and perceived authenticity.

---

## 6) Tool Stack Summary

| Layer | Tool |
|--------|------|
| Frontend | Vue (committed framework) |
| Backend | Node.js + Express |
| DB/Auth | Supabase (Postgres + Auth + Storage) |
| LLM | OpenAI GPT‑4o mini / GPT‑4‑turbo |
| Analytics | PostHog Cloud (JS SDK) |
| Payments | Stripe or LemonSqueezy |
| Hosting | Render / Vercel |

---

## 7) Design Anchors (from Craving‑First Flow)

- **Stage 1 – Entry:** calm, validating greeting (“Feeling a craving right now?”)  
- **Stage 2 – Relief:** guided breathing + reframing (“You’re not missing out — your body is rebalancing.”)  
- **Stage 3 – Reflection:** seed curiosity (“Do you know why that craving appeared?”)  
- **Stage 4 – Teaser:** vision of freedom (“Imagine never having cravings again.”)  
- **Stage 5 – Conversion:** Freedom Journey CTA (“Unlock the Easy Way experience.”)

---

## 8) Focus: Market Validation vs. Product Optimization

| Stage | Goal |
|--------|------|
| **Now** | Validate willingness to engage + pay. Optimize *feel* of relief, not long‑term efficacy. |
| **Later** | Prove sustained efficacy + adaptiveness (integrate KB, RAG, personalization). |

Focus energy on **perceived relief, tone, and conversion** — these are the signals of market traction.

---

## 9) Next Steps

1. Author the static script JSON using the Craving‑First Flow as Stage scaffolding.  
2. Create LLM system + user prompts per stage.  
3. Integrate PostHog events for start, relief, CTA.  
4. Connect Stripe or LemonSqueezy checkout.  
5. Run closed beta + capture first conversion data.  

---

**This adaptive‑script approach keeps the build lightweight, emotionally resonant, and data‑driven enough to validate market interest before investing in heavier AI infrastructure.**

