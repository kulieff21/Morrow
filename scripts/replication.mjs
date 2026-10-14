import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { World } from '../src/engine.js';
import { ARMS, THRIFT_PROTOCOL, createThriftCheckpoint, forkThriftWorlds,
  digest, stateHash } from './thrift-experiment.mjs';
import { factorialEffects, summarizeEffects } from './analyze-thrift.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const REPLICATION_SEEDS = Object.freeze(Array.from({ length: 100 }, (_, i) => 10000 + i));
export const REPLICATION_COMMIT = '2158e085b706c647829637182d51829231b8ff77';
export const REPLICATION_HASHES = Object.freeze({
  'src/engine.js': '132e0bd255913caba45f38a98dc9e23f700502402cc6b21304c99e52f66b79c7',
  'scripts/thrift-experiment.mjs': '6f12afdd863d3882e14e61289f5edb6a36c7748cfb521490033f516334b06e90',
  'scripts/analyze-thrift.mjs': '87a2e058e8e7f7173bdf3019dc7b276b0a344494c67b8adda3902221a61cb8ed',
  'docs/replication-protocol.md': '536e2a8ce51b8c037ef8d80cdbac435fe5f09b501d4b69a9b4a9dfd4c84e71bd',
});
export const BOOTSTRAP = Object.freeze({ resamples: 20000, seed: 20261014,
  method: 'paired-seed percentile', quantile: 'type 7', level: 0.95 });
const average = (values) => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

export function quantile(sorted, p) {
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * p, low = Math.floor(position), fraction = position - low;
  return sorted[low] + fraction * (sorted[Math.ceil(position)] - sorted[low]);
}

export function bootstrapMean(values, { resamples = BOOTSTRAP.resamples, seed = BOOTSTRAP.seed } = {}) {
  const eligible = values.filter((value) => value !== null);
  assert.ok(eligible.every(Number.isFinite), 'Non-finite bootstrap input');
  assert.ok(Number.isSafeInteger(resamples) && resamples > 0);
  if (!eligible.length) return { n: 0, excluded: values.length, interval: null };
  let state = seed >>> 0;
  function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const means = [];
  for (let b = 0; b < resamples; b++) {
    let sum = 0;
    for (let i = 0; i < eligible.length; i++) sum += eligible[Math.floor(random() * eligible.length)];
    means.push(sum / eligible.length);
  }
  means.sort((a, b) => a - b);
  return { n: eligible.length, excluded: values.length - eligible.length,
    interval: [quantile(means, .025), quantile(means, .975)] };
}

export function replicationDecision(summary, bootstrap) {
  if (summary.n !== 100 || !bootstrap.interval) return 'inconclusive-undefined-shares';
  if (summary.mean < 0 && bootstrap.interval[1] < 0) return 'criterion-met';
  if (bootstrap.interval[0] > 0) return 'opposite-direction';
  return 'inconclusive';
}

export function runReplicationSeed(seed) {
  const checkpoint = createThriftCheckpoint(seed);
  const { worlds, edits } = forkThriftWorlds(checkpoint);
  const startSha256 = Object.fromEntries(ARMS.map((arm) => [arm, stateHash(worlds[arm].snapshot())]));
  const final = Object.fromEntries(ARMS.map((arm) => {
    const world = worlds[arm].step(960);
    assert.equal(world.tick, 1920);
    return [arm, { stats: world.stats(), stateSha256: stateHash(world.snapshot()) }];
  }));
  return { seed, checkpoint, checkpointSha256: stateHash(checkpoint), edits, startSha256, final };
}

async function frozenInputs() {
  for (const [file, expected] of Object.entries(REPLICATION_HASHES)) {
    assert.equal(digest(await readFile(path.join(root, file))), expected, `Frozen input changed: ${file}`);
  }
}

