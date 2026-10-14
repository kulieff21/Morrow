import { startExperiment, advanceExperiment, STEP, DAY } from './engine.js';
import { drawWorld } from './render.js';
import { initLanguage, tr } from './i18n.js';

const $ = (id) => document.getElementById(id);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let paired;
let thrift;
let replication;
let metric = 'count';
let replay = startExperiment(4217);
let stopped = reduced.matches;
let lastFrame = 0;
let credit = 0;
let heroVisible = true;

const number = (value) => value.toFixed(2);
const signed = (value) => `${value < 0 ? '−' : '+'}${number(Math.abs(value))}`;

function renderLineages() {
  if (!paired) return;
  const chart = $('lineage-chart');
  if (!chart.children.length) {
    for (const row of paired.lineages) {
      const item = document.createElement('div'); item.className = 'lineage-plot-row';
      const name = document.createElement('span'); name.className = 'lineage-plot-name'; name.textContent = row.name;
      const bars = document.createElement('div'); bars.className = 'paired-bars';
      for (const arm of ['abundance', 'drought']) {
        const line = document.createElement('div'); line.className = `bar-line ${arm}`;
        line.append(document.createElement('i'), document.createElement('b')); bars.append(line);
      }
      item.append(name, bars); chart.append(item);
    }
  }
  const maximum = 50;
  paired.lineages.forEach((row, index) => {
    const values = metric === 'count' ? [row.meanControlCount, row.meanDroughtCount]
      : [100 * row.meanControlShare, 100 * row.meanDroughtShare];
    values.forEach((value, arm) => {
      const line = chart.children[index].querySelectorAll('.bar-line')[arm];
      line.style.setProperty('--value', `${value / maximum * 100}%`);
      line.querySelector('b').textContent = `${number(value)}${metric === 'share' ? '%' : ''}`;
    });
  });
  const share = metric === 'share';
  $('metric-count').setAttribute('aria-pressed', String(!share));
  $('metric-share').setAttribute('aria-pressed', String(share));
  const description = paired.lineages.map((row) => {
    const values = share ? [row.meanControlShare * 100, row.meanDroughtShare * 100]
      : [row.meanControlCount, row.meanDroughtCount];
    return tr(`${row.name}: abundance ${number(values[0])}, drought ${number(values[1])}.`,
      `${row.name}: bolluk ${number(values[0])}, kıtlık ${number(values[1])}.`);
  }).join(' ');
  chart.setAttribute('aria-label', tr(`Mean lineage ${share ? 'shares in percent' : 'living counts'}. `,
    `Soyların ortalama ${share ? 'yüzde payları' : 'canlı sayıları'}. `) + description);
  $('chart-explanation').textContent = share
    ? tr("Çiy: 17.91% → 33.42%. Its share rises by 15.51 percentage points as the total population shrinks.", "Çiy: %17.91 → %33.42. Toplam popülasyon küçülürken payı 15.51 yüzde puanı yükseliyor.")
    : tr('Çiy: 26.67 → 4.67 organisms. Every lineage has a lower mean living count in drought.', 'Çiy: 26.67 → 4.67 canlı. Bütün soyların ortalama canlı sayısı kıtlıkta daha düşük.');
}

function renderSeed() {
  if (!thrift) return;
  const run = thrift.runs.find((value) => value.seed === Number($('recorded-seed').value));
  const labels = [tr('Natural abundance', 'Doğal bolluk'), tr('Natural drought', 'Doğal kıtlık'),
    tr('Normalized abundance', 'Normalize bolluk'), tr('Normalized drought', 'Normalize kıtlık')];
  const keys = ['naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought'];
  $('arm-results').replaceChildren(...keys.map((key, index) => {
    const arm = run.arms[key]; const row = document.createElement('tr');
    for (const value of [labels[index], arm.population, arm.count, `${number(arm.sharePercent)}%`]) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    return row;
  }));
  $('seed-interaction').textContent = tr(
    `Seed ${run.seed}: share interaction ${signed(run.share.interaction)} pp; count interaction ${signed(run.count.interaction)} organisms.`,
    `Seed ${run.seed}: pay etkileşimi ${signed(run.share.interaction)} yüzde puanı; sayı etkileşimi ${signed(run.count.interaction)} canlı.`);
}

