# Ascend Nicotine — “Craving Companion” MVP  
### UX + Implementation Spec (v1.1)
_Last updated: Nov 2025_  
_Owner: Kevin Lee_  

---

## 0️⃣ Purpose  

This document defines the **Craving Companion MVP** — a lean, craving-first experience designed for **market validation**.  

The goal is to test if users:  
1. Engage meaningfully in a craving moment  
2. Experience perceived relief  
3. Click or attempt purchase of the “Freedom Journey” offer  

Everything else (progress dashboards, journaling, personalization, RAG) is intentionally **out of scope**.

---

## 1️⃣ Core Concept  

Users arrive mid-craving.  
They’re guided by an **LLM voice companion** through short stages:  
1. **Entry** → confirm craving moment  
2. **Relief** → guided breathing and reframing  
3. **Reflection** → curiosity bridge  
4. **Teaser** → seed vision of freedom  
5. **Conversion** → offer “Freedom Journey” CTA  

The app must feel **instant, calm, safe, and modern**, prioritizing **voice interaction** with graceful text fallback.

---

## 2️⃣ Experience Philosophy  

| Principle | UX Translation |
|------------|----------------|
| **Minimal friction** | No account creation, no long forms |
| **Voice-first** | Immediate mic prompt → continuous conversation |
| **Emotionally warm** | Gentle tone, soft gradient palette |
| **Freedom-framed** | Copy avoids willpower, fear, or punishment |
| **Single path** | One linear flow; user either completes session or exits |

---

## 3️⃣ Visual & Tone Design  

### Palette (Option A — Teal Fresh)
| Element | Color | Use |
|----------|--------|-----|
| Gradient background | `#0D5C63 → #4ABDAC` | Calm primary canvas |
| Accent (Coral) | `#FC4A1A` | CTA, user messages |
| Neutral surface | `#FFFFFF` | Chat bubbles, modals |
| Text | `#333333` | Primary text |
| Success highlight | `#E0F5F3` | Subtle progress elements |

### Typography
- **Header / Stage labels:** Inter 700  
- **Body:** Inter 400, 16–18 px  
- **Tone:** Calm, reassuring, minimal punctuation.

### Imagery / Motion
- No stock photos.  
- Use micro-animations (breathing dot, mic glow).  
- Soft fade transitions between stages.

---

## 4️⃣ Stage-by-Stage UX Flow  

### **Stage 1 – Entry**
- **Screen copy:**  
  > “Feeling a craving right now?”  
- **Primary CTA:** “Yes — help me now”  
- **Secondary:** “No, just exploring”  
- On “Yes”: prompt mic permission → create new `session` record.  

**Voice behavior:**  
- If granted → start continuous listening.  
- Fallback → show text input bar.  

---

### **Stage 2 – Relief**
- **UI:** full-screen chat (LLM ↔ user)  
- **LLM content:** calming visualization, breathing, reframing.  
- **Interaction:**  
  - App displays simple breathing animation.  
  - LLM asks: “On a scale of 1-10, how strong is the craving now?”  
  - User responds (voice or text).  
  - Store `intensity_pre`, `intensity_post`.  
- **Exit condition:** craving intensity recorded → move to reflection.

---

### **Stage 3 – Reflection**
- **Prompt:**  
  > “That craving’s gone. Want to know *why* it appeared?”  
- **Options:**  
  - “Yes, tell me” → LLM reflection stage  
  - “Not now” → skip to teaser  

**Visual:** gentle wave animation slows to still water.

---

### **Stage 4 – Teaser**
- **Copy:**  
  > “You’ve mastered this craving. Imagine never having one again.”  
  > “There’s a simple reason nicotine feels powerful — once you see through it, it loses control over you.”  
- **CTA:** “Start Freedom Lesson 1 — Free Preview.”  
- Event logged: `cta_clicked` (via analytics only).

---

### **Stage 5 – Conversion**
- **Modal or separate screen:**  
  > “Unlock the Easy Way Experience – $39”  
  > “6 guided conversations that dissolve nicotine myths.”  
- **CTA:** “Continue to Checkout (Stripe)” or “Join Waitlist.”  
- Event logged: `payment_attempted` (via analytics).

---

## 5️⃣ Interaction Model  

