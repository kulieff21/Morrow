# Çiy thrift intervention — fixed follow-up protocol

Fixed before examining the four-arm batch outcomes, October 14, 2026. The
hypothesis and reused seeds were chosen after seeing the previous paired
analysis. This is a targeted within-model follow-up, not independent validation
on new seeds or an externally registered biological experiment.

## Question

Does setting the living Çiy cohort's thrift gene to 1.00 at day 8 reduce its
day-16 population-share advantage under drought more than under abundance?

## Fixed inputs

- Model: morrow-0.1, unchanged `src/engine.js`.
- Engine SHA-256: `132e0bd255913caba45f38a98dc9e23f700502402cc6b21304c99e52f66b79c7`.
- Seeds: 4217 through 4228 inclusive; report all twelve, without exclusions by result.
- Warmup: eight displayed days at resources 1.0, mutation amplitude 0.08, seasons off.
- Follow-up: eight more days in each arm. Existing model step/caps/rules unchanged.
- Original batch SHA-256:
  `5576ea15805262502465348b160ef4ff4c56e7cdf5de8122bd04f437e284ba18`.

## Intervention and four arms

Create four independent full clones of the same day-8 checkpoint per seed:

| Arm | Resource renewal | Çiy thrift at checkpoint |
| --- | ---: | --- |
| naturalAbundance | 1.00 | Leave each organism's existing value |
| naturalDrought | 0.15 | Leave each organism's existing value |
| normalizedAbundance | 1.00 | Set each living Çiy organism to 1.00 |
| normalizedDrought | 0.15 | Set each living Çiy organism to 1.00 |

Only the existing Çiy organisms' `genes.thrift` is edited. Preserve IDs, order,
all other genes, age, energy, position, food, RNG state and every other checkpoint
field, apart from the declared resource multiplier. The intervention consumes no
random draw. It occurs once, before advancing any branch. Descendants inherit the
modified gene with the usual mutation; they are **not** repeatedly clamped to 1.00.

The parameter controls energy cost, movement speed, reproduction threshold and
lifespan in this engine. This intervention changes all these linked consequences.
It also changes the cohort's thrift variance, not just its mean. It cannot isolate
energy conservation alone. No attempt will be made to hold future random draws
in lockstep after branches diverge.

## Outcomes and sign convention

At day 16, record every lineage's absolute count and population share, total
population, and the living Çiy cohort's mean thrift. Primary outcome is Çiy share;
absolute Çiy count and total population are secondary, reported alongside it.

For either count or share, define the **normalization effect** separately by
environment:

```text
effect_abundance = normalizedAbundance - naturalAbundance
effect_drought   = normalizedDrought   - naturalDrought
interaction      = effect_drought - effect_abundance
```

For shares multiply by 100 and report percentage points. A negative share
interaction is the predicted direction: normalization reduces Çiy's relative
outcome more under drought. A positive value is the opposite direction; zero
shows no difference between the environment-specific effects for that seed.
Report each seed's two effects and interaction, mean and median interaction,
full observed range, and negative/zero/positive counts. Each seed has equal weight.
No significance test, confidence interval or after-the-fact threshold is planned.

An extinct whole world has undefined shares; report null and exclude that seed
from the share interaction mean with its denominator shown. A missing Çiy lineage
in a nonextinct world has a defined zero share. Keep all seeds in the count result.

## Evidence and checks

Save full day-8 checkpoints, edited organism IDs and original thrift values,
hashes of checkpoint/branch starting states, final stats and final state hashes.
Save the frozen engine, protocol and previous-batch hashes with the batch. The
unmodified arms must reproduce the previous batch's complete baseline/control/
drought statistics. Reject a mismatch rather than treating it as a new result.

Tests must verify only the declared fields differ on forking, independent clones,
no RNG consumption, exact follow-up length, mutation allowed after intervention,
reproducibility, both interaction formulas, and extinction/null handling.

The previous raw batch and paired analysis remain immutable. Generated reports
must be checkable from saved raw outcomes without rerunning simulation. Changes
to the hypothesis, endpoints, seed set or protocol after seeing results require a
separately identified experiment, not replacement of this one.