export async function runReplicationBatch(onProgress = () => {}) {
  await frozenInputs();
  const runs = [];
  for (const seed of REPLICATION_SEEDS) {
    runs.push(runReplicationSeed(seed));
    onProgress(seed, runs.length);
  }
  return { schemaVersion: 1, model: 'morrow-0.1', protocolCommit: REPLICATION_COMMIT,
    protocol: { ...THRIFT_PROTOCOL }, frozenSha256: { ...REPLICATION_HASHES },
    runnerSha256: digest(await readFile(fileURLToPath(import.meta.url))),
    executionRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    seeds: [...REPLICATION_SEEDS], sampleSize: 100, branchRuns: 400, runs };
}

function leaders(stats) {
  const maximum = Math.max(...stats.lineages.map((row) => row.count));
  return stats.lineages.filter((row) => maximum > 0 && row.count === maximum).map((row) => row.lineage);
}

function outcome(stats) {
  assert.equal(stats.day, 16, 'Wrong endpoint');
  assert.ok(Number.isSafeInteger(stats.population) && stats.population >= 0);
  assert.equal(stats.lineages.length, 6);
  for (const [index, row] of stats.lineages.entries()) {
    assert.equal(row.lineage, index);
    assert.ok(Number.isSafeInteger(row.count) && row.count >= 0);
    assert.ok(Number.isFinite(row.thriftSum) && row.thriftSum >= 0);
  }
  assert.equal(stats.lineages.reduce((sum, row) => sum + row.count, 0), stats.population);
  const target = stats.lineages[1]; assert.equal(target.name, 'Çiy');
  return { population: stats.population, count: target.count,
    sharePercent: stats.population ? target.count / stats.population * 100 : null,
    meanThrift: target.count ? target.thriftSum / target.count : null };
}

export function summarizeReplication(runs) {
  const effects = Object.fromEntries(['count', 'share'].map((metric) => [metric,
    Object.fromEntries(['abundance', 'drought', 'interaction'].map((effect) => [effect,
      summarizeEffects(runs.map((run) => run[metric][effect]))]))]));
  const bootstrap = Object.fromEntries(['count', 'share'].map((metric) => [metric,
    bootstrapMean(runs.map((run) => run[metric].interaction))]));
  return { sampleSize: runs.length, branchRuns: runs.length * 4,
    arms: Object.fromEntries(ARMS.map((arm) => [arm, {
      meanPopulation: average(runs.map((r) => r.arms[arm].population)),
      meanCount: average(runs.map((r) => r.arms[arm].count)),
      meanSharePercent: average(runs.map((r) => r.arms[arm].sharePercent).filter((v) => v !== null)),
      comparableShares: runs.filter((r) => r.arms[arm].sharePercent !== null).length,
      targetExtinctions: runs.filter((r) => r.arms[arm].count === 0).length,
      wholeWorldExtinctions: runs.filter((r) => r.arms[arm].population === 0).length,
    }])), effects, bootstrap, bootstrapSettings: { ...BOOTSTRAP },
    decision: replicationDecision(effects.share.interaction, bootstrap.share),
    naturalDifferences: Object.fromEntries(['count', 'share'].map((metric) => [metric,
      summarizeEffects(runs.map((r) => r.naturalDifference[metric]))])),
    leadership: {
      abundanceRetained: runs.filter((r) => r.leadership.abundanceRetained === true).length,
      droughtRetained: runs.filter((r) => r.leadership.droughtRetained === true).length,
      abundanceUndefined: runs.filter((r) => r.leadership.abundanceRetained === null).length,
      droughtUndefined: runs.filter((r) => r.leadership.droughtRetained === null).length,
      endpointDisjoint: runs.filter((r) => r.leadership.endpointRelation === 'disjoint').length,
      endpointIdentical: runs.filter((r) => r.leadership.endpointRelation === 'identical').length,
      endpointPartial: runs.filter((r) => r.leadership.endpointRelation === 'partial').length,
      endpointUndefined: runs.filter((r) => r.leadership.endpointRelation === 'undefined').length,
    }, runs };
}

