# Çiy thrift intervention — four-arm results

Twelve day-8 checkpoints, four branches per checkpoint, 48 branch outcomes.
The checkpoint is the paired unit: this is **12**, not 48 independent units.
Twenty-four natural-branch outcomes reproduce the earlier experiment; twenty-four
normalized-branch outcomes add the thrift intervention.

The [fixed protocol](thrift-protocol.md) was committed as `4352cde6c77044e0fc1242ae66757940c1421403`
before batch execution at `eceb3c6166f798688bde2cef23472f219861de7a`.
The hypothesis and seeds were informed by the earlier analysis of these same
seeds. No held-out replication is claimed.

Raw evidence: [thrift-raw.json](thrift-raw.json), SHA-256 `88a55655488c95447dc283a4af58b42151578e7062441a5b19cb152ad473d9c8`.
It contains complete day-8 checkpoints, exact gene edits, branch-start hashes,
all final lineage stats and final state hashes. The previous batch and engine
are unchanged. The two natural arms match the previous complete statistics
for every seed.

## Intervention

Set only the thrift gene of every living Çiy organism to 1.00 at the day-8
checkpoint in the two normalized arms. Preserve other genes, energy, age,
food, positions and RNG state. This consumes no random draw. Mutation amplitude
remains 0.08; descendants are not clamped again. Run all arms to day 16.

Thrift controls energy consumption, movement, reproduction threshold and
lifespan. The intervention changes all of these and removes checkpoint thrift
variation within the treated cohort; it is not an energy-only mechanism test.

## Arm means

Every seed has equal weight. Shares are per-seed fractions, not pooled counts.

| Arm | Total population | Çiy count | Çiy share (%) | Defined shares | Çiy extinct | Whole world extinct |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Abundance, natural thrift | 147.33 | 26.67 | 17.91 | 12/12 | 0/12 | 0/12 |
| Drought, natural thrift | 13.50 | 4.67 | 33.42 | 12/12 | 0/12 | 0/12 |
| Abundance, normalized thrift | 141.83 | 17.75 | 12.46 | 12/12 | 0/12 | 0/12 |
| Drought, normalized thrift | 13.00 | 2.25 | 15.56 | 12/12 | 4/12 | 0/12 |

## Prespecified contrasts

```text
effect_abundance = normalizedAbundance - naturalAbundance
effect_drought   = normalizedDrought - naturalDrought
interaction      = effect_drought - effect_abundance
```

Primary outcome is Çiy population share, in percentage points (pp). Negative
interaction is the predicted direction: normalization reduces the relative
outcome more under drought. Absolute count is secondary and has its own scale.

| Metric / contrast | Mean | Median | Observed range | Negative / zero / positive | Defined pairs |
| --- | ---: | ---: | --- | --- | ---: |
| Share (pp) / abundance | -5.46 | -5.50 | -13.86 to +1.16 | 10 / 0 / 2 | 12/12 |
| Share (pp) / drought | -17.86 | -13.00 | -61.54 to +6.67 | 11 / 0 / 1 | 12/12 |
| Share (pp) / interaction | -12.40 | -6.90 | -57.73 to +12.47 | 8 / 0 / 4 | 12/12 |
| Count / abundance | -8.92 | -10.00 | -23.00 to +2.00 | 10 / 0 / 2 | 12/12 |
| Count / drought | -2.42 | -2.50 | -8.00 to 0.00 | 7 / 5 / 0 | 12/12 |
| Count / interaction | +6.50 | +8.00 | -7.00 to +23.00 | 3 / 0 / 9 | 12/12 |

The primary share interaction averages **-12.40 pp**,
with median **-6.90 pp**. It is negative in
**8/12** seeds, positive in **4/12**.
The sign is not consistent across all seeds; the full range and median matter.

The mean drought-minus-abundance share contrast is +15.51 pp with
natural thrift and +3.10 pp after normalization. This comparison
does not identify a percentage of the advantage "explained" by thrift.

The mean absolute-count interaction is **+6.50 organisms**:
normalization loses more organisms in abundance on this absolute scale.
There are far fewer organisms in drought. The count and share contrasts answer
different questions; a relative-share result does not establish a larger
absolute loss or universal drought-specific necessity.

## Per-seed primary outcome

