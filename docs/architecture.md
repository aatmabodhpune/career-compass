# Career Compass Architecture

This document describes the high-level architecture of the Career Compass platform.

## Components
- **Frontend:** React + Vite + TypeScript
- **Backend / Data:** Supabase (Auth, Postgres, Storage)
- **APIs:** Supabase Edge Functions
- **Alignment Engine:** Google Cloud Functions (Node.js)

## Frontend Architecture

The frontend follows a simple request / state flow:

UI → Zustand Store → API Layer → Supabase Edge Functions → PostgreSQL (JSONB)

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
