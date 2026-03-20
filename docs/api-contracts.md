# Career Compass API Contracts

These contracts describe the Supabase Edge Functions used by the Assessment Module.

## POST /assessment/start

Behavior:
- Idempotent for a given `student_id` + `school_id`.
- Returns an existing in-progress session when one exists, otherwise creates a new one.
- Defensive handling:
  - Cleans up legacy / invalid in-progress sessions.
  - Deduplicates multiple in-progress sessions by keeping the latest valid one.

Response:
- `{ data: { session_id }, error: null }` on success
- `{ data: null, error: <message> }` on failure

## POST /assessment/save

Input:
- `token`
- `session_id`
- `responses` (FULL responses object; JSON)

Behavior:
- Backend merges `responses` into the session’s JSONB storage.

Response:
- `{ data: <backend payload>, error: null }` on success
- `{ data: null, error: <message> }` on failure

## POST /assessment/submit

Input:
- `token`
- `session_id`

Behavior:
- Marks the session as `completed`.
- Prevents further writes for that session.

Response:
- `{ data: <backend payload>, error: null }` on success
- `{ data: null, error: <message> }` on failure
