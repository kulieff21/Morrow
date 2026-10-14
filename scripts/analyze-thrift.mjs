import assert from 'node:assert/strict';
import { ARMS, THRIFT_PROTOCOL, THRIFT_SEEDS, FROZEN_HASHES,
  PROTOCOL_COMMIT, stateHash, forkThriftWorlds } from './thrift-experiment.mjs';

const average = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
export function summarizeEffects(values) {
  const defined = values.filter((value) => value !== null);
  assert.ok(defined.every(Number.isFinite), 'Non-finite effect');
  const sorted = [...defined].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return { n: defined.length, undefined: values.length - defined.length,
    mean: average(defined), median: !defined.length ? null : defined.length % 2
      ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2,
    range: defined.length ? [sorted[0], sorted.at(-1)] : null,
    negative: defined.filter((value) => value < 0).length,
    zero: defined.filter((value) => value === 0).length,
    positive: defined.filter((value) => value > 0).length };
}

export function factorialEffects(outcomes) {
  const difference = (a, b) => a === null || b === null ? null : a - b;
  const abundance = difference(outcomes.normalizedAbundance, outcomes.naturalAbundance);
  const drought = difference(outcomes.normalizedDrought, outcomes.naturalDrought);
  return { abundance, drought, interaction: difference(drought, abundance) };
}

function targetOutcome(stats) {
  assert.ok(Number.isSafeInteger(stats.population) && stats.population >= 0, 'Invalid population');
  assert.equal(stats.day, 16, 'Wrong endpoint');
  assert.equal(stats.lineages.length, 6);
  for (let i = 0; i < 6; i++) {
    const row = stats.lineages[i];
    assert.equal(row.lineage, i);
    assert.ok(Number.isSafeInteger(row.count) && row.count >= 0, 'Invalid lineage count');
    assert.ok(Number.isFinite(row.thriftSum) && row.thriftSum >= 0, 'Invalid thrift sum');
  }
  assert.equal(stats.lineages.reduce((sum, row) => sum + row.count, 0), stats.population);
  const target = stats.lineages[1];
  assert.equal(target.name, 'Çiy');
  return { population: stats.population, count: target.count,
    sharePercent: stats.population ? target.count / stats.population * 100 : null,
    meanThrift: target.count ? target.thriftSum / target.count : null };
}

export function analyzeThriftBatch(raw, reference) {
  assert.equal(raw.schemaVersion, 1);
  assert.equal(raw.model, 'morrow-0.1');
  assert.deepEqual(raw.protocol, THRIFT_PROTOCOL);
  assert.deepEqual(raw.frozenSha256, FROZEN_HASHES);
  assert.equal(raw.protocolCommit, PROTOCOL_COMMIT);
  assert.deepEqual(raw.seeds, THRIFT_SEEDS);
  assert.equal(raw.sampleSize, 12); assert.equal(raw.branchRuns, 48);
  assert.equal(raw.runs.length, 12);
  const runs = raw.runs.map((run, index) => {
    assert.equal(run.seed, THRIFT_SEEDS[index]);
    assert.equal(run.checkpoint.seed, run.seed);
    assert.equal(run.checkpointSha256, stateHash(run.checkpoint), 'Checkpoint hash mismatch');
    assert.equal(run.naturalReplayMatchesOriginal, true);
    const { worlds, edits } = forkThriftWorlds(run.checkpoint);
    assert.deepEqual(run.edits, edits, 'Recorded gene edits differ');
    for (const arm of ARMS) {
      assert.equal(run.startSha256[arm], stateHash(worlds[arm].snapshot()), 'Branch starting hash mismatch');
      assert.match(run.final[arm].stateSha256, /^[a-f0-9]{64}$/);
    }
    const original = reference.runs.find((row) => row.seed === run.seed);
    assert.ok(original, 'Reference seed missing');
    assert.deepEqual(worlds.naturalAbundance.stats(), original.baseline);
    assert.deepEqual(run.final.naturalAbundance.stats, original.control);
    assert.deepEqual(run.final.naturalDrought.stats, original.drought);
    const arms = Object.fromEntries(ARMS.map((arm) => [arm, targetOutcome(run.final[arm].stats)]));
    const count = factorialEffects(Object.fromEntries(ARMS.map((arm) => [arm, arms[arm].count])));
    const share = factorialEffects(Object.fromEntries(ARMS.map((arm) => [arm, arms[arm].sharePercent])));
    return { seed: run.seed, editedOrganisms: edits.length,
      checkpointMeanThrift: average(edits.map((edit) => edit.before)), arms, count, share };
  });
  return {
    analysisVersion: 1, model: raw.model, protocolCommit: PROTOCOL_COMMIT,
    protocol: { ...THRIFT_PROTOCOL }, executionRevision: raw.executionRevision,
    sampleSize: 12, branchRuns: 48,
    definition: 'Normalization effect = normalized - natural; interaction = effect_drought - effect_abundance. Negative share interaction is the predicted direction.',
    arms: Object.fromEntries(ARMS.map((arm) => [arm, {
      meanPopulation: average(runs.map((run) => run.arms[arm].population)),
      meanCount: average(runs.map((run) => run.arms[arm].count)),
      meanSharePercent: average(runs.map((run) => run.arms[arm].sharePercent).filter((value) => value !== null)),
      comparableShares: runs.filter((run) => run.arms[arm].sharePercent !== null).length,
      targetExtinctions: runs.filter((run) => run.arms[arm].count === 0).length,
      wholeWorldExtinctions: runs.filter((run) => run.arms[arm].population === 0).length,
    }])),
    effects: Object.fromEntries(['count', 'share'].map((metric) => [metric,
      Object.fromEntries(['abundance', 'drought', 'interaction'].map((effect) => [effect,
        summarizeEffects(runs.map((run) => run[metric][effect]))]))])),
    runs,
    limitations: [
      'Twelve reused seeds and a hypothesis chosen from their earlier outcomes; no held-out replication or biological inference.',
      'Thrift is changed once at day 8; descendant mutation remains active.',
      'Changing thrift affects energy, movement, reproduction and lifespan, and removes checkpoint thrift variation within the treated lineage.',
      'Branch random draws diverge; these are full modeled intervention effects, not coupled environmental random sequences.',
      'A share effect is relative to the other lineages and is reported beside absolute counts.',
      'Final-state hashes are provenance; confirming their contents requires the full replay command.',
      'The one fixed follow-up horizon and trait target do not establish universal necessity, sufficiency or a general gene effect.',
    ],
  };
}
