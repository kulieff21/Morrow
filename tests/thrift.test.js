import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { World } from '../src/engine.js';
import { createThriftCheckpoint, forkThriftWorlds, runThriftSeed, stateHash, ARMS } from '../scripts/thrift-experiment.mjs';
import { factorialEffects, summarizeEffects } from '../scripts/analyze-thrift.mjs';

const reference = JSON.parse(await readFile(new URL('../docs/initial-batch.json', import.meta.url), 'utf8'));

test('four clones differ only in declared resource setting and existing Ciy thrift', () => {
  const checkpoint = createThriftCheckpoint(4217), original = structuredClone(checkpoint);
  const { worlds, edits } = forkThriftWorlds(checkpoint);
  assert.equal(edits.length, checkpoint.agents.filter((agent) => agent.lineage === 1).length);
  for (const arm of ARMS) {
    const actual = worlds[arm].snapshot(), expected = structuredClone(checkpoint);
    expected.options.resources = arm.endsWith('Drought') ? 0.15 : 1;
    if (arm.startsWith('normalized')) for (const agent of expected.agents) if (agent.lineage === 1) agent.genes.thrift = 1;
    assert.deepEqual(actual, expected);
    assert.equal(actual.rng, checkpoint.rng);
  }
  worlds.normalizedAbundance.agents[0].energy = 1;
  assert.deepEqual(worlds.naturalAbundance.snapshot(), original);
  assert.notEqual(worlds.normalizedAbundance.agents, worlds.normalizedDrought.agents);
  assert.deepEqual(checkpoint, original);
});

test('normalization is once-only and descendants use normal mutation', () => {
  const checkpoint = createThriftCheckpoint(4217);
  const { worlds } = forkThriftWorlds(checkpoint);
  const world = worlds.normalizedAbundance;
  const parent = world.agents.find((agent) => agent.lineage === 1);
  assert.equal(parent.genes.thrift, 1);
  const child = world.createAgent(1, parent);
  assert.ok(child.genes.thrift >= 0.92 && child.genes.thrift <= 1.08);
  assert.notEqual(child.genes.thrift, 1);
  world.step(250);
  assert.ok(world.agents.some((agent) => agent.lineage === 1 && agent.bornAt > 96 && agent.genes.thrift !== 1));
});

test('four-arm replay is exact, ends on day 16, and preserves original natural arms', () => {
  const original = reference.runs.find((run) => run.seed === 4217);
  const first = runThriftSeed(4217, original), second = runThriftSeed(4217, original);
  assert.deepEqual(first, second);
  assert.equal(first.checkpointSha256, stateHash(first.checkpoint));
  for (const arm of ARMS) assert.equal(first.final[arm].stats.day, 16);
  assert.deepEqual(first.final.naturalAbundance.stats, original.control);
  assert.deepEqual(first.final.naturalDrought.stats, original.drought);
  assert.throws(() => runThriftSeed(4217, { ...original, control: { ...original.control, population: -1 } }));
});

test('factorial contrast uses normalized-minus-natural and drought-minus-abundance', () => {
  assert.deepEqual(factorialEffects({ naturalAbundance: 10, normalizedAbundance: 8,
    naturalDrought: 6, normalizedDrought: 1 }), { abundance: -2, drought: -5, interaction: -3 });
  assert.deepEqual(factorialEffects({ naturalAbundance: 10, normalizedAbundance: 4,
    naturalDrought: 6, normalizedDrought: 3 }), { abundance: -6, drought: -3, interaction: 3 });
  assert.deepEqual(factorialEffects({ naturalAbundance: 0, normalizedAbundance: 0,
    naturalDrought: null, normalizedDrought: 0 }), { abundance: 0, drought: null, interaction: null });
});

test('summary preserves undefined denominators and reports mean, median, range and directions', () => {
  assert.deepEqual(summarizeEffects([-5, -1, 0, 2, null]),
    { n: 4, undefined: 1, mean: -1, median: -0.5, range: [-5, 2], negative: 2, zero: 1, positive: 1 });
  assert.deepEqual(summarizeEffects([null]),
    { n: 0, undefined: 1, mean: null, median: null, range: null, negative: 0, zero: 0, positive: 0 });
});

test('intervention refuses a different time or environment and supports no remaining Ciy', () => {
  const snapshot = new World(1).snapshot();
  assert.throws(() => forkThriftWorlds(snapshot));
  snapshot.tick = 960; snapshot.options.mutation = 0;
  assert.throws(() => forkThriftWorlds(snapshot));
  const checkpoint = createThriftCheckpoint(4217);
  checkpoint.agents = checkpoint.agents.filter((agent) => agent.lineage !== 1);
  const { worlds, edits } = forkThriftWorlds(checkpoint);
  assert.equal(edits.length, 0);
  assert.deepEqual(worlds.naturalAbundance.snapshot(), worlds.normalizedAbundance.snapshot());
});
