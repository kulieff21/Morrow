import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { analyzeBatch, readAnalysis, renderMarkdown } from '../scripts/analyze-batch.mjs';

const original = JSON.parse(await readFile(new URL('../docs/initial-batch.json', import.meta.url), 'utf8'));
const clone = () => structuredClone(original);

test('frozen batch yields paired leadership outcomes, preserving endpoint ties', () => {
  const analysis = analyzeBatch(original);
  assert.deepEqual(analysis.leadership.control, { retained: 9, changed: 3, undefined: 0 });
  assert.deepEqual(analysis.leadership.drought, { retained: 5, changed: 7, undefined: 0 });
  assert.deepEqual(analysis.leadership.endpointSets,
    { identical: 2, 'partial-overlap': 1, disjoint: 9, undefined: 0 });
  assert.deepEqual(analysis.leadership.transitions,
    { bothRetained: 2, controlOnlyRetained: 7, droughtOnlyRetained: 3, neitherRetained: 0, undefined: 0 });
  const tie = analysis.runs.find((run) => run.seed === 4228);
  assert.deepEqual(tie.control.leaders, [4, 5]);
  assert.deepEqual(tie.drought.leaders, [5]);
  assert.equal(tie.endpointLeaderComparison, 'partial-overlap');
});

test('share changes use equal seed weighting and cannot be mistaken for count growth', () => {
  const analysis = analyzeBatch(original);
  const dew = analysis.lineages[1];
  assert.ok(Math.abs(dew.meanShareDeltaPercentagePoints - 15.5065272925471) < 1e-10);
  assert.equal(dew.higherShareInDrought, 10);
  assert.ok(dew.meanDroughtCount < dew.meanControlCount);
  assert.ok(Math.abs(analysis.lineages.reduce((sum, row) => sum + row.meanShareDeltaPercentagePoints, 0)) < 1e-10);
  for (const run of analysis.runs) {
    assert.ok(Math.abs(run.lineages.reduce((sum, row) => sum + row.shareDeltaPercentagePoints, 0)) < 1e-10);
    assert.equal(run.lineages.reduce((sum, row) => sum + row.countDelta, 0), run.populationDelta);
  }
});

test('extinction produces null shares and reported denominator exclusions, never NaN', () => {
  const batch = clone();
  const run = batch.runs[0];
  run.drought.population = 0;
  run.drought.lineages.forEach((row) => { row.count = 0; });
  run.droughtLeaders = []; run.retainedLead = null;
  const analysis = analyzeBatch(batch);
  assert.equal(analysis.runs[0].endpointLeaderComparison, 'undefined');
  assert.equal(analysis.runs[0].drought.retainedBaselineLead, null);
  assert.equal(analysis.runs[0].lineages[0].droughtShare, null);
  assert.equal(analysis.lineages[0].comparableSharePairs, 11);
  assert.equal(analysis.leadership.drought.undefined, 1);
  assert.equal(analysis.leadership.transitions.undefined, 1);
  assert.equal(analysis.population.lowerInDrought, 12);
  assert.ok(!JSON.stringify(analysis).includes('NaN'));
});

test('invalid, duplicate or incomplete input cannot silently enter a report', () => {
  for (const mutate of [
    (batch) => { batch.runs[0].control.population++; },
    (batch) => { batch.runs[0].control.lineages[1].lineage = 0; },
    (batch) => { batch.runs[0].control.lineages[1].count = -1; },
    (batch) => { batch.runs[0].drought.lineages[1].name = 'Wrong lineage'; },
    (batch) => { batch.runs[0].complete = false; },
    (batch) => { batch.runs[0].protocol.droughtResources = 0.2; },
    (batch) => { batch.runs[1].seed = batch.runs[0].seed; },
    (batch) => { batch.runs[0].leaders = [0]; },
    (batch) => { batch.runs[0].retainedLead = false; },
    (batch) => { batch.sampleSize++; },
  ]) {
    const batch = clone(); mutate(batch);
    assert.throws(() => analyzeBatch(batch), /Invalid batch/);
  }
});

test('analysis leaves the source data intact and records its exact SHA-256', async () => {
  const batch = clone(), before = structuredClone(batch);
  analyzeBatch(batch);
  assert.deepEqual(batch, before);
  const result = await readAnalysis();
  assert.equal(result.source.sha256, '5576ea15805262502465348b160ef4ff4c56e7cdf5de8122bd04f437e284ba18');
  assert.equal(result.sampleSize, 12);
});

test('human report distinguishes percentage points, counts, ties and missing values', async () => {
  const report = await readAnalysis();
  const markdown = renderMarkdown(report);
  assert.match(markdown, /Share difference:.*percentage points/);
  assert.match(markdown, /\| Çiy \| 26\.67 \| 4\.67 \| 17\.91% \| 33\.42% \| \+15\.51 \| 10\/12 \|/);
  assert.match(markdown, /\| 4228 \| Yankı \| Yankı, Filiz \| Filiz \| partial-overlap/);
  report.lineages[0].meanShareDeltaPercentagePoints = null;
  assert.ok(!renderMarkdown(report).includes('NaN'));
  assert.match(renderMarkdown(report), /\| Akım .* \| — \|/);
});
