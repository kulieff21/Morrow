import { World, STEP, DAY, LINEAGES, clamp, startExperiment, advanceExperiment } from './engine.js';
import { drawWorld, drawHistory, pointInWorld, formatDay } from './render.js';
import { tr, eventText, initLanguage } from './i18n.js';

const $ = (id) => document.getElementById(id);
const worldCanvas = $('world');
let world = new World(4217);
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let speed = 1;
let tool = 'select';
let selectedId = null;
let lastSelected = null;
let mode = 'observe';
let experiment = null;
let experimentPaused = false;
let prediction = 'yes';
let previousTime = performance.now();
let accumulator = 0;
let experimentAccumulator = 0;
let lastUi = 0;
let redraw = true;

function announce(message) { $('announcement').textContent = message; }

function validatedSeed(input) {
  if (input.value.trim() === '' || !input.checkValidity() || !Number.isInteger(Number(input.value))) {
    input.setCustomValidity(tr('Enter an integer between 0 and 4294967295.', '0 ile 4294967295 arasında bir tam sayı gir.'));
    input.reportValidity();
    return null;
  }
  input.setCustomValidity('');
  return Number(input.value) >>> 0;
}
for (const id of ['seed', 'experiment-seed']) $(id).addEventListener('input', () => $(id).setCustomValidity(''));

function setPause(value) {
  paused = value;
  accumulator = 0;
  redraw = true;
  $('play').textContent = paused ? '▶' : 'Ⅱ';
  $('play').setAttribute('aria-label', paused ? tr('Play simulation', 'Simülasyonu oynat') : tr('Pause simulation', 'Simülasyonu duraklat'));
  $('play').setAttribute('aria-pressed', String(paused));
}
setPause(paused);
$('play').addEventListener('click', () => setPause(!paused));
$('step').addEventListener('click', () => { setPause(true); world.step(10); redraw = true; refreshWorld(); });
document.querySelectorAll('[data-speed]').forEach((button) => button.addEventListener('click', () => {
  speed = Number(button.dataset.speed);
  document.querySelectorAll('[data-speed]').forEach((item) => {
    const active = Number(item.dataset.speed) === speed;
    item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
  });
}));
document.querySelectorAll('[data-tool]').forEach((button) => button.addEventListener('click', () => {
  tool = button.dataset.tool;
  document.querySelectorAll('[data-tool]').forEach((item) => {
    const active = item.dataset.tool === tool;
    item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
  });
  refreshTool();
  announce(tool === 'select' ? tr('Selection tool chosen.', 'Gözlem aracı seçildi.') : tool === 'feed' ? tr('Food tool chosen. Click the pond.', 'Besin aracı seçildi. Havuza dokun.') : tr('Rock tool chosen. Click the pond.', 'Kaya aracı seçildi. Havuza dokun.'));
}));

function refreshTool() {
  $('pool-hint').textContent = tool === 'feed' ? tr('Click the pond to add food', 'Besin bırakmak için havuza dokun')
    : tool === 'rock' ? tr('Click the pond to add a rock', 'Kaya yerleştirmek için havuza dokun') : tr('Select an organism to look closer', 'Yakından bakmak için bir canlı seç');
}

function selectAgent(agent) {
  selectedId = agent?.id ?? null;
  lastSelected = agent ? structuredClone(agent) : null;
  redraw = true;
  refreshWorld();
  if (agent) announce(tr(`${LINEAGES[agent.lineage].name} #${agent.id} selected. Generation ${agent.generation}.`, `${LINEAGES[agent.lineage].name} #${agent.id} seçildi. Kuşak ${agent.generation}.`));
}
worldCanvas.addEventListener('click', (event) => {
  const point = pointInWorld(worldCanvas, event);
  if (tool === 'feed') world.addFood(point.x, point.y);
  else if (tool === 'rock') {
    const added = world.addObstacle(point.x, point.y);
    if (!added) announce(tr('Rock could not be placed. Try another point; the limit is 12 rocks.', 'Kaya yerleştirilemedi. Başka bir nokta dene; en fazla 12 kaya ekleyebilirsin.'));
  } else {
    const radius = Math.max(24, 1000 / worldCanvas.getBoundingClientRect().width * 14);
    let nearest = null;
    let minimum = radius;
    for (const agent of world.agents) {
      const distance = Math.hypot(agent.x - point.x, agent.y - point.y);
      if (distance < minimum) { nearest = agent; minimum = distance; }
    }
    selectAgent(nearest);
  }
  refreshWorld(); redraw = true;
});
$('unselect').addEventListener('click', () => selectAgent(null));