### Voice Modes
| Mode | Description | Trigger |
|------|--------------|---------|
| **Continuous Voice** | User grants mic; app stays in live listen/respond loop. | Default on Stage 2 |
| **Push-to-Talk** | Hold mic button to send short voice snippets. | Fallback (denied perm / unstable connection) |
| **Text Chat** | Keyboard input. | Always available |

### Transcription Flow
1. Voice recognized → temporary “Listening…” → transcribed text bubble.  
2. Send to backend (`/conversation` API) with current `stage`.  
3. LLM returns 1–2 short messages; app speaks reply (TTS).  
4. Scroll to latest.

---

## 6️⃣ Frontend Architecture (Vue 3)

| Component | Purpose |
|------------|----------|
| **Home.vue** | Entry stage (“Feeling a craving?”) |
| **Session.vue** | Chat container (Stages 2–4) |
| **ChatInput.vue** | Voice/PTT/text bar |
| **ChatMessage.vue** | User + bot bubbles |
| **CheckoutModal.vue** | Conversion screen |
| **analytics.ts** | PostHog event helper |
| **voiceAdapter.ts** | Web Speech API interface |
| **storage.ts** | Local session store (optional) |

### Router Flow
`/` → Home → on “Yes” → `/session` → (LLM flow) → CTA → CheckoutModal.

No multi-page nav or progress tabs.

---

## 7️⃣ Data and Analytics  

| Table | Fields | Notes |
|--------|---------|-------|
| **sessions** | id, stage, start_time, end_time | created on Entry |
| **craving_events** | session_id, intensity_pre, intensity_post | recorded after Relief |
| **conversions** | session_id, created_at | only if you need backend validation of payment (Stripe webhook) |

**Analytics Events (PostHog):**
- `session_started`
- `relief_stage_completed`
- `cta_clicked`
- `payment_attempted`
- `session_completed`

Analytics disabled when `VITE_ENABLE_ANALYTICS=false`.

---

## 8️⃣ Voice Adapter (Pseudo-Spec)
```ts
// voiceAdapter.ts
export const VoiceAdapter = {
  async startContinuous() { /* start Web Speech API recognition */ },
  async stopContinuous() { /* stop recognition */ },
  async pushToTalkOnce() { /* record short clip */ },
  onTranscript(cb) { /* stream partials */ },
  isSupported: 'SpeechRecognition' in window
}
```
LLM responses come from `POST /api/conversation` with payload:
```json
{
  "stage": "relief",
  "user_input": "My craving is strong",
  "session_id": "abc123"
}
```

---

## 9️⃣ Definition of Done  

| Area | Done When |
|------|-----------|
| **Core Flow** | User completes all 5 stages without error |
| **Voice** | Mic prompt works; fallback to text if denied |
| **LLM** | Returns adaptive responses per stage (JSON script) |
| **Analytics** | PostHog events captured in staging |
| **Checkout** | Stripe test mode reachable |
| **Visual Polish** | Gradient background, smooth transitions |
| **Deploy** | Vercel/Render link live for closed beta |

---

## 🔟 Non-Goals / Future Phases
- No RAG / knowledge retrieval  
- No progress dashboard or journaling  
- No user authentication  
- No multi-session log  
- No notification system  

---

## ✅ Next Actions

| Owner | Task | Priority |
|--------|------|----------|
| **UX** | Finalize stage copy and script JSON for Entry–Conversion | 🔥 |
| **Dev (Agent)** | Scaffold Vue app per this spec; integrate LLM endpoint | 🔥 |
| **Dev (Agent)** | Add voice adapter + mic prompt | 🔥 |
| **Dev (Agent)** | Integrate PostHog analytics (env-gated) | 🔥 |
| **Dev (Agent)** | Implement Stripe checkout (test mode) | 🔥 |
| **Kevin (You)** | Prepare beta test cohort (10–30 users) | 🚀 |

---

### 📦 Deliverable Summary for Coding Agent
**Goal:** Build a single-flow, craving-relief app in Vue that:  
- Opens instantly  
- Starts voice session  
- Runs through Entry → Relief → Reflection → Teaser → Conversion  
- Fires analytics + Stripe CTA  
- Deploys for beta test  