export function analyzeReplication(raw) {
  assert.equal(raw.schemaVersion, 1); assert.equal(raw.model, 'morrow-0.1');
  assert.equal(raw.protocolCommit, REPLICATION_COMMIT);
  assert.deepEqual(raw.protocol, THRIFT_PROTOCOL);
  assert.deepEqual(raw.frozenSha256, REPLICATION_HASHES);
  assert.deepEqual(raw.seeds, REPLICATION_SEEDS);
  assert.equal(raw.sampleSize, 100); assert.equal(raw.branchRuns, 400); assert.equal(raw.runs.length, 100);
  assert.match(raw.executionRevision, /^[a-f0-9]{40}$/);
  const runs = raw.runs.map((run, index) => {
    assert.equal(run.seed, REPLICATION_SEEDS[index]); assert.equal(run.checkpoint.seed, run.seed);
    assert.equal(run.checkpointSha256, stateHash(run.checkpoint), 'Checkpoint hash mismatch');
    const { worlds, edits } = forkThriftWorlds(run.checkpoint);
    assert.deepEqual(run.edits, edits, 'Gene edit mismatch');
    for (const arm of ARMS) {
      assert.equal(run.startSha256[arm], stateHash(worlds[arm].snapshot()), 'Branch starting hash mismatch');
      assert.match(run.final[arm].stateSha256, /^[a-f0-9]{64}$/);
    }
    const arms = Object.fromEntries(ARMS.map((arm) => [arm, outcome(run.final[arm].stats)]));
    const count = factorialEffects(Object.fromEntries(ARMS.map((arm) => [arm, arms[arm].count])));
    const share = factorialEffects(Object.fromEntries(ARMS.map((arm) => [arm, arms[arm].sharePercent])));
    const baseline = leaders(World.fromSnapshot(run.checkpoint).stats());
    const a = leaders(run.final.naturalAbundance.stats), d = leaders(run.final.naturalDrought.stats);
    const retained = (endpoint) => baseline.length && endpoint.length ? baseline.some((id) => endpoint.includes(id)) : null;
    return { seed: run.seed, editedOrganisms: edits.length,
      checkpointMeanThrift: average(edits.map((edit) => edit.before)), arms, count, share,
      naturalDifference: { count: arms.naturalDrought.count - arms.naturalAbundance.count,
        share: arms.naturalDrought.sharePercent === null || arms.naturalAbundance.sharePercent === null ? null
          : arms.naturalDrought.sharePercent - arms.naturalAbundance.sharePercent },
      leadership: { baseline, abundance: a, drought: d, abundanceRetained: retained(a), droughtRetained: retained(d),
        endpointRelation: !a.length || !d.length ? 'undefined' : JSON.stringify(a) === JSON.stringify(d)
          ? 'identical' : a.some((id) => d.includes(id)) ? 'partial' : 'disjoint' } };
  });
  return { analysisVersion: 1, model: raw.model, protocolCommit: raw.protocolCommit,
    executionRevision: raw.executionRevision, protocol: raw.protocol, ...summarizeReplication(runs) };
}

export async function readReplicationReport() {
  await frozenInputs();
  const bytes = await readFile(path.join(root, 'docs/replication-raw.json'));
  const raw = JSON.parse(bytes);
  assert.equal(raw.runnerSha256, digest(await readFile(fileURLToPath(import.meta.url))), 'Frozen replication implementation changed');
  return { source: { path: 'docs/replication-raw.json', sha256: digest(bytes) }, ...analyzeReplication(raw) };
}

