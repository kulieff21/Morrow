# Resource scarcity and lineage success in Morrow

A paired artificial life study with a targeted intervention and unseen seed replication

Prepared for Elmar Quliyev • Updated 14 October 2026 • Revision 2

## Abstract

**Background.** Numerical dominance under one resource regime need not persist after an environmental change. A small artificial-life model can make this question experimentally accessible, provided that its rules, comparison units and limits are explicit. Morrow is a deterministic, spatial, individual-based sandbox in which organisms search for food, spend energy, reproduce with bounded trait mutation and die. It is an exploratory computational system without empirical biological calibration.

**Methods.** An initial study used twelve seeds, 4217–4228. Complete day-8 checkpoints were copied into abundance and drought branches and followed to day 16. Post hoc count/share analysis motivated a four-arm intervention crossing renewal regime with one-time normalization of living Çiy thrift to 1.00. A separately committed replication protocol then fixed 100 previously unexamined seeds, 10000–10099, with the same engine, intervention and horizon. The primary outcome was the mean share interaction, defined as the normalization effect in drought minus that in abundance; count was secondary. The prospective replication criterion required 100 defined share interactions, a negative mean and a central 95% paired-seed percentile-bootstrap interval wholly below zero. Twenty thousand resamples were fixed in advance. The consecutive seed range is not a probability sample of all possible worlds.

**Results.** In the original twelve worlds, leadership persisted in 9/12 abundance and 5/12 drought branches. Çiy's mean share increased from 17.91% to 33.42% while its count decreased from 26.67 to 4.67. Original mean share and count interactions were −12.40 percentage points and +6.50 organisms. In the 100 new paired worlds, the share interaction averaged −14.73 points, with bootstrap interval [−18.69, −10.75], median −14.67 and range [−70.27, +47.61]. It was negative in 81 seeds and positive in 19; all 100 were defined. The prespecified criterion was met. The count interaction averaged +4.78 organisms, with interval [+3.01, +6.56]. Natural abundance/drought Çiy counts averaged 28.28/6.34 and shares 19.25%/42.25%. Ten normalized-drought branches lost Çiy; no whole world became extinct.

**Conclusions.** The predicted average relative-share pattern recurred in previously unexamined initial conditions without changing the model. This reduces dependence on the original twelve worlds but does not establish a universal effect or isolate energy conservation. Nineteen reversed interactions, a fixed consecutive seed range, coupled thrift mechanisms and one endpoint limit interpretation. Bootstrap intervals describe resampling of this ensemble; broader sampling coverage is not established. Original and new evidence remain separate and publicly auditable with full checkpoints, all seed endpoints, source hashes and executable replay.

**Keywords:** artificial life; individual-based simulation; resource scarcity; paired experiment; lineage composition; reproducibility; gene intervention; unseen seed replication

## 1 Introduction

### 1.1 The question behind the pond

Morrow began as a practical question shared by a human project owner and an AI coding assistant: could a small local world produce an observation worth investigating? The resulting pond is a deliberately limited system. Organisms have positions, energy and three numerical traits. They compete indirectly through a shared food supply. Their descendants inherit perturbed traits, and their lineages can become more or less common without any organism reasoning about the environment.

The first question was whether the lineage with the most living descendants after a period of abundance would remain a leader after food renewal was reduced. This is a question about a change in numerical ranking at a specified endpoint. It is narrower than asking which lineage is universally fittest, whether organisms adapt intelligently, or whether the model reproduces a real ecosystem. Defining the question narrowly allows a complete answer from the recorded worlds.

The control branch is essential to that answer. A lineage can lose leadership during another eight days of abundance because of competition, inherited variation, movement and chance within the model. A drought endpoint alone cannot distinguish a change associated with scarcity from a change that would also have occurred under continued renewal. Cloning the same checkpoint supplies a direct within-world comparison.

### 1.2 From ranking to composition and intervention

The initial leadership results motivated two additional questions. First, how did abundance and drought differ in total population, lineage counts and lineage shares? This was answered by reanalyzing the saved two-arm records, without adding new recorded trials. Second, could one numerical trait associated with Çiy's initial profile help account for its relative representation under drought? That question led to a targeted four-arm intervention.

The distinction between count and share is central. A lineage may decline from many organisms to a few while becoming a larger fraction of the survivors. Conversely, an intervention may cause a larger loss of organisms in a large population but a larger loss of percentage points in a small population. Both descriptions can be correct. This article therefore reports the two scales separately and defines every contrast before interpreting it.

### 1.3 Reporting approach and contribution

The article uses an Introduction, Methods, Results and Discussion structure, borrowing general manuscript organization from ICMJE guidance [1]. The model description follows the purpose, state, scheduling and submodel logic of the ODD reporting protocol [2]. Explicit aims, generating rules and estimands are also informed by simulation-study guidance [3], although Morrow is an intervention study within a toy model rather than a comparison of statistical estimators. These are reporting aids, not claims of clinical relevance or external model validation.

The contribution is a fully traceable small computational case study. It connects an exploratory observation to a prospectively fixed follow-up, retains contrary seed-level outcomes, and demonstrates why the outcome scale matters. It also supplies enough detail to inspect the implementation rather than rely on the visual impression of an animated pond. No claim of theoretical novelty over the broader artificial-life literature is made; the cited literature was selected for reporting and reproducibility, not as a systematic survey of that field.

## 2 Materials and methods

### 2.1 Study stages and experimental units

The study has four stages. The original experiment generated twelve paired abundance–drought outcomes. The second stage analyzed those same records. The third replayed the natural conditions and added the thrift intervention on the original seeds. The fourth tested its prespecified primary contrast on 100 previously unexamined seeds. Original and new ensembles are reported separately; new initial conditions are not independent investigators or a different model.

**Table 1 Study chronology and evidential status**

| Stage | Question and action | Evidence status |
| --- | --- | --- |
| Initial paired experiment | Does day 8 leadership persist to day 16 under drought with an abundance comparison | Twelve paired worlds; original leadership question |
| Paired endpoint analysis | Compare leadership transitions, total population, all lineage counts and shares | Post hoc analysis of the same saved records; no new recorded trials |
| Four arm thrift experiment | Normalize living Çiy thrift once and cross that edit with renewal regime | Follow-up protocol committed before examining this batch; hypothesis and seeds came from earlier results |
| Unseen seed replication | Repeat the unchanged four-arm design on seeds 10000–10099 | Protocol and implementation committed before new outcomes; 100 new paired units and 400 branches |

The paired unit is one seeded initial world and its day-8 checkpoint. Four branches from one checkpoint are related outcomes of that unit. The follow-up contains 48 branch executions: 24 natural-arm replays and 24 treated branches. It does not provide 48 independent replicates. Combining the earlier experiment and later replay does not create additional independent initial conditions. The twelve seeds were consecutive integers, selected as a compact reproducible batch; they were not a probability sample of ecosystems or a held-out validation set.

### 2.2 Model purpose and scope

Morrow version 0.1 is an individual-based spatial model designed for observation and controlled perturbation. Its intended adequacy is operational: reproducible worlds, explicit energy and reproduction rules, branching from an identical checkpoint, and transparent accounting of outcomes. It has no calibration target, fitted biological parameter, measured species, physical energy unit or empirical environmental time series. Parameters were chosen by the developer to create an observable sandbox, not estimated from external data.

The browser application and case study default to English with a Turkish switch. They run without application dependencies, accounts, API keys, analytics or external fonts. A Node.js server provides loopback preview, and GitHub Pages hosts the static public release. Language changes affect the view, not simulation state or ecological randomness. The ecological engine is pure JavaScript and can also run headlessly. Organisms do not contain language models, neural networks or learning algorithms. AI assistance was used to build and analyze the software, not to decide the actions of simulated organisms.

### 2.3 Entities state variables and scales

Space is a 1000 × 650 rectangle in arbitrary model units. Body centers reflect at its walls and are clamped inside the boundary. A fixed tick advances 0.1 model seconds. One displayed day equals 12 model seconds, or 120 ticks. The checkpoint at day 8 is exactly tick 960, and the endpoint at day 16 is exactly tick 1920. A displayed day has no asserted correspondence to a biological day.

An organism has a persistent ID, parent ID, lineage ID, generation, three genes, position, heading, age, energy and bookkeeping fields. The latter record food eaten, children, most recent feeding time, next wandering change, wandering heading and birth time. Age and energy are individual state variables. A generation value describes genealogical depth; it does not advance synchronously across a population.

Food particles have a position and an availability flag. Fixed patch centers determine where new particles are concentrated. Optional circular rocks alter local geometry. World state includes the pseudo-random generator state, tick, time, next organism ID, organism and food arrays, obstacles, environmental options, spawn credit, cumulative births and deaths, patch locations, history and recent events. Array order is retained because it participates in deterministic scheduling.

Lineage is a permanent descent label. A child keeps its parent's label even if mutation changes all of its trait values substantially. Labels therefore are not species, behavioral classes or clusters recomputed from the current genes. Between-lineage composition and within-lineage trait evolution are distinct processes in this model.

### 2.4 Initialization and founder traits

Every world begins with five organisms in each of six lineages, for a total of 30. Table 2 gives the center of each founder trait distribution. Each founder gene receives an independent uniform perturbation between −0.06 and +0.06, then is clamped to the interval [0.45, 1.75]. Thus the table gives initialization centers rather than identical genes shared by all members of a lineage.

**Table 2 Founder trait centers**

| Lineage | Speed s | Sense q | Thrift h | Initial organisms |
| --- | --- | --- | --- | --- |
| Akım | 1.42 | 0.86 | 0.78 | 5 |
| Çiy | 0.78 | 1.12 | 1.35 | 5 |
| Köz | 1.12 | 1.25 | 0.92 | 5 |
| Sis | 0.90 | 1.45 | 1.08 | 5 |
| Yankı | 1.24 | 0.70 | 1.15 | 5 |
| Filiz | 0.95 | 0.92 | 1.20 | 5 |

Founders are placed uniformly inside an inset rectangle: x = 50 + 900U and y = 50 + 550U, where each U is a draw in [0, 1). Initial headings are uniform over a full circle. Initial energy is 58 + 28U, and age is zero. The first wandering update is scheduled at an offset below two model seconds. Initialization then generates 210 food particles. Founders and food are created in fixed loop order; changing that order would change which random draws are assigned to which entities.

### 2.5 Randomness and deterministic continuation

All model randomness is supplied by a Mulberry32 pseudo-random generator with unsigned 32-bit state. Input seeds are coerced to that range, and zero is a valid seed. Founder variation, positions, food placement, wandering and offspring mutation consume the same generator. The renderer consumes none of its draws, and the engine does not call `Math.random`.

A seed is sufficient only when the model version, options and intervention sequence are also fixed. An interactive food addition consumes random draws and changes later outcomes. A full checkpoint is stronger than a seed alone because it preserves the exact state reached after all earlier actions. Restoring a checkpoint makes a deep copy of every serialized field, without shared organism or food arrays.

Cloned branches begin with identical generator states. They do not maintain event-by-event common random numbers after divergence. For example, a different number of births or wandering events changes the number of consumed draws, and later food placement may then differ as well. The recorded contrast includes the full consequence of the intervention in this shared-stream implementation. It is not an energy-only effect under a separately fixed future sequence of food events.

### 2.6 Food renewal and spatial supply

With seasons disabled, the attempted renewal rate is 15R particles per model second, where R is the resource multiplier. Abundance uses R = 1.00, giving 15 attempts per second; drought uses R = 0.15, giving 2.25. A fractional spawn-credit accumulator receives rate × 0.1 each tick. While credit is at least one, an attempt is made and one credit is spent. This avoids rounding a fractional rate separately at each tick.

One of five patches is chosen uniformly for each attempted spawn. Patch centers are (170, 170), (740, 145), (460, 355), (210, 535) and (810, 490). The x offset is 215(U₁ + U₂ − 1), and the y offset is 180(U₃ + U₄ − 1). These triangular offsets concentrate food toward a patch center before coordinates are clamped at least 12 units from the world boundary. Clamping changes the distribution near edges; it is part of the implemented supply rule.

At most 420 food particles can exist. A capped attempt produces no new particle. An attempted point inside a rock's exclusion zone is rejected without retry, and its credit is still spent. Therefore the configured rate is an attempted supply rate, not a guarantee of realized additions. In the recorded experiments no rocks were present. Food has no expiration time and is removed only by consumption or a manual rock placement. Existing checkpoint food remains in all experimental branches: drought reduces renewal rather than instantaneously removing stored resources.

### 2.7 Sensing movement and sequential competition

Each tick, surviving organisms search for the nearest available food strictly within a radius of 70q. A spatial grid with 100-unit cells limits the search cost. The search uses the organism's position before movement. Distance ties follow the fixed iteration order because a candidate replaces the current nearest particle only when its squared distance is strictly smaller.