function drawReplay() {
  const warmup = replay.phase === 'warmup';
  const control = warmup ? replay.warmup : replay.control;
  const drought = warmup ? replay.warmup : replay.drought;
  const ticks = warmup ? replay.elapsedTicks : 960 + replay.elapsedTicks;
  $('replay-drought-label').textContent = warmup
    ? tr('Future drought · full renewal until day 8', 'Kıtlık kolu · 8. güne kadar tam yenilenme')
    : tr('Drought · 15% renewal', 'Kıtlık · %15 yenilenme');
  drawWorld($('replay-control'), control);
  drawWorld($('replay-drought'), drought, { drought: !warmup });
  $('hero-experiment').classList.toggle('forked', !warmup);
  $('replay-control-count').textContent = control.agents.length;
  $('replay-drought-count').textContent = drought.agents.length;
  $('replay-progress').style.width = `${ticks / 1920 * 100}%`;
  $('replay-day').textContent = `${(ticks * STEP / DAY).toFixed(1)} / 16 ${tr('days', 'gün')}`;
  $('replay-phase').textContent = warmup ? tr('One shared beginning', 'Tek bir ortak başlangıç')
    : replay.phase === 'complete' ? tr('Two recorded futures', 'Kaydedilmiş iki gelecek') : tr('The checkpoint branches', 'Aynı an iki kola ayrılıyor');
  $('replay-toggle').textContent = stopped ? tr('Play', 'Oynat') : tr('Pause', 'Duraklat');
  $('replay-toggle').setAttribute('aria-pressed', String(stopped));
  $('replay-toggle').disabled = replay.phase === 'complete';
}

function renderReplication() {
  if (!replication) return;
  const select = $('replication-seed');
  select.disabled = false;
  $('replication-negative').disabled = false;
  $('replication-positive').disabled = false;
  if (!select.options.length) for (const run of replication.runs) {
    const option = document.createElement('option'); option.value = run.seed; option.textContent = run.seed;
    select.append(option);
  }
  const effect = replication.effects.share.interaction;
  const interval = replication.bootstrap.share.interval;
  $('replication-status').textContent = replication.decision === 'criterion-met'
    ? tr('Prespecified criterion met', 'Önceden belirlenen ölçüt karşılandı')
    : tr('Prespecified criterion inconclusive', 'Önceden belirlenen ölçüt belirsiz');
  $('replication-mean').textContent = signed(effect.mean);
  $('replication-interval').textContent = tr(`95% paired-bootstrap interval: [${interval.map(signed).join(', ')}] pp`,
    `%95 eşleştirilmiş bootstrap aralığı: [${interval.map(signed).join(', ')}] yüzde puanı`);
  $('replication-signs').textContent = tr(`${effect.negative} negative · ${effect.positive} positive · ${effect.zero} zero`,
    `${effect.negative} negatif · ${effect.positive} pozitif · ${effect.zero} sıfır`);
  const count = replication.effects.count.interaction;
  const countInterval = replication.bootstrap.count.interval.map(signed).join(', ');
  $('replication-count').textContent = tr(`Count interaction: ${signed(count.mean)} organisms; 95% interval [${countInterval}].`,
    `Canlı sayısı etkileşimi: ${signed(count.mean)} canlı; %95 aralık [${countInterval}].`);
  const map = $('replication-worlds');
  if (!map.children.length) for (const run of replication.runs) {
    const dot = document.createElement('span'); dot.className = run.share.interaction < 0 ? 'negative' : run.share.interaction > 0 ? 'positive' : 'zero';
    map.append(dot);
  }
  map.setAttribute('aria-label', tr(`All 100 share interactions: ${effect.negative} negative, ${effect.positive} positive, ${effect.zero} zero. Use the seed selector to inspect every outcome.`,
    `100 pay etkileşimi: ${effect.negative} negatif, ${effect.positive} pozitif, ${effect.zero} sıfır. Her sonucu incelemek için seed seçiciyi kullan.`));
  replication.runs.forEach((run, index) => {
    map.children[index].classList.toggle('selected', run.seed === Number(select.value));
    map.children[index].title = `Seed ${run.seed}: ${signed(run.share.interaction)} pp`;
  });
  const run = replication.runs.find((value) => value.seed === Number(select.value));
  const keys = ['naturalAbundance', 'naturalDrought', 'normalizedAbundance', 'normalizedDrought'];
  const labels = [tr('Natural abundance', 'Doğal bolluk'), tr('Natural drought', 'Doğal kıtlık'),
    tr('Normalized abundance', 'Normalize bolluk'), tr('Normalized drought', 'Normalize kıtlık')];
  $('replication-arm-results').replaceChildren(...keys.map((key, i) => {
    const arm = run.arms[key], row = document.createElement('tr');
    for (const value of [labels[i], arm.population, arm.count, `${number(arm.sharePercent)}%`]) {
      const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
    }
    return row;
  }));
  $('replication-seed-details').textContent = tr(
    `Seed ${run.seed}: share interaction ${signed(run.share.interaction)} pp; count interaction ${signed(run.count.interaction)} organisms.`,
    `Seed ${run.seed}: pay etkileşimi ${signed(run.share.interaction)} yüzde puanı; sayı etkileşimi ${signed(run.count.interaction)} canlı.`);
}

