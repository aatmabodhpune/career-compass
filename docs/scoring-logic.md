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