The organism turns toward the target by at most 0.42 radians per tick, using a wrapped angular difference. If there is no target and its wandering update is due, it chooses a wandering heading by adding (U − 0.5) × 2.6 radians to its current heading and schedules the next change 0.8 + 1.8U model seconds later. A target is not recomputed after movement during the same tick.

Movement speed is determined jointly by speed and thrift:

```equation
v(s,h) = 24s / (0.75 + 0.25h)
```

The per-tick displacement is v × 0.1 in the new heading. A wall collision reflects the relevant heading component and resets the wandering direction; the center is then clamped inside the world. Food is consumed only if the selected particle is still available and the moved organism is strictly less than 12 units away. Consumption adds 25 energy, capped at 150. At most the selected particle is eaten by that organism in a tick.

Agents are processed sequentially. Priority begins at the index tick modulo the old population size and then wraps through the old array. Food consumed by an earlier organism is immediately unavailable to later organisms. Survivors are collected in this processing order, followed by newborns, so array order evolves. This rotating priority avoids a permanent first-agent advantage but does not make the simulation simultaneous or eliminate all scheduling effects.

### 2.8 Energy reproduction inheritance and death

At the beginning of an organism's update its age increases by 0.1 and its energy decreases by 0.1 times the cost rate:

```equation
C(s,q,h) = (0.55 + 1.2s² + 0.30q²) / h
```

Speed and sense have quadratic costs, while thrift divides the total cost. An organism dies immediately if its energy is non-positive or its age reaches 130 + 30h model seconds. These checks occur before movement and feeding, so an organism that has already exhausted its energy cannot be rescued by nearby food later in the same tick.

After movement and any feeding, reproduction occurs if age is strictly above five model seconds, energy is strictly above 92 + 26h, and the population-cap check permits a birth. The parent loses 48 energy and the child starts with 40; reproduction therefore removes eight units of total energy. The child is placed 12 units from the parent in a random direction, then clamped and displaced from any rock. It begins at age zero, generation one above the parent and with a new unique ID. Newborns are not processed until the next tick.

Each offspring gene is inherited independently with a bounded additive perturbation:

```equation
g_child = clamp(g_parent + ε, 0.45, 1.75)
ε ∼ Uniform(−m, +m)
```

The mutation setting m = 0.08 is an absolute amplitude. It is not an 8% probability of mutation, an 8% proportional change, or a biological mutation rate. Every child samples a perturbation for each gene. Clamping at the bounds alters the resulting distribution near those bounds. There is no recombination, mating or exchange between parents.

The population cap is 240. Its conservative check uses the old population length plus the number of newborns already created in that tick. It does not subtract deaths encountered earlier in the tick. Some births may therefore wait until the next tick even if a death has freed space. At every completed step the accounting identity is living population = 30 + cumulative births − cumulative deaths.

Thrift has four direct consequences: higher h reduces energy expenditure, reduces movement speed at fixed s, raises the energy threshold for reproduction, and raises the age limit. It is therefore a trade-off parameter, not a pure efficiency coefficient. “Normalization” is the intervention's name for assigning h = 1.00, not a claim that 1.00 is biologically normal or statistically standardized.

### 2.9 Exact process schedule

The schedule below is part of the model specification. Reordering feeding, mortality or reproduction could change the results even with the same formulas.

1. Increment tick and derive time as tick × 0.1.
2. Add renewal credit, attempt food spawns and spend their credit.
3. Build the food grid from the current food array.
4. Choose the rotating processing offset from tick and old population length.
5. For each old organism in that order, increase age and debit energy.
6. Remove organisms that fail the energy or age test from further processing.
7. Find food, turn or wander, move, reflect at walls and resolve rocks.
8. Eat the selected food if the strict distance and availability tests pass.
9. Apply the reproduction rule and collect a newborn if permitted.
10. Replace the agent array with survivors followed by newborns; remove consumed food.
11. Record history every ten ticks, equivalent to one model second.

Population history retains the latest 600 samples. The event log retains twelve messages. These are observation limits rather than ecological population limits; the complete living state remains available in a snapshot. The tested 16-day horizon is 192 model seconds and therefore does not reach the history-retention limit.

### 2.10 Optional interactive mechanisms excluded from the study

The application can multiply renewal by a seasonal factor of 0.65 + 0.35 cos(day × π/4). Its period is eight displayed days, ranging from 1.00 at day 0 to 0.30 at day 4 and back to 1.00 at day 8. Seasons were disabled throughout the recorded experiments. Resource sliders support multipliers from 0 to 2, and the mutation slider supports amplitudes from 0 to 0.25; the experiment fixes these values rather than inheriting arbitrary observation-view settings.

Manual food placement makes 22 spawn attempts near a clicked point, using offsets up to 45 units in each direction. Rocks have radius 28, repel body centers to radius 35 and exclude food within radius 31. Their centers are clamped 40 units inside the boundary; at most twelve may be placed and their centers must be at least 70 units apart. Adding a rock removes food in its exclusion zone and displaces organisms. There is no global route planning, so a food-seeking organism can become locally trapped at a rock. No manual food, rock or mid-branch setting changes were used in the batch.

### 2.11 Initial paired protocol

For each seed, a fresh world runs for 960 ticks at R = 1.00, m = 0.08 and seasons off. At that checkpoint the entire snapshot is cloned. One branch continues at R = 1.00; the other uses R = 0.15. Each runs exactly 960 further ticks. This gives an equal branch duration, an identical starting food stock and identical pre-intervention genealogical history.

The leader set contains every lineage tied for the highest positive living count. Baseline leadership is retained when at least one day-8 leader belongs to the endpoint leader set. This is a set-intersection rule; it does not require sole leadership or the survival of a particular individual. A world with no living organisms has no leader and an undefined persistence outcome. The analysis preserves ties rather than breaking them alphabetically or by lineage index.

### 2.12 Post hoc paired estimands

Let n be a lineage's final count, N the final total population, i a seed, A abundance and D drought. Share in percent is 100n/N. A lineage absent from a living world has share zero. When N = 0, shares are undefined rather than forced to zero. In this batch every whole world survived, so all twelve pairs contribute to every reported share contrast.

```equation
p_i = 100n_i / N_i
Δp_i = p_i,D − p_i,A
Δn_i = n_i,D − n_i,A
```

Reported share means average each seed's share, giving each initial condition equal weight. They are not calculated by pooling organisms across worlds. Likewise, mean population reduction averages 100(1 − N_D/N_A) across seeds and is not the percentage reduction calculated from the two mean population sizes. The paired analysis also classifies endpoint leader sets as identical, partially overlapping or disjoint and cross-tabulates baseline-leader persistence in both branches.

These questions were formulated after the original outcomes were available. Their results are descriptive discoveries, not prospectively confirmed predictions. No p-values, confidence intervals, family-wise error corrections or optimized significance thresholds were introduced for this twelve-seed case study.

### 2.13 Four arm targeted thrift intervention

The follow-up protocol was committed as `4352cde6c77044e0fc1242ae66757940c1421403` before the current four-arm batch outcomes were examined. Its runner was frozen at execution revision `eceb3c6166f798688bde2cef23472f219861de7a`. The ecological engine remained unchanged. These records establish ordering in the initially private repository, subsequently made public; they are not an external registry. The later unseen-seed replication has a separate protocol and evidence file.

For each original seed, the runner regenerates the day-8 checkpoint and creates four complete copies. In the two normalized branches it sets only `genes.thrift` of organisms whose permanent lineage is Çiy to exactly 1.00. The edit is applied once to the living checkpoint cohort. It does not affect founders retrospectively, resurrect dead members, edit another lineage, reset energy or erase food. It consumes no random draw. Mutation remains 0.08, so descendants can depart from 1.00 immediately through inheritance.

**Table 3 Four branch conditions after the checkpoint**

| Arm | Code | Renewal multiplier | Day 8 Çiy thrift edit |
| --- | --- | --- | --- |
| Natural abundance | A | 1.00 | None |
| Natural drought | D | 0.15 | None |
| Normalized abundance | XA | 1.00 | Set living cohort to 1.00 once |
| Normalized drought | XD | 0.15 | Set living cohort to 1.00 once |

Except for the declared resource setting and gene edits, the starting clones retain positions, headings, energy, ages, all other genes, organism ordering, IDs, food, renewal credit, counters and generator state. Both the mean and the variation of the edited cohort's thrift values change. The raw file saves the complete checkpoint, IDs and before/after gene values, checkpoint and arm-start hashes, all final full statistics and final-state hashes.

### 2.14 Primary interaction and secondary outcomes

The primary follow-up outcome is final Çiy share in percentage points. For each seed, normalization effect means normalized minus natural within the same environment. The interaction subtracts the abundance effect from the drought effect:

```equation
E_A,i = p_XA,i − p_A,i
E_D,i = p_XD,i − p_D,i
I_i = E_D,i − E_A,i
```

A negative interaction means the intervention lowers share more, or raises it less, in drought than in abundance. It does not mean that drought has a negative effect on share in every arm, or that all individual worlds share the same mechanism. The prespecified directional prediction was a negative average share interaction.

The same contrasts are calculated separately for absolute Çiy count. Total population, target-lineage extinction and whole-world extinction provide additional context. Means, medians, observed ranges and counts of negative, zero and positive contrasts are reported. Undefined shares would be excluded with explicit denominators, while count outcomes would remain defined. Here all twelve interactions are defined. An observed range is not a confidence interval, and a sign count is not reported as a probability of replication.

### 2.15 Software verification and evidence preservation

The dependency-free application and scientific runners use Node.js 22 or newer. The expanded suite contains 41 tests, including comparison of the new runner with the complete original seed-4217 checkpoint and all four endpoints, deterministic paired resampling, strict decision boundaries, undefined shares and rejection of altered records. Tests before the first replication run used known old outcomes and synthetic validation fixtures; they did not execute any of seeds 10000–10099.

Source checks validate JavaScript syntax, both pages' DOM targets, public asset paths and generated report freshness. Original and replication runners refuse raw-file replacement. Full replay reconstructs 48 original and 400 new branch outcomes, complete checkpoints, edits, starting hashes and final-state hashes. A separate standard-library Python audit recalculates the new endpoints, interactions, summaries and both 20,000-resample intervals without running the ecological engine. CI repeats verification before deployment.

These checks support computational consistency, not ecological realism, absence of every possible bug or biological mechanism. Cross-platform CI replay demonstrates execution in its configured environment; it does not guarantee bitwise portability to every future JavaScript implementation.

### 2.16 Prospective replication in previously unexamined worlds

The replication protocol was fixed and pushed as `2158e085b706c647829637182d51829231b8ff77` before any new world was executed or examined. Implementation and tests were committed at `274454f164f9ecb8474c25856cee2be4a3adad8f`, the execution revision recorded in the raw batch. Exactly 100 seeds, 10000 through 10099 inclusive, were run in ascending order. There was no pilot, replacement, optional stopping, threshold change or parameter search on these seeds. The count of 100 was a fixed practical design choice, not the output of a power or precision calculation. It provides 100 new paired units and 400 branches, with no pooling of old worlds for the primary estimate.

The engine and existing checkpoint/fork functions were unchanged. Each seed underwent 960 shared warmup ticks and 960 ticks per branch with the conditions in Table 3. All 100 complete checkpoints, edited IDs and before/after values, starting hashes, final full statistics and endpoint hashes were saved separately. Hashes identify the protocol, runner, original helper and original contrast implementation. Seeds are held out from the earlier investigation by nonuse before this protocol; a consecutive integer range is not random sampling over all uint32 seeds.

The mean share interaction was the primary estimate. The prospective criterion required all 100 share interactions to be defined, a negative mean and an upper endpoint below zero in the central 95% percentile-bootstrap interval. An interval crossing or touching zero would yield an inconclusive criterion; a wholly positive interval would support the opposite direction under this rule. Any undefined share interaction would make the primary criterion inconclusive, while eligible estimates and count results would still be reported. An absent Çiy lineage in a living world is zero share, whereas whole-world extinction makes share undefined. A checkpoint without living Çiy would remain an intention-to-intervene unit with zero edits.

For each reported interaction outcome, 20,000 bootstrap samples drew whole paired seed records with replacement, each with the eligible sample size. Organisms and individual arms were never resampled separately. A separate Mulberry32 analysis generator was reset to seed 20261014 for each outcome and never touched ecological RNG state. Sorted bootstrap means were interpolated at indices (19999 × 0.025) and (19999 × 0.975), using type-7 quantiles [7]. No p-values, multiplicity claims or new inferential decision thresholds were introduced for secondary outcomes.

The interval measures resampling variation in this chosen ensemble. Interpretation as a population confidence interval requires representative, exchangeable seed outcomes, which the fixed consecutive range does not establish. Percentile intervals also need not have nominal finite-sample coverage [8]. Meeting the declared criterion is therefore a conditional replication result, not a biological test or a guarantee for arbitrary initial conditions. The original twelve-seed results remain descriptive and receive no retroactive confidence interval.

