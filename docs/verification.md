# Verification — version 0.1

Recorded on October 14, 2026, on Windows with Node.js 22.23.2.

## Automated checks

- `npm test`: 15 passing tests (14 model/protocol tests and one HTTP integration test).
- `npm run check`: syntax checks for eight JavaScript modules; 80 unique HTML IDs,
  literal UI targets, local asset links, and absence of unseeded engine randomness.
- Twelve consecutive experiment seeds: full reports in `initial-batch.json`;
  five retained, seven changed, zero undefined leadership outcomes.
- The test server uses its own ephemeral port and is stopped by its test.
- GitHub Actions repeats the tests and source checks on Node 22 / Ubuntu.
  The repository Actions tab is the authority for each remote run's status.

The tests verify model invariants, not scientific validity. The HTTP integration
test checks an allowlist, HTTP methods and response headers; it is not a general
security certification.

## Browser QA

Checked in the Codex in-app browser using the real loopback server:

- Observation loaded with thirty founders, six lineages and 210 initial food.
- Pause and selection from the lineage ledger showed the organism's ID, energy,
  generation, genes and offspring counts.
- Drought set resource renewal to 15% and updated the environment indicator.
- The experiment preserved the paused observation world while running a fresh one.
- Placing a rock and dropping food updated the pond and event message.
- The explanation dialog opened, restricted focus and closed with Escape.
- The complete experiment for seed 4217 reached 16.0 days and rendered the result
  table: control population 139, drought population 14, drought leader Filiz (5).
  These matched the model/CLI results, including the other five lineage counts.
- Responsive inspection at 390 × 844 found no horizontal overflow; experiment
  canvases stacked. Desktop was inspected at 1280 × 900; shelf and pond stayed
  separate, and the document width did not exceed the viewport. Temporary viewport
  overrides were reset after QA.
- No browser console warnings or errors were observed in the inspected sessions.

Browser testing caught a final-frame UI bug: throttled counters could leave the
experiment at 15.9 days after the model had finished. The final experiment and
extinction steps now force a UI refresh; a real repeated browser run confirmed
the completed results screen.

JSON export buttons executed and updated their status without a console error.
The in-app browser did not emit the awaited native download event, so saved-file
delivery was **not** independently verified there. Exported model reports are
independently available through the tested CLI and the tracked initial batch.

## Boundaries

No persistence across page reloads, import UI, production hosting, or cross-browser
matrix was tested or promised. The project has no external service integration.
Model snapshots are in memory; downloads are user-initiated. See README for startup
and `docs/model.md` for assumptions.
