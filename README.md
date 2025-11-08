# Ascend Craving Companion

This repository contains the Ascend Craving Companion MVP implementation, featuring a Vue 3 frontend and a Node.js/Express backend that powers the adaptive craving-relief experience described in the project documentation.

## Structure

- `frontend/` – Vue application implementing the craving session flow.
- `backend/` – Express service that orchestrates LLM conversations and persistence.
- `scripts/` – Utility scripts for local development and deployment.
- `feature_docs/` – Product and UX documentation.

Refer to `feature_docs/craving_management_mvp_build_plan.md` for the sprint-aligned delivery roadmap.

### LLM Provider Configuration

Set `LLM_PROVIDER` (defaults to `openai`) and the corresponding API key(s) in `backend/.env` to choose the model runtime. The conversation service gracefully falls back to scripted copy when no provider is configured.

### Checkout Links

Populate `VITE_CHECKOUT_URL` (and optionally `VITE_WAITLIST_URL`) in `frontend/.env` to wire the Freedom Journey CTA to your payment or waitlist destination.

## Development

Install dependencies at the root once:

```bash
npm install
```

Then start both frontend and backend together:

```bash
npm run dev
```

To build both workspaces:

```bash
npm run build
```