Secondary summaries include count effects, all arm population/count/share means, sign counts, observed ranges, target and whole-world extinctions, natural drought-minus-abundance contrasts and leadership retention. Complete new endpoint ledgers appear in Appendix D. Extreme or reversed worlds are inspected only after the primary analysis and are labeled descriptive.

## 3 Results

### 3.1 Baseline leadership and subsequent transitions

At day 16, baseline leadership persisted in nine abundance branches and five drought branches. Thus leadership changed in three abundance branches and seven drought branches. The difference between those marginal change counts is four, but it is not the number of worlds in which drought alone changed the outcome. The paired transition table shows why.

**Table 4 Baseline leadership persistence in paired branches**

| Abundance outcome | Drought retained | Drought changed | Row total |
| --- | --- | --- | --- |
| Retained | 2 | 7 | 9 |
| Changed | 3 | 0 | 3 |
| Column total | 5 | 7 | 12 |

Seven seeds retained baseline leadership only in abundance, while three retained it only in drought. Two retained it in both branches, and none lost it in both. The direction of a comparison therefore depends on its paired definition, not just on subtracting totals. For example, seed 4217 began with Filiz leading, ended with Yankı leading in abundance, and retained Filiz in drought.

The final abundance and drought leader sets were disjoint in nine pairs, identical in two and partially overlapping in one. Seed 4228 had an abundance tie between Yankı and Filiz and a drought lead for Filiz, producing partial overlap. Seed 4221 began with a tie between Köz and Filiz; its drought lead for Köz satisfies the stated retention rule. Appendix A preserves the complete leader ledger.

### 3.2 Population reduction and lineage composition

Mean total population was 147.33 in abundance and 13.50 in drought, a mean paired difference of −133.83 organisms. Drought population was lower in all twelve seeds. The mean within-pair percentage reduction was 90.83%. This is a comparison of the twelve recorded endpoints, not an estimated carrying capacity or a long-run extinction rate.

![Figure 1 Total population in the original paired branches](figures/population.png)

Figure 1. Each point is a day-16 population from one original branch. Blue denotes abundance and brown drought. The horizontal axis identifies initial conditions, not time; points are deliberately unconnected. All twelve drought populations are below their paired abundance values. The same natural endpoints recur in the four-arm replay and are not additional replicates.

**Table 5 Mean lineage counts and equal seed mean shares**

| Lineage | A count | D count | A share % | D share % | D minus A pp |
| --- | --- | --- | --- | --- | --- |
| Akım | 3.50 | 0.00 | 2.41 | 0.00 | −2.41 |
| Çiy | 26.67 | 4.67 | 17.91 | 33.42 | +15.51 |
| Köz | 17.50 | 0.92 | 12.12 | 7.86 | −4.27 |
| Sis | 11.42 | 1.00 | 7.75 | 7.23 | −0.51 |
| Yankı | 41.58 | 1.42 | 28.32 | 11.12 | −17.21 |
| Filiz | 46.67 | 5.50 | 31.49 | 40.37 | +8.89 |

All six lineages had a lower mean absolute count in drought. Çiy and Filiz nevertheless gained mean share, by 15.51 and 8.89 percentage points respectively. Çiy had a higher drought share in ten seeds and a lower share in two. Filiz had a higher share in eight. Akım had no surviving members in any drought endpoint, while it was already absent from two abundance endpoints. These are lineage extinctions within surviving worlds, not whole-world extinctions.

For Çiy, the key observation is simultaneous absolute loss and relative gain: mean count 26.67 to 4.67, mean share 17.91% to 33.42%. A description such as “Çiy grew under drought” would therefore be incorrect. Its representation among survivors increased on average while the entire population contracted sharply.

### 3.3 Four arm endpoints

Every natural follow-up endpoint matched its original full recorded statistics. This equality is a replay check and also means the natural endpoints cannot be counted again as new evidence. The normalized arms produced the endpoints summarized in Table 6.

**Table 6 Four arm Çiy endpoints with equal seed weighting**

| Arm | Mean total N | Mean Çiy n | Mean Çiy share % | Çiy extinctions |
| --- | --- | --- | --- | --- |
| A | 147.33 | 26.67 | 17.91 | 0 of 12 |
| D | 13.50 | 4.67 | 33.42 | 0 of 12 |
| XA | 141.83 | 17.75 | 12.46 | 0 of 12 |
| XD | 13.00 | 2.25 | 15.56 | 4 of 12 |

Mean total population decreased by 5.50 organisms in normalized abundance and 0.50 in normalized drought. The normalized-drought total of 13.00 illustrates that a substantial target-lineage change can occur with a much smaller change in whole-world population. Other lineages can occupy a larger fraction of that remaining population. No whole-world extinction occurred in any of the 48 branches.

### 3.4 Primary share contrasts

Normalization lowered mean Çiy share by 5.46 points in abundance and 17.86 points in drought. The difference of those effects was −12.40 points. The corresponding median interaction was −6.90 points, with individual interactions extending from −57.73 to +12.47. Eight seeds had a negative interaction and four a positive one; none were exactly zero.

**Table 7 Normalization effects on Çiy share in percentage points**

| Contrast | Mean | Median | Minimum | Maximum | Negative | Zero | Positive |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XA minus A | −5.46 | −5.50 | −13.86 | +1.16 | 10 | 0 | 2 |
| XD minus D | −17.86 | −13.00 | −61.54 | +6.67 | 11 | 0 | 1 |
| Interaction | −12.40 | −6.90 | −57.73 | +12.47 | 8 | 0 | 4 |

![Figure 2 Share interaction for each seeded initial condition](figures/share-interaction.png)

Figure 2. Blue points show the primary interaction for each seed. Gray points mark zero and brown points the mean interaction of −12.40 percentage points. The predicted direction is below zero. The references are levels, not uncertainty limits; no confidence interval is shown. Seeds are categorical initial conditions represented by their integer identifiers. The spread and four positive interactions qualify the negative mean.

The natural drought–abundance share difference was +15.51 points, while the normalized difference was +3.10. Their difference is the same −12.40-point interaction. It would be inappropriate to divide these values and report a fraction of drought advantage “explained” by thrift: the intervention changes multiple mechanisms and variance, interacts with the ecosystem, and operates on a compositional outcome. No mediation estimand was specified or identified.

### 3.5 Secondary counts and the denominator effect

The count results differ from the share results. Normalization lowered mean Çiy count by 8.92 organisms in abundance and 2.42 in drought. Consequently the count interaction was +6.50 organisms, with a median of +8.00 and observed range −7.00 to +23.00. Nine count interactions were positive and three negative.

**Table 8 Normalization effects on Çiy count in organisms**

| Contrast | Mean | Median | Minimum | Maximum | Negative | Zero | Positive |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XA minus A | −8.92 | −10.00 | −23.00 | +2.00 | 10 | 0 | 2 |
| XD minus D | −2.42 | −2.50 | −8.00 | 0.00 | 7 | 5 | 0 |
| Interaction | +6.50 | +8.00 | −7.00 | +23.00 | 3 | 0 | 9 |

Seed 4220 gives a concrete denominator example. Natural drought ended with four Çiy organisms out of fifteen, or 26.67%. Normalized drought also ended with four Çiy, but out of twelve, or 33.33%. The count effect is zero while the share effect is +6.67 points. In that same seed, the full share interaction is +12.47 points, opposite to the primary prediction. Preserving this world in the report prevents an average negative effect from being mistaken for an invariant response.

### 3.6 Target lineage extinction and heterogeneity

Çiy disappeared in normalized drought for seeds 4217, 4222, 4225 and 4227. Natural drought retained Çiy in all twelve seeds, and neither abundance arm lost the target lineage. A zero target count contributes a zero share because another lineage still survives; these four outcomes are not missing data.

The most negative share interaction occurred at seed 4222, at −57.73 points. Its natural drought endpoint contained eight Çiy among thirteen organisms, while normalized drought contained none. The mean interaction is therefore accompanied by a noticeably less negative median. Both measures are reported without trimming or removing extreme worlds. The four opposite-sign interactions at seeds 4220, 4221, 4223 and 4226 also remain in every summary. Appendix B gives every arm and contrast, including the edited cohort sizes and endpoint thrift means.

### 3.7 Replication on 100 unseen seeds

The prospective criterion was met: all 100 share interactions were defined, their mean was −14.73 percentage points, and the bootstrap interval [−18.69, −10.75] lay below zero. The median was −14.67 and the observed range was −70.27 to +47.61. Eighty-one interactions were negative, none zero and nineteen positive. This reproduces the average direction in a disjoint set of initial conditions while retaining substantial heterogeneity.

**Table 9 Replication arm means at day 16**

| Arm | Mean total N | Mean Çiy n | Mean share percent | Çiy extinctions |
| --- | --- | --- | --- | --- |
| A | 146.01 | 28.28 | 19.25 | 0 of 100 |
| D | 14.73 | 6.34 | 42.25 | 0 of 100 |
| XA | 140.96 | 20.29 | 14.35 | 0 of 100 |
| XD | 13.90 | 3.13 | 22.63 | 10 of 100 |

Natural drought reduced mean Çiy count from 28.28 to 6.34 while increasing mean share from 19.25% to 42.25%. The equally weighted mean share difference was +23.00 points; 97 worlds had a share gain and three a loss. Natural count fell in 99 worlds and increased in one. Thus the original mean count/share pattern recurred, but a lower count was not universal in the new set. Mean total population was 146.01 in natural abundance and 14.73 in natural drought.

**Table 10 Replication interactions and paired bootstrap intervals**

| Outcome | Mean | Median | Minimum | Maximum | 95 lower | 95 upper |
| --- | --- | --- | --- | --- | --- | --- |
| Share pp | -14.73 | -14.67 | -70.27 | 47.61 | -18.69 | -10.75 |
| Count n | 4.78 | 4.00 | -18.00 | 29.00 | 3.01 | 6.56 |

The count interaction averaged +4.78 organisms, with median +4.00, range −18 to +29 and interval [+3.01, +6.56]. Thirty were negative, three zero and 67 positive. Normalization changed mean count by −7.99 in abundance and −3.21 in drought, while the corresponding share effects were −4.90 and −19.63 points. The sign difference between the two outcome scales therefore persisted. These count estimates are secondary descriptive context, not a second primary success criterion.

![Individual share interactions in 100 unseen seeds with the mean and its paired bootstrap interval](figures/replication-interactions.png)

Figure 3. Each point is one new seed's share interaction. Blue denotes the predicted negative direction and brown the reversed direction. The dark horizontal line is the mean, the pale band its central 95% paired-bootstrap interval, and gray marks zero. The band describes resampling uncertainty of the mean; it is not an interval for individual outcomes or validated coverage across all possible seeds. Seed identifiers are initial conditions rather than a time trajectory.

**Table 11 Original and unseen ensembles kept separate**

| Batch | Share interaction | Count interaction | Negative share interactions |
| --- | --- | --- | --- |
| 12 original seeds | −12.40 pp | +6.50 n | 8 of 12 |
| 100 unseen seeds | −14.73 pp | +4.78 n | 81 of 100 |

No whole world became extinct in any new arm. Çiy disappeared in 10 normalized-drought branches and none of the other three arms. All checkpoint target cohorts were retained in the analysis. Baseline leaders persisted in 64/100 natural-abundance branches and 35/100 natural-drought branches. Final natural leader sets were disjoint in 59 worlds, identical in 37 and partially overlapping in four. These are additional descriptive outcomes.

The strongest negative interaction was seed 10046 at −70.27 points: natural drought retained 10 Çiy out of 14 organisms, whereas normalized drought retained one out of 15. The largest positive interaction was seed 10058 at +47.61 points: its abundance normalization effect was −12.19 points, while its drought effect was +35.42 points. Natural drought had five Çiy out of 15 and normalized drought eleven out of 16. These post hoc extremes illustrate how opposite outcomes remain compatible with a negative mean; they are not new mechanistic tests or exclusion grounds.

## 4 Discussion

### 4.1 What the experiment establishes within its rules

The first stage shows that numerical leadership after eight days of abundance does not guarantee leadership after another eight days of scarcity. The control comparison adds that leadership can also change during continued abundance. The paired records locate these changes in individual worlds rather than treating the marginal retention totals as causal case counts.

The post hoc composition analysis identifies Çiy as a lineage whose representation among drought survivors increased on average. The follow-up then changes an actual state variable rather than merely correlating a lineage's original profile with its outcome. With all other checkpoint state preserved, setting the living Çiy cohort's thrift to 1.00 changes later outcomes. This supports a causal statement about that implemented intervention within these deterministic worlds, including subsequent ecological feedback and divergence of random-event paths.

