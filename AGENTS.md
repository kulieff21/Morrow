# Morrow

An interactive, deterministic artificial-life sandbox created with Elmar.

- Conversation: Turkish. UI: English by default, with a Turkish switch.
  Source, identifiers and documentation: English.
- Keep the browser app dependency-free. Node.js 22+ serves and tests it.
- The simulation is a toy model, not a biological or economic prediction.
- Preserve seeded reproducibility: never use Math.random in the engine.
- Use a fixed simulation step; playback speed must not change outcomes.
- Experiment branches must clone the same checkpoint and report assumptions.
- Run `npm test` and `npm run check` before committing. Use the Browser skill for UI QA.
- Keep exports user-initiated. No analytics, external services or credentials.
- Git operations are authorized for this project, including private repository creation.
- Commit completed, coherent units frequently; Elmar explicitly requested shorter commit intervals.
- Do not change repository visibility or publish hosting without a user request.
- Elmar explicitly authorized public visibility and GitHub Pages publication on
  October 14, 2026. Keep the simulation engine and frozen scientific evidence
  unchanged when translating or presenting the site.

## Layout

`src/engine.js`: pure simulation and experiment logic.
`src/app.js`, `src/render.js`, `styles.css`, `pond.html`: browser experience.
`index.html`, `case.css`, `src/case.js`: bilingual public case study.
`server.mjs`: loopback-only preview server. `tests/`: Node built-in tests.

## Next session

Read `LOG.md` and `README.md` before changes. Keep the model documentation in
`docs/model.md` aligned with actual mechanics.


## Frozen unseen seed replication

Elmar authorized the new 100-seed study and updates to all publication outputs.
Read `docs/replication-protocol.md` and `docs/replication-results.md` before related
work. Preserve `scripts/replication.mjs`, its frozen helper inputs and raw evidence;
new scientific designs require separate identities. `npm run check` verifies
replication report freshness, and CI replays all 400 new arms plus the 48 old arms.
Rebuild and numerically audit the DOCX after manuscript edits, then render and
inspect every page before publication. See article README for tools.
