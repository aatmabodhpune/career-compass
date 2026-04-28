# 📊 Data Model Specifications

Documenting relational entities tracking participant assessments.

## Response Persistence

Data maps sequentially to the centralized state mapping.

### Schema Blueprint (`benchmark_scores`):
```json
{
  "personality": {
    "openness": 0.85
  },
  "interest": {
    "realistic": 0.40
  },
  "aptitude": {
    "a1": 1.00
  },
  "weights": {
    "a1": 0.60
  },
  "meta": {
    "description": "Exhibits strong analytical capacities.",
    "strengths": ["Logical deduction"],
    "improvements": ["Task prioritization"]
  }
}
```

## Guarantees:
- **Atomicity:** Single records handle combined metric sets.
- **Support:** Flexible parsers translate partitioned scopes cleanly.