The primary predicted average interaction is present: the share effect is more negative under drought. The evidence is conditional on the frozen engine, chosen initial conditions, one-time edit and eight-day branch horizon. The median and seed-level directions show that the effect is heterogeneous. The experiment supplies an average pattern in the recorded worlds, not a guarantee for an arbitrary new seed.

### 4.2 Why thrift cannot be reduced to energy conservation

At fixed speed and sense, lowering thrift increases expenditure. That gives a plausible route to a lower target population when food is scarce. However, the same edit also increases movement speed, lowers the reproduction energy threshold and lowers the age limit. Those consequences can oppose one another over different parts of a trajectory. Normalization also removes all thrift variation among the treated checkpoint organisms while retaining variation in other traits.

The current design does not distinguish these channels. An energy-only mechanism would require an explicit model modification or a carefully specified alternative intervention, followed by a new protocol. Nor does the experiment establish that high thrift is necessary or sufficient for drought leadership. Çiy retains a particular history, sense and speed distribution, spatial arrangement and competitor community. A different lineage with the same thrift value is not tested by this intervention.

Mutating descendants further complicate a simple static explanation. The treatment is a reset of a living cohort at day 8, not a permanent prohibition on higher thrift. Endpoint means in normalized arms can differ from 1.00 because descendants mutate and surviving members are selected by the model. That fact is evidence about how the intervention was implemented; the present article does not infer a separate adaptive optimum from those endpoint averages.

### 4.3 Why outcome scale changes the conclusion

Share and count answer different questions. The primary share outcome asks how strongly Çiy is represented in the surviving community. The count outcome asks how many Çiy organisms remain. Because drought populations are much smaller, losing a few organisms can produce a large share change, whereas losing more organisms in abundance can produce a smaller change in percentage points.

The positive mean count interaction and negative mean share interaction are therefore not a contradiction. They show that “thrift matters more in drought” is underspecified. The statement is supported here for the average normalization effect on relative share, but the absolute count loss is larger in abundance. Leadership is a third outcome, based on a rank set rather than either effect size. Reporting all three avoids converting one definition of success into another after observing the results.

Shares are also compositional: the six values sum to 100% in every living world. A target's share can change because its count changes, because competitors change, or both. The total-population outcome and seed 4220 example make the denominator visible. Treating a higher share as evidence of growth would discard that information.

### 4.4 Seed reuse and protocol timing

The four-arm protocol was fixed before examining its batch, which limits opportunities to change the target, horizon or primary contrast in response to those outcomes. It does not erase the exploratory history. Çiy was selected after its share gain was observed, and the same twelve initial conditions were reused. A prospective intervention on previously studied worlds is more structured than a wholly post hoc explanation, but it is not an independent confirmation on unseen worlds.

No formal sampling model was specified for selecting these twelve consecutive seeds. The reported means describe them exactly up to numerical rounding. Confidence intervals or significance language could suggest a broader population of worlds without defining how that population was sampled. We therefore retain descriptive summaries and complete seed-level results. The subsequent 100-seed replication fixed its range, sample size, uncertainty method and criterion before execution. It met that criterion, while 19 reversed outcomes remained. Its sample size was pragmatic rather than precision-derived, and the chosen range does not establish probability sampling. The bootstrap interval is therefore reported with the restricted interpretation in Section 2.16, rather than retroactively treating the original twelve worlds as confirmatory.

### 4.5 Structural and numerical limitations

The model omits predation, sexual reproduction, recombination, immigration, disease, learning and an explicit genotype-to-phenotype developmental process. Genes are bounded numerical controls connected directly to equations. Lineage labels remain fixed even when descendants change traits. Consequently, persistence of a label cannot be equated with conservation of its founder phenotype.

Spatial structure is imposed through five fixed food patches and reflecting boundaries. Patch clamping, food and population caps, strict distance thresholds, sequential processing and the conservative birth check can all influence competition. The rotating schedule moderates one ordering issue without demonstrating neutrality to all alternative schedules. A 0.1-second tick is fixed for reproducibility, but no step-size convergence study has been conducted.

The endpoint is a transient measurement at day 16. It does not establish equilibrium, long-term carrying capacity, eventual fixation or a lifetime fitness ranking. Existing food carries over into drought, and resource renewal changes while other environmental properties remain constant. This intervention represents one model of scarcity rather than every possible resource shock. Seasonality and physical obstacles are available in the interface but absent from the study, so the results say nothing directly about those conditions.

Reproducible execution does not make these assumptions empirically correct. Tests and hashes answer whether the recorded computation can be reconstructed and whether internal constraints hold. Biological validation would require a defined real target, relevant observations, a calibration strategy and out-of-sample checks. No such validation is part of Morrow 0.1, and no economic or trading prediction follows from it.

### 4.6 Future work derived from the present limits

The unseen-seed batch completes one extension: testing the unchanged contrast beyond the initial twelve worlds. A further study could specify random seed sampling and a precision-based sample size, or repeat disjoint ensembles independently. Expanding the seed count alone does not test sensitivity to the model's structural assumptions.

A second extension could separate thrift's pathways by changing the energy divisor independently from movement, reproduction and lifespan. Such a change would define a new model and would need its own explicit estimand. Another design could preserve the treated cohort's thrift variance while shifting its mean, or compare interventions at multiple checkpoint times. These would answer different questions from a one-time assignment to 1.00.

Sensitivity studies could examine tick size, branch duration, spatial supply, mutation amplitude, population caps and alternative scheduling rules. A multistream generator could hold particular environmental event streams aligned across branches, but that would alter the stochastic coupling and would need separate interpretation. None of these proposed studies has been run or is claimed as evidence in this article.

## 5 Reproducibility and access

### 5.1 Evidence package and immutable identifiers

