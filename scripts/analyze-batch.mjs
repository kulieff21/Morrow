import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const SOURCE = 'docs/initial-batch.json';
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const intersects = (first, second) => first.some((id) => second.includes(id));
const sameSet = (first, second) => first.length === second.length && first.every((id) => second.includes(id));
const validCount = (value) => Number.isSafeInteger(value) && value >= 0;

function requireCondition(condition, message) {
  if (!condition) throw new Error(`Invalid batch: ${message}`);
}

function validateStats(stats, seed, stage, expectedNames) {
  const context = `seed ${seed}, ${stage}`;
  requireCondition(stats && validCount(stats.population), `${context}: invalid population`);
  requireCondition(Array.isArray(stats.lineages) && stats.lineages.length === 6,
    `${context}: expected six lineage rows`);
  const rows = [...stats.lineages].sort((a, b) => a.lineage - b.lineage);
  for (let id = 0; id < 6; id++) {
    const row = rows[id];
    requireCondition(row.lineage === id && validCount(row.count), `${context}: invalid lineage ID/count`);
    requireCondition(typeof row.name === 'string' && row.name.length > 0, `${context}: invalid lineage name`);
    if (expectedNames) requireCondition(row.name === expectedNames[id], `${context}: lineage names differ`);
  }
  requireCondition(rows.reduce((sum, row) => sum + row.count, 0) === stats.population,
    `${context}: lineage counts do not sum to population`);
  const maximum = Math.max(...rows.map((row) => row.count));
  return {
    population: stats.population,
    counts: rows.map((row) => row.count),
    shares: rows.map((row) => stats.population ? row.count / stats.population : null),
    leaders: maximum ? rows.filter((row) => row.count === maximum).map((row) => row.lineage) : [],
    names: rows.map((row) => row.name),
  };
}

