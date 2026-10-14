# Design direction

## Intent

An observation instrument for a living pond. The pond is the first thing to
look at; controls sit beside it, rather than displacing it with a marketing hero.

## Tokens

| Token | Value | Role |
| --- | --- | --- |
| Deep water | #102d49 | Pond and header ink |
| Shallow water | #254d66 | Depth contours |
| Mist | #edf3f5 | Page background |
| Paper | #ffffff | Reading surfaces |
| Iris | #b6a6ec | Swift lineage |
| Apricot | #f4b582 | Other lineages / intervention |

Type: Georgia for the Morrow wordmark and short expressive titles; Segoe UI
for controls and reading. System fonts avoid network requests and font shifts.
Data uses tabular numerals, not a blanket monospace treatment.

## Layout

Desktop: a wide observation pool on the left; a narrow instrument shelf on the
right. Metrics and the population trace belong directly to the pool. Mobile:
pool, playback, observations, environment controls in a single readable flow.

```text
Morrow / living systems                         observe | experiment
---------------------------------------------------------------
 day / population / generations              environment controls
 +-----------------------------------+       +-------------------+
 |                                   |       | food / mutation   |
 |       the living pond             |       | seasons / tools   |
 |                                   |       +-------------------+
 +-----------------------------------+       selected organism
 playback / tools                            lineage ledger
 population history
```

## Review before implementation

A conventional dashboard would make all information equally prominent. This
design makes the moving pool the focal point, and uses an open instrument shelf
instead of a grid of cards. Organisms use anatomy to express traits: longer tails
for speed, a larger feeler ring for sensing, and body fullness for energy. Depth
contours, feeding flashes and lineage colors explain the simulation rather than
adding unrelated decoration. The experiment presents two actual populations and
the recorded checkpoint, not a prewritten winner.