The evidence is stored in the public repository [kulieff21 Morrow](https://github.com/kulieff21/Morrow). The final pre-article explanatory revision is `75cbe6901fcdfa604d8f0b357035ce74e1809961`. The model, original batch and follow-up inputs have the identifiers in Table 12. SHA-256 values identify bytes; a changed line ending or formatting byte will change a digest even when a reader considers the content equivalent.

**Table 12 Frozen evidence identifiers**

| Artifact | Repository path | SHA256 |
| --- | --- | --- |
| Ecological engine | src/engine.js | 132e0bd255913caba45f38a98dc9e23f700502402cc6b21304c99e52f66b79c7 |
| Original paired batch | docs/initial-batch.json | 5576ea15805262502465348b160ef4ff4c56e7cdf5de8122bd04f437e284ba18 |
| Follow-up protocol | docs/thrift-protocol.md | bb2c7d2da5dac4109e9e3c4b12a778a53b04b303820572789f14e23c29273919 |
| Complete follow-up evidence | docs/thrift-raw.json | 88a55655488c95447dc283a4af58b42151578e7062441a5b19cb152ad473d9c8 |
| Unseen seed protocol | docs/replication-protocol.md | 536e2a8ce51b8c037ef8d80cdbac435fe5f09b501d4b69a9b4a9dfd4c84e71bd |
| Unseen seed raw evidence | docs/replication-raw.json | 321feaa61e0eeffb05a4e964521dfd8559d5a0372e04347baa6785af5befabaa |
| Unseen seed implementation | scripts/replication.mjs | b7604dfb1c248d089ac140e32c83bb70198202082f58a79f33a68bb576d48587 |

The pre-article CI run [38539248610](https://github.com/kulieff21/Morrow/actions/runs/38539248610) passed the original checks and replay. Elmar subsequently authorized public visibility and GitHub Pages on 14 October 2026. The [public case study](https://kulieff21.github.io/Morrow/) links the interactive app, evidence and article download. The initial manuscript at revision c1409cc retained a private-access statement; this second revision updates access and adds the separately identified replication. No dataset DOI, open-source license, journal submission or peer review is claimed.

Machine-readable files, version control, checksums and executable analyses follow practical reproducibility principles [4]. They improve provenance but do not by themselves establish full FAIR compliance [5]. Public Git access improves discovery and access, but no public archival identifier or open-source license has been assigned. Public hosting alone does not establish full FAIR compliance or long-term archival preservation.

### 5.2 Executable replay sequence

From a local checkout with Node.js 22 or newer, the following commands verify the model and regenerate or check its scientific analyses. The analysis commands read the saved evidence; the replay command reruns all four arms without replacing the raw record.

```powershell
npm test
npm run check
npm run analyze -- --check
npm run analyze:thrift -- --check
npm run experiment:thrift -- --replay
node scripts/replication.mjs --check
python scripts/check-replication.py
npm run experiment:replication -- --replay
```

To inspect a newly printed two-arm experiment without modifying the stored original file, use `npm run experiment -- 4217 4218 4219`. The CLI's standard output can be saved to a new filename chosen by the investigator. The original twelve-seed file should remain preserved rather than silently replaced by a later execution.

The browser can be started with `npm start` and opened at `http://127.0.0.1:4317/pond.html`; the case study is at the root. It is an observation interface, not the authoring environment for the four-arm batch. The browser experiment remains the original two-arm protocol. The follow-up intervention and audit evidence are provided by the CLI scripts.

### 5.3 Software responsibilities

**Table 13 Source map for inspection and replay**

| Component | Responsibility |
| --- | --- |
| src/engine.js | World state, generator, fixed-step rules, snapshots and original paired protocol |
| src/app.js and src/render.js | Bilingual controls, view state, playback, observation and canvas rendering |
| server.mjs | Loopback-only static server with explicit route allowlist |
| scripts/experiment.mjs | Original multi-seed two-arm runner |
| scripts/analyze-batch.mjs | Validated paired endpoints and generated reports |
| scripts/thrift-experiment.mjs | One-time edit, four-arm execution, evidence and replay |
| scripts/analyze-thrift.mjs | Follow-up contrasts, validation and report generation |
| scripts/replication.mjs | Frozen unseen-seed runner, paired bootstrap, reports and replay |
| scripts/check-replication.py | Independent standard-library Python numerical audit |
| src/case.js and index.html | Bilingual case study, original replay and replication explorer |
| tests | Built-in Node tests for engine, server, analysis and intervention |
| scripts/build-article-evidence.py | Article appendix tables and data figures from saved JSON |
| scripts/md-to-docx.py | Reusable conversion from the article Markdown to Word |

### 5.4 Interface behavior and practical constraints

Playback speed changes how quickly fixed ticks are requested, not their mathematical size. The observation view supports pause, one-second stepping and 1×, 3× and 8× playback. Hidden tabs and inactive views do not advance; returning to the page does not fast-forward missed time. Under heavy load, playback slows rather than skipping ecological steps. Reduced-motion preference starts observation paused.

Selecting an organism follows its ID, and a selected lineage can be cycled through living members. The panel retains the last observation after that individual dies. History shows lineage composition; it is not an additional experimental record. Worlds live in memory and reset on reload. JSON exports are user initiated, and version 0.1 has no snapshot-import interface or automatic persistence. Export button execution was observed during interface verification, but saved-file delivery was not independently verified in that browser environment.

The original README image was replaced by a native 2880 × 2520 lossless PNG after a compressed preview proved blurry. That screenshot documents the interface only. Counts and figures in this article come from the JSON records rather than image measurements. The screenshot and the UI's decorative organism shapes do not supply independent observations.

The project source, Git repository, evidence and article outputs are located on the owner's D drive. This does not imply that the whole work session wrote nothing to C. Initial npm commands created small cache logs there, and the coding application's runtime and session storage use the Windows user profile. Later project npm checks direct their cache into ignored project-local storage on D. No complete before-and-after C-drive measurement exists, so a total storage footprint cannot be inferred. This operational distinction is included for provenance and does not affect the ecological outcomes.

## 6 Conclusions

The original twelve worlds linked scarcity to changed lineage composition and leadership, and identified a negative average share interaction under one-time Çiy thrift normalization. A prospective repetition on 100 previously unexamined seeds reproduced the average direction: −14.73 percentage points with central 95% paired-bootstrap interval [−18.69, −10.75]. All 100 share interactions were defined, so the prespecified criterion was met. The count interaction remained positive at +4.78 organisms; relative representation and absolute persistence remain different outcomes.

The new evidence extends the result beyond the initial exploratory worlds without changing the rules. It does not make the response universal: nineteen interactions reversed sign, and the observed range was broad. The fixed seed range, ensemble-based bootstrap interpretation, coupled trait mechanisms, one horizon and lack of empirical calibration remain substantive limits. The contribution is a traceable progression from observation through a fixed intervention to a separately identified replication, with complete public evidence rather than a biological generalization.

## 7 Contributions and declarations

### 7.1 Human direction and AI assistance

Elmar Quliyev authorized the project, its initially private repository, later public release and successive investigations including the 100-seed replication, tested the interactive application, provided feedback and requested this article. The coding assistant used in the project, referred to in the conversation as Sisyphos and operating in Codex, proposed and implemented the sandbox and follow-up analyses, executed checks, researched reporting guidance, drafted the manuscript and built its document conversion tools under that direction.

AI assistance is disclosed because substantial software and writing work was AI generated. The assistant is not listed as an accountable scientific author. Consistent with general authorship guidance [6], human review of the final claims, attribution and submission decisions remains necessary before any external submission. This document does not assert that such a submission review has already occurred. Primary evidence is the recorded model computation and cited sources, not the assistant's conversational descriptions.

### 7.2 Ethical scope

The experiment uses simulated entities and does not include human participants, animals, clinical data or an external biological dataset. The public evidence package contains generated world states rather than observations about identifiable people. The scientific claims are restricted to the implemented rules and recorded computational outcomes. Repository access and any external release of the code, data or manuscript remain under the project owner's control.

## References

[1] International Committee of Medical Journal Editors. Preparing a Manuscript for Submission to a Medical Journal. Accessed 14 October 2026. [Manuscript preparation guidance](https://icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html).

[2] Grimm V, Railsback SF, Vincenot CE, Berger U, Gallagher C, DeAngelis DL, et al. The ODD Protocol for Describing Agent-Based and Other Simulation Models: A Second Update to Improve Clarity, Replication, and Structural Realism. Journal of Artificial Societies and Social Simulation. 2020;23(2):7. [doi 10.18564/jasss.4259](https://doi.org/10.18564/jasss.4259).

[3] Morris TP, White IR, Crowther MJ. Using simulation studies to evaluate statistical methods. 2019. Author manuscript revised 2018. [Author manuscript](https://arxiv.org/abs/1712.03198); [published article doi 10.1002/sim.8086](https://doi.org/10.1002/sim.8086).

[4] Sandve GK, Nekrutenko A, Taylor J, Hovig E. Ten Simple Rules for Reproducible Computational Research. PLOS Computational Biology. 2013;9(10):e1003285. [doi 10.1371/journal.pcbi.1003285](https://doi.org/10.1371/journal.pcbi.1003285).

[5] Wilkinson MD, Dumontier M, Aalbersberg IJJ, Appleton G, Axton M, Baak A, et al. The FAIR Guiding Principles for scientific data management and stewardship. Scientific Data. 2016;3:160018. [doi 10.1038/sdata.2016.18](https://doi.org/10.1038/sdata.2016.18).

[6] International Committee of Medical Journal Editors. Use of AI by Authors. Accessed 14 October 2026. [AI disclosure and authorship guidance](https://www.icmje.org/recommendations/browse/artificial-intelligence/ai-use-by-authors.html).

[7] NIST cmomy documentation. Bootstrap confidence intervals from resampled statistics. Accessed 14 October 2026. [Percentile interval method](https://pages.nist.gov/cmomy/reference/generated/cmomy.confidence_interval.html).

[8] Hesterberg TC. What Teachers Should Know about the Bootstrap: Resampling in the Undergraduate Statistics Curriculum. 2014. [Author manuscript](https://arxiv.org/abs/1411.5279).

<!-- BEGIN GENERATED EVIDENCE -->

## Appendix A Complete paired endpoint ledger

These tables reproduce the saved endpoints. Counts are integers; shares and contrasts are rounded only for display. A comma separates tied leaders. No branch is excluded.



**Table A1 Population and lineage leadership**

| Seed | Day 8 N | A N | D N | Day 8 leaders | A leaders | D leaders |
| --- | --- | --- | --- | --- | --- | --- |
| 4217 | 162 | 139 | 14 | Filiz | Yankı | Filiz |
| 4218 | 150 | 149 | 13 | Yankı | Yankı | Çiy |
| 4219 | 172 | 153 | 19 | Çiy | Filiz | Çiy |
| 4220 | 161 | 155 | 15 | Filiz | Filiz | Filiz |
| 4221 | 163 | 136 | 12 | Köz, Filiz | Yankı | Köz |
| 4222 | 177 | 149 | 13 | Filiz | Filiz | Çiy |
| 4223 | 169 | 147 | 10 | Filiz | Filiz | Filiz |
| 4224 | 162 | 148 | 16 | Filiz | Filiz | Çiy |
| 4225 | 177 | 152 | 12 | Yankı | Yankı | Filiz |
| 4226 | 166 | 156 | 10 | Yankı | Yankı, Filiz | Çiy |
| 4227 | 155 | 132 | 13 | Yankı | Yankı | Filiz |
| 4228 | 156 | 152 | 15 | Yankı | Yankı, Filiz | Filiz |



**Table A2 Day 8 checkpoint lineage counts**

| Seed | Akım | Çiy | Köz | Sis | Yankı | Filiz |
| --- | --- | --- | --- | --- | --- | --- |
| 4217 | 13 | 17 | 37 | 24 | 32 | 39 |
| 4218 | 22 | 16 | 19 | 25 | 40 | 28 |
| 4219 | 19 | 43 | 18 | 28 | 27 | 37 |
| 4220 | 7 | 29 | 29 | 14 | 35 | 47 |
| 4221 | 10 | 22 | 40 | 18 | 33 | 40 |
| 4222 | 10 | 39 | 17 | 35 | 29 | 47 |
| 4223 | 11 | 16 | 25 | 16 | 49 | 52 |
| 4224 | 9 | 22 | 28 | 15 | 41 | 47 |
| 4225 | 7 | 19 | 34 | 16 | 55 | 46 |
| 4226 | 12 | 30 | 30 | 19 | 38 | 37 |
| 4227 | 19 | 19 | 30 | 25 | 34 | 28 |
| 4228 | 9 | 23 | 24 | 12 | 56 | 32 |



**Table A3 Natural abundance at day 16 lineage counts**

| Seed | Akım | Çiy | Köz | Sis | Yankı | Filiz |
| --- | --- | --- | --- | --- | --- | --- |
| 4217 | 1 | 8 | 26 | 10 | 54 | 40 |
| 4218 | 3 | 15 | 10 | 17 | 61 | 43 |
| 4219 | 12 | 47 | 9 | 9 | 27 | 49 |
| 4220 | 1 | 32 | 25 | 10 | 32 | 55 |
| 4221 | 0 | 20 | 36 | 8 | 43 | 29 |
| 4222 | 4 | 39 | 8 | 18 | 19 | 61 |
| 4223 | 1 | 20 | 5 | 8 | 51 | 62 |
| 4224 | 2 | 31 | 19 | 10 | 34 | 52 |
| 4225 | 0 | 22 | 19 | 13 | 50 | 48 |
| 4226 | 4 | 36 | 11 | 15 | 45 | 45 |
| 4227 | 12 | 19 | 28 | 12 | 34 | 27 |
| 4228 | 2 | 31 | 14 | 7 | 49 | 49 |



**Table A4 Natural drought at day 16 lineage counts**

| Seed | Akım | Çiy | Köz | Sis | Yankı | Filiz |
| --- | --- | --- | --- | --- | --- | --- |
| 4217 | 0 | 4 | 2 | 1 | 2 | 5 |
| 4218 | 0 | 7 | 0 | 1 | 2 | 3 |
| 4219 | 0 | 9 | 0 | 2 | 0 | 8 |
| 4220 | 0 | 4 | 0 | 1 | 0 | 10 |
| 4221 | 0 | 1 | 6 | 0 | 2 | 3 |
| 4222 | 0 | 8 | 0 | 1 | 0 | 4 |
| 4223 | 0 | 1 | 1 | 1 | 2 | 5 |
| 4224 | 0 | 5 | 0 | 3 | 4 | 4 |
| 4225 | 0 | 3 | 0 | 1 | 0 | 8 |
| 4226 | 0 | 3 | 2 | 1 | 2 | 2 |
| 4227 | 0 | 5 | 0 | 0 | 2 | 6 |
| 4228 | 0 | 6 | 0 | 0 | 1 | 8 |



## Appendix B Complete four arm endpoint ledger

A means natural abundance, D natural drought, XA normalized abundance and XD normalized drought. Each row is one paired initial condition. N denotes total living population; n denotes living Çiy descendants.



**Table B1 Total population in every arm**

| Seed | A N | D N | XA N | XD N |
| --- | --- | --- | --- | --- |
| 4217 | 139 | 14 | 141 | 16 |
| 4218 | 149 | 13 | 140 | 17 |
| 4219 | 153 | 19 | 141 | 14 |
| 4220 | 155 | 15 | 155 | 12 |
| 4221 | 136 | 12 | 142 | 17 |
| 4222 | 149 | 13 | 152 | 7 |
| 4223 | 147 | 10 | 137 | 14 |
| 4224 | 148 | 16 | 144 | 13 |
| 4225 | 152 | 12 | 142 | 13 |
| 4226 | 156 | 10 | 141 | 14 |
| 4227 | 132 | 13 | 135 | 4 |
| 4228 | 152 | 15 | 132 | 15 |



**Table B2 Çiy counts in every arm**

| Seed | A n | D n | XA n | XD n |
| --- | --- | --- | --- | --- |
| 4217 | 8 | 4 | 9 | 0 |
| 4218 | 15 | 7 | 13 | 7 |
| 4219 | 47 | 9 | 36 | 5 |
| 4220 | 32 | 4 | 23 | 4 |
| 4221 | 20 | 1 | 7 | 1 |
| 4222 | 39 | 8 | 34 | 0 |
| 4223 | 20 | 1 | 14 | 1 |
| 4224 | 31 | 5 | 15 | 2 |
| 4225 | 22 | 3 | 9 | 0 |
| 4226 | 36 | 3 | 13 | 3 |
| 4227 | 19 | 5 | 21 | 0 |
| 4228 | 31 | 6 | 19 | 4 |



**Table B3 Çiy shares in every arm in percent**

| Seed | A | D | XA | XD |
| --- | --- | --- | --- | --- |
| 4217 | 5.76 | 28.57 | 6.38 | 0.00 |
| 4218 | 10.07 | 53.85 | 9.29 | 41.18 |
| 4219 | 30.72 | 47.37 | 25.53 | 35.71 |
| 4220 | 20.65 | 26.67 | 14.84 | 33.33 |
| 4221 | 14.71 | 8.33 | 4.93 | 5.88 |
| 4222 | 26.17 | 61.54 | 22.37 | 0.00 |
| 4223 | 13.61 | 10.00 | 10.22 | 7.14 |
| 4224 | 20.95 | 31.25 | 10.42 | 15.38 |
| 4225 | 14.47 | 25.00 | 6.34 | 0.00 |
| 4226 | 23.08 | 30.00 | 9.22 | 21.43 |
| 4227 | 14.39 | 38.46 | 15.56 | 0.00 |
| 4228 | 20.39 | 40.00 | 14.39 | 26.67 |



**Table B4 Normalization share effects in percentage points**

| Seed | XA minus A | XD minus D | Interaction |
| --- | --- | --- | --- |
| 4217 | +0.63 | -28.57 | -29.20 |
| 4218 | -0.78 | -12.67 | -11.89 |
| 4219 | -5.19 | -11.65 | -6.47 |
| 4220 | -5.81 | +6.67 | +12.47 |
| 4221 | -9.78 | -2.45 | +7.33 |
| 4222 | -3.81 | -61.54 | -57.73 |
| 4223 | -3.39 | -2.86 | +0.53 |
| 4224 | -10.53 | -15.87 | -5.34 |
| 4225 | -8.14 | -25.00 | -16.86 |
| 4226 | -13.86 | -8.57 | +5.29 |
| 4227 | +1.16 | -38.46 | -39.62 |
| 4228 | -6.00 | -13.33 | -7.33 |



**Table B5 Normalization count effects in organisms**

| Seed | XA minus A | XD minus D | Interaction |
| --- | --- | --- | --- |
| 4217 | +1.00 | -4.00 | -5.00 |
| 4218 | -2.00 | +0.00 | +2.00 |
| 4219 | -11.00 | -4.00 | +7.00 |
| 4220 | -9.00 | +0.00 | +9.00 |
| 4221 | -13.00 | +0.00 | +13.00 |
| 4222 | -5.00 | -8.00 | -3.00 |
| 4223 | -6.00 | +0.00 | +6.00 |
| 4224 | -16.00 | -3.00 | +13.00 |
| 4225 | -13.00 | -3.00 | +10.00 |
| 4226 | -23.00 | +0.00 | +23.00 |
| 4227 | +2.00 | -5.00 | -7.00 |
| 4228 | -12.00 | -2.00 | +10.00 |



**Table B6 Treated checkpoint cohort and inherited thrift at the endpoint**

| Seed | Edited n | Day 8 mean h | XA mean h | XD mean h |
| --- | --- | --- | --- | --- |
| 4217 | 17 | 1.3482 | 1.0022 | Undefined |
| 4218 | 16 | 1.3108 | 0.9891 | 1.0218 |
| 4219 | 43 | 1.3441 | 1.0032 | 1.0429 |
| 4220 | 29 | 1.3116 | 1.0164 | 0.9911 |
| 4221 | 22 | 1.3270 | 1.0066 | 1.0000 |
| 4222 | 39 | 1.3803 | 0.9937 | Undefined |
| 4223 | 16 | 1.3586 | 0.9758 | 0.9205 |
| 4224 | 22 | 1.3637 | 0.9983 | 0.9919 |
| 4225 | 19 | 1.3322 | 1.0008 | Undefined |
| 4226 | 30 | 1.3854 | 1.0159 | 1.0107 |
| 4227 | 19 | 1.3429 | 0.9982 | Undefined |
| 4228 | 23 | 1.3632 | 0.9900 | 1.0090 |



Endpoint thrift averages describe surviving descendants, not a new mechanistic analysis. Their departure from 1.0000 confirms that normalization was not maintained as a permanent clamp. Undefined means no Çiy remained in that arm.


<!-- END GENERATED EVIDENCE -->

## Appendix C Parameter ledger and implementation boundaries

**Table C1 Fixed values relevant to the recorded experiment**

| Quantity | Value | Meaning |
| --- | --- | --- |
| World size | 1000 × 650 | Arbitrary spatial units |
| Tick duration | 0.1 | Model seconds |
| Displayed day | 12 | Model seconds |
| Checkpoint and endpoint | 960 and 1920 | Exact ticks |
| Initial population | 30 | Five per lineage |
| Initial food and food cap | 210 and 420 | Particles |
| Population cap | 240 | Conservative birth check |
| Renewal attempts | 15R per second | R = 1.00 or 0.15 |
| Founder variation | Uniform ±0.06 | Each gene independently |
| Offspring mutation | Uniform ±0.08 | Additive amplitude |
| Gene bounds | 0.45 to 1.75 | Clamp after variation |
| Founder energy | 58 + 28U | U in [0, 1) |
| Feeding gain and energy cap | 25 and 150 | Energy units |
| Feeding radius | Strictly below 12 | After movement |
| Sensing radius | Strictly below 70q | Before movement |
| Search grid cell size | 100 | Spatial acceleration |
| Maximum turning | 0.42 per tick | Radians |
| Wander delay | 0.8 + 1.8U | Model seconds |
| Wander heading perturbation | (U − 0.5) × 2.6 | Radians |
| Minimum reproduction age | Strictly above 5 | Model seconds |
| Reproduction threshold | Strictly above 92 + 26h | Energy units |
| Parent cost and child energy | 48 and 40 | Net energy loss 8 |
| Age limit | 130 + 30h | Model seconds |
| Child placement offset | 12 | Before boundary correction |
| History interval and retention | 10 ticks and 600 samples | Observation only |
| Seasons and manual interventions | Off and none | All recorded branches |
| Follow-up treatment | Living Çiy h set once to 1.00 | At day 8 only |

### C1 Design concepts and their implementation

**Emergence.** Population size, lineage ranking, spatial crowding and surviving trait distributions arise from local rules. No rule declares Çiy a drought winner or forces a particular endpoint leader. The observed pattern nevertheless depends on the hand-selected trait centers and equations.

**Adaptation and objectives.** Organisms turn toward food according to a fixed rule. They do not calculate expected fitness, remember prior shortages or optimize a policy. Population change through differential survival and reproduction can be described as selection within the model; it should not be confused with individual learning.

**Interaction and sensing.** Agents interact through depletion of shared particles, not explicit fighting, predation or mating. Sensing reveals food positions within a radius but no competitor state. Body overlap between organisms is not prohibited. Food particles do not actively respond to organisms.

**Stochasticity.** Every draw comes from the seeded world generator. The trajectory is deterministic conditional on complete state and interventions. Calling a world stochastic refers to its generating mechanism over seeds, not unexplained randomness during a fixed replay.

**Collectives and observation.** Permanent lineages are genealogical bookkeeping groups; there is no group-level agent, coordinated action or group reproduction. Statistics count living descendants and summarize genes among those survivors. History is sampled at fixed model times and rendering adds no model events.

### C2 Checks that are distinct from scientific validation

The birth–death identity detects accounting inconsistencies. Clone-independence checks detect accidental shared references. Seeded replay detects unintended changes to ordering, random draws or transition rules. Hash checks detect changed source bytes. Generated-artifact checks detect disagreement between raw input and derived reports. None of these checks alone establishes external validity, and the 41 automated tests are not 41 independent ecological replications.

### C3 Document reproduction

The complete Markdown file is `docs/article/morrow-article.md`. Tables A1–A4 and B1–B6 are regenerated from frozen JSON by `scripts/build-article-evidence.py`, which also builds two ReportLab SVG plots. The PNG copies embedded in Word retain sufficient resolution for the document width. The article converter requires Python and `python-docx`; the separate evidence builder additionally requires `reportlab`. These authoring dependencies are separate from the dependency-free Morrow application.

```powershell
python scripts/md-to-docx.py docs/article/morrow-article.md `
  --output docs/article/morrow-article.docx
```

The converter resolves images relative to the Markdown source, writes actual Word headings, hyperlinks, repeated table headers and editable Office Math objects, and fails on unsupported block syntax. The generated Word document is a presentation of this Markdown source rather than an additional experimental data record. Pagination depends on fonts and the Word renderer, while the source numbers and definitions remain the same.

<!-- BEGIN REPLICATION EVIDENCE -->

## Appendix D Complete unseen seed replication ledger

These are the 100 new paired units, seeds 10000–10099. A and D denote natural abundance and drought; XA and XD denote normalized abundance and drought. All endpoints are at day 16. No seed is removed or pooled with the original twelve. Counts are exact integers; shares and effects are rounded only for display. Complete six-lineage statistics, checkpoints and state hashes remain in the public raw JSON.

**Table D1 Total population in the 400 new branches**

| Seed | A N | D N | XA N | XD N |
| --- | --- | --- | --- | --- |
| 10000 | 156 | 22 | 145 | 16 |
| 10001 | 147 | 14 | 144 | 13 |
| 10002 | 136 | 14 | 134 | 19 |
| 10003 | 153 | 10 | 145 | 16 |
| 10004 | 144 | 11 | 132 | 13 |
| 10005 | 162 | 17 | 137 | 12 |
| 10006 | 140 | 13 | 139 | 13 |
| 10007 | 153 | 18 | 146 | 16 |
| 10008 | 150 | 14 | 155 | 13 |
| 10009 | 148 | 20 | 141 | 14 |
| 10010 | 155 | 20 | 152 | 18 |
| 10011 | 141 | 9 | 133 | 10 |
| 10012 | 140 | 18 | 141 | 10 |
| 10013 | 159 | 16 | 133 | 14 |
| 10014 | 163 | 9 | 136 | 16 |
| 10015 | 155 | 14 | 149 | 16 |
| 10016 | 150 | 12 | 135 | 12 |
| 10017 | 151 | 15 | 148 | 10 |
| 10018 | 131 | 13 | 131 | 11 |
| 10019 | 147 | 14 | 146 | 14 |
| 10020 | 138 | 16 | 129 | 12 |
| 10021 | 153 | 14 | 154 | 16 |
| 10022 | 140 | 14 | 134 | 16 |
| 10023 | 145 | 11 | 138 | 7 |
| 10024 | 150 | 12 | 135 | 14 |
| 10025 | 142 | 13 | 135 | 16 |
| 10026 | 154 | 19 | 146 | 10 |
| 10027 | 148 | 14 | 144 | 15 |
| 10028 | 155 | 17 | 151 | 17 |
| 10029 | 145 | 12 | 140 | 12 |
| 10030 | 154 | 16 | 150 | 11 |
| 10031 | 140 | 15 | 132 | 13 |
| 10032 | 147 | 20 | 155 | 13 |
| 10033 | 137 | 13 | 129 | 14 |
| 10034 | 138 | 14 | 134 | 21 |
| 10035 | 147 | 13 | 144 | 15 |
| 10036 | 135 | 16 | 143 | 15 |
| 10037 | 127 | 10 | 134 | 13 |
| 10038 | 149 | 17 | 124 | 17 |
| 10039 | 150 | 17 | 141 | 12 |
| 10040 | 148 | 18 | 141 | 11 |
| 10041 | 139 | 15 | 131 | 10 |
| 10042 | 154 | 16 | 144 | 10 |
| 10043 | 143 | 9 | 141 | 14 |
| 10044 | 156 | 19 | 154 | 18 |
| 10045 | 157 | 7 | 147 | 14 |
| 10046 | 150 | 14 | 155 | 15 |
| 10047 | 136 | 13 | 137 | 18 |
| 10048 | 143 | 18 | 140 | 11 |
| 10049 | 148 | 17 | 141 | 18 |
| 10050 | 155 | 8 | 152 | 17 |
| 10051 | 134 | 12 | 140 | 13 |
| 10052 | 143 | 16 | 147 | 11 |
| 10053 | 142 | 15 | 154 | 10 |
| 10054 | 129 | 18 | 135 | 16 |
| 10055 | 139 | 13 | 139 | 13 |
| 10056 | 144 | 17 | 144 | 14 |
| 10057 | 147 | 16 | 146 | 8 |
| 10058 | 150 | 15 | 146 | 16 |
| 10059 | 146 | 14 | 139 | 14 |
| 10060 | 138 | 14 | 152 | 12 |
| 10061 | 149 | 18 | 134 | 15 |
| 10062 | 137 | 10 | 127 | 14 |
| 10063 | 149 | 14 | 146 | 15 |
| 10064 | 132 | 14 | 130 | 15 |
| 10065 | 140 | 17 | 136 | 12 |
| 10066 | 148 | 18 | 152 | 13 |
| 10067 | 151 | 18 | 147 | 15 |
| 10068 | 164 | 14 | 164 | 24 |
| 10069 | 147 | 8 | 142 | 13 |
| 10070 | 153 | 15 | 151 | 14 |
| 10071 | 150 | 17 | 136 | 17 |
| 10072 | 161 | 19 | 136 | 12 |
| 10073 | 140 | 14 | 149 | 14 |
| 10074 | 146 | 15 | 134 | 9 |
| 10075 | 151 | 15 | 144 | 15 |
| 10076 | 145 | 15 | 140 | 16 |
| 10077 | 137 | 14 | 128 | 17 |
| 10078 | 141 | 12 | 133 | 8 |
| 10079 | 151 | 15 | 138 | 16 |
| 10080 | 133 | 17 | 132 | 16 |
| 10081 | 138 | 10 | 125 | 12 |
| 10082 | 146 | 15 | 144 | 9 |
| 10083 | 148 | 17 | 131 | 17 |
| 10084 | 141 | 15 | 147 | 16 |
| 10085 | 134 | 19 | 132 | 13 |
| 10086 | 138 | 15 | 143 | 12 |
| 10087 | 135 | 13 | 145 | 17 |
| 10088 | 143 | 17 | 138 | 19 |
| 10089 | 136 | 14 | 143 | 14 |
| 10090 | 146 | 10 | 137 | 12 |
| 10091 | 153 | 15 | 142 | 12 |
| 10092 | 157 | 15 | 135 | 14 |
| 10093 | 154 | 17 | 142 | 11 |
| 10094 | 148 | 19 | 139 | 16 |
| 10095 | 155 | 13 | 139 | 16 |
| 10096 | 143 | 15 | 133 | 13 |
| 10097 | 143 | 12 | 140 | 12 |
| 10098 | 151 | 18 | 152 | 17 |
| 10099 | 151 | 15 | 151 | 10 |

**Table D2 Living Ciy descendants in the 400 new branches**

| Seed | A n | D n | XA n | XD n |
| --- | --- | --- | --- | --- |
| 10000 | 41 | 11 | 33 | 4 |
| 10001 | 19 | 4 | 15 | 0 |
| 10002 | 12 | 3 | 6 | 1 |
| 10003 | 35 | 7 | 21 | 8 |
| 10004 | 21 | 5 | 15 | 1 |
| 10005 | 35 | 7 | 20 | 1 |
| 10006 | 41 | 5 | 26 | 6 |
| 10007 | 23 | 6 | 22 | 6 |
| 10008 | 26 | 7 | 22 | 1 |
| 10009 | 18 | 8 | 12 | 6 |
| 10010 | 53 | 8 | 26 | 4 |
| 10011 | 20 | 2 | 15 | 0 |
| 10012 | 30 | 12 | 33 | 6 |
| 10013 | 31 | 8 | 19 | 9 |
| 10014 | 52 | 3 | 22 | 2 |
| 10015 | 29 | 4 | 17 | 4 |
| 10016 | 26 | 4 | 18 | 2 |
| 10017 | 32 | 7 | 27 | 0 |
| 10018 | 23 | 4 | 16 | 7 |
| 10019 | 29 | 7 | 26 | 5 |
| 10020 | 21 | 6 | 12 | 1 |
| 10021 | 22 | 8 | 24 | 4 |
| 10022 | 19 | 7 | 17 | 3 |
| 10023 | 31 | 1 | 16 | 2 |
| 10024 | 37 | 8 | 28 | 2 |
| 10025 | 27 | 6 | 23 | 1 |
| 10026 | 35 | 10 | 38 | 4 |
| 10027 | 16 | 3 | 9 | 1 |
| 10028 | 24 | 5 | 17 | 4 |
| 10029 | 30 | 6 | 25 | 2 |
| 10030 | 18 | 4 | 9 | 0 |
| 10031 | 34 | 5 | 20 | 2 |
| 10032 | 24 | 9 | 19 | 2 |
| 10033 | 33 | 3 | 13 | 3 |
| 10034 | 18 | 4 | 15 | 1 |
| 10035 | 28 | 3 | 20 | 1 |
| 10036 | 24 | 5 | 25 | 3 |
| 10037 | 12 | 3 | 14 | 3 |
| 10038 | 25 | 5 | 9 | 1 |
| 10039 | 32 | 9 | 21 | 3 |
| 10040 | 27 | 9 | 21 | 5 |
| 10041 | 19 | 7 | 19 | 3 |
| 10042 | 38 | 5 | 17 | 0 |
| 10043 | 18 | 4 | 11 | 2 |
| 10044 | 25 | 6 | 19 | 1 |
| 10045 | 27 | 2 | 14 | 1 |
| 10046 | 14 | 10 | 23 | 1 |
| 10047 | 18 | 7 | 19 | 1 |
| 10048 | 38 | 9 | 24 | 1 |
| 10049 | 28 | 7 | 17 | 7 |
| 10050 | 38 | 3 | 17 | 6 |
| 10051 | 34 | 7 | 19 | 4 |
| 10052 | 29 | 7 | 27 | 1 |
| 10053 | 25 | 5 | 19 | 2 |
| 10054 | 19 | 8 | 20 | 3 |
| 10055 | 23 | 2 | 10 | 2 |
| 10056 | 27 | 11 | 32 | 4 |
| 10057 | 18 | 6 | 18 | 3 |
| 10058 | 45 | 5 | 26 | 11 |
| 10059 | 20 | 5 | 11 | 4 |
| 10060 | 22 | 4 | 14 | 1 |
| 10061 | 36 | 16 | 35 | 6 |
| 10062 | 22 | 4 | 13 | 1 |
| 10063 | 20 | 4 | 10 | 3 |
| 10064 | 30 | 8 | 19 | 6 |
| 10065 | 34 | 10 | 28 | 3 |
| 10066 | 39 | 9 | 36 | 3 |
| 10067 | 58 | 12 | 32 | 8 |
| 10068 | 50 | 7 | 26 | 8 |
| 10069 | 20 | 4 | 13 | 3 |
| 10070 | 24 | 6 | 21 | 1 |
| 10071 | 30 | 9 | 16 | 4 |
| 10072 | 38 | 7 | 14 | 1 |
| 10073 | 31 | 7 | 32 | 4 |
| 10074 | 40 | 9 | 24 | 4 |
| 10075 | 60 | 9 | 43 | 5 |
| 10076 | 24 | 6 | 14 | 6 |
| 10077 | 32 | 9 | 25 | 5 |
| 10078 | 21 | 2 | 18 | 0 |
| 10079 | 33 | 7 | 18 | 4 |
| 10080 | 25 | 9 | 20 | 3 |
| 10081 | 18 | 2 | 15 | 1 |
| 10082 | 32 | 7 | 28 | 4 |
| 10083 | 32 | 6 | 10 | 4 |
| 10084 | 9 | 5 | 11 | 0 |
| 10085 | 27 | 13 | 22 | 6 |
| 10086 | 18 | 4 | 20 | 2 |
| 10087 | 22 | 6 | 14 | 6 |
| 10088 | 9 | 10 | 11 | 0 |
| 10089 | 11 | 4 | 12 | 1 |
| 10090 | 19 | 5 | 14 | 0 |
| 10091 | 43 | 5 | 24 | 5 |
| 10092 | 29 | 5 | 34 | 3 |
| 10093 | 46 | 11 | 32 | 0 |
| 10094 | 40 | 12 | 24 | 3 |
| 10095 | 22 | 3 | 16 | 1 |
| 10096 | 24 | 7 | 18 | 5 |
| 10097 | 34 | 4 | 19 | 2 |
| 10098 | 28 | 6 | 33 | 8 |
| 10099 | 40 | 4 | 33 | 5 |

**Table D3 Ciy shares in the 400 new branches in percent**

| Seed | A | D | XA | XD |
| --- | --- | --- | --- | --- |
| 10000 | 26.2821 | 50.0000 | 22.7586 | 25.0000 |
| 10001 | 12.9252 | 28.5714 | 10.4167 | 0.0000 |
| 10002 | 8.8235 | 21.4286 | 4.4776 | 5.2632 |
| 10003 | 22.8758 | 70.0000 | 14.4828 | 50.0000 |
| 10004 | 14.5833 | 45.4545 | 11.3636 | 7.6923 |
| 10005 | 21.6049 | 41.1765 | 14.5985 | 8.3333 |
| 10006 | 29.2857 | 38.4615 | 18.7050 | 46.1538 |
| 10007 | 15.0327 | 33.3333 | 15.0685 | 37.5000 |
| 10008 | 17.3333 | 50.0000 | 14.1935 | 7.6923 |
| 10009 | 12.1622 | 40.0000 | 8.5106 | 42.8571 |
| 10010 | 34.1935 | 40.0000 | 17.1053 | 22.2222 |
| 10011 | 14.1844 | 22.2222 | 11.2782 | 0.0000 |
| 10012 | 21.4286 | 66.6667 | 23.4043 | 60.0000 |
| 10013 | 19.4969 | 50.0000 | 14.2857 | 64.2857 |
| 10014 | 31.9018 | 33.3333 | 16.1765 | 12.5000 |
| 10015 | 18.7097 | 28.5714 | 11.4094 | 25.0000 |
| 10016 | 17.3333 | 33.3333 | 13.3333 | 16.6667 |
| 10017 | 21.1921 | 46.6667 | 18.2432 | 0.0000 |
| 10018 | 17.5573 | 30.7692 | 12.2137 | 63.6364 |
| 10019 | 19.7279 | 50.0000 | 17.8082 | 35.7143 |
| 10020 | 15.2174 | 37.5000 | 9.3023 | 8.3333 |
| 10021 | 14.3791 | 57.1429 | 15.5844 | 25.0000 |
| 10022 | 13.5714 | 50.0000 | 12.6866 | 18.7500 |
| 10023 | 21.3793 | 9.0909 | 11.5942 | 28.5714 |
| 10024 | 24.6667 | 66.6667 | 20.7407 | 14.2857 |
| 10025 | 19.0141 | 46.1538 | 17.0370 | 6.2500 |
| 10026 | 22.7273 | 52.6316 | 26.0274 | 40.0000 |
| 10027 | 10.8108 | 21.4286 | 6.2500 | 6.6667 |
| 10028 | 15.4839 | 29.4118 | 11.2583 | 23.5294 |
| 10029 | 20.6897 | 50.0000 | 17.8571 | 16.6667 |
| 10030 | 11.6883 | 25.0000 | 6.0000 | 0.0000 |
| 10031 | 24.2857 | 33.3333 | 15.1515 | 15.3846 |
| 10032 | 16.3265 | 45.0000 | 12.2581 | 15.3846 |
| 10033 | 24.0876 | 23.0769 | 10.0775 | 21.4286 |
| 10034 | 13.0435 | 28.5714 | 11.1940 | 4.7619 |
| 10035 | 19.0476 | 23.0769 | 13.8889 | 6.6667 |
| 10036 | 17.7778 | 31.2500 | 17.4825 | 20.0000 |
| 10037 | 9.4488 | 30.0000 | 10.4478 | 23.0769 |
| 10038 | 16.7785 | 29.4118 | 7.2581 | 5.8824 |
| 10039 | 21.3333 | 52.9412 | 14.8936 | 25.0000 |
| 10040 | 18.2432 | 50.0000 | 14.8936 | 45.4545 |
| 10041 | 13.6691 | 46.6667 | 14.5038 | 30.0000 |
| 10042 | 24.6753 | 31.2500 | 11.8056 | 0.0000 |
| 10043 | 12.5874 | 44.4444 | 7.8014 | 14.2857 |
| 10044 | 16.0256 | 31.5789 | 12.3377 | 5.5556 |
| 10045 | 17.1975 | 28.5714 | 9.5238 | 7.1429 |
| 10046 | 9.3333 | 71.4286 | 14.8387 | 6.6667 |
| 10047 | 13.2353 | 53.8462 | 13.8686 | 5.5556 |
| 10048 | 26.5734 | 50.0000 | 17.1429 | 9.0909 |
| 10049 | 18.9189 | 41.1765 | 12.0567 | 38.8889 |
| 10050 | 24.5161 | 37.5000 | 11.1842 | 35.2941 |
| 10051 | 25.3731 | 58.3333 | 13.5714 | 30.7692 |
| 10052 | 20.2797 | 43.7500 | 18.3673 | 9.0909 |
| 10053 | 17.6056 | 33.3333 | 12.3377 | 20.0000 |
| 10054 | 14.7287 | 44.4444 | 14.8148 | 18.7500 |
| 10055 | 16.5468 | 15.3846 | 7.1942 | 15.3846 |
| 10056 | 18.7500 | 64.7059 | 22.2222 | 28.5714 |
| 10057 | 12.2449 | 37.5000 | 12.3288 | 37.5000 |
| 10058 | 30.0000 | 33.3333 | 17.8082 | 68.7500 |
| 10059 | 13.6986 | 35.7143 | 7.9137 | 28.5714 |
| 10060 | 15.9420 | 28.5714 | 9.2105 | 8.3333 |
| 10061 | 24.1611 | 88.8889 | 26.1194 | 40.0000 |
| 10062 | 16.0584 | 40.0000 | 10.2362 | 7.1429 |
| 10063 | 13.4228 | 28.5714 | 6.8493 | 20.0000 |
| 10064 | 22.7273 | 57.1429 | 14.6154 | 40.0000 |
| 10065 | 24.2857 | 58.8235 | 20.5882 | 25.0000 |
| 10066 | 26.3514 | 50.0000 | 23.6842 | 23.0769 |
| 10067 | 38.4106 | 66.6667 | 21.7687 | 53.3333 |
| 10068 | 30.4878 | 50.0000 | 15.8537 | 33.3333 |
| 10069 | 13.6054 | 50.0000 | 9.1549 | 23.0769 |
| 10070 | 15.6863 | 40.0000 | 13.9073 | 7.1429 |
| 10071 | 20.0000 | 52.9412 | 11.7647 | 23.5294 |
| 10072 | 23.6025 | 36.8421 | 10.2941 | 8.3333 |
| 10073 | 22.1429 | 50.0000 | 21.4765 | 28.5714 |
| 10074 | 27.3973 | 60.0000 | 17.9104 | 44.4444 |
| 10075 | 39.7351 | 60.0000 | 29.8611 | 33.3333 |
| 10076 | 16.5517 | 40.0000 | 10.0000 | 37.5000 |
| 10077 | 23.3577 | 64.2857 | 19.5312 | 29.4118 |
| 10078 | 14.8936 | 16.6667 | 13.5338 | 0.0000 |
| 10079 | 21.8543 | 46.6667 | 13.0435 | 25.0000 |
| 10080 | 18.7970 | 52.9412 | 15.1515 | 18.7500 |
| 10081 | 13.0435 | 20.0000 | 12.0000 | 8.3333 |
| 10082 | 21.9178 | 46.6667 | 19.4444 | 44.4444 |
| 10083 | 21.6216 | 35.2941 | 7.6336 | 23.5294 |
| 10084 | 6.3830 | 33.3333 | 7.4830 | 0.0000 |
| 10085 | 20.1493 | 68.4211 | 16.6667 | 46.1538 |
| 10086 | 13.0435 | 26.6667 | 13.9860 | 16.6667 |
| 10087 | 16.2963 | 46.1538 | 9.6552 | 35.2941 |
| 10088 | 6.2937 | 58.8235 | 7.9710 | 0.0000 |
| 10089 | 8.0882 | 28.5714 | 8.3916 | 7.1429 |
| 10090 | 13.0137 | 50.0000 | 10.2190 | 0.0000 |
| 10091 | 28.1046 | 33.3333 | 16.9014 | 41.6667 |
| 10092 | 18.4713 | 33.3333 | 25.1852 | 21.4286 |
| 10093 | 29.8701 | 64.7059 | 22.5352 | 0.0000 |
| 10094 | 27.0270 | 63.1579 | 17.2662 | 18.7500 |
| 10095 | 14.1935 | 23.0769 | 11.5108 | 6.2500 |
| 10096 | 16.7832 | 46.6667 | 13.5338 | 38.4615 |
| 10097 | 23.7762 | 33.3333 | 13.5714 | 16.6667 |
| 10098 | 18.5430 | 33.3333 | 21.7105 | 47.0588 |
| 10099 | 26.4901 | 26.6667 | 21.8543 | 50.0000 |

**Table D4 Environment specific effects and interactions**

| Seed | Share EA | Share ED | Share I | Count EA | Count ED | Count I |
| --- | --- | --- | --- | --- | --- | --- |
| 10000 | -3.5234 | -25.0000 | -21.4766 | -8.0000 | -7.0000 | 1.0000 |
| 10001 | -2.5085 | -28.5714 | -26.0629 | -4.0000 | -4.0000 | 0.0000 |
| 10002 | -4.3459 | -16.1654 | -11.8195 | -6.0000 | -2.0000 | 4.0000 |
| 10003 | -8.3931 | -20.0000 | -11.6069 | -14.0000 | 1.0000 | 15.0000 |
| 10004 | -3.2197 | -37.7622 | -34.5425 | -6.0000 | -4.0000 | 2.0000 |
| 10005 | -7.0064 | -32.8431 | -25.8367 | -15.0000 | -6.0000 | 9.0000 |
| 10006 | -10.5807 | 7.6923 | 18.2730 | -15.0000 | 1.0000 | 16.0000 |
| 10007 | 0.0358 | 4.1667 | 4.1309 | -1.0000 | 0.0000 | 1.0000 |
| 10008 | -3.1398 | -42.3077 | -39.1679 | -4.0000 | -6.0000 | -2.0000 |
| 10009 | -3.6515 | 2.8571 | 6.5087 | -6.0000 | -2.0000 | 4.0000 |
| 10010 | -17.0883 | -17.7778 | -0.6895 | -27.0000 | -4.0000 | 23.0000 |
| 10011 | -2.9062 | -22.2222 | -19.3160 | -5.0000 | -2.0000 | 3.0000 |
| 10012 | 1.9757 | -6.6667 | -8.6424 | 3.0000 | -6.0000 | -9.0000 |
| 10013 | -5.2111 | 14.2857 | 19.4969 | -12.0000 | 1.0000 | 13.0000 |
| 10014 | -15.7254 | -20.8333 | -5.1080 | -30.0000 | -1.0000 | 29.0000 |
| 10015 | -7.3003 | -3.5714 | 3.7289 | -12.0000 | 0.0000 | 12.0000 |
| 10016 | -4.0000 | -16.6667 | -12.6667 | -8.0000 | -2.0000 | 6.0000 |
| 10017 | -2.9488 | -46.6667 | -43.7179 | -5.0000 | -7.0000 | -2.0000 |
| 10018 | -5.3435 | 32.8671 | 38.2106 | -7.0000 | 3.0000 | 10.0000 |
| 10019 | -1.9197 | -14.2857 | -12.3660 | -3.0000 | -2.0000 | 1.0000 |
| 10020 | -5.9151 | -29.1667 | -23.2516 | -9.0000 | -5.0000 | 4.0000 |
| 10021 | 1.2053 | -32.1429 | -33.3482 | 2.0000 | -4.0000 | -6.0000 |
| 10022 | -0.8849 | -31.2500 | -30.3651 | -2.0000 | -4.0000 | -2.0000 |
| 10023 | -9.7851 | 19.4805 | 29.2656 | -15.0000 | 1.0000 | 16.0000 |
| 10024 | -3.9259 | -52.3810 | -48.4550 | -9.0000 | -6.0000 | 3.0000 |
| 10025 | -1.9770 | -39.9038 | -37.9268 | -4.0000 | -5.0000 | -1.0000 |
| 10026 | 3.3001 | -12.6316 | -15.9317 | 3.0000 | -6.0000 | -9.0000 |
| 10027 | -4.5608 | -14.7619 | -10.2011 | -7.0000 | -2.0000 | 5.0000 |
| 10028 | -4.2256 | -5.8824 | -1.6568 | -7.0000 | -1.0000 | 6.0000 |
| 10029 | -2.8325 | -33.3333 | -30.5008 | -5.0000 | -4.0000 | 1.0000 |
| 10030 | -5.6883 | -25.0000 | -19.3117 | -9.0000 | -4.0000 | 5.0000 |
| 10031 | -9.1342 | -17.9487 | -8.8145 | -14.0000 | -3.0000 | 11.0000 |
| 10032 | -4.0685 | -29.6154 | -25.5469 | -5.0000 | -7.0000 | -2.0000 |
| 10033 | -14.0101 | -1.6484 | 12.3617 | -20.0000 | 0.0000 | 20.0000 |
| 10034 | -1.8494 | -23.8095 | -21.9601 | -3.0000 | -3.0000 | 0.0000 |
| 10035 | -5.1587 | -16.4103 | -11.2515 | -8.0000 | -2.0000 | 6.0000 |
| 10036 | -0.2953 | -11.2500 | -10.9547 | 1.0000 | -2.0000 | -3.0000 |
| 10037 | 0.9989 | -6.9231 | -7.9220 | 2.0000 | 0.0000 | -2.0000 |
| 10038 | -9.5205 | -23.5294 | -14.0090 | -16.0000 | -4.0000 | 12.0000 |
| 10039 | -6.4397 | -27.9412 | -21.5015 | -11.0000 | -6.0000 | 5.0000 |
| 10040 | -3.3496 | -4.5455 | -1.1958 | -6.0000 | -4.0000 | 2.0000 |
| 10041 | 0.8348 | -16.6667 | -17.5014 | 0.0000 | -4.0000 | -4.0000 |
| 10042 | -12.8698 | -31.2500 | -18.3802 | -21.0000 | -5.0000 | 16.0000 |
| 10043 | -4.7860 | -30.1587 | -25.3727 | -7.0000 | -2.0000 | 5.0000 |
| 10044 | -3.6880 | -26.0234 | -22.3354 | -6.0000 | -5.0000 | 1.0000 |
| 10045 | -7.6736 | -21.4286 | -13.7549 | -13.0000 | -1.0000 | 12.0000 |
| 10046 | 5.5054 | -64.7619 | -70.2673 | 9.0000 | -9.0000 | -18.0000 |
| 10047 | 0.6333 | -48.2906 | -48.9239 | 1.0000 | -6.0000 | -7.0000 |
| 10048 | -9.4306 | -40.9091 | -31.4785 | -14.0000 | -8.0000 | 6.0000 |
| 10049 | -6.8622 | -2.2876 | 4.5746 | -11.0000 | 0.0000 | 11.0000 |
| 10050 | -13.3319 | -2.2059 | 11.1260 | -21.0000 | 3.0000 | 24.0000 |
| 10051 | -11.8017 | -27.5641 | -15.7624 | -15.0000 | -3.0000 | 12.0000 |
| 10052 | -1.9124 | -34.6591 | -32.7467 | -2.0000 | -6.0000 | -4.0000 |
| 10053 | -5.2680 | -13.3333 | -8.0654 | -6.0000 | -3.0000 | 3.0000 |
| 10054 | 0.0861 | -25.6944 | -25.7806 | 1.0000 | -5.0000 | -6.0000 |
| 10055 | -9.3525 | 0.0000 | 9.3525 | -13.0000 | 0.0000 | 13.0000 |
| 10056 | 3.4722 | -36.1345 | -39.6067 | 5.0000 | -7.0000 | -12.0000 |
| 10057 | 0.0839 | 0.0000 | -0.0839 | 0.0000 | -3.0000 | -3.0000 |
| 10058 | -12.1918 | 35.4167 | 47.6084 | -19.0000 | 6.0000 | 25.0000 |
| 10059 | -5.7850 | -7.1429 | -1.3579 | -9.0000 | -1.0000 | 8.0000 |
| 10060 | -6.7315 | -20.2381 | -13.5066 | -8.0000 | -3.0000 | 5.0000 |
| 10061 | 1.9583 | -48.8889 | -50.8472 | -1.0000 | -10.0000 | -9.0000 |
| 10062 | -5.8222 | -32.8571 | -27.0350 | -9.0000 | -3.0000 | 6.0000 |
| 10063 | -6.5735 | -8.5714 | -1.9979 | -10.0000 | -1.0000 | 9.0000 |
| 10064 | -8.1119 | -17.1429 | -9.0310 | -11.0000 | -2.0000 | 9.0000 |
| 10065 | -3.6975 | -33.8235 | -30.1261 | -6.0000 | -7.0000 | -1.0000 |
| 10066 | -2.6671 | -26.9231 | -24.2559 | -3.0000 | -6.0000 | -3.0000 |
| 10067 | -16.6419 | -13.3333 | 3.3086 | -26.0000 | -4.0000 | 22.0000 |
| 10068 | -14.6341 | -16.6667 | -2.0325 | -24.0000 | 1.0000 | 25.0000 |
| 10069 | -4.4505 | -26.9231 | -22.4726 | -7.0000 | -1.0000 | 6.0000 |
| 10070 | -1.7790 | -32.8571 | -31.0782 | -3.0000 | -5.0000 | -2.0000 |
| 10071 | -8.2353 | -29.4118 | -21.1765 | -14.0000 | -5.0000 | 9.0000 |
| 10072 | -13.3084 | -28.5088 | -15.2004 | -24.0000 | -6.0000 | 18.0000 |
| 10073 | -0.6663 | -21.4286 | -20.7622 | 1.0000 | -3.0000 | -4.0000 |
| 10074 | -9.4868 | -15.5556 | -6.0687 | -16.0000 | -5.0000 | 11.0000 |
| 10075 | -9.8740 | -26.6667 | -16.7927 | -17.0000 | -4.0000 | 13.0000 |
| 10076 | -6.5517 | -2.5000 | 4.0517 | -10.0000 | 0.0000 | 10.0000 |
| 10077 | -3.8264 | -34.8739 | -31.0475 | -7.0000 | -4.0000 | 3.0000 |
| 10078 | -1.3598 | -16.6667 | -15.3069 | -3.0000 | -2.0000 | 1.0000 |
| 10079 | -8.8108 | -21.6667 | -12.8558 | -15.0000 | -3.0000 | 12.0000 |
| 10080 | -3.6455 | -34.1912 | -30.5457 | -5.0000 | -6.0000 | -1.0000 |
| 10081 | -1.0435 | -11.6667 | -10.6232 | -3.0000 | -1.0000 | 2.0000 |
| 10082 | -2.4734 | -2.2222 | 0.2511 | -4.0000 | -3.0000 | 1.0000 |
| 10083 | -13.9880 | -11.7647 | 2.2233 | -22.0000 | -2.0000 | 20.0000 |
| 10084 | 1.1000 | -33.3333 | -34.4333 | 2.0000 | -5.0000 | -7.0000 |
| 10085 | -3.4826 | -22.2672 | -18.7846 | -5.0000 | -7.0000 | -2.0000 |
| 10086 | 0.9425 | -10.0000 | -10.9425 | 2.0000 | -2.0000 | -4.0000 |
| 10087 | -6.6411 | -10.8597 | -4.2186 | -8.0000 | 0.0000 | 8.0000 |
| 10088 | 1.6773 | -58.8235 | -60.5008 | 2.0000 | -10.0000 | -12.0000 |
| 10089 | 0.3034 | -21.4286 | -21.7319 | 1.0000 | -3.0000 | -4.0000 |
| 10090 | -2.7947 | -50.0000 | -47.2053 | -5.0000 | -5.0000 | 0.0000 |
| 10091 | -11.2032 | 8.3333 | 19.5365 | -19.0000 | 0.0000 | 19.0000 |
| 10092 | 6.7138 | -11.9048 | -18.6186 | 5.0000 | -2.0000 | -7.0000 |
| 10093 | -7.3349 | -64.7059 | -57.3710 | -14.0000 | -11.0000 | 3.0000 |
| 10094 | -9.7608 | -44.4079 | -34.6471 | -16.0000 | -9.0000 | 7.0000 |
| 10095 | -2.6828 | -16.8269 | -14.1442 | -6.0000 | -2.0000 | 4.0000 |
| 10096 | -3.2494 | -8.2051 | -4.9557 | -6.0000 | -2.0000 | 4.0000 |
| 10097 | -10.2048 | -16.6667 | -6.4619 | -15.0000 | -2.0000 | 13.0000 |
| 10098 | 3.1675 | 13.7255 | 10.5580 | 5.0000 | 2.0000 | -3.0000 |
| 10099 | -4.6358 | 23.3333 | 27.9691 | -7.0000 | 1.0000 | 8.0000 |

EA is XA minus A; ED is XD minus D; I is ED minus EA. Share effects are percentage points and count effects are organisms. All 100 share interactions are defined. The criterion and uncertainty method were fixed before any of these outcomes were executed.

<!-- END REPLICATION EVIDENCE -->
