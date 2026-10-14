import { WIDTH, HEIGHT, DAY, LINEAGES, clamp } from './engine.js';
import { tr } from './i18n.js';

export function fitCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * ratio);
  const height = Math.round(rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const context = canvas.getContext('2d');
  context.setTransform(width / WIDTH, 0, 0, height / HEIGHT, 0, 0);
  return context;
}

function water(context, world, drought) {
  context.fillStyle = '#102d49';
  context.fillRect(0, 0, WIDTH, HEIGHT);
  const gradient = context.createRadialGradient(460, 270, 60, 480, 320, 640);
  gradient.addColorStop(0, drought ? '#3d465155' : '#315e7355');
  gradient.addColorStop(1, '#102d4900');
  context.fillStyle = gradient;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  // Submerged contours, static so motion in the pond means living movement.
  context.lineWidth = 1;
  for (let ring = 0; ring < 6; ring++) {
    context.beginPath();
    for (let i = 0; i <= 90; i++) {
      const angle = i / 90 * Math.PI * 2;
      const radius = 115 + ring * 72 + Math.sin(angle * 3 + 0.6) * 23 + Math.cos(angle * 5) * 12;
      const x = 505 + Math.cos(angle) * radius * 1.35;
      const y = 330 + Math.sin(angle) * radius * 0.83;
      if (i === 0) context.moveTo(x, y); else context.lineTo(x, y);
    }
    context.closePath();
    context.strokeStyle = '#7ca1b310';
    context.stroke();
  }
  context.fillStyle = '#83a8b816';
  for (let i = 0; i < 55; i++) {
    const x = ((i * 157 + 53) % 977) + 10;
    const y = ((i * 233 + 31) % 607) + 10;
    context.fillRect(x, y, 1.5, 1.5);
  }
  if (world) for (const patch of world.patches) {
    context.beginPath();
    context.ellipse(patch.x, patch.y, 90, 65, -0.3, 0, Math.PI * 2);
    context.fillStyle = '#578f8c05';
    context.fill();
  }
}

export function drawWorld(canvas, world, { selectedId = null, drought = false, empty = '' } = {}) {
  const context = fitCanvas(canvas);
  if (!context) return;
  water(context, world, drought);
  if (!world) {
    context.textAlign = 'center';
    context.fillStyle = '#a7bfce';
    context.font = '25px Georgia';
    context.fillText(empty || tr('A world will wake soon.', 'Bir dünya birazdan uyanacak.'), 500, 320);
    context.font = '16px Segoe UI';
    context.fillStyle = '#7e9cb2';
    context.fillText(tr('First a prediction, then an observation.', 'Önce bir tahmin, sonra gözlem.'), 500, 355);
    return;
  }
  for (const rock of world.obstacles) {
    context.fillStyle = '#2e4d64';
    context.strokeStyle = '#71899a66';
    context.lineWidth = 1.2;
    context.beginPath();
    context.ellipse(rock.x, rock.y, rock.radius, rock.radius * 0.95, 0.4, 0, Math.PI * 2);
    context.fill(); context.stroke();
    context.beginPath();
    context.arc(rock.x - 1, rock.y - 2, rock.radius * 0.7, 3.4, 5.8);
    context.strokeStyle = '#9ab1bf2b'; context.stroke();
  }
  for (const food of world.food) {
    context.beginPath();
    context.arc(food.x, food.y, 2.3, 0, Math.PI * 2);
    context.fillStyle = '#99c7ad';
    context.fill();
    context.fillStyle = '#b6dfbf13';
    context.beginPath(); context.arc(food.x, food.y, 5, 0, Math.PI * 2); context.fill();
  }
  // Selected specimens draw last, so inspection is never obscured by a neighbor.
  const selected = world.agents.find((agent) => agent.id === selectedId);
  for (const agent of world.agents) if (agent !== selected) creature(context, agent, world.time, false);
  if (selected) creature(context, selected, world.time, true);
}