export function renderReplicationMarkdown(report) {
  const f = (v) => v === null ? 'Undefined' : v.toFixed(4);
  const lines = ['# Morrow unseen seed replication results', '',
    `Protocol: ${report.protocolCommit}. Execution: ${report.executionRevision}.`, '',
    '100 previously unexamined seeds (10000–10099), 400 branches, one unchanged model. The old twelve seeds are excluded.', '',
    `Prespecified primary criterion: **${report.decision}**.`, '',
    '| Outcome | Defined seeds | Mean interaction | Median | Minimum | Maximum | Negative | Zero | Positive | Bootstrap lower | Bootstrap upper |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'];
  for (const [metric, label] of [['share', 'Share (percentage points)'], ['count', 'Count (organisms)']]) {
    const e = report.effects[metric].interaction, b = report.bootstrap[metric];
    lines.push(`| ${[label, e.n, f(e.mean), f(e.median), ...(e.range ?? [null, null]).map(f), e.negative, e.zero, e.positive, ...(b.interval ?? [null, null]).map(f)].join(' | ')} |`);
  }
  lines.push('', 'Intervals are central 95% paired-seed percentile bootstrap intervals, 20,000 resamples, analysis RNG seed 20261014, type-7 quantiles. They describe resampling of the chosen ensemble; representative/exchangeable sampling across all seeds is not established. No biological or energy-only inference follows.', '',
    '| Arm | Mean total N | Mean Çiy n | Mean Çiy share % | Defined shares | Çiy extinctions | Whole-world extinctions |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const key of ARMS) {
    const a = report.arms[key];
    lines.push(`| ${[key, f(a.meanPopulation), f(a.meanCount), f(a.meanSharePercent), a.comparableShares, a.targetExtinctions, a.wholeWorldExtinctions].join(' | ')} |`);
  }
  lines.push('', '## Every seed', '', 'A and D are natural abundance/drought; XA and XD are normalized abundance/drought. Interaction is (XD−D)−(XA−A). These are paired endpoints, not independent arms.', '',
    '| Seed | A N | D N | XA N | XD N | A n | D n | XA n | XD n | Share interaction pp | Count interaction n |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
  for (const r of report.runs) lines.push(`| ${[r.seed, ...ARMS.map((a) => r.arms[a].population), ...ARMS.map((a) => r.arms[a].count), f(r.share.interaction), f(r.count.interaction)].join(' | ')} |`);
  lines.push('', 'All arm shares, environment-specific effects, natural contrasts, leadership outcomes, edited cohort sizes and extinction denominators are in the [analysis JSON](replication-analysis.json). Full checkpoints and final statistics are in [raw evidence](replication-raw.json).', '',
    'The criterion tests the prespecified average pattern in this model/seed range/horizon. Sign heterogeneity and reversed individual outcomes remain relevant. Thrift affects several coupled rules and its checkpoint variation is removed by normalization.', '',
    '[Fixed protocol](replication-protocol.md). Original evidence remains unchanged. Replay: `npm run experiment:replication -- --replay`.', '');
  return lines.join('\n');
}

export async function checkReplicationArtifacts() {
  const report = await readReplicationReport();
  for (const [file, expected] of [['replication-analysis.json', JSON.stringify(report, null, 2) + '\n'],
    ['replication-results.md', renderReplicationMarkdown(report)]]) {
    assert.equal(await readFile(path.join(root, 'docs', file), 'utf8'), expected, `Stale ${file}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [command, ...rest] = process.argv.slice(2);
    assert.ok(!rest.length && ['--write', '--replay', '--analyze', '--check'].includes(command),
      'Usage: node scripts/replication.mjs --write|--replay|--analyze|--check');
    const destination = path.join(root, 'docs/replication-raw.json');
    if (command === '--check') { await checkReplicationArtifacts(); console.log('Replication artifacts match saved evidence.'); }
    else if (command === '--analyze') {
      const report = await readReplicationReport();
      await writeFile(path.join(root, 'docs/replication-analysis.json'), JSON.stringify(report, null, 2) + '\n');
      await writeFile(path.join(root, 'docs/replication-results.md'), renderReplicationMarkdown(report));
      console.log(`Analysis written; primary criterion: ${report.decision}.`);
    } else {
      if (command === '--write') {
        try { await readFile(destination); throw new Error('Raw replication already exists; use --replay.'); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
      }
      const batch = await runReplicationBatch((seed, n) => console.error(`Seed ${seed}: ${n}/100 paired worlds complete.`));
      if (command === '--write') { await writeFile(destination, JSON.stringify(batch) + '\n', { flag: 'wx' }); console.log('Saved all 100 checkpoints and 400 branches.'); }
      else {
        const { executionRevision: savedRevision, ...saved } = JSON.parse(await readFile(destination));
        const { executionRevision: currentRevision, ...replayed } = batch;
        assert.deepEqual(replayed, saved);
        console.log(`All 400 branches match (recorded ${savedRevision}; replay ${currentRevision}).`);
      }
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
