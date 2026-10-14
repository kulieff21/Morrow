import { startExperiment, advanceExperiment } from '../src/engine.js';
import { pathToFileURL } from 'node:url';

export function runBatch(seeds) {
  const runs = seeds.map((seed) => {
    const experiment = startExperiment(seed);
    while (experiment.phase !== 'complete') advanceExperiment(experiment, 200);
    return experiment.result;
  });
  const eligible = runs.filter((run) => run.retainedLead !== null);
  return {
    model: 'morrow-0.1', seeds,
    measured: 'At least one checkpoint-leading lineage is also a final drought leader.',
    sampleSize: runs.length, eligible: eligible.length,
    retainedLead: eligible.filter((run) => run.retainedLead).length,
    changedLead: eligible.filter((run) => !run.retainedLead).length,
    undefined: runs.length - eligible.length,
    limitation: 'Descriptive toy-model outcomes for these seeds only, not independent evidence about biology.',
    runs,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const values = process.argv.slice(2);
  const seeds = values.length ? values.map(Number) : Array.from({ length: 12 }, (_, i) => 4217 + i);
  if (seeds.some((seed) => !Number.isInteger(seed) || seed < 0 || seed > 4294967295)) {
    console.error('Seeds must be integers between 0 and 4294967295.'); process.exitCode = 1;
  } else {
    console.log(JSON.stringify(runBatch(seeds), null, 2));
  }
}