function creature(context, agent, time, selected) {
  const color = LINEAGES[agent.lineage].color;
  const energy = clamp(agent.energy / 120, 0.15, 1);
  const length = 6 + energy * 2.7;
  const width = 3.8 + energy * 1.3;
  if (selected) {
    context.save();
    context.strokeStyle = `${color}20`;
    context.fillStyle = `${color}06`;
    context.lineWidth = 1;
    context.setLineDash([3, 7]);
    context.beginPath();
    context.arc(agent.x, agent.y, 70 * agent.genes.sense, 0, Math.PI * 2);
    context.fill(); context.stroke();
    context.restore();
  }
  context.save();
  context.translate(agent.x, agent.y);
  context.rotate(agent.angle);
  context.globalAlpha = 0.55 + energy * 0.45;
  const wave = Math.sin(time * 13 + agent.id * 1.7) * (2.5 + agent.genes.speed);
  context.beginPath();
  context.moveTo(-length + 1, 0);
  context.bezierCurveTo(-length - 4, wave, -length - 8, -wave, -length - agent.genes.speed * 12, wave * 1.3);
  context.lineWidth = 1.5;
  context.lineCap = 'round';
  context.strokeStyle = `${color}a0`;
  context.stroke();
  context.beginPath();
  context.ellipse(0, 0, length, width, 0, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.beginPath();
  context.ellipse(-2, 0, length * 0.42, width * 0.47, 0, 0, Math.PI * 2);
  context.fillStyle = '#ffffff33';
  context.fill();
  context.beginPath();
  context.arc(length - 3, -1, 1.2, 0, Math.PI * 2);
  context.fillStyle = '#17314c';
  context.fill();
  context.restore();
  if (time - agent.fedAt < 0.45) {
    const progress = (time - agent.fedAt) / 0.45;
    context.strokeStyle = `${color}${Math.round((1 - progress) * 85).toString(16).padStart(2, '0')}`;
    context.lineWidth = 1;
    context.beginPath(); context.arc(agent.x, agent.y, 9 + progress * 12, 0, Math.PI * 2); context.stroke();
  }
  if (selected) {
    context.strokeStyle = color;
    context.lineWidth = 1;
    const radius = 19;
    for (let i = 0; i < 4; i++) {
      context.beginPath();
      context.arc(agent.x, agent.y, radius, i * Math.PI / 2 + 0.15, i * Math.PI / 2 + 0.75);
      context.stroke();
    }
    context.fillStyle = '#e0ebf3';
    context.font = '11px Segoe UI';
    context.textAlign = 'center';
    const labelY = agent.y < 35 ? agent.y + 35 : agent.y - 29;
    context.fillText(`${LINEAGES[agent.lineage].name} #${agent.id}`, clamp(agent.x, 48, WIDTH - 48), labelY);
  }
}

export function drawHistory(canvas, world) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * ratio);
  const height = Math.round(rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const w = rect.width, h = rect.height;
  context.clearRect(0, 0, w, h);
  const history = world.history;
  const maximum = Math.max(40, ...history.map((sample) => sample.population)) * 1.16;
  const plotWidth = w - 30;
  const plotHeight = h - 6;
  context.font = '9px Segoe UI';
  context.textAlign = 'right';
  for (const fraction of [0, 0.5, 1]) {
    const y = 3 + plotHeight * (1 - fraction);
    context.strokeStyle = '#cbd9e077';
    context.lineWidth = 0.7;
    context.beginPath(); context.moveTo(0, y); context.lineTo(plotWidth, y); context.stroke();
    context.fillStyle = '#8193a2';
    context.fillText(String(Math.round(maximum * fraction)), w, y + 3);
  }
  if (history.length < 2) return;
  const xAt = (index) => index / (history.length - 1) * plotWidth;
  const yAt = (value) => h - 3 - value / maximum * plotHeight;
  for (let lineage = 0; lineage < LINEAGES.length; lineage++) {
    context.beginPath();
    for (let i = 0; i < history.length; i++) {
      const sum = history[i].counts.slice(0, lineage + 1).reduce((a, b) => a + b, 0);
      if (i === 0) context.moveTo(xAt(i), yAt(sum)); else context.lineTo(xAt(i), yAt(sum));
    }
    for (let i = history.length - 1; i >= 0; i--) {
      const sum = history[i].counts.slice(0, lineage).reduce((a, b) => a + b, 0);
      context.lineTo(xAt(i), yAt(sum));
    }
    context.closePath();
    context.fillStyle = `${LINEAGES[lineage].color}b0`;
    context.fill();
  }
  context.beginPath();
  for (let i = 0; i < history.length; i++) {
    if (!i) context.moveTo(xAt(i), yAt(history[i].population));
    else context.lineTo(xAt(i), yAt(history[i].population));
  }
  context.strokeStyle = '#47657e'; context.lineWidth = 1.4; context.stroke();
}

export function pointInWorld(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) / rect.width * WIDTH,
    y: (event.clientY - rect.top) / rect.height * HEIGHT };
}

export const formatDay = (time) => (time / DAY).toFixed(1);