export function analyzeBatch(batch) {
  requireCondition(batch?.model === 'morrow-0.1', 'unsupported model');
  requireCondition(Array.isArray(batch.runs) && batch.runs.length > 0, 'no runs');
  requireCondition(batch.sampleSize === batch.runs.length, 'sample size does not match runs');
  requireCondition(Array.isArray(batch.seeds) && batch.seeds.length === batch.runs.length, 'seed list does not match runs');
  const seeds = new Set();
  let names;
  const runs = batch.runs.map((run, index) => {
    requireCondition(Number.isInteger(run.seed) && run.seed >= 0 && run.seed <= 4294967295,
      'invalid seed');
    requireCondition(!seeds.has(run.seed), `duplicate seed ${run.seed}`);
    seeds.add(run.seed);
    requireCondition(batch.seeds[index] === run.seed, 'seed ordering does not match runs');
    requireCondition(run.complete === true && run.version === 1 && run.model === batch.model,
      `seed ${run.seed}: incomplete or incompatible report`);
    requireCondition(run.protocol?.warmupDays === 8 && run.protocol.branchDays === 8 &&
      run.protocol.controlResources === 1 && run.protocol.droughtResources === 0.15 &&
      run.protocol.mutation === 0.08 && run.protocol.seasons === false,
    `seed ${run.seed}: incompatible protocol`);
    const baseline = validateStats(run.baseline, run.seed, 'baseline', names);
    names ??= baseline.names;
    const control = validateStats(run.control, run.seed, 'control', names);
    const drought = validateStats(run.drought, run.seed, 'drought', names);
    const retained = (stage) => baseline.leaders.length && stage.leaders.length
      ? intersects(baseline.leaders, stage.leaders) : null;
    requireCondition(Array.isArray(run.leaders) && new Set(run.leaders).size === run.leaders.length &&
      sameSet(run.leaders, baseline.leaders), `seed ${run.seed}: recorded baseline leaders differ`);
    requireCondition(Array.isArray(run.droughtLeaders) && new Set(run.droughtLeaders).size === run.droughtLeaders.length &&
      sameSet(run.droughtLeaders, drought.leaders), `seed ${run.seed}: recorded drought leaders differ`);
    requireCondition(run.retainedLead === retained(drought), `seed ${run.seed}: recorded retained-lead outcome differs`);
    const comparable = control.leaders.length > 0 && drought.leaders.length > 0;
    return {
      seed: run.seed,
      baseline: { population: baseline.population, leaders: baseline.leaders },
      control: { population: control.population, leaders: control.leaders, retainedBaselineLead: retained(control) },
      drought: { population: drought.population, leaders: drought.leaders, retainedBaselineLead: retained(drought) },
      endpointLeaderComparison: !comparable ? 'undefined' : sameSet(control.leaders, drought.leaders)
        ? 'identical' : intersects(control.leaders, drought.leaders) ? 'partial-overlap' : 'disjoint',
      populationDelta: drought.population - control.population,
      populationReductionPercent: control.population
        ? 100 * (control.population - drought.population) / control.population : null,
      lineages: names.map((name, id) => ({
        lineage: id, name, baselineCount: baseline.counts[id],
        controlCount: control.counts[id], droughtCount: drought.counts[id],
        countDelta: drought.counts[id] - control.counts[id],
        baselineShare: baseline.shares[id], controlShare: control.shares[id], droughtShare: drought.shares[id],
        shareDeltaPercentagePoints: control.population && drought.population
          ? 100 * (drought.shares[id] - control.shares[id]) : null,
      })),
    };
  });
  const leaderPersistence = (stage) => ({
    retained: runs.filter((run) => run[stage].retainedBaselineLead === true).length,
    changed: runs.filter((run) => run[stage].retainedBaselineLead === false).length,
    undefined: runs.filter((run) => run[stage].retainedBaselineLead === null).length,
  });
  const countTransitions = (control, drought) => runs.filter((run) =>
    run.control.retainedBaselineLead === control && run.drought.retainedBaselineLead === drought).length;
  const jointlyComparable = runs.filter((run) => run.control.retainedBaselineLead !== null &&
    run.drought.retainedBaselineLead !== null).length;
  return {
    analysisVersion: 1, model: batch.model, protocol: { ...batch.runs[0].protocol },
    sampleSize: runs.length, seeds: [...seeds],
    definitions: {
      leadership: 'All lineages tied for the largest living descendant count. No leader at extinction.',
      retainedBaselineLead: 'At least one checkpoint leader is an endpoint leader; ties are preserved.',
      shareDeltaPercentagePoints: '100 * (drought lineage count / drought population - control lineage count / control population).',
      means: 'Each seed has equal weight. Share means exclude pairs with an extinct branch; denominators are reported.',
      populationDelta: 'Drought minus control at the same day-16 endpoint.',
    },
    leadership: {
      control: leaderPersistence('control'), drought: leaderPersistence('drought'),
      endpointSets: Object.fromEntries(['identical', 'partial-overlap', 'disjoint', 'undefined']
        .map((key) => [key, runs.filter((run) => run.endpointLeaderComparison === key).length])),
      transitions: {
        bothRetained: countTransitions(true, true), controlOnlyRetained: countTransitions(true, false),
        droughtOnlyRetained: countTransitions(false, true), neitherRetained: countTransitions(false, false),
        undefined: runs.length - jointlyComparable,
      },
    },
    population: {
      meanControl: mean(runs.map((run) => run.control.population)),
      meanDrought: mean(runs.map((run) => run.drought.population)),
      meanDelta: mean(runs.map((run) => run.populationDelta)),
      meanReductionPercent: mean(runs.map((run) => run.populationReductionPercent).filter((value) => value !== null)),
      comparableReductionPairs: runs.filter((run) => run.populationReductionPercent !== null).length,
      lowerInDrought: runs.filter((run) => run.populationDelta < 0).length,
    },
    lineages: names.map((name, id) => {
      const rows = runs.map((run) => run.lineages[id]);
      const paired = rows.filter((row) => row.shareDeltaPercentagePoints !== null);
      return {
        lineage: id, name, meanControlCount: mean(rows.map((row) => row.controlCount)),
        meanDroughtCount: mean(rows.map((row) => row.droughtCount)),
        meanCountDelta: mean(rows.map((row) => row.countDelta)),
        comparableSharePairs: paired.length,
        meanControlShare: mean(paired.map((row) => row.controlShare)),
        meanDroughtShare: mean(paired.map((row) => row.droughtShare)),
        meanShareDeltaPercentagePoints: mean(paired.map((row) => row.shareDeltaPercentagePoints)),
        shareDeltaRange: paired.length ? [Math.min(...paired.map((row) => row.shareDeltaPercentagePoints)),
          Math.max(...paired.map((row) => row.shareDeltaPercentagePoints))] : null,
        higherShareInDrought: paired.filter((row) => row.shareDeltaPercentagePoints > 0).length,
        equalShareInDrought: paired.filter((row) => row.shareDeltaPercentagePoints === 0).length,
        lowerShareInDrought: paired.filter((row) => row.shareDeltaPercentagePoints < 0).length,
        higherCountInDrought: rows.filter((row) => row.countDelta > 0).length,
        extinctControl: rows.filter((row) => row.controlCount === 0).length,
        extinctDrought: rows.filter((row) => row.droughtCount === 0).length,
      };
    }),
    limitations: [
      'Post hoc descriptive analysis of the existing twelve seed reports; no new simulation runs.',
      'No significance tests, confidence intervals, or claim about a general seed distribution.',
      'Branch differences include the full modeled intervention path and diverging random draws.',
      'A higher population share can coexist with fewer living descendants.',
      'The data do not isolate a causal effect of speed, sense, or thrift.',
      'Lineage endpoints do not separate birth rates, death rates, or within-lineage trait evolution.',
    ],
    runs,
  };
}

export async function readAnalysis() {
  const bytes = await readFile(path.join(root, SOURCE));
  const analysis = analyzeBatch(JSON.parse(bytes.toString('utf8')));
  return { source: { path: SOURCE, sha256: createHash('sha256').update(bytes).digest('hex') }, ...analysis };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    if (args.some((arg) => arg !== '--write') || args.length > 1) throw new Error('Usage: npm run analyze [-- --write]');
    const report = await readAnalysis();
    const json = JSON.stringify(report, null, 2) + '\n';
    if (args.includes('--write')) {
      await writeFile(path.join(root, 'docs/paired-analysis.json'), json);
      console.log(`Saved paired analysis of ${report.sampleSize} existing runs; source SHA-256 ${report.source.sha256}`);
    } else process.stdout.write(json);
  } catch (error) {
    console.error(error.message); process.exitCode = 1;
  }
}