initLanguage(() => {
  document.title = tr('Morrow — one pond, two futures', 'Morrow — bir havuz, iki gelecek');
  for (const [id, english, turkish] of [
    ['recorded-seed', 'Recorded seed', 'Kayıtlı seed'],
    ['replay-control', 'Abundance replay', 'Bolluk tekrarı'],
    ['replay-drought', 'Drought replay', 'Kıtlık tekrarı'],
    ['replication-seed', 'Unseen seed', 'Yeni seed'],
  ]) $(id).setAttribute('aria-label', tr(english, turkish));
  document.querySelector('.metric-switch').setAttribute('aria-label', tr('Outcome scale', 'Sonuç ölçüsü'));
  document.querySelector('.site-header nav').setAttribute('aria-label', tr('Sections', 'Bölümler'));
  document.querySelector('meta[name="description"]').content = tr('Morrow: a living pond, twelve original worlds, a prospective replication on 100 unseen seeds and a complete research article.', 'Morrow: yaşayan havuz, ilk on iki dünya, 100 yeni seed üzerinde önceden planlanmış tekrar ve ayrıntılı araştırma makalesi.');
  renderLineages(); renderSeed(); renderReplication(); drawReplay();
});

for (const value of ['count', 'share']) $(`metric-${value}`).addEventListener('click', () => { metric = value; renderLineages(); });
$('recorded-seed').addEventListener('change', renderSeed);
$('replication-seed').addEventListener('change', renderReplication);
for (const [id, direction] of [['replication-negative', -1], ['replication-positive', 1]]) $(id).addEventListener('click', () => {
  if (!replication) return;
  const extremes = [...replication.runs].sort((a, b) => direction * (b.share.interaction - a.share.interaction));
  $('replication-seed').value = extremes[0].seed; renderReplication();
});
$('replay-toggle').addEventListener('click', () => { stopped = !stopped; credit = 0; drawReplay(); });
$('replay').addEventListener('click', () => {
  replay = startExperiment(4217); credit = 0;
  stopped = reduced.matches;
  if (reduced.matches) advanceExperiment(replay, 1920);
  drawReplay();
});
reduced.addEventListener('change', () => {
  if (reduced.matches) { stopped = true; advanceExperiment(replay, 1920); drawReplay(); }
});
new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; credit = 0; }, { threshold: .05 }).observe($('hero-experiment'));
document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); credit = 0; });
window.addEventListener('resize', drawReplay);

if (reduced.matches) { advanceExperiment(replay, 1920); drawReplay(); }
function animate(now) {
  const delta = Math.min((now - lastFrame) / 1000, .1); lastFrame = now;
  if (!document.hidden && heroVisible && !stopped && replay.phase !== 'complete') {
    credit += delta * 240;
    const count = Math.min(30, Math.floor(credit));
    if (count) { credit -= count; advanceExperiment(replay, count); drawReplay(); }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

try {
  [paired, thrift, replication] = await Promise.all(['paired-analysis.json', 'thrift-analysis.json', 'replication-analysis.json'].map(async (file) => {
    const response = await fetch(new URL(`../docs/${file}`, import.meta.url));
    if (!response.ok) throw new Error('Evidence request failed');
    return response.json();
  }));
  renderLineages(); renderSeed(); renderReplication();
} catch {
  $('data-error').hidden = false;
  $('data-error').textContent = tr('The interactive evidence could not load. Reload the page or open the linked JSON records.', 'Etkileşimli kanıtlar yüklenemedi. Sayfayı yenile veya bağlantılı JSON kayıtlarını aç.');
}
