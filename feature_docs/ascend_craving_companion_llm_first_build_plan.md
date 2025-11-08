# Ascend Craving Companion — LLM-First Build Plan

**Product:** Ascend Nicotine Cessation — Craving Companion  
**Owner:** Kevin Lee  
**Version:** 0.1  
**Date:** 2025-11-08  

---

## 1. Intent

This build plan prioritizes an *effective, LLM-powered craving-relief experience* over analytics, reminders, or deployment automation.  
It also bakes in **per-stage LLM routing** so different parts of the conversation can be served by different models/providers without changing the frontend.

---

## 2. Goals

1. Replace the current dev/mock conversation path with a real LLM-backed endpoint.
2. Ensure the craving flow (Entry → Relief) actually reduces perceived craving in the moment.
3. Support stage-based LLM selection (e.g. Relief on a fast model, Reflection on a richer model).
4. Only after the core flow works, add Reflection/Teaser/Conversion.
5. Defer analytics and reminder automation until the product feels good.

---

## 3. Sprint Outline

### Sprint 0 — LLM Wiring & Routing

**Goal:** real LLM responses, stage-aware.

**Tasks**
- Implement/confirm `/api/conversation` uses the backend LLM service (remove or gate the dev mock in `frontend/src/services/conversationService.ts`).
- Add an **LLM policy layer** (`backend/src/services/llmPolicy.ts`) that, given `{ stage, mode }`, returns `{ provider, model }`.
- Refactor `backend/src/services/llmService.ts` to:
  - load the stage segment from `backend/config/stageScript.json`
  - build a system prompt from that segment
  - call the correct provider based on the LLM policy
- Create provider adapters, starting with OpenAI:
  - `backend/src/services/providers/openai.ts`
  - later can add Anthropic/Groq/Azure without touching the route
- Allow `stageScript.json` entries to optionally declare:
  ```json
  {
    "relief": {
      "tone": "calm",
      "llmProvider": "openai",
      "llmModel": "gpt-4o-mini"
    }
  }
  ```
  The LLM policy should read this first, then fall back to defaults.
- Keep analytics disabled (env-gated) so local/dev builds don’t emit noisy events.

**Deliverable:** calling `/api/conversation` from the frontend yields an on-script, stage-specific LLM reply.

---

### Sprint 1 — Core Craving Experience (Entry → Relief)

**Goal:** user feels calmer and sees the craving go down.

**Tasks**
- Make the Vue session flow use only the first 2 stages: Entry, then Relief.
- Keep the current gradient/session shell (`HomeView.vue`, `SessionView.vue`) and wire them to the real conversation.
- In Relief:
  - prompt for craving intensity (1–10) at the start
  - run 1–3 LLM turns that guide breathing + reframing (pull copy hints from `stageScript.json`)
  - prompt for craving intensity again at the end
- Save `intensity_pre` and `intensity_post` to Supabase via the existing `/api/session` + session repository code.
- Show a “micro-win” message if `intensity_post < intensity_pre`.
- Tune system prompt to enforce EasyWay-style tone (no willpower/fear).

**Deliverable:** a user can open the app, say “yes, help me now,” talk to the LLM, and see their intensity go down and be stored.

---

### Sprint 2 — Reflection, Teaser, Conversion

**Goal:** complete the narrative arc and provide a premium path.

**Tasks**
- Add Reflection stage:
  - “Want to know why this craving showed up?”
  - Buttons: **Yes** → reflection LLM stage; **Not now** → go to teaser
  - This stage can use a *larger* or *more reasoning-heavy* model via the LLM policy
- Add Teaser stage:
  - show Freedom/Journey framing copy from script
  - reinforce that cravings can be eliminated, not just managed
- Add Conversion stage:
  - CTA → Stripe/LemonSqueezy test checkout
  - optional “Join waitlist” if payment isn’t ready
- Persist reflection choice + CTA click in Supabase (lightweight, not full analytics)
- Update `stageScript.json` with copy for these 3 stages so that future LLM iterations are script-only changes.

**Deliverable:** full Entry → Relief → Reflection → Teaser → Conversion flow, with per-stage LLM selection.

---

### Sprint 3 — Voice Companion Prototype

**Goal:** make the craving interaction feel human and immediate.

**Tasks**
- Add a `voiceAdapter.ts` in the frontend that wraps Web Speech API:
  - continuous mode (ideal)
  - push-to-talk fallback
  - text fallback if mic denied
- Add TTS playback of LLM messages
- Pass `mode: 'voice'` in the conversation payload so the backend can choose models (shorter responses) via the LLM policy
- Harden error and permission handling in `SessionView.vue`

**Deliverable:** user can run the same craving flow with voice on devices that support it.

---

### Sprint 4 — Beta Prep & Analytics (Deferred Until Closer to Launch)

**Goal:** add visibility and re-engagement only when the experience is good.

**Tasks**
- Turn on PostHog (or your chosen wrapper) only in staging/prod
  - `session_started`
  - `session_completed`
  - `cta_clicked`
- Add a simple reminder trigger (Resend or Supabase function) for “come back for next craving”
- Add a short beta checklist (deployment, env vars, LLM keys, Stripe test keys)

**Deliverable:** instrumented build ready for 10–30 user beta.

---

## 4. Updated Architecture Notes

- **Frontend** stays the same: Vue 3 app with Home → Session.
- **Backend** now has:
  - `llmPolicy.ts` (decides provider/model)
  - `llmService.ts` (builds prompt + calls provider)
  - `providers/*` (one file per LLM vendor)
  - existing Express routes remain stable
- **Script-driven**: most future improvements are edits to `stageScript.json`, not code.

---

## 5. Definition of Done

1. `/api/conversation` no longer returns the dev mock in QA/staging.
2. Relief stage can be completed with real LLM responses.
3. Stage-based LLM selection works (different model for reflection vs relief).
4. Supabase gets session + craving intensity deltas.
5. Analytics stays off in local/dev.
6. Voice can be added without changing the LLM call shape.

---

## 6. Next Actions (Immediate)

1. Refactor backend conversation flow to use `llmPolicy.ts`.
2. Remove/gate the frontend mock conversation call.
3. Expand `stageScript.json` to include optional `llmProvider`/`llmModel` per stage.
4. Run an end-to-end manual test of Entry → Relief.
