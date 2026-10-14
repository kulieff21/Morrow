# Public website release — 14 October 2026

Elmar explicitly authorized English as the default, a Turkish switch, a case
study, public repository visibility and GitHub Pages hosting. He requested visual
animation specifically for the case study. No scientific model change or new
recorded experiment was part of this release.

## Entry points and language

- [Case study](https://kulieff21.github.io/Morrow/)
- [Observation and original two-arm experiment](https://kulieff21.github.io/Morrow/pond.html)
- [Turkish case study](https://kulieff21.github.io/Morrow/?lang=tr)
- [Turkish pond](https://kulieff21.github.io/Morrow/pond.html?lang=tr)
- [Public source, protocols and raw evidence](https://github.com/kulieff21/Morrow)

English is the authored HTML default, including when JavaScript is unavailable.
`?lang=tr` selects Turkish; links between the app and case study retain it.
Changing language translates the view without creating a world or advancing its
random generator. Organism IDs and lineage names remain unchanged. Engine events
remain canonical Turkish in saved snapshots and JSON; only their visible text
is translated. Reloading still starts a new in-memory world, as before.

## What moves and where the numbers come from

The hero runs the actual unchanged engine for seed 4217: 960 shared steps to day
8, followed by 960 steps in each branch. At completion the populations are 139
and 14. The future drought panel explicitly retains full renewal until the fork.
Playback accelerates the display without changing the fixed simulation step.
It runs once, offers pause/replay, and pauses outside the viewport or in a
background tab. With reduced motion requested, it computes the endpoint directly;
CSS also removes transitions, fork animation and smooth scrolling.

The count/share chart reads `docs/paired-analysis.json`. The four-arm seed
explorer reads `docs/thrift-analysis.json`; it is a view of existing records, not
a new experiment. Both offer direct JSON links and fail visibly if evidence
cannot load. The chart's accessible description includes all six paired values.
The article illustration is decorative; the downloadable article contains the
actual scientific figures and tables.

The full article and its original seven-file manifest are preserved. Its earlier
private-access wording describes the revision before public release; current
access is explained beside the download and in the article build README. The
source has no open-source license, and the report has not been peer reviewed.

## Build and deployment

No dependencies or build service account are needed. Node.js 22+:

```powershell
npm test
npm run check
npm run experiment:thrift -- --replay
npm run build:pages
```

`scripts/site-files.mjs` enumerates the complete 15-file website. The build
replaces only `.local/pages/`, copies those assets, and adds `.nojekyll`.
Git metadata, agent instructions, local QA files and authoring tools are excluded
from the Pages artifact. The repository itself is public, including tracked
history and scientific evidence. This distinction is intentional.

The Pages workflow runs tests, source/artifact checks, the full 48-arm replay and
the build before deploying `main` through the `github-pages` environment. Pages
uses **GitHub Actions** as its build source. The separate checks workflow remains
enabled for pull requests. Failed build verification prevents deployment.
The workflow follows GitHub's [custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

All site links/imports use relative paths compatible with `/Morrow/`. To preview
that exact project prefix locally in a separate PowerShell terminal:

```powershell
$env:PORT = '4338'
$env:BASE_PATH = '/Morrow'
npm start
```

Open `http://127.0.0.1:4338/Morrow/`. The default `npm start` without those
environment variables serves the case study at `/` and app at `/pond.html`.
The preview remains bound to loopback and serves only the public allowlist.

## Verification scope

- 35 Node tests cover the existing model/analysis invariants, view translation,
  preserved lineage identifiers, loopback routes at `/` and `/Morrow/`, MIME
  types, HEAD requests, refusal of non-site files, exact build contents, stale
  output replacement, nested module imports and page fragments.
- Source checks verify JavaScript syntax, both pages' DOM targets, English
  defaults, Pages-compatible assets and generated evidence freshness.
- In-app browser inspection covered desktop and 390-pixel mobile layouts,
  English/Turkish switching, count/share changes, seed selection, links and the
  article section. Neither page had horizontal overflow at those widths.
- In the paused pond, switching language preserved the displayed day,
  population, food, generation, selected ID, energy and three gene values.
  A paused experiment retained its progress, mode and seed; the completed
  experiment gave the same six lineage counts in both languages.
- Seed 4217's hero replay reached the recorded 139/14 endpoints. The app's
  separate experiment completed with Filiz among the drought leaders in both
  languages. Observed browser warning/error logs were empty.
- Reduced-motion branches were inspected in source; this browser session did
  not provide a reduced-motion emulation control. Native file saving was not
  independently observed; the DOCX HTTP response and published bytes are checked
  separately from the download button.
- The engine, original batch, committed thrift protocol and raw thrift evidence
  retain their four frozen SHA-256 hashes. A bounded credential-pattern scan
  covered 103 historical Git blobs before publication, with no matches; this is
  not a general security certification.

Project changes and build/cache output stay under the D-drive project. Existing
browser/Codex/Windows runtime activity can still touch C; no zero-C-write claim
is made. The user's existing observation server is not stopped or replaced.

## Subsequent unseen seed replication update

A separately authorized study now adds 100 previously unexamined initial
conditions (10000–10099) and 400 branches. The engine and original evidence are
unchanged. See the [fixed protocol](replication-protocol.md) and
[complete results](replication-results.md). The case study keeps the original
12-world analysis and adds a separate bilingual replication section: mean,
paired-bootstrap interval, criterion, 100-dot sign map, every seed's four-arm
endpoints, both extreme outcomes and explicit sampling/mechanism limitations.

The public artifact now contains **16 files plus .nojekyll**. The added file is
`docs/replication-analysis.json`; large raw checkpoints remain linked through
the public source repository. The Word download is revision 2: 40 A 4 pages,
28 tables, three figures and ten native equations. The original article remains
available in Git history. Current access wording is updated in revision 2.

All 41 tests, current source/artifact checks, independent Python recalculation,
the original 48-arm replay and new 400-arm replay pass. Both Actions workflows
now run the independent audit and new replay; Pages deploys only after those
checks. Frozen raw generation refuses replacement. Desktop and 390-pixel mobile
inspection covered both languages, selection retention, all 100 select options,
100 displayed signs and shortcuts to seeds 10046/10058. No horizontal overflow
or browser warning/error log entries were observed. Reduced-motion and native
file-saving verification retain the limitations described above.
