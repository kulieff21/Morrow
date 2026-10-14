import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runReplicationSeed, bootstrapMean, quantile, replicationDecision,
  analyzeReplication, REPLICATION_SEEDS, REPLICATION_HASHES, REPLICATION_COMMIT } from '../scripts/replication.mjs';
import { THRIFT_PROTOCOL, ARMS, stateHash } from '../scripts/thrift-experiment.mjs';

const recorded = JSON.parse(await readFile(new URL('../docs/thrift-raw.json', import.meta.url)));
const known = recorded.runs[0];

test('new runner reproduces the full original 4217 checkpoint and all four endpoints', () => {
  const { naturalReplayMatchesOriginal, ...expected } = known;
  assert.equal(naturalReplayMatchesOriginal, true);
  assert.deepEqual(runReplicationSeed(4217), expected);
});

test('bootstrap resamples paired effects deterministically and handles zero/null correctly', () => {
  assert.deepEqual(bootstrapMean([2, 2, null]), { n: 2, excluded: 1, interval: [2, 2] });
  assert.deepEqual(bootstrapMean([0, 0]), { n: 2, excluded: 0, interval: [0, 0] });
  assert.deepEqual(bootstrapMean([null]), { n: 0, excluded: 1, interval: null });
  const values = [-12, -3, 0, 1, 20];
  assert.deepEqual(bootstrapMean(values), bootstrapMean(values));
  assert.deepEqual(values, [-12, -3, 0, 1, 20]);
  assert.throws(() => bootstrapMean([NaN]));
  assert.equal(quantile([0, 10], .025), .25);
  assert.equal(quantile([0, 10], .975), 9.75);
});

test('prespecified decision needs 100 defined seeds, negative mean and strictly negative upper limit', () => {
  const s = { n: 100, mean: -2 };
  assert.equal(replicationDecision(s, { interval: [-4, -.1] }), 'criterion-met');
  assert.equal(replicationDecision(s, { interval: [-4, 0] }), 'inconclusive');
  assert.equal(replicationDecision({ n: 99, mean: -2 }, { interval: [-4, -.1] }), 'inconclusive-undefined-shares');
  assert.equal(replicationDecision({ n: 100, mean: 2 }, { interval: [.1, 4] }), 'opposite-direction');
});

// Synthetic validation fixtures relabel known old evidence without executing any
// unseen seed. They are never saved as experiment evidence or used for claims.
function fixture() {
  return { schemaVersion: 1, model: 'morrow-0.1', protocolCommit: REPLICATION_COMMIT,
    protocol: { ...THRIFT_PROTOCOL }, frozenSha256: { ...REPLICATION_HASHES },
    executionRevision: 'a'.repeat(40), seeds: [...REPLICATION_SEEDS], sampleSize: 100, branchRuns: 400,
    runs: REPLICATION_SEEDS.map((seed) => {
      const r = structuredClone(known); r.seed = seed; r.checkpoint.seed = seed;
      r.checkpointSha256 = stateHash(r.checkpoint);
      // Seed is provenance in snapshots; no RNG draw or world step is performed.
      // Starting hashes must reflect this synthetic relabeling as well.
      for (const arm of ARMS) {
        const start = structuredClone(r.checkpoint);
        start.options.resources = arm.endsWith('Drought') ? .15 : 1;
        if (arm.startsWith('normalized')) for (const a of start.agents) if (a.lineage === 1) a.genes.thrift = 1;
        r.startSha256[arm] = stateHash(start);
      }
      return r;
    }) };
}

test('analysis preserves pairing, zero target share and all seed denominators', () => {
  const raw = fixture(), before = JSON.stringify(raw);
  const report = analyzeReplication(raw);
  assert.equal(report.sampleSize, 100); assert.equal(report.branchRuns, 400);
  assert.equal(report.arms.normalizedDrought.meanSharePercent, 0);
  assert.equal(report.arms.normalizedDrought.targetExtinctions, 100);
  assert.equal(report.effects.share.interaction.negative, 100);
  assert.equal(report.bootstrap.share.n, 100);
  assert.equal(report.decision, 'criterion-met');
  assert.equal(JSON.stringify(raw), before);
});

test('analysis rejects substituted seeds, altered checkpoints, edits, endpoints and totals', () => {
  for (const change of [
    (r) => { r.seeds[0] = 4217; },
    (r) => { r.runs[1].seed = r.runs[0].seed; },
    (r) => { r.runs[0].checkpoint.food[0].x += 1; },
    (r) => { r.runs[0].edits[0].after = .9; },
    (r) => { r.runs[0].final.naturalAbundance.stats.day = 15; },
    (r) => { r.runs[0].final.naturalAbundance.stats.population += 1; },
  ]) { const raw = fixture(); change(raw); assert.throws(() => analyzeReplication(raw)); }
});

test('whole-world extinction excludes share interactions and keeps count outcomes', () => {
  const raw = fixture(), arm = raw.runs[0].final.normalizedDrought.stats;
  arm.population = 0;
  for (const row of arm.lineages) { row.count = 0; row.thriftSum = 0; }
  const report = analyzeReplication(raw);
  assert.equal(report.runs[0].arms.normalizedDrought.sharePercent, null);
  assert.equal(report.effects.share.interaction.n, 99);
  assert.equal(report.effects.count.interaction.n, 100);
  assert.equal(report.decision, 'inconclusive-undefined-shares');
});
