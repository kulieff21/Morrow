// Pure, fixed-step model. All ecological randomness belongs to World.random().
export const STEP = 0.1;
export const DAY = 12;
export const WIDTH = 1000;
export const HEIGHT = 650;
export const MAX_POPULATION = 240;
export const LINEAGES = [
  { name: 'Akım', color: '#b6a6ec', speed: 1.42, sense: 0.86, thrift: 0.78 },
  { name: 'Çiy', color: '#8ed7c6', speed: 0.78, sense: 1.12, thrift: 1.35 },
  { name: 'Köz', color: '#f4b582', speed: 1.12, sense: 1.25, thrift: 0.92 },
  { name: 'Sis', color: '#a6c9f5', speed: 0.90, sense: 1.45, thrift: 1.08 },
  { name: 'Yankı', color: '#e6a7c6', speed: 1.24, sense: 0.70, thrift: 1.15 },
  { name: 'Filiz', color: '#d4d995', speed: 0.95, sense: 0.92, thrift: 1.20 },
];

export const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const distanceSquared = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const wrapAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

export class World {
  constructor(seed = 4217, options = {}) {
    this.seed = Number(seed) >>> 0;
    this.rng = this.seed;
    this.time = 0;
    this.tick = 0;
    this.nextId = 1;
    this.agents = [];
    this.food = [];
    this.obstacles = [];
    this.history = [];
    this.events = [];
    this.births = 0;
    this.deaths = 0;
    this.spawnCredit = 0;
    this.options = { resources: 1, mutation: 0.08, seasons: false, ...options };
    this.patches = [
      { x: 170, y: 170 }, { x: 740, y: 145 }, { x: 460, y: 355 },
      { x: 210, y: 535 }, { x: 810, y: 490 },
    ];
    for (let lineage = 0; lineage < LINEAGES.length; lineage++) {
      for (let i = 0; i < 5; i++) this.agents.push(this.createAgent(lineage));
    }
    for (let i = 0; i < 210; i++) this.spawnFood();
    this.record();
    this.note('Dünya uyandı. Altı soy, otuz canlı.');
  }

  random() {
    // Mulberry32: zero is a valid seed; arithmetic stays in uint32 space.
    this.rng = (this.rng + 0x6d2b79f5) >>> 0;
    let value = this.rng;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  createAgent(lineage, parent = null) {
    const source = parent?.genes ?? LINEAGES[lineage];
    const genes = {};
    for (const key of ['speed', 'sense', 'thrift']) {
      const variation = parent ? this.options.mutation : 0.06;
      genes[key] = clamp(source[key] + (this.random() - 0.5) * variation * 2, 0.45, 1.75);
    }
    const angle = this.random() * Math.PI * 2;
    const point = parent
      ? { x: parent.x + Math.cos(angle) * 12, y: parent.y + Math.sin(angle) * 12 }
      : { x: 50 + this.random() * (WIDTH - 100), y: 50 + this.random() * (HEIGHT - 100) };
    const agent = {
      id: this.nextId++, lineage, genes,
      generation: parent ? parent.generation + 1 : 0,
      parentId: parent?.id ?? null,
      x: clamp(point.x, 8, WIDTH - 8), y: clamp(point.y, 8, HEIGHT - 8),
      angle, energy: parent ? 40 : 58 + this.random() * 28,
      age: 0, eaten: 0, children: 0, fedAt: -10,
      turnAt: this.time + this.random() * 2,
      wander: angle, bornAt: this.time,
    };
    this.resolveObstacles(agent);
    return agent;
  }

  note(message) {
    this.events.unshift({ time: this.time, message });
    this.events.length = Math.min(this.events.length, 12);
  }

  setEnvironment(changes, message = '') {
    if (changes.resources !== undefined) {
      if (!Number.isFinite(changes.resources)) throw new Error('Invalid resource rate');
      this.options.resources = clamp(changes.resources, 0, 2);
    }
    if (changes.mutation !== undefined) {
      if (!Number.isFinite(changes.mutation)) throw new Error('Invalid mutation rate');
      this.options.mutation = clamp(changes.mutation, 0, 0.25);
    }
    if (changes.seasons !== undefined) this.options.seasons = Boolean(changes.seasons);
    if (message) this.note(message);
  }

  resourceRate() {
    const season = this.options.seasons
      ? 0.65 + 0.35 * Math.cos((this.time / DAY) * Math.PI / 4)
      : 1;
    return 15 * this.options.resources * season;
  }

  spawnFood(point = null) {
    if (this.food.length >= 420) return false;
    const patch = this.patches[Math.floor(this.random() * this.patches.length)];
    const x = point?.x ?? patch.x + (this.random() + this.random() - 1) * 215;
    const y = point?.y ?? patch.y + (this.random() + this.random() - 1) * 180;
    const food = { x: clamp(x, 12, WIDTH - 12), y: clamp(y, 12, HEIGHT - 12), alive: true };
    if (this.obstacles.some((rock) => distanceSquared(rock, food) < (rock.radius + 3) ** 2)) return false;
    this.food.push(food);
    return true;
  }

  addFood(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    for (let i = 0; i < 22; i++) {
      this.spawnFood({ x: x + (this.random() - 0.5) * 90, y: y + (this.random() - 0.5) * 90 });
    }
    this.note('Havuza bir avuç besin bırakıldı.');
  }

  addObstacle(x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || this.obstacles.length >= 12) return false;
    const rock = { x: clamp(x, 40, WIDTH - 40), y: clamp(y, 40, HEIGHT - 40), radius: 28 };
    if (this.obstacles.some((other) => distanceSquared(rock, other) < 70 ** 2)) return false;
    this.obstacles.push(rock);
    this.food = this.food.filter((food) => distanceSquared(food, rock) > (rock.radius + 3) ** 2);
    for (const agent of this.agents) this.resolveObstacles(agent);
    this.note('Akışa bir kaya eklendi.');
    return true;
  }

