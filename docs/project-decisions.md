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
