# Morrow

An interactive, deterministic artificial-life sandbox created with Elmar.

- Conversation and UI: Turkish. Source, identifiers and documentation: English.
- Keep the browser app dependency-free. Node.js 22+ serves and tests it.
- The simulation is a toy model, not a biological or economic prediction.
- Preserve seeded reproducibility: never use Math.random in the engine.
- Use a fixed simulation step; playback speed must not change outcomes.
- Experiment branches must clone the same checkpoint and report assumptions.
- Run `npm test` and `npm run check` before committing. Use the Browser skill for UI QA.
- Keep exports user-initiated. No analytics, external services or credentials.
- Git operations are authorized for this project, including private repository creation.
- Do not change repository visibility or publish hosting without a user request.

## Layout

`src/engine.js`: pure simulation and experiment logic.
`src/app.js`, `src/render.js`, `styles.css`, `index.html`: browser experience.
`server.mjs`: loopback-only preview server. `tests/`: Node built-in tests.

## Next session

Read `LOG.md` and `README.md` before changes. Keep the model documentation in
`docs/model.md` aligned with actual mechanics.
