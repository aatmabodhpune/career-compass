# Engineering Decisions (Sprint 2)

## Frontend Session & Persistence

- Frontend does NOT trust localStorage blindly; Zustand persist is used for token rehydration only.
- Assessment state is cleared on user changes:
  - On login: the assessment store is reset before starting a new backend session.
  - On logout: the assessment store is reset to avoid leaking prior users' `session_id` and `responses`.

## Backend-First Session Lifecycle

- Backend controls the assessment session lifecycle:
  - `assessment-start` is responsible for returning an active `session_id`.
  - Legacy / inconsistent session data is cleaned defensively.
- Defensive backend handling is required because legacy users may have:
  - multiple in-progress sessions
  - invalid/missing session fields

## Autosave Correctness

- Autosave sends the FULL `responses` object.
- Autosave payload is always derived from the latest Zustand state at execution time (no stale local copies).
- Autosave is debounced at `1000ms` to reduce redundant network calls.

## Alignment Engine (Sprint 3 & 3.5)

✔ Prefix-based classification (p*, i*, a*)
✔ Global benchmarks (no school_id)
✔ Benchmark stored as JSONB (`benchmark_scores`)
✔ Supabase Edge Functions over GCF
✔ Frontend is dumb renderer (no logic)
✔ Zustand as single source of truth
✔ Aptitude mapping handled in normalizer layer

⚠️ **Pending Decision:**
- Backend sorting not implemented yet

⚠️ GLOBAL NOTE: Sorting of results is pending. Backend currently returns unsorted arrays. This will be implemented before production.

---

## Alignment Engine — Sprint 4 Decisions

- **Key mapping is handled only in `computeAllScores`** — not in normalization or the DB layer. This keeps the mapping concern isolated to the scoring layer.
- **Missing benchmark keys are ignored** — if a normalized trait has no corresponding benchmark key, its contribution is skipped. No default values are substituted.
- **`computeAllScores` must always return an array** — callers depend on array methods (`sort`, `slice`, `reduce`). This is a strict function contract enforced by initialization (`const scores: CareerScore[] = []`) and a catch block returning `[]`.
- **`rankAll` only accepts arrays** — a hard entry guard throws `"rankAll received non-array input"` if violated. This surfaces upstream issues immediately.
- **No score threshold applied** — all careers with valid benchmark data are scored and ranked regardless of score value.
- **Controller validates before service** — input fields (`session_id`, `user_id`, `school_id`) are validated at the HTTP layer. DB session validity (`student_id` match, `school_id` match, `status === "completed"`) is checked in the repository before service execution.
- **Insight engine is non-blocking** — if `ExplanationEngine`, `StrengthAnalyzer`, or `RecommendationEngine` throws, the error is caught and `insights`/`career_details` default to empty structures. The primary ranking response is always returned.
- **PDF report deferred** — `generateReportPlaceholder()` returns `{ url: null }`. Full PDF generation requires a Deno-compatible library or a separate Node.js service.
- **Deno runtime enforced** — all local imports use `.ts` extensions. No Node.js-specific (`pdfkit`, `fs`, `buffer`) packages used.

---
## 🔷 Sprint 4 Decisions (Final)

- Classification layer is separate from the normalizer: it groups responses by prefix (`p*`, `i*`, `a*`) and does not perform scaling.
- Prefix-based grouping: `p*` → personality, `i*` → interest, `a*` → aptitude.
- Frontend is a dumb renderer (no transformation): it does not normalize or map keys for scoring.
- Validation is simplified for the compute-alignment request payload: the frontend sends only `session_id`.
- JSONB benchmark storage: `benchmark_scores` is stored as JSONB.
- Insight engine is non-blocking: explanation/recommendation failures fall back to empty insight structures.

⚠️ Sorting not implemented yet
⚠️ Arrays returned unsorted (pre-production fix required)