  resolveObstacles(agent) {
    for (const rock of this.obstacles) {
      const dx = agent.x - rock.x;
      const dy = agent.y - rock.y;
      const distance = Math.hypot(dx, dy);
      const radius = rock.radius + 7;
      if (distance < radius) {
        const nx = distance > 0 ? dx / distance : 1;
        const ny = distance > 0 ? dy / distance : 0;
        agent.x = rock.x + nx * radius;
        agent.y = rock.y + ny * radius;
        agent.angle = Math.atan2(ny, nx);
        agent.wander = agent.angle;
      }
    }
    agent.x = clamp(agent.x, 7, WIDTH - 7);
    agent.y = clamp(agent.y, 7, HEIGHT - 7);
  }

  step(count = 1) {
    for (let i = 0; i < count; i++) this.advance();
    return this;
  }

  advance() {
    this.tick++;
    this.time = this.tick * STEP;
    this.spawnCredit += this.resourceRate() * STEP;
    while (this.spawnCredit >= 1) {
      this.spawnFood();
      this.spawnCredit--;
    }
    const cellSize = 100;
    const grid = new Map();
    for (const food of this.food) {
      const key = `${Math.floor(food.x / cellSize)},${Math.floor(food.y / cellSize)}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(food);
    }
    const survivors = [];
    const newborns = [];
    // Rotate food priority every step without depending on frame rate.
    const offset = this.agents.length ? this.tick % this.agents.length : 0;
    for (let n = 0; n < this.agents.length; n++) {
      const agent = this.agents[(n + offset) % this.agents.length];
      agent.age += STEP;
      const { speed, sense, thrift } = agent.genes;
      agent.energy -= ((0.55 + 1.2 * speed ** 2 + 0.30 * sense ** 2) / thrift) * STEP;
      if (agent.energy <= 0 || agent.age >= 130 + 30 * thrift) {
        this.deaths++;
        continue;
      }
      const sight = 70 * sense;
      let nearest = null;
      let nearestSquared = sight ** 2;
      for (let gx = Math.floor((agent.x - sight) / cellSize); gx <= Math.floor((agent.x + sight) / cellSize); gx++) {
        for (let gy = Math.floor((agent.y - sight) / cellSize); gy <= Math.floor((agent.y + sight) / cellSize); gy++) {
          for (const food of grid.get(`${gx},${gy}`) ?? []) {
            const distance = distanceSquared(agent, food);
            if (food.alive && distance < nearestSquared) {
              nearest = food;
              nearestSquared = distance;
            }
          }
        }
      }
      let targetAngle;
      if (nearest) targetAngle = Math.atan2(nearest.y - agent.y, nearest.x - agent.x);
      else {
        if (this.time >= agent.turnAt) {
          agent.wander = agent.angle + (this.random() - 0.5) * 2.6;
          agent.turnAt = this.time + 0.8 + this.random() * 1.8;
        }
        targetAngle = agent.wander;
      }
      agent.angle += clamp(wrapAngle(targetAngle - agent.angle), -0.42, 0.42);
      const movement = 24 * speed / (0.75 + 0.25 * thrift) * STEP;
      agent.x += Math.cos(agent.angle) * movement;
      agent.y += Math.sin(agent.angle) * movement;
      if (agent.x < 7 || agent.x > WIDTH - 7) {
        agent.angle = Math.PI - agent.angle;
        agent.wander = agent.angle;
      }
      if (agent.y < 7 || agent.y > HEIGHT - 7) {
        agent.angle = -agent.angle;
        agent.wander = agent.angle;
      }
      this.resolveObstacles(agent);
      if (nearest?.alive && distanceSquared(agent, nearest) < 12 ** 2) {
        nearest.alive = false;
        agent.energy = Math.min(agent.energy + 25, 150);
        agent.eaten++;
        agent.fedAt = this.time;
      }
      if (agent.energy > 92 + 26 * thrift && agent.age > 5 &&
          this.agents.length + newborns.length < MAX_POPULATION) {
        agent.energy -= 48;
        agent.children++;
        newborns.push(this.createAgent(agent.lineage, agent));
        this.births++;
      }
      survivors.push(agent);
    }
    const wasAlive = this.agents.length > 0;
    this.agents = survivors.concat(newborns);
    this.food = this.food.filter((food) => food.alive);
    if (wasAlive && !this.agents.length) this.note('Son canlı da kayboldu. Yeni bir dünya başlatabilirsin.');
    if (this.tick % 10 === 0) this.record();
  }

  stats() {
    const lineages = LINEAGES.map((definition, lineage) => ({
      ...definition, lineage, count: 0, speedSum: 0, thriftSum: 0, generation: 0,
    }));
    let speed = 0;
    let thrift = 0;
    let generation = 0;
    for (const agent of this.agents) {
      const row = lineages[agent.lineage];
      row.count++;
      row.speedSum += agent.genes.speed;
      row.thriftSum += agent.genes.thrift;
      row.generation = Math.max(row.generation, agent.generation);
      speed += agent.genes.speed;
      thrift += agent.genes.thrift;
      generation = Math.max(generation, agent.generation);
    }
    return {
      population: this.agents.length, food: this.food.length, births: this.births,
      deaths: this.deaths, generation, day: this.time / DAY,
      speed: this.agents.length ? speed / this.agents.length : 0,
      thrift: this.agents.length ? thrift / this.agents.length : 0, lineages,
    };
  }

  record() {
    const stats = this.stats();
    this.history.push({ time: this.time, population: stats.population,
      counts: stats.lineages.map((row) => row.count) });
    if (this.history.length > 600) this.history.shift();
  }

  snapshot() {
    return structuredClone({
      seed: this.seed, rng: this.rng, time: this.time, tick: this.tick,
      nextId: this.nextId, agents: this.agents, food: this.food,
      obstacles: this.obstacles, history: this.history, events: this.events,
      births: this.births, deaths: this.deaths, spawnCredit: this.spawnCredit,
      options: this.options, patches: this.patches,
    });
  }

  static fromSnapshot(snapshot) {
    return Object.assign(Object.create(World.prototype), structuredClone(snapshot));
  }
}

export const EXPERIMENT = Object.freeze({
  warmupDays: 8, branchDays: 8, controlResources: 1, droughtResources: 0.15,
  mutation: 0.08, seasons: false,
});

export function startExperiment(seed = 4217) {
  return { seed: Number(seed) >>> 0, phase: 'warmup', elapsedTicks: 0,
    warmup: new World(seed, { resources: 1, mutation: EXPERIMENT.mutation, seasons: false }),
    control: null, drought: null, checkpoint: null, result: null };
}

export function advanceExperiment(experiment, count = 1) {
  const warmupTicks = Math.round(EXPERIMENT.warmupDays * DAY / STEP);
  const branchTicks = Math.round(EXPERIMENT.branchDays * DAY / STEP);
  for (let i = 0; i < count && experiment.phase !== 'complete'; i++) {
    if (experiment.phase === 'warmup') {
      experiment.warmup.step();
      experiment.elapsedTicks++;
      if (experiment.elapsedTicks >= warmupTicks) {
        experiment.checkpoint = experiment.warmup.stats();
        const snapshot = experiment.warmup.snapshot();
        experiment.control = World.fromSnapshot(snapshot);
        experiment.drought = World.fromSnapshot(snapshot);
        experiment.control.setEnvironment({ resources: EXPERIMENT.controlResources });
        experiment.drought.setEnvironment({ resources: EXPERIMENT.droughtResources });
        experiment.phase = 'branches';
        experiment.elapsedTicks = 0;
      }
    } else {
      experiment.control.step();
      experiment.drought.step();
      experiment.elapsedTicks++;
      if (experiment.elapsedTicks >= branchTicks) {
        experiment.phase = 'complete';
        experiment.result = experimentReport(experiment);
      }
    }
  }
  return experiment;
}

export function experimentReport(experiment) {
  if (!experiment.checkpoint) return null;
  const baseline = experiment.checkpoint;
  const control = experiment.control.stats();
  const drought = experiment.drought.stats();
  const maximum = Math.max(...baseline.lineages.map((row) => row.count));
  const leaders = baseline.lineages.filter((row) => row.count === maximum && maximum > 0).map((row) => row.lineage);
  const droughtMaximum = Math.max(...drought.lineages.map((row) => row.count));
  const droughtLeaders = drought.lineages.filter((row) => row.count === droughtMaximum && droughtMaximum > 0).map((row) => row.lineage);
  return {
    version: 1, model: 'morrow-0.1', seed: experiment.seed,
    protocol: { ...EXPERIMENT }, complete: experiment.phase === 'complete',
    baseline, control, drought, leaders, droughtLeaders,
    retainedLead: leaders.length > 0 && droughtLeaders.length > 0
      ? leaders.some((lineage) => droughtLeaders.includes(lineage)) : null,
    limitations: [
      'A rule-based toy model, not a biological prediction.',
      'Lineage success is measured by living descendants, not individuals or universal fitness.',
      'Population ties are retained; extinction makes leadership undefined.',
      'The branches start identically but their random draws diverge as behavior diverges.',
      'One seed is one run; it does not establish a general result.',
      'Food already present at the checkpoint remains in both branches.',
    ],
  };
}
