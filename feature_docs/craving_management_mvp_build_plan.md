# Craving Management MVP Build Plan

## Sprint 0 — Foundation
- Lock stage script JSON and tone guidance; finalize system prompts per stage.
- Design Vue scaffolding (Home → Session flow), gradient theme, animation stubs.
- Set up project repositories, environment configuration, and CI checks; stub analytics flag and feature toggles.
- Stand up basic Express API and OpenAI client wired to static script (mock responses acceptable for this sprint).

## Sprint 1 — Core MVP
- Implement Entry → Relief UI flow with intensity capture and stage state machine.
- Persist `sessions` and `craving_events` in Supabase; finish `/api/conversation` and `/api/session` endpoints.
- Integrate CTA screen routing to Stripe or LemonSqueezy test checkout (front-end link only).
- Add PostHog wrapper gated by environment flag; verify staging instrumentation.

## Sprint 2 — Depth & Beta Readiness
- Build Reflection and Teaser stages, including optional branch for “Not now.”
- Capture `cta_clicked` and `session_completed` analytics events; store reflection choices if needed.
- Implement email reminder trigger (Resend or Supabase function) for beta cohort.
- Prepare beta environment: deploy to Vercel or Render, populate test users, run manual QA checklist.

## Sprint 3 — Voice Companion & Polish
- Add voice adapter (continuous and push-to-talk) with TTS playback and text fallback.
- Harden error handling for microphone permissions, dropped recognition, and LLM timeouts.
- Conduct voice pilot with beta users, gather feedback, iterate on script copy and timing.
- Run final regression sweep, confirm Stripe and analytics in staging, and update launch documentation.
