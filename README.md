# Morrow

A small living world, built for Elmar and Sisyphos to explore together.
Watch organisms find food, spend energy, have offspring, and change across
generations. Then change the environment and test your prediction.

The interface is in Turkish. The app runs locally with no dependencies, accounts,
API keys, analytics, external fonts, or network services.

![The Morrow observation pond](docs/screenshots/pond.png)

## Run

Install Node.js 22 or newer, then run in this folder:

```powershell
npm start
```

Open [Morrow on your computer](http://127.0.0.1:4317/).
No `npm install` step is required. To use another port in PowerShell:

```powershell
$env:PORT = '4318'
npm start
```

The preview binds only to `127.0.0.1`. Close it with Ctrl+C in its terminal.
Hosting is not configured; the GitHub repository is private.

## Explore

- Select an organism in the pond, or select a lineage in the ledger. Repeated
  lineage clicks cycle through its living members. Selection follows an ID;
  the panel retains the last observation when that organism dies.
- Pause, move one simulated second with **Adım**, or play at 1×, 3× or 8×.
  With focus outside controls, Space toggles playback and `.` advances one second.
- Change food renewal and mutation, bring a drought, or turn on the season cycle.
- Choose **+ Besin** or **+ Kaya**, then click the pond to intervene. There is a
  maximum of twelve non-overlapping rocks. Removing rocks requires a new world.
- Enter an integer seed and restart. The same seed **and the same intervention
  sequence** reproduce the same world. Restart retains current environment settings.
- Download a full observation snapshot or a completed experiment as JSON.

Worlds are in memory. Reloading the page starts over; there is no automatic save
or snapshot-import UI in version 0.1. Download before closing a world you care about.
Background tabs do not advance, and returning to a tab does not fast-forward it.
The observation world waits while the experiment view is open and resumes when
you return. Reduced-motion preference starts the observation paused.

## The first question

**Does the most numerous lineage in abundance remain a leader during scarcity?**

The experiment view starts a separate seeded world. It runs eight simulated days
in abundance, then copies the **complete checkpoint**, including existing food,
into two independent branches. One continues at 100% food renewal; the other drops
to 15%. Both run another eight days with mutation at 8% and seasons off.

Leadership means the largest count of living descendants at the measurement time.
Ties remain ties. Leadership is undefined if no organisms survive. The hypothesis
counts as retained if any checkpoint leader is among the final drought leaders.
This definition does not require sole leadership or prove that the same organism
survived. The control branch is reported for comparison.

The initial twelve seeds (4217–4228) produced five retained and seven changed
leaders. These are descriptive results of this toy model, not biological evidence.
See [the recorded run](docs/first-experiment.md) and [model rules](docs/model.md).

```powershell
npm run experiment
npm run experiment -- 4217 4218 4219
```

The CLI prints full per-lineage reports as JSON; default is the twelve seeds above.

## What the paired branches reveal

Reanalyzing those same twelve reports, the baseline leader changes in 3 control
branches and 7 drought branches. At the final endpoint, leader sets are disjoint
in 9 pairs, identical in 2, and overlap partially in 1. The two marginal change
counts alone do not say which seeds changed only under drought; the paired
transition table preserves that distinction.

Mean population is 147.33 in the control and 13.50 in drought. Çiy's mean share
rises from 17.91% to 33.42%, while its mean count falls from 26.67 to 4.67. A larger
share of a smaller surviving population does not imply population growth.
Every seed has equal weight; these are descriptive outcomes of the twelve saved
runs, with no significance or general biological claim.

See the [paired analysis](docs/paired-analysis.md) for all six lineages, every seed,
ties, formulas and limitations. Analyze the saved batch without new experiment
trials:

```powershell
npm run analyze
npm run analyze -- --check
```

## Verify

```powershell
npm test
npm run check
```

Tests exercise seeded reproduction, step batching, checkpoint continuation,
inheritance, starvation, obstacle placement, population limits, paired branches,
ties/extinction, and loopback HTTP behavior. `check` verifies JavaScript syntax,
DOM targets and asset references. GitHub Actions runs both on push and PR.

See [verification](docs/verification.md), [design direction](docs/design.md),
and [session log](LOG.md).

## Source map

| File | Responsibility |
| --- | --- |
| `src/engine.js` | Seeded fixed-step model, snapshots and experiment protocol |
| `src/render.js` | Pond, organism anatomy and stacked population trace |
| `src/app.js` | Controls, observation state, experiments and JSON downloads |
| `index.html`, `styles.css` | Accessible responsive Turkish interface |
| `server.mjs` | Loopback-only static preview with explicit route allowlist |
| `scripts/experiment.mjs` | Repeatable multi-seed CLI |
| `scripts/analyze-batch.mjs` | Read-only paired analysis and reproducible reports |
| `tests/` | Node built-in tests; no external test runner |

## Limits

This is an intentionally simple rule-based artificial-life model. Its outcomes
depend on the chosen energy costs, food layout, reproductive rules and time horizon.
Organisms do not think or use language models. There is no predation, mating,
neural learning or real genetics. Mutation is a bounded numerical perturbation.
Population is capped at 240, food at 420, and the chart retains 600 samples.
Playback under heavy load slows down rather than skipping ecological steps.

Built October 14, 2026. Private source; no open-source license granted.
