# Database Schema (Alignment Engine)

### career_benchmarks

- `benchmark_scores` (jsonb):
  ```json
  {
    "personality": {},
    "interest": {},
    "aptitude": {},
    "weights": {}
  }
  ```

### alignment_results

- `session_id`
- `results_json`
- `top_careers`

⚠️ GLOBAL NOTE: Sorting of results is pending. Backend currently returns unsorted arrays. This will be implemented before production.

⚠️ Sorting not implemented yet
⚠️ Arrays returned unsorted (pre-production fix required)
