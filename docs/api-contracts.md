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

## POST /compute-alignment

Request:
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "school_id": "uuid"
}
```

Response:
```json
{
  "data": {
    "overall_top_10": [],
    "personality_top_10": [],
    "interest_top_10": [],
    "aptitude_top_10": [],
    "insights": {
      "strengths": [],
      "weaknesses": [],
      "recommendations": []
    },
    "career_details": [],
    "report": {
      "url": null
    }
  },
  "error": null
}
```

**Notes:**
- `report.url` will be `null` until PDF generation is implemented.
- Arrays currently **NOT sorted** (sorting pending before production).
- Controller validates `session_id`, `user_id`, `school_id` before calling service.
- DB session validation: session must exist, `student_id` must match `user_id`, `school_id` must match, and `status` must be `"completed"`.
- Specific error messages returned per failure: `"Session not found"`, `"Unauthorized"`, `"Assessment not completed"`.
- `insights` and `career_details` default to empty structures if insight engine fails (non-blocking).

⚠️ GLOBAL NOTE: Sorting of results is pending. Backend currently returns unsorted arrays. This will be implemented before production.

---
### Sprint 4 Addition — Frontend Compute Alignment Request

The frontend sends a request body containing ONLY `session_id`:

```json
{ "session_id": "uuid" }
```

⚠️ Sorting not implemented yet
⚠️ Arrays returned unsorted (pre-production fix required)

---

## 🔷 Sprint 5 Clarifications

- Request remains:

```json
{ "session_id": "uuid" }
```

- Backend arrays are **now sorted DESCENDING** (final_score, etc.) before reaching the API layer.
- `career_id` mapping to `career_name` is performed **globally** in the frontend API/Store prior to rendering, relying on `fetchCareerMap()`.
- The alignment response schema remains completely unchanged as per Sprint 4 specifications.
