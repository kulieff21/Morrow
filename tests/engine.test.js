import test from 'node:test';
import assert from 'node:assert/strict';
import { World, STEP, DAY, WIDTH, HEIGHT, MAX_POPULATION, LINEAGES,
  startExperiment, advanceExperiment, experimentReport } from '../src/engine.js';

test('same seed and interventions reproduce the complete state', () => {
  const first = new World(4217);
  const second = new World(4217);
  for (const world of [first, second]) {
    world.step(100); world.addFood(250, 320); world.addObstacle(400, 290);
    world.setEnvironment({ resources: 0.15, mutation: 0.2, seasons: true }); world.step(220);
  }
  assert.deepEqual(first.snapshot(), second.snapshot());
  assert.notDeepEqual(new World(4218).snapshot(), new World(4217).snapshot());
});

test('seed zero is reproducible and not replaced by a default', () => {
  const first = new World(0).step(30), second = new World(0).step(30);
  assert.deepEqual(first.snapshot(), second.snapshot());
  assert.notDeepEqual(first.agents, new World(4217).step(30).agents);
});

test('batching fixed steps does not change ecological outcomes', () => {
  const first = new World(92), second = new World(92);
  first.step(300);
  for (let i = 0; i < 30; i++) second.step(10);
  assert.deepEqual(first.snapshot(), second.snapshot());
});

test('snapshot resumes bit for bit, without sharing state', () => {
  const original = new World(82).step(120);
  const copy = World.fromSnapshot(original.snapshot());
  original.step(200); copy.step(200);
  assert.deepEqual(original.snapshot(), copy.snapshot());
  copy.agents[0].genes.speed = 0.45;
  assert.notEqual(copy.agents[0].genes.speed, original.agents[0].genes.speed);
});

test('births inherit lineage, parent and bounded, mutated genes', () => {
  const world = new World(4217).step(350);
  const children = world.agents.filter((agent) => agent.parentId !== null);
  assert.ok(children.length > 0);
  for (const child of children) {
    assert.ok(child.generation > 0);
    assert.ok(child.parentId < child.id);
    assert.ok(child.lineage >= 0 && child.lineage < LINEAGES.length);
    for (const value of Object.values(child.genes)) assert.ok(value >= 0.45 && value <= 1.75);
  }
  assert.equal(world.agents.length, 30 + world.births - world.deaths);
});

test('zero mutation copies the parental genes exactly', () => {
  const world = new World(4, { mutation: 0 });
  const parent = world.agents[0];
  const child = world.createAgent(parent.lineage, parent);
  assert.deepEqual(child.genes, parent.genes);
  assert.equal(child.lineage, parent.lineage);
  assert.equal(child.generation, parent.generation + 1);
});

test('long runs keep finite state, population cap, counts and bounded history', () => {
  const world = new World(4217, { resources: 2, seasons: true }).step(6500);
  assert.ok(world.agents.length <= MAX_POPULATION);
  assert.ok(world.food.length <= 420);
  assert.ok(world.history.length <= 600);
  assert.equal(world.stats().lineages.reduce((sum, row) => sum + row.count, 0), world.agents.length);
  assert.equal(world.agents.length, 30 + world.births - world.deaths);
  assert.equal(new Set(world.agents.map((agent) => agent.id)).size, world.agents.length);
  for (const agent of world.agents) {
    for (const key of ['x', 'y', 'energy', 'age', 'angle']) assert.ok(Number.isFinite(agent[key]), key);
    assert.ok(agent.x >= 7 && agent.x <= WIDTH - 7);
    assert.ok(agent.y >= 7 && agent.y <= HEIGHT - 7);
    assert.ok(agent.energy > 0 && agent.energy <= 150);
  }
});

