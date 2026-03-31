# Career Compass Architecture

This document describes the high-level architecture of the Career Compass platform.

## Components
- **Frontend:** React + Vite + TypeScript
- **Backend / Data:** Supabase (Auth, Postgres, Storage)
- **APIs:** Supabase Edge Functions (Deno runtime)
  - Modular structure: `controller → service → repository → modules`
- **Alignment Engine:** Supabase Edge Functions (Migrated from Google Cloud Functions)

## Alignment Engine Flow

Assessment → Responses (JSONB)
→ Prefix Classification (p*, i*, a*)
→ Normalization
→ Scoring
→ Ranking
→ Storage (alignment_results)
→ API Response
→ Frontend Rendering

## Frontend Architecture

The frontend follows a simple request / state flow:

UI → Zustand Store → API Layer → Supabase Edge Functions → DB

⚠️ GLOBAL NOTE: Sorting of results is pending. Backend currently returns unsorted arrays. This will be implemented before production.

- Zustand is the single source of truth for the active assessment state (session id, status, section, responses).
- The UI reads only from Zustand state and triggers state updates via store actions.

## Autosave System

- Trigger: fired on every response update (`updateResponse`) from the UI.
- Debounce: `1000ms` (single in-flight timer that resets on further changes).
- Payload: autosave sends the FULL `responses` object (JSON) to the backend.

## Session Lifecycle (Assessment Module)

1. `start` (Home): `startSession(token)` hydrates/creates a backend session, then stores the returned `session_id`.
2. `resume` (Assessment): the UI renders the active question based on Zustand state and session status.
3. `autosave`: debounced persistence of the FULL `responses` object while the assessment is in progress.
4. `submit`: `submitAssessment(token)` submits the active `session_id`, sets Zustand `status = completed`, and blocks further writes.

## UI System (MVP Styling Primitives)

All pages use a consistent lightweight UI system based on three primitives:

- `Container`: `max-w-5xl mx-auto px-4 py-8`, used to wrap pages.
- `Card`: `bg-white rounded-xl shadow-md p-6`, with a `centered` variant for demo-friendly pages.
- `Button`: `primary` (blue-600), `secondary` (bordered), and `ghost` styles; includes shared spacing/disabled behavior.

Typography scale used across the MVP:
- Heading: `text-2xl font-bold text-gray-900`
- Subheading: `text-lg font-semibold`
- Body: `text-gray-600`
- Label: `text-sm text-gray-500`

Progress bar uses a simple bar layout with `h-2`, `bg-gray-200` track, and `bg-blue-600` filled portion.

---

## Alignment Engine — Final Flow (Sprint 4)

```
responses
→ normalizeAll        (trait values → 0-100 scale)
→ computeAllScores    (key mapping + dot-product scoring)
→ rankAll             (top 10 per category + overall)
→ insight engine      (explanations, strengths, recommendations)
→ API response
```

**Contract Notes:**
- `computeAllScores` enforces ARRAY output — callers must treat return as `CareerScore[]`.
- Key mapping (user trait name → benchmark key, e.g. `openness → p1`) is handled **exclusively inside `computeAllScores`**. Normalization and repository layers are not responsible for key translation.
- `rankAll` accepts only arrays. A hard guard at function entry will throw if a non-array is passed.
- Insight engine runs **after** ranking and operates on `ranked.overall_top_10`.
- PDF report generation is a placeholder returning `{ url: null }` — full implementation deferred.

⚠️ **Sorting not yet implemented.** Backend returns unsorted arrays. Sorting will be added before production.

---

## 🔷 Alignment Engine — Final Architecture (Sprint 4 Completion)

### Full Pipeline

```
DB (flat JSON responses: { p1, i1, a1, ... })
  → Repository (fetchAssessmentResponses — raw extraction, no transformation)
  → Classifier (prefix-based grouping: p* → personality, i* → interest, a* → aptitude)
  → Normalizer (scale trait values to 0–100)
  → Scorer (dot-product scoring with key mapping: trait name → benchmark key)
  → Ranker (top 10 per category + overall)
  → Insight Engine (strengths, weaknesses, recommendations, career explanations)
  → API Response ({ data, error })
```

### Conditional Classification

The classifier applies **only when input is flat** (top-level keys start with `p`, `i`, or `a`). If the repository already returns structured data (`{ personality, interest, aptitude }`), classification is skipped.

```ts
const isFlat = Object.keys(responses).some(
    (key) => key.startsWith("p") || key.startsWith("i") || key.startsWith("a")
);
```

### Separation of Concerns

| Layer | Responsibility | MUST NOT |
|---|---|---|
| Repository | Raw DB extraction | Classify, normalize, or validate categories |
| Classifier | Prefix-based grouping | Normalize values or access benchmarks |
| Normalizer | Scale to 0–100 | Map keys or access benchmarks |
| Scorer | Dot-product scoring + key mapping | Sort, rank, or produce insights |
| Ranker | Sort + slice top 10 per category | Score or access DB |
| Insight Engine | Generate explanations, strengths, recs | Modify scores or rankings |

### Runtime

- **Supabase Edge Functions (Deno)**
- All local imports use `.ts` extensions
- No Node.js-specific packages
- Insight engine is non-blocking (wrapped in try/catch)

⚠️ Sorting not yet implemented. Arrays returned unsorted. Will be addressed before production.

⚠️ Sorting not implemented yet
⚠️ Arrays returned unsorted (pre-production fix required)

---

## 🔷 Sprint 5 — Presentation Layer (Final)

Describe:

- No backend changes
- No API changes
- No DB changes

Final flow (unchanged):

Assessment → Edge Function → DB → Response  
→ API Layer → Zustand → UI → Render

Add:

- Backend sorting now part of response layer
- Career name mapping happens in API/store layer (NOT UI)
- UI is strictly a renderer (no logic)