function resetWorld() {
  const seed = validatedSeed($('seed'));
  if (seed === null) return;
  world = new World(seed, { resources: Number($('resources').value) / 100,
    mutation: Number($('mutation').value) / 100, seasons: $('seasons').checked });
  selectedId = null; lastSelected = null; accumulator = 0;
  setPause(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  redraw = true; refreshWorld();
  announce(tr(`New world started with seed ${seed}.`, `Seed ${seed} ile yeni dünya başladı.`));
}
$('reset').addEventListener('click', resetWorld);
$('revive').addEventListener('click', resetWorld);
$('seed').addEventListener('keydown', (event) => { if (event.key === 'Enter') resetWorld(); });
$('resources').addEventListener('input', () => {
  world.setEnvironment({ resources: Number($('resources').value) / 100 });
  refreshWorld(); redraw = true;
});
$('resources').addEventListener('change', () => {
  world.note(`Besin yenilenmesi %${$('resources').value} oldu.`); refreshWorld();
});
$('mutation').addEventListener('input', () => {
  world.setEnvironment({ mutation: Number($('mutation').value) / 100 }); refreshWorld();
});
$('seasons').addEventListener('change', () => {
  world.setEnvironment({ seasons: $('seasons').checked }, $('seasons').checked
    ? 'Mevsimler dönmeye başladı.' : 'Mevsim döngüsü durdu.'); refreshWorld();
});
function setResources(value, message) {
  $('resources').value = value;
  world.setEnvironment({ resources: value / 100 }, message);
  refreshWorld(); redraw = true; announce(eventText(message));
}
$('drought').addEventListener('click', () => setResources(15, 'Kıtlık başladı. Besin yenilenmesi %15.'));
$('abundance').addEventListener('click', () => setResources(100, 'Bolluk geri geldi. Besin yenilenmesi %100.'));

const lineageElements = LINEAGES.map((definition, lineage) => {
  const button = document.createElement('button');
  button.className = 'lineage-row';
  const dot = document.createElement('span'); dot.className = 'lineage-dot'; dot.style.background = definition.color;
  const name = document.createElement('span'); name.className = 'lineage-name'; name.textContent = definition.name;
  const track = document.createElement('span'); track.className = 'lineage-bar';
  const fill = document.createElement('i'); fill.style.background = definition.color; track.append(fill);
  const count = document.createElement('b');
  button.append(dot, name, track, count); $('lineages').append(button);
  button.addEventListener('click', () => {
    const candidates = world.agents.filter((agent) => agent.lineage === lineage);
    const current = candidates.findIndex((agent) => agent.id === selectedId);
    selectAgent(candidates[(current + 1) % candidates.length]);
  });
  return { button, fill, count };
});

function refreshWorld() {
  const stats = world.stats();
  $('day').textContent = stats.day.toFixed(1);
  $('population').textContent = stats.population;
  $('generation').textContent = stats.generation;
  $('food-count').textContent = stats.food;
  $('life-totals').textContent = tr(`${stats.births} births · ${stats.deaths} deaths`, `${stats.births} doğum · ${stats.deaths} kayıp`);
  $('resource-value').textContent = `${Math.round(world.options.resources * 100)}%`;
  $('mutation-value').textContent = `±${world.options.mutation.toFixed(2)}`;
  $('weather').textContent = world.options.seasons ? tr('Seasons', 'Mevsimler') : world.options.resources < 0.4 ? tr('Drought', 'Kıtlık')
    : world.options.resources < 0.85 ? tr('Sparse food', 'Seyrek besin') : tr('Abundance', 'Bolluk');
  $('extinction').hidden = stats.population > 0;
  $('event-note').textContent = eventText(world.events[0]?.message);
  $('history-start').textContent = `${formatDay(world.history[0]?.time ?? 0)} ${tr('days', 'gün')}`;
  $('history-end').textContent = `${stats.day.toFixed(1)} ${tr('days', 'gün')}`;
  $('history').setAttribute('aria-label', tr(`Population by lineage. Now ${stats.population} organisms, ${stats.births} births, ${stats.deaths} deaths.`, `Soylara göre canlı sayısı grafiği. Şu an ${stats.population} canlı, ${stats.births} doğum, ${stats.deaths} kayıp.`));
  const maximum = Math.max(1, ...stats.lineages.map((row) => row.count));
  for (const row of stats.lineages) {
    const elements = lineageElements[row.lineage];
    elements.count.textContent = row.count;
    elements.fill.style.width = `${row.count / maximum * 100}%`;
    elements.button.disabled = row.count === 0;
    elements.button.setAttribute('aria-label', tr(`${row.name}: ${row.count} organisms. Select a member of this lineage.`, `${row.name}: ${row.count} canlı. Bu soydan bir canlı seç.`));
  }
  const specimen = world.agents.find((agent) => agent.id === selectedId);
  if (specimen) lastSelected = structuredClone(specimen);
  const display = specimen ?? lastSelected;
  $('specimen-empty').hidden = Boolean(display);
  $('specimen-detail').hidden = !display;
  $('specimen-state').textContent = !display ? tr('Select an organism', 'Bir canlı seç') : specimen ? tr('Following', 'Takip ediliyor') : tr('Life ended', 'Yaşamı sona erdi');
  if (display) {
    $('specimen-mark').style.background = LINEAGES[display.lineage].color;
    $('specimen-name').textContent = `${LINEAGES[display.lineage].name} #${display.id}`;
    $('specimen-family').textContent = tr(`Generation ${display.generation} · ${formatDay(display.age)} days old${display.parentId ? ` · Parent #${display.parentId}` : ' · Founder'}`, `${display.generation}. kuşak · ${formatDay(display.age)} günlük${display.parentId ? ` · Ebeveyn #${display.parentId}` : ' · Kurucu canlı'}`);
    $('energy').value = specimen ? clamp(display.energy, 0, 150) : 0;
    $('energy-value').textContent = specimen ? `${Math.round(display.energy)} / 150` : '—';
    for (const key of ['speed', 'sense', 'thrift']) {
      $(`trait-${key}`).style.width = `${display.genes[key] / 1.75 * 100}%`;
      $(`${key}-value`).textContent = display.genes[key].toFixed(2);
    }
    $('specimen-story').textContent = tr(`${display.eaten} food collected, ${display.children} offspring.${specimen ? '' : ' Showing the last observed traits.'}`, `${display.eaten} besin topladı, ${display.children} yavrusu oldu.${specimen ? '' : ' Son görülen özellikleri gösteriliyor.'}`);
  }
}

function changeMode(value) {
  mode = value;
  $('observation').hidden = mode !== 'observe';
  $('experiment').hidden = mode !== 'experiment';
  for (const [id, active] of [['observe-mode', mode === 'observe'], ['experiment-mode', mode === 'experiment']]) {
    $(id).classList.toggle('active', active); $(id).setAttribute('aria-pressed', String(active));
  }
  accumulator = 0; experimentAccumulator = 0; redraw = true;
  if (mode === 'experiment') refreshExperiment(); else refreshWorld();
}
$('observe-mode').addEventListener('click', () => changeMode('observe'));
$('experiment-mode').addEventListener('click', () => changeMode('experiment'));
$('experiment-invite').addEventListener('click', () => { changeMode('experiment'); window.scrollTo({ top: 0, behavior: 'instant' }); });
$('back-observe').addEventListener('click', () => changeMode('observe'));

function setExperimentInputs(disabled) {
  $('prediction').disabled = disabled;
  $('experiment-seed').disabled = disabled;
  $('run-experiment').disabled = disabled;
}
$('run-experiment').addEventListener('click', () => {
  const seed = validatedSeed($('experiment-seed'));
  if (seed === null) return;
  prediction = document.querySelector('input[name="prediction"]:checked').value;
  experiment = startExperiment(seed);
  experimentPaused = false; experimentAccumulator = 0;
  setExperimentInputs(true);
  $('results').hidden = true;
  $('pause-experiment').hidden = false;
  refreshExperiment(); redraw = true; announce(tr('Experiment started. First, eight days of abundance.', 'Deney başladı. Önce sekiz günlük bolluk dönemi.'));
});
$('pause-experiment').addEventListener('click', () => {
  experimentPaused = !experimentPaused; experimentAccumulator = 0;
  refreshExperiment();
});

function refreshExperiment() {
  $('pause-experiment').textContent = experimentPaused ? tr('Resume experiment', 'Deneye devam et') : tr('Pause experiment', 'Deneyi duraklat');
  if (!experiment) {
    drawWorld($('control-world'), null); drawWorld($('drought-world'), null);
    return;
  }
  const warmup = experiment.phase === 'warmup';
  const complete = experiment.phase === 'complete';
  const ticks = warmup ? experiment.elapsedTicks : 960 + experiment.elapsedTicks;
  $('experiment-progress').value = ticks;
  $('experiment-progress-label').textContent = `${(ticks * STEP / DAY).toFixed(1)} / 16 ${tr('days', 'gün')}`;
  $('experiment-status').textContent = complete ? tr(`Experiment complete · seed ${experiment.seed}`, `Deney tamamlandı · seed ${experiment.seed}`)
    : experimentPaused ? tr('Experiment paused.', 'Deney bekliyor.')
      : warmup ? tr('One world grows. Conditions are still shared.', 'Tek dünya büyüyor. Henüz koşullar aynı.') : tr('One beginning, two different futures.', 'Aynı başlangıçtan iki farklı gelecek.');
  $('experiment-notice').textContent = complete ? tr('The same seed gives the same result. Change it for another run.', 'Aynı seed aynı sonucu verir. Başka bir koşu için seed’i değiştir.') : tr('Runs at 12×. Background tabs wait. Your observation pond is preserved.', 'Deney 12× hızda çalışıyor. Sekme arka plana geçerse bekler. Gözlem havuzun korunuyor.');
  if (complete) $('run-experiment').textContent = tr('Start another run ↗', 'Başka bir koşu başlat ↗');
  const control = warmup ? experiment.warmup : experiment.control;
  const drought = warmup ? experiment.warmup : experiment.drought;
  $('control-count').textContent = `${control.agents.length} ${tr('organisms', 'canlı')}`;
  $('drought-count').textContent = `${drought.agents.length} ${tr('organisms', 'canlı')}`;
  if (complete && $('results').hidden) showResults();
}

function showResults() {
  const report = experiment.result;
  $('results').hidden = false;
  setExperimentInputs(false);
  $('run-experiment').textContent = tr('Start another run ↗', 'Başka bir koşu başlat ↗');
  $('pause-experiment').hidden = true;
  $('experiment-notice').textContent = tr('The same seed gives the same result. Change it for another run.', 'Aynı seed aynı sonucu verir. Başka bir koşu için seed’i değiştir.');
  const names = report.leaders.map((id) => LINEAGES[id].name).join(', ');
  const endNames = report.droughtLeaders.map((id) => LINEAGES[id].name).join(', ');
  if (report.retainedLead === null) $('result-verdict').textContent = report.leaders.length === 0
    ? tr('No lineage survived to the checkpoint. Leadership cannot be compared.', 'Ayrılma anında yaşayan soy kalmadı. Bu koşuda lider karşılaştırılamıyor.')
    : tr('All lineages died out in drought. Leadership is undefined.', 'Kıtlıkta bütün soylar tükendi. Lider karşılaştırması tanımsız.');
  else if (report.retainedLead) $('result-verdict').textContent = tr(`${names} remains among the leaders after drought.`, `${names}, kıtlık sonunda da liderler arasında.`);
  else $('result-verdict').textContent = tr(`${names} led in abundance. ${endNames} leads after drought.`, `Bolluğun lideri ${names} idi. Kıtlık sonunda ${endNames} öne geçti.`);
  const body = $('results-body'); body.replaceChildren();
  for (let lineage = 0; lineage < LINEAGES.length; lineage++) {
    const definition = LINEAGES[lineage];
    const row = document.createElement('tr');
    row.classList.toggle('leader', report.leaders.includes(lineage));
    const name = document.createElement('td');
    const dot = document.createElement('span'); dot.className = 'lineage-dot'; dot.style.background = definition.color;
    name.append(dot, document.createTextNode(definition.name)); row.append(name);
    for (const stats of [report.baseline, report.control, report.drought]) {
      const cell = document.createElement('td'); cell.textContent = stats.lineages[lineage].count; row.append(cell);
    }
    body.append(row);
  }
  $('prediction-result').textContent = report.retainedLead === null ? tr('Your prediction cannot be evaluated for this run.', 'Bu koşuda tahmin değerlendirilemiyor.')
    : (prediction === 'yes') === report.retainedLead ? tr('Your prediction matches this run.', 'Tahminin bu koşunun sonucuyla örtüştü.') : tr('This run differs from your prediction.', 'Bu koşunun sonucu tahmininden farklı çıktı.');
  announce(`${tr('Experiment complete.', 'Deney tamamlandı.')} ${$('result-verdict').textContent}`);
}

function downloadJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('export-world').addEventListener('click', () => {
  downloadJson(`morrow-world-${world.seed}-tick-${world.tick}.json`, {
    version: 1, model: 'morrow-0.1', kind: 'world-snapshot', state: world.snapshot(),
    note: 'Full in-memory state, including recent history. No import UI in version 0.1.',
  }); announce(tr('Observation JSON download started.', 'Gözlem verisinin JSON indirmesi başlatıldı.'));
});
$('export-experiment').addEventListener('click', () => {
  if (!experiment?.result) return;
  downloadJson(`morrow-experiment-${experiment.seed}.json`, { ...experiment.result, prediction });
  announce(tr('Experiment JSON download started.', 'Deney sonucunun JSON indirmesi başlatıldı.'));
});

let helpWasPaused = false;
let helpExperimentWasPaused = false;
$('help-open').addEventListener('click', () => {
  helpWasPaused = paused; helpExperimentWasPaused = experimentPaused;
  setPause(true); experimentPaused = true;
  $('help-dialog').showModal();
});
for (const id of ['help-close', 'help-done']) $(id).addEventListener('click', () => $('help-dialog').close());
$('help-dialog').addEventListener('close', () => {
  setPause(helpWasPaused); experimentPaused = helpExperimentWasPaused; experimentAccumulator = 0;
  $('help-open').focus();
});
document.addEventListener('keydown', (event) => {
  if ($('help-dialog').open || /INPUT|BUTTON|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (mode === 'observe' && event.code === 'Space') { event.preventDefault(); setPause(!paused); }
  if (mode === 'observe' && event.key === '.') { setPause(true); world.step(10); refreshWorld(); redraw = true; }
});
document.addEventListener('visibilitychange', () => { previousTime = performance.now(); accumulator = 0; experimentAccumulator = 0; });
window.addEventListener('resize', () => { redraw = true; });

function frame(now) {
  const delta = Math.min((now - previousTime) / 1000, 0.1);
  previousTime = now;
  let changed = false;
  if (!document.hidden && !$('help-dialog').open) {
    if (mode === 'observe' && !paused && world.agents.length) {
      accumulator += delta * speed;
      const steps = Math.min(20, Math.floor((accumulator + 1e-9) / STEP));
      if (steps) { world.step(steps); accumulator -= steps * STEP; changed = true; }
    } else if (mode === 'experiment' && experiment && experiment.phase !== 'complete' && !experimentPaused) {
      experimentAccumulator += delta * 12;
      const steps = Math.min(30, Math.floor((experimentAccumulator + 1e-9) / STEP));
      if (steps) { advanceExperiment(experiment, steps); experimentAccumulator -= steps * STEP; changed = true; }
    }
  }
  if (changed || redraw) {
    if (mode === 'observe') {
      drawWorld(worldCanvas, world, { selectedId, drought: world.options.resources < 0.4 });
      if (now - lastUi >= 150 || redraw || !world.agents.length) { refreshWorld(); drawHistory($('history'), world); lastUi = now; }
    } else {
      const warmup = experiment?.phase === 'warmup';
      drawWorld($('control-world'), experiment ? (warmup ? experiment.warmup : experiment.control) : null);
      drawWorld($('drought-world'), experiment ? (warmup ? experiment.warmup : experiment.drought) : null,
        { drought: Boolean(experiment && !warmup) });
      if (now - lastUi >= 150 || redraw || experiment?.phase === 'complete') { refreshExperiment(); lastUi = now; }
    }
    redraw = false;
  }
  requestAnimationFrame(frame);
}
initLanguage(() => {
  $('play').setAttribute('aria-label', paused ? tr('Play simulation', 'Simülasyonu oynat') : tr('Pause simulation', 'Simülasyonu duraklat'));
  for (const id of ['seed', 'experiment-seed']) $(id).setCustomValidity('');
  $('announcement').textContent = '';
  refreshWorld(); refreshTool(); refreshExperiment();
  if (experiment?.phase === 'complete') showResults();
  redraw = true;
});
requestAnimationFrame(frame);