test('zero resources eventually permits complete extinction without spontaneous births', () => {
  const world = new World(13, { resources: 0 });
  world.food = [];
  world.step(2500);
  assert.equal(world.agents.length, 0);
  assert.equal(world.stats().speed, 0);
  assert.equal(world.stats().thrift, 0);
  const births = world.births;
  world.addFood(100, 100); world.step(100);
  assert.equal(world.births, births);
  assert.equal(world.agents.length, 0);
  assert.equal(world.food.length, 22);
});

test('rocks displace organisms, exclude food and have a placement limit', () => {
  const world = new World(5);
  const agent = world.agents[0]; agent.x = 300; agent.y = 300;
  assert.equal(world.addObstacle(300, 300), true);
  assert.ok(Math.hypot(agent.x - 300, agent.y - 300) >= 35 - 1e-9);
  assert.equal(world.addObstacle(310, 310), false);
  assert.equal(world.spawnFood({ x: 300, y: 300 }), false);
  for (let i = 0; i < 11; i++) assert.equal(world.addObstacle(50 + i * 80, 70), true);
  assert.equal(world.addObstacle(900, 550), false);
  assert.equal(world.obstacles.length, 12);
  world.step(60);
  for (const living of world.agents) for (const rock of world.obstacles) {
    assert.ok(Math.hypot(living.x - rock.x, living.y - rock.y) >= rock.radius + 7 - 1e-9);
  }
});

test('seasonal resource cycle stays between 30% and 100% of configured renewal', () => {
  const world = new World(1, { seasons: true, resources: 1 });
  world.time = 0; assert.equal(world.resourceRate(), 15);
  world.time = 4 * DAY; assert.ok(Math.abs(world.resourceRate() - 4.5) < 1e-9);
  world.time = 8 * DAY; assert.equal(world.resourceRate(), 15);
});

test('environment input clamps finite values and rejects non-finite values', () => {
  const world = new World(1);
  world.setEnvironment({ resources: 100, mutation: -1 });
  assert.equal(world.options.resources, 2); assert.equal(world.options.mutation, 0);
  assert.throws(() => world.setEnvironment({ resources: NaN }));
  assert.throws(() => world.setEnvironment({ mutation: Infinity }));
});

test('experiment forks at the exact checkpoint; only food renewal differs', () => {
  const experiment = startExperiment(4217);
  advanceExperiment(experiment, 8 * DAY / STEP);
  assert.equal(experiment.phase, 'branches');
  assert.equal(experiment.elapsedTicks, 0);
  const control = experiment.control.snapshot(), drought = experiment.drought.snapshot();
  assert.equal(control.options.resources, 1); assert.equal(drought.options.resources, 0.15);
  drought.options.resources = 1;
  assert.deepEqual(control, drought);
  assert.notEqual(experiment.control.agents, experiment.drought.agents);
  assert.notEqual(experiment.control.agents[0], experiment.drought.agents[0]);
});

test('experiment completion is exact, repeatable and contains every lineage', () => {
  const first = startExperiment(4217), second = startExperiment(4217);
  advanceExperiment(first, 1920); advanceExperiment(second, 2000);
  assert.equal(first.phase, 'complete');
  assert.equal(first.control.time, 16 * DAY);
  assert.deepEqual(first.result, second.result);
  assert.equal(first.result.complete, true);
  assert.equal(first.result.baseline.lineages.length, 6);
  assert.ok(first.result.drought.population < first.result.control.population);
  const frozen = structuredClone(first.result);
  advanceExperiment(first, 100); assert.deepEqual(first.result, frozen);
});

test('leadership preserves ties and extinction is undefined', () => {
  const experiment = startExperiment(2);
  advanceExperiment(experiment, 960);
  experiment.checkpoint.lineages.forEach((row) => { row.count = 5; });
  experiment.drought.agents = [];
  const extinct = experimentReport(experiment);
  assert.equal(extinct.leaders.length, 6);
  assert.equal(extinct.retainedLead, null);
  assert.deepEqual(extinct.droughtLeaders, []);
});
