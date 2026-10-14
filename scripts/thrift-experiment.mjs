import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { World, DAY, STEP } from '../src/engine.js';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const THRIFT_PROTOCOL = Object.freeze({
  warmupDays: 8, branchDays: 8, mutation: 0.08, seasons: false,
  abundanceResources: 1, droughtResources: 0.15,
  targetLineage: 1, targetName: 'Çiy', normalizedThrift: 1,
  timing: 'Once at the day-8 checkpoint; descendants mutate normally.',
});
export const THRIFT_SEEDS = Object.freeze(Array.from({ length: 12 }, (_, index) => 4217 + index));
export const ARMS = Object.freeze([
  'naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought',
]);
export const FROZEN_HASHES = Object.freeze({
  engine: '132e0bd255913caba45f38a98dc9e23f700502402cc6b21304c99e52f66b79c7',
  reference: '5576ea15805262502465348b160ef4ff4c56e7cdf5de8122bd04f437e284ba18',
  protocol: 'bb2c7d2da5dac4109e9e3c4b12a778a53b04b303820572789f14e23c29273919',
});
export const PROTOCOL_COMMIT = '4352cde6c77044e0fc1242ae66757940c1421403';
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const stateHash = (snapshot) => digest(JSON.stringify(snapshot));

export function createThriftCheckpoint(seed) {
  assert.ok(Number.isInteger(seed) && seed >= 0 && seed <= 4294967295, 'Invalid seed');
  return new World(seed, { resources: 1, mutation: 0.08, seasons: false })
    .step(Math.round(THRIFT_PROTOCOL.warmupDays * DAY / STEP)).snapshot();
}

export function forkThriftWorlds(checkpoint) {
  assert.equal(checkpoint.tick, 960, 'Intervention must occur on day 8');
  assert.deepEqual(checkpoint.options, { resources: 1, mutation: 0.08, seasons: false });
  const edits = checkpoint.agents.filter((agent) => agent.lineage === 1)
    .map((agent) => ({ id: agent.id, before: agent.genes.thrift, after: 1 }));
  const worlds = Object.fromEntries(ARMS.map((arm) => {
    const world = World.fromSnapshot(checkpoint);
    world.setEnvironment({ resources: arm.endsWith('Drought') ? 0.15 : 1 });
    if (arm.startsWith('normalized')) {
      for (const agent of world.agents) if (agent.lineage === 1) agent.genes.thrift = 1;
    }
    return [arm, world];
  }));
  return { worlds, edits };
}

export function runThriftSeed(seed, reference) {
  assert.equal(reference.seed, seed);
  const checkpoint = createThriftCheckpoint(seed);
  assert.deepEqual(World.fromSnapshot(checkpoint).stats(), reference.baseline,
    `Seed ${seed}: day-8 replay differs from original`);
  const { worlds, edits } = forkThriftWorlds(checkpoint);
  const startSha256 = Object.fromEntries(ARMS.map((arm) => [arm, stateHash(worlds[arm].snapshot())]));
  const final = {};
  for (const arm of ARMS) {
    const world = worlds[arm].step(Math.round(THRIFT_PROTOCOL.branchDays * DAY / STEP));
    assert.equal(world.tick, 1920);
    final[arm] = { stats: world.stats(), stateSha256: stateHash(world.snapshot()) };
  }
  assert.deepEqual(final.naturalAbundance.stats, reference.control,
    `Seed ${seed}: natural abundant arm differs from original`);
  assert.deepEqual(final.naturalDrought.stats, reference.drought,
    `Seed ${seed}: natural drought arm differs from original`);
  return { seed, checkpointSha256: stateHash(checkpoint), checkpoint, edits,
    startSha256, final, naturalReplayMatchesOriginal: true };
}

export async function readFrozenThriftInputs() {
  const paths = { engine: 'src/engine.js', reference: 'docs/initial-batch.json', protocol: 'docs/thrift-protocol.md' };
  const bytes = {};
  for (const [key, filename] of Object.entries(paths)) {
    bytes[key] = await readFile(path.join(root, filename));
    assert.equal(digest(bytes[key]), FROZEN_HASHES[key], `Frozen ${key} changed`);
  }
  const reference = JSON.parse(bytes.reference.toString('utf8'));
  assert.deepEqual(reference.seeds, THRIFT_SEEDS);
  return reference;
}

export async function runThriftBatch(onProgress = () => {}) {
  const reference = await readFrozenThriftInputs();
  const runs = [];
  for (const seed of THRIFT_SEEDS) {
    runs.push(runThriftSeed(seed, reference.runs.find((run) => run.seed === seed)));
    onProgress(seed, runs.length, THRIFT_SEEDS.length);
  }
  return {
    schemaVersion: 1, model: 'morrow-0.1', protocolCommit: PROTOCOL_COMMIT,
    protocol: { ...THRIFT_PROTOCOL }, frozenSha256: { ...FROZEN_HASHES },
    runnerSha256: digest(await readFile(fileURLToPath(import.meta.url))),
    executionRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    seeds: [...THRIFT_SEEDS], sampleSize: 12, branchRuns: 48, runs,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 1 || !['--write', '--replay'].includes(args[0])) {
      throw new Error('Usage: npm run experiment:thrift -- --write|--replay');
    }
    const destination = path.join(root, 'docs/thrift-raw.json');
    if (args[0] === '--write') {
      let existing = false;
      try { await readFile(destination); existing = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
      if (existing) throw new Error('Raw thrift batch already exists; use --replay to verify it without overwriting.');
    }
    const batch = await runThriftBatch((seed, done, total) => console.error(`Seed ${seed}: ${done}/${total} checkpoints, four arms complete.`));
    if (args[0] === '--write') {
      await writeFile(destination, JSON.stringify(batch, null, 2) + '\n', { flag: 'wx' });
      console.log('Saved twelve checkpoints and 48 branch outcomes to docs/thrift-raw.json.');
    } else {
      const saved = JSON.parse(await readFile(destination, 'utf8'));
      // The saved execution revision is provenance, not a simulated state.
      const { executionRevision: savedRevision, ...savedData } = saved;
      const { executionRevision: replayRevision, ...replayData } = batch;
      assert.deepEqual(replayData, savedData);
      console.log(`Full replay matches raw data (recorded ${savedRevision}; replay ${replayRevision}).`);
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
