# 🧮 Scoring System Reference

This document outlines the evaluation algorithms used to calculate occupational fit.

## Core Normalization

To ensure objective comparison across distinct psychometric measures, all internal calculations scale inputs down to standardized floating ranges.

- **Storage Range:** `0.00` to `1.00`
- **Output Multiplier:** Automated presentational wrappers multiply values by 100 on the interface layer for clean user readability.

## Alignment Computation

Final rankings leverage composite formulas avoiding heuristic inference layers:

```
Total Alignment = (Personality Alignment × 0.40) + (Interest Alignment × 0.40) + (Aptitude Alignment × 0.20)
```

## Section Details

### 1. Personality & Interest
Evaluations match target benchmarks across explicit profile sets.

### 2. Aptitude Processing
Points evaluate strictly through correct or incorrect boolean thresholds.
- **Value Mapping:** `Correct = 1.0`, `Incorrect = 0.0`.
- **Career Selection:** Assigns specific combinations of 8-12 unique questions extracted from the overarching `a1` to `a20` range.
- **Weights:** Variable coefficients (`0.20` to `1.00`) dictate proportional influence safely.

## Operational Guarantees
- No cutoff barriers drop baseline records.
- Guaranteed retrieval paths supply sorted lists reliably.
