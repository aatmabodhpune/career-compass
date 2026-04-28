# 🏗️ Career Compass Architecture

This document describes the high-level architecture of the Career Compass platform following the completion of Sprint 6.

## 🧱 1. ASSESSMENT SYSTEM

The assessment module gathers psychometric signals across three core dimensions.

- **Question Inventory (118 items):**
  - **Personality:** Big Five inventory items.
  - **Interest:** RIASEC methodology mappings.
  - **Aptitude:** 20 targeted MCQs equipped with full image-rendering support.

### Technical Implementation:
- **Backend-Driven questions:** The complete question bank operates out of the backend (`/alignment-engine/config`). The client tier no longer holds static question lists.
- **Asset Pipelines:** Public asset bindings are maintained directly using isolated Supabase Storage pathways.

## 🧱 2. DATA MODEL

Participant responses are stored as granular state records inside individual session instances.

- **Schema Specifics:**
  - Standardized single-row records mapped per session ID (`assessment_responses`).
  - Supports dual formats dynamically across flat prefix structures and grouped sub-objects.

### Target Mapping:
```json
benchmark_scores: {
  "personality": {},
  "interest": {},
  "aptitude": {},
  "weights": {},
  "meta": {
    "description": "...",
    "strengths": [],
    "improvements": []
  }
}
```

## 🧱 3. SCORING SYSTEM

- **Scaling Guidelines:** Standardized algorithms constrain raw aggregates down to an internal `[0, 1]` range. Presentational components multiply the final values by 100 on output.
- **Rule Definitions:** Strict deterministic mathematical weights substitute third-party evaluation modules. No threshold barriers interrupt evaluation queues.

### Weighted Calculation:
```
final_score = (personality * 0.40) + (interest * 0.40) + (aptitude * 0.20)
```

## 🧱 4. APTITUDE SCORING

Logical evaluations use binary checks exclusively.
```
Aptitude Score = (Correct Selections) / (Total Prompts)
```

### Allocation Rules:
- High-level mapping selects 8-12 aptitude queries mapped between ranges `a1` through `a20`.
- Supports continuous weighting variances extending from `0.20` up to `1.00` per individual item.

## 🧱 5. ARCHITECTURE FLOW

Operations enforce precise execution boundaries.

```
[Raw Responses]
       ↓
(normalizeAll)
       ↓
(computeAllScores)
       ↓
   (rankAll)
       ↓
   (insights)
       ↓
 (enrichment)
       ↓
 [API Response]
```

## 🧱 6. ENRICHMENT LAYER

Final summaries draw structured profile outlines extracted off backend indices:
- Primary descriptions.
- Career strengths.
- Suggested domains of improvement.

## 🧱 7. AUTH MODEL

Access control routes through unique transport tokens.
- **Identity:** Anonymous credentials provision foundational transport wrappers.
- **Context:** Individual session hashes resolve active database operations securely.

## 🧱 8. FRONTEND FLOW

React state transitions proceed sequentially.
```
[Token Verification] ➔ [Demographics] ➔ [Dashboard] ➔ [Tests] ➔ [Report View]
```

## 🧱 9. PDF SYSTEM

Export features operate across distinct logical modules.
- **Results.tsx:** Client interaction handler.
- **ReportTemplate.tsx:** Visual layout declarations.
- **generateReport.ts:** Document generator execution flow.

## 🧱 10. KNOWN LIMITATIONS

- Benchmark bounds rely on preliminary baseline aggregates.
- Ranking aggregates build off static weighted sums.
- Administrator interfaces are scheduled for subsequent expansion.