All four shares are percentages; the last three columns are percentage points.

| Seed | Natural abundance | Natural drought | Normalized abundance | Normalized drought | Effect abundance | Effect drought | Interaction |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 4217 | 5.76 | 28.57 | 6.38 | 0.00 | +0.63 | -28.57 | -29.20 |
| 4218 | 10.07 | 53.85 | 9.29 | 41.18 | -0.78 | -12.67 | -11.89 |
| 4219 | 30.72 | 47.37 | 25.53 | 35.71 | -5.19 | -11.65 | -6.47 |
| 4220 | 20.65 | 26.67 | 14.84 | 33.33 | -5.81 | +6.67 | +12.47 |
| 4221 | 14.71 | 8.33 | 4.93 | 5.88 | -9.78 | -2.45 | +7.33 |
| 4222 | 26.17 | 61.54 | 22.37 | 0.00 | -3.81 | -61.54 | -57.73 |
| 4223 | 13.61 | 10.00 | 10.22 | 7.14 | -3.39 | -2.86 | +0.53 |
| 4224 | 20.95 | 31.25 | 10.42 | 15.38 | -10.53 | -15.87 | -5.34 |
| 4225 | 14.47 | 25.00 | 6.34 | 0.00 | -8.14 | -25.00 | -16.86 |
| 4226 | 23.08 | 30.00 | 9.22 | 21.43 | -13.86 | -8.57 | +5.29 |
| 4227 | 14.39 | 38.46 | 15.56 | 0.00 | +1.16 | -38.46 | -39.62 |
| 4228 | 20.39 | 40.00 | 14.39 | 26.67 | -6.00 | -13.33 | -7.33 |

## Per-seed absolute counts

| Seed | Natural abundance | Natural drought | Normalized abundance | Normalized drought | Count interaction |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 4217 | 8 | 4 | 9 | 0 | -5.00 |
| 4218 | 15 | 7 | 13 | 7 | +2.00 |
| 4219 | 47 | 9 | 36 | 5 | +7.00 |
| 4220 | 32 | 4 | 23 | 4 | +9.00 |
| 4221 | 20 | 1 | 7 | 1 | +13.00 |
| 4222 | 39 | 8 | 34 | 0 | -3.00 |
| 4223 | 20 | 1 | 14 | 1 | +6.00 |
| 4224 | 31 | 5 | 15 | 2 | +13.00 |
| 4225 | 22 | 3 | 9 | 0 | +10.00 |
| 4226 | 36 | 3 | 13 | 3 | +23.00 |
| 4227 | 19 | 5 | 21 | 0 | -7.00 |
| 4228 | 31 | 6 | 19 | 4 | +10.00 |

## Limits and interpretation

The observed primary contrast is in the predicted direction on average for
these fixed checkpoints and horizon. It supports a contribution of the coupled
thrift parameter to the relative-share pattern in this model. It does not show
that thrift alone explains the pattern, or that the result holds for every seed.

- Twelve reused seeds and a hypothesis chosen from their earlier outcomes; no held-out replication or biological inference.
- Thrift is changed once at day 8; descendant mutation remains active.
- Changing thrift affects energy, movement, reproduction and lifespan, and removes checkpoint thrift variation within the treated lineage.
- Branch random draws diverge; these are full modeled intervention effects, not coupled environmental random sequences.
- A share effect is relative to the other lineages and is reported beside absolute counts.
- Final-state hashes are provenance; confirming their contents requires the full replay command.
- The one fixed follow-up horizon and trait target do not establish universal necessity, sufficiency or a general gene effect.

Undefined whole-world shares are excluded with explicit denominators. A zero
Çiy count in a living world remains a valid zero share. No p-values, confidence
intervals or threshold-based significance claims are used.

## Reproduce and verify

```powershell
npm run analyze:thrift
npm run analyze:thrift -- --check
npm run experiment:thrift -- --replay
```

Analysis reads saved evidence without running new worlds. Replay reruns all
four arms and checks full checkpoints, edits, start hashes, final stats and
final state hashes. Recorded execution revision is retained as provenance.
Raw batch writing refuses to overwrite an existing batch.

Unrounded values and individual endpoint mean thrift are in
[thrift-analysis.json](thrift-analysis.json).
