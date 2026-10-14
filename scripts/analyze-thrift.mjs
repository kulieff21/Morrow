import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { ARMS, THRIFT_PROTOCOL, THRIFT_SEEDS, FROZEN_HASHES,
  PROTOCOL_COMMIT, stateHash, digest, forkThriftWorlds, readFrozenThriftInputs } from './thrift-experiment.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

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
  assert.match(raw.executionRevision, /^[a-f0-9]{40}$/);
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

export async function readThriftReport() {
  const reference = await readFrozenThriftInputs();
  const bytes = await readFile(path.join(root, 'docs/thrift-raw.json'));
  const raw = JSON.parse(bytes.toString('utf8'));
  assert.equal(raw.runnerSha256, digest(await readFile(path.join(root, 'scripts/thrift-experiment.mjs'))),
    'Recorded runner has changed; preserve this experiment and identify a new one.');
  return { source: { path: 'docs/thrift-raw.json', sha256: digest(bytes) }, ...analyzeThriftBatch(raw, reference) };
}

export function renderThriftMarkdown(report) {
  const f = (value) => value === null ? '—' : value.toFixed(2);
  const sign = (value) => value === null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
  const range = (values) => values ? `${sign(values[0])} to ${sign(values[1])}` : '—';
  const names = { naturalAbundance: 'Abundance, natural thrift', naturalDrought: 'Drought, natural thrift',
    normalizedAbundance: 'Abundance, normalized thrift', normalizedDrought: 'Drought, normalized thrift' };
  const effects = report.effects;
  const gapNatural = report.arms.naturalDrought.meanSharePercent - report.arms.naturalAbundance.meanSharePercent;
  const gapNormalized = report.arms.normalizedDrought.meanSharePercent - report.arms.normalizedAbundance.meanSharePercent;
  const lines = [
    '# Çiy thrift intervention — four-arm results', '',
    `Twelve day-8 checkpoints, four branches per checkpoint, 48 branch outcomes.`,
    'The checkpoint is the paired unit: this is **12**, not 48 independent units.',
    'Twenty-four natural-branch outcomes reproduce the earlier experiment; twenty-four',
    'normalized-branch outcomes add the thrift intervention.', '',
    `The [fixed protocol](thrift-protocol.md) was committed as \`${report.protocolCommit}\``,
    `before batch execution at \`${report.executionRevision}\`.`,
    'The hypothesis and seeds were informed by the earlier analysis of these same',
    'seeds. No held-out replication is claimed.', '',
    `Raw evidence: [thrift-raw.json](thrift-raw.json), SHA-256 \`${report.source.sha256}\`.`,
    'It contains complete day-8 checkpoints, exact gene edits, branch-start hashes,',
    'all final lineage stats and final state hashes. The previous batch and engine',
    'are unchanged. The two natural arms match the previous complete statistics',
    'for every seed.', '',
    '## Intervention', '',
    'Set only the thrift gene of every living Çiy organism to 1.00 at the day-8',
    'checkpoint in the two normalized arms. Preserve other genes, energy, age,',
    'food, positions and RNG state. This consumes no random draw. Mutation amplitude',
    'remains 0.08; descendants are not clamped again. Run all arms to day 16.', '',
    'Thrift controls energy consumption, movement, reproduction threshold and',
    'lifespan. The intervention changes all of these and removes checkpoint thrift',
    'variation within the treated cohort; it is not an energy-only mechanism test.', '',
    '## Arm means', '',
    'Every seed has equal weight. Shares are per-seed fractions, not pooled counts.', '',
    '| Arm | Total population | Çiy count | Çiy share (%) | Defined shares | Çiy extinct | Whole world extinct |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...ARMS.map((arm) => { const row = report.arms[arm];
      return `| ${names[arm]} | ${f(row.meanPopulation)} | ${f(row.meanCount)} | ${f(row.meanSharePercent)} | ${row.comparableShares}/12 | ${row.targetExtinctions}/12 | ${row.wholeWorldExtinctions}/12 |`; }), '',
    '## Prespecified contrasts', '',
    '```text', 'effect_abundance = normalizedAbundance - naturalAbundance',
    'effect_drought   = normalizedDrought - naturalDrought',
    'interaction      = effect_drought - effect_abundance', '```', '',
    'Primary outcome is Çiy population share, in percentage points (pp). Negative',
    'interaction is the predicted direction: normalization reduces the relative',
    'outcome more under drought. Absolute count is secondary and has its own scale.', '',
    '| Metric / contrast | Mean | Median | Observed range | Negative / zero / positive | Defined pairs |',
    '| --- | ---: | ---: | --- | --- | ---: |',
    ...['share', 'count'].flatMap((metric) => ['abundance', 'drought', 'interaction'].map((effect) => {
      const row = effects[metric][effect];
      return `| ${metric === 'share' ? 'Share (pp)' : 'Count'} / ${effect} | ${sign(row.mean)} | ${sign(row.median)} | ${range(row.range)} | ${row.negative} / ${row.zero} / ${row.positive} | ${row.n}/12 |`;
    })), '',
    `The primary share interaction averages **${sign(effects.share.interaction.mean)} pp**,`,
    `with median **${sign(effects.share.interaction.median)} pp**. It is negative in`,
    `**${effects.share.interaction.negative}/12** seeds, positive in **${effects.share.interaction.positive}/12**.`,
    'The sign is not consistent across all seeds; the full range and median matter.', '',
    `The mean drought-minus-abundance share contrast is ${sign(gapNatural)} pp with`,
    `natural thrift and ${sign(gapNormalized)} pp after normalization. This comparison`,
    'does not identify a percentage of the advantage "explained" by thrift.', '',
    `The mean absolute-count interaction is **${sign(effects.count.interaction.mean)} organisms**:`,
    'normalization loses more organisms in abundance on this absolute scale.',
    'There are far fewer organisms in drought. The count and share contrasts answer',
    'different questions; a relative-share result does not establish a larger',
    'absolute loss or universal drought-specific necessity.', '',
    '## Per-seed primary outcome', '',
    'All four shares are percentages; the last three columns are percentage points.', '',
    '| Seed | Natural abundance | Natural drought | Normalized abundance | Normalized drought | Effect abundance | Effect drought | Interaction |',
    '| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...report.runs.map((run) => `| ${run.seed} | ${ARMS.map((arm) => f(run.arms[arm].sharePercent)).join(' | ')} | ${sign(run.share.abundance)} | ${sign(run.share.drought)} | ${sign(run.share.interaction)} |`), '',
    '## Per-seed absolute counts', '',
    '| Seed | Natural abundance | Natural drought | Normalized abundance | Normalized drought | Count interaction |',
    '| ---: | ---: | ---: | ---: | ---: | ---: |',
    ...report.runs.map((run) => `| ${run.seed} | ${ARMS.map((arm) => run.arms[arm].count).join(' | ')} | ${sign(run.count.interaction)} |`), '',
    '## Limits and interpretation', '',
    'The observed primary contrast is in the predicted direction on average for',
    'these fixed checkpoints and horizon. It supports a contribution of the coupled',
    'thrift parameter to the relative-share pattern in this model. It does not show',
    'that thrift alone explains the pattern, or that the result holds for every seed.', '',
    ...report.limitations.map((limitation) => `- ${limitation}`), '',
    'Undefined whole-world shares are excluded with explicit denominators. A zero',
    'Çiy count in a living world remains a valid zero share. No p-values, confidence',
    'intervals or threshold-based significance claims are used.', '',
    '## Reproduce and verify', '',
    '```powershell', 'npm run analyze:thrift', 'npm run analyze:thrift -- --check',
    'npm run experiment:thrift -- --replay', '```', '',
    'Analysis reads saved evidence without running new worlds. Replay reruns all',
    'four arms and checks full checkpoints, edits, start hashes, final stats and',
    'final state hashes. Recorded execution revision is retained as provenance.',
    'Raw batch writing refuses to overwrite an existing batch.', '',
    'Unrounded values and individual endpoint mean thrift are in',
    '[thrift-analysis.json](thrift-analysis.json).', '',
  ];
  return lines.join('\n');
}

export async function checkThriftArtifacts() {
  const report = await readThriftReport();
  for (const [filename, expected] of [['thrift-analysis.json', JSON.stringify(report, null, 2) + '\n'],
    ['thrift-results.md', renderThriftMarkdown(report)]]) {
    assert.equal(await readFile(path.join(root, 'docs', filename), 'utf8'), expected,
      `Stale ${filename}; regenerate with npm run analyze:thrift -- --write`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || args.some((arg) => !['--write', '--check'].includes(arg))) {
      throw new Error('Usage: npm run analyze:thrift [-- --write|--check]');
    }
    if (args.includes('--check')) {
      await checkThriftArtifacts(); console.log('Thrift artifacts match the saved raw evidence and fixed inputs.');
    } else {
      const report = await readThriftReport();
      if (args.includes('--write')) {
        await writeFile(path.join(root, 'docs/thrift-analysis.json'), JSON.stringify(report, null, 2) + '\n');
        await writeFile(path.join(root, 'docs/thrift-results.md'), renderThriftMarkdown(report));
        console.log('Saved four-arm analysis and report; no simulation rerun.');
      } else process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
