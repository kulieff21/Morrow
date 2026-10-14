# Morrow unseen seed replication protocol

Fixed on 14 October 2026 before executing or examining any of the new outcomes.
This protocol will be committed and pushed before implementation is executed.
The earlier twelve seeds informed the question; they are not included in this
validation set. This is a within-model replication on previously unexamined
initial conditions, not independent authorship, external registration or
biological validation.

## Fixed design

- Exactly 100 integer seeds: 10000 through 10099 inclusive, in ascending order.
  No pilot on these seeds, substitution, optional stopping or outcome exclusions.
  This transparent consecutive range is not a random sample of all uint32 seeds.
- Unchanged morrow-0.1 engine SHA-256:
  `132e0bd255913caba45f38a98dc9e23f700502402cc6b21304c99e52f66b79c7`.
- Reuse the existing checkpoint and four-arm fork functions without edits.
  Warmup 960 steps at renewal 1, mutation amplitude 0.08 and seasons off.
  Clone the full day-8 checkpoint into four arms; advance each 960 more steps.
- Natural/normalized thrift crossed with abundance/drought: renewal 1 versus
  0.15; normalized arms set only living Çiy thrift once to 1.00 before advancing.
  Descendants inherit and mutate normally. No other trait, cap, rule, horizon,
  existing food, energy, age, position or RNG field changes on forking.
- These are 100 paired units and 400 branches. Within-seed arms are not four
  independent samples. The natural arms are new outcomes for these new seeds.
- Preserve all original evidence, original runner and original protocol files.

## Outcomes and decision rule

The primary outcome is the mean, equally weighted per-seed Çiy **share
interaction**, in percentage points:

```text
abundance_effect = normalizedAbundance - naturalAbundance
drought_effect   = normalizedDrought - naturalDrought
interaction      = drought_effect - abundance_effect
```

Predicted direction: negative. Secondary results are the same contrasts for
absolute Çiy count, arm means for count/share/total population, natural drought
minus abundance differences, medians, observed ranges, sign counts, lineage
extinctions, whole-world extinctions, baseline leadership retention and endpoint
leader-set comparisons. Publish all 100 seed rows; do not pool old and new seeds
for the primary result. Describe opposite-sign and zero results alongside the
mean; inspect extremes only as descriptive follow-up.

Compute a central 95% percentile bootstrap interval for the mean interaction:
20,000 resamples, sampling paired seed records with replacement, each with the
same number of records as the eligible set. Use a separate Mulberry32 generator
initialized to 20261014, independent of all ecological RNG state. Sort the
bootstrap means and use linear interpolation at indices (B−1)×0.025 and
(B−1)×0.975 (type 7). Reset this analysis generator for each reported outcome so
that repeated analyses are exactly reproducible. Never resample organisms or
individual arms. Report the count interval beside the primary share interval.

**The prespecified replication criterion is met only if all 100 share
interactions are defined, the mean is negative and the bootstrap upper endpoint
is below zero.** If the interval crosses/touches zero, report the direction and
an inconclusive criterion. If entirely positive, report opposite-direction
evidence under this criterion. If any shares are undefined, the primary
criterion is inconclusive; show eligible-denominator estimates transparently.
Do not change thresholds after seeing outcomes. No p-values or multiplicity
claims are planned; secondary outcomes are descriptive.

Whole-world extinction makes its share undefined (null). A missing Çiy lineage
in a living world has zero share. A share interaction requires all four arm
shares. Preserve all 100 seeds in count summaries; show all excluded share
denominators. No living Çiy at day 8 is retained as an intention-to-intervene
unit, with zero edits; do not condition inclusion on the target's survival.

The bootstrap describes resampling variation across this fixed ensemble. A
confidence interpretation beyond it requires exchangeable, representative seed
outcomes, an assumption not established by a chosen consecutive seed range.
Meeting the criterion does not establish coverage, universality across seeds,
robustness across parameter settings or a biological mechanism. Thrift still
couples energy cost, movement, reproduction and lifespan; the intervention also
removes initial within-cohort thrift variation. Percentile intervals can have
imperfect coverage. These limitations will accompany the result.

## Evidence and execution

Commit implementation and tests before the first full run. Record protocol
commit/hash, execution revision, runner/analyzer/helper/engine hashes, seed list,
complete checkpoints, original gene edits, all branch starting hashes, final
statistics and final-state hashes. Store new raw evidence separately, refusing
replacement. Analyze saved evidence without simulation; replay verifies full
checkpoints and every endpoint. A technical failure may be resumed or rerun
under the same frozen implementation, never used to replace an unfavorable
seed. Any necessary implementation correction is documented, separately
committed and identified; the scientific design remains fixed.

Validation before execution covers known original seed outcomes (4217), fork
invariants, formulas, paired resampling, null/zero outcomes, the decision rule
and rejection of malformed or altered evidence. After execution, independently
recalculate primary/secondary summaries and bootstrap endpoints from saved
records, and verify the complete replay. Update the English article and DOCX,
bilingual case study, README, audits and deployment together with chronology
preserved. Publish the new protocol, raw evidence and every seed endpoint.

## Method references

- NIST, [confidence limits for the mean](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm): sampling-based uncertainty and bootstrap alternatives.
- NIST, [bootstrap confidence intervals](https://pages.nist.gov/cmomy/reference/generated/cmomy.confidence_interval.html): percentile intervals from resampled statistics.
- Hesterberg, [What Teachers Should Know about the Bootstrap](https://arxiv.org/abs/1411.5279): limitations and finite-sample coverage of percentile intervals.
