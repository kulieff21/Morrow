# Model 0.1

## Space and time

The world is 1000 × 650 units with reflecting walls. A simulation step is 0.1
model seconds; one displayed day is 12 model seconds. `World.step(n)` advances
exactly n steps and is independent of rendering. The UI accumulates frame time;
if rendering is slow, it processes bounded work and does not skip simulation steps.
Hidden tabs and the inactive view do not advance.

## Randomness and initial state

Mulberry32 stores an unsigned 32-bit PRNG state. Seed zero is valid. The engine
does not use `Math.random`. Initial agents, resource locations, wander directions,
and mutation use this same generator. Rendering does not consume its state.

Six founder lineages start with five organisms each and 210 food particles.
Organisms have a persistent ID, parent ID, lineage ID, generation, position,
heading, age, energy, and speed/sense/thrift genes. Founder genes are independently
perturbed by ±0.06, then clamped to [0.45, 1.75].

| Lineage | Speed | Sense | Thrift |
| --- | ---: | ---: | ---: |
| Akım | 1.42 | 0.86 | 0.78 |
| Çiy | 0.78 | 1.12 | 1.35 |
| Köz | 1.12 | 1.25 | 0.92 |
| Sis | 0.90 | 1.45 | 1.08 |
| Yankı | 1.24 | 0.70 | 1.15 |
| Filiz | 0.95 | 0.92 | 1.20 |

Lineage is a permanent label for descent, not a changing trait category. Selection
therefore affects gene distributions both within and between these labels.

## Searching and feeding

Each step an organism finds the nearest available food within `70 × sense` units.
A spatial grid accelerates the query without changing its radius. Organisms turn
at most 0.42 radians per step toward food, otherwise use a seeded wandering heading.
They move at:

```text
24 × speed / (0.75 + 0.25 × thrift) units per model second
```

Food is consumed when the organism is within 12 units after moving. It restores
25 energy, capped at 150. A consumed particle cannot feed another organism.
Processing priority rotates by one position per tick to avoid permanently giving
the first initial organism access priority; this is not a simultaneous solver.

Normal renewal is 15 particles per model second, multiplied by the resource
setting [0, 2]. A fractional spawn credit avoids frame-dependent rounding.
Food spawns around five fixed patches with seeded triangular offsets, clamped to
the boundary. Maximum food is 420. Rocks can reject a spawn; rejected particles
are not retried and their spawn credit is spent.

Seasons multiply renewal by:

```text
0.65 + 0.35 × cos(day × π / 4)
```

The period is eight days: full abundance on day 0, minimum (30%) on day 4,
full abundance on day 8. The drought button sets base renewal to 15%; it does
not erase existing food or automatically disable seasons.

## Energy, reproduction and death

Energy loss per model second is:

```text
(0.55 + 1.2 × speed² + 0.30 × sense²) / thrift
```

High thrift reduces cost but slows movement and raises the reproductive threshold.
An organism older than five model seconds and above `92 + 26 × thrift` energy can
reproduce if the population cap permits it. The parent spends 48 energy; the child
starts with 40, so reproduction removes eight total energy. The child inherits
each gene with uniform perturbation in [−mutation, +mutation], clamped to
[0.45, 1.75]. Default mutation amplitude is 0.08; it is not an 8% mutation probability.
Lineage remains the parent's lineage and generation increases by one.

An organism dies when energy is non-positive or age reaches `130 + 30 × thrift`
model seconds. Death is checked before movement/feeding, so an organism with no
energy cannot recover by feeding later in that tick. The engine counts births
and deaths separately. Total living population is always `30 + births − deaths`.
The conservative cap check includes not-yet-removed organisms from the old step,
so some reproduction may wait one step even if a death frees space later.

Circular rocks have a physical radius of 28 and repel body centers to radius 35.
Food cannot spawn within radius 31. There are at most twelve rocks, at least
70 units apart. This is local collision response, not route planning: organisms
can get caught trying to reach food on the other side of a rock.

## Paired experiment

Warm up a fresh default world for 960 ticks (8 days). Clone its complete state,
including PRNG state, genes, energy, food, history and spawn credit, into two
independent worlds. Set resource multipliers to 1.0 and 0.15 respectively. Run
both for 960 more ticks with mutation 0.08 and seasons off.

The report includes full lineage counts at the checkpoint, control end and drought
end; leader IDs include all ties. `retainedLead` is true when the checkpoint and
drought leader sets intersect; false when they are disjoint; null when either
leadership set is undefined through extinction. Leadership is based on absolute
descendant count; it is not an individual fitness score or survival probability.

Branches begin with identical PRNG states, but consume different draws as their
behavior diverges. They are paired initial conditions, not a common-random-number
coupling of every subsequent environmental event. Results reflect the full
modeled consequence of changing renewal, including these diverging event paths.

The eight-day endpoint, founder traits, spatial patches and caps are modeling
choices. No parameters were tuned against an external data set. Reports describe
this model and these seeds; they do not establish general biological claims.

## Targeted thrift follow-up

The [fixed four-arm protocol](thrift-protocol.md) uses the unchanged engine to
intervene once at day 8. The two normalized arms set only living Çiy organisms'
`genes.thrift` to 1.00; descendants subsequently mutate normally. Cross this
intervention with abundance/drought to measure an environment-by-normalization
interaction in final population share and, separately, absolute count.

This changes every coupled effect of thrift and removes thrift variation from the
treated checkpoint cohort. It does not isolate metabolism from movement,
reproduction or lifespan. Source/data hashes, all twelve checkpoints and every
branch endpoint are preserved. See [results and limits](thrift-results.md).
