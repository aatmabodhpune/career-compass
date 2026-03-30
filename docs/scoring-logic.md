# SCORING LOGIC (FINAL)

## 1. Classification

Responses split using prefixes:
- `p*` → personality  
- `i*` → interest  
- `a*` → aptitude  

## 2. Normalization

### Personality / Interest
`((avg - 1) / 4) * 100`

### Aptitude
- Input: `"a1": "C"`
- Converted using answer key
- Score: `(correct / total) * 100`

## 3. Scoring Formula

`(User Score - Benchmark Score) × Weight`

## 4. Aggregation

Final Score:
`(P + I + A) / 3`

## 5. Ranking

- Top 10 per category
- Top 10 overall

⚠️ NOTE:
Sorting NOT implemented yet

## 6. Output Structure

```json
{
  "career_id": "...",
  "score": 0,
  "breakdown": {
    "personality": 0,
    "interest": 0,
    "aptitude": 0
  }
}
```

⚠️ GLOBAL NOTE: Sorting of results is pending. Backend currently returns unsorted arrays. This will be implemented before production.

---

## 7. Key Mapping Layer (Sprint 4)

User response keys from the frontend and benchmark keys in the DB use different naming conventions. Translation is handled **exclusively inside `computeAllScores`**.

| Category    | User trait (normalized key) | Benchmark key |
|-------------|-----------------------------|---------------|
| Personality | `openness`                  | `p1`          |
| Personality | `conscientiousness`         | `p2`          |
| Personality | `extraversion`              | `p3`          |
| Personality | `agreeableness`             | `p4`          |
| Personality | `neuroticism`               | `p5`          |
| Interest    | `realistic`                 | `i1`          |
| Interest    | `investigative`             | `i2`          |
| Interest    | `artistic`                  | `i3`          |
| Interest    | `social`                    | `i4`          |
| Interest    | `enterprising`              | `i5`          |
| Interest    | `conventional`              | `i6`          |
| Aptitude    | `verbal`                    | `a1`          |
| Aptitude    | `numerical`                 | `a2`          |
| Aptitude    | `logical`                   | `a3`          |

**Passthrough:** If the DB already stores raw keys (`p1`, `i1`, `a1`), they map to themselves — the mapping layer handles both formats transparently.

---

## 8. Data Handling Rules (Sprint 4)

- **Missing keys → ignored.** If a normalized trait has no corresponding benchmark key, its contribution is skipped. No error is thrown.
- **No default values.** Nothing is substituted for missing data — zero-contribution is different from defaulting.
- **No career filtering.** Every benchmark entry always produces a score entry. No career is dropped based on score value.
- **All careers ranked.** `rankAll` receives the full scores array and slices top 10 per category after sorting.

⚠️ Sorting is NOT yet implemented. Backend returns unsorted arrays. Sorting will be added before production.

---
## 9. Classification Layer (Sprint 4)

The classification layer groups traits by prefix:
- `p*` → personality
- `i*` → interest
- `a*` → aptitude

Classification performs NO normalization/scaling and does not translate benchmark keys; those concerns belong to later layers.

## 10. Data Flow Contract (Sprint 4)

- `computeAllScores` MUST return an array (`CareerScore[]`). Callers rely on array operations (e.g., `sort`, `slice`, `reduce`).
- `rankAll` MUST receive that array. Non-array input is a hard error (no fallback transformations).
- No implicit transformations: the pipeline preserves the data-shape contracts between layers.

⚠️ Sorting not implemented yet
⚠️ Arrays returned unsorted (pre-production fix required)
