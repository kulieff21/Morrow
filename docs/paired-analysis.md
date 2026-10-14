# Paired endpoint analysis

Generated from the existing frozen batch. No new simulation trials are added.

Source: [initial-batch.json](initial-batch.json).
SHA-256: `5576ea15805262502465348b160ef4ff4c56e7cdf5de8122bd04f437e284ba18`.

Sample: 12 distinct, consecutively chosen seeds (4217–4228).
Eight days of shared abundance, then eight days of 100% renewal control versus
15% renewal drought. Mutation amplitude 0.08; seasons off.

## Question and measurements

Does scarcity change the day-16 outcome relative to the same-start control?
Compare endpoint leader sets, absolute lineage counts and population shares.
A higher share means a larger fraction of survivors, even when the lineage
itself has fewer living descendants.

- Baseline persistence: at least one day-8 leader is a day-16 leader.
- Endpoint comparison: leader sets may be identical, overlap partially, or be disjoint.
- Share difference: 100 × (drought share − control share), in percentage points.
- Means give each seed equal weight. Extinct-branch pairs have undefined shares;
  they are excluded from share means and their denominators are reported.

## Leadership

| Branch | Baseline leader retained | Changed | Undefined |
| --- | ---: | ---: | ---: |
| Control | 9 | 3 | 0 |
| Drought | 5 | 7 | 0 |

| Endpoint leader-set comparison | Seeds |
| --- | ---: |
| identical | 2 |
| partial-overlap | 1 |
| disjoint | 9 |
| undefined | 0 |

| Baseline leader persistence in paired branches | Seeds |
| --- | ---: |
| Retained in both | 2 |
| Retained in control only | 7 |
| Retained in drought only | 3 |
| Retained in neither | 0 |
| Undefined pair | 0 |

The difference between the two marginal change counts is not a count of
seeds where drought alone changed leadership. Read the paired transitions:
some baseline leaders are retained in drought while changing in the control.

## Population and lineage composition

Mean total population: **147.33 control**,
**13.50 drought**. Drought has fewer organisms in
**12/12** pairs. The mean within-pair
population reduction is **90.83%**
(denominator: 12 control-nonextinct pairs).

| Lineage | Mean count: control | Mean count: drought | Mean share: control | Mean share: drought | Mean share difference (pp) | Higher drought share / comparable pairs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Akım | 3.50 | 0.00 | 2.41% | 0.00% | -2.41 | 0/12 |
| Çiy | 26.67 | 4.67 | 17.91% | 33.42% | +15.51 | 10/12 |
| Köz | 17.50 | 0.92 | 12.12% | 7.86% | -4.27 | 3/12 |
| Sis | 11.42 | 1.00 | 7.75% | 7.23% | -0.51 | 5/12 |
| Yankı | 41.58 | 1.42 | 28.32% | 11.12% | -17.21 | 1/12 |
| Filiz | 46.67 | 5.50 | 31.49% | 40.37% | +8.89 | 8/12 |

The share means are averages of per-seed fractions, not pooled lineage counts
divided by pooled population. Rounding can make displayed totals differ slightly.
All unrounded values, per-seed differences, ranges, counts and denominators are
in [paired-analysis.json](paired-analysis.json).

## Per-seed endpoints

| Seed | Day-8 leader(s) | Control leader(s) | Drought leader(s) | Endpoint comparison | Control population | Drought population |
| ---: | --- | --- | --- | --- | ---: | ---: |
| 4217 | Filiz | Yankı | Filiz | disjoint | 139 | 14 |
| 4218 | Yankı | Yankı | Çiy | disjoint | 149 | 13 |
| 4219 | Çiy | Filiz | Çiy | disjoint | 153 | 19 |
| 4220 | Filiz | Filiz | Filiz | identical | 155 | 15 |
| 4221 | Köz, Filiz | Yankı | Köz | disjoint | 136 | 12 |
| 4222 | Filiz | Filiz | Çiy | disjoint | 149 | 13 |
| 4223 | Filiz | Filiz | Filiz | identical | 147 | 10 |
| 4224 | Filiz | Filiz | Çiy | disjoint | 148 | 16 |
| 4225 | Yankı | Yankı | Filiz | disjoint | 152 | 12 |
| 4226 | Yankı | Yankı, Filiz | Çiy | disjoint | 156 | 10 |
| 4227 | Yankı | Yankı | Filiz | disjoint | 132 | 13 |
| 4228 | Yankı | Yankı, Filiz | Filiz | partial-overlap | 152 | 15 |

## Interpretation limits

- Post hoc descriptive analysis of the existing twelve seed reports; no new simulation runs.
- No significance tests, confidence intervals, or claim about a general seed distribution.
- Branch differences include the full modeled intervention path and diverging random draws.
- A higher population share can coexist with fewer living descendants.
- The data do not isolate a causal effect of speed, sense, or thrift.
- Lineage endpoints do not separate birth rates, death rates, or within-lineage trait evolution.

The control branch captures modeled change under continued abundance. The
paired contrast measures the full outcome difference under the two modeled
environments, including divergent random draws. It does not identify the
mechanism of a particular gene or establish a result for biology.

The endpoint records do not reveal lineage-specific birth/death rates, the
full time course of scarcity, or within-lineage gene changes. No new evidence
about those mechanisms is claimed here.

## Reproduce

```powershell
npm run analyze
npm run analyze -- --write
npm run analyze -- --check
```

The first command prints the analysis JSON. The second writes this report and
its JSON companion. The third checks both artifacts against the original input.
The source batch is read only. No model or protocol parameters are changed.
