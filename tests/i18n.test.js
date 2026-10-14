import test from 'node:test';
import assert from 'node:assert/strict';
import { getLanguage, setLanguage, tr, eventText } from '../src/i18n.js';
import { COPY } from '../src/translations.js';
import { World } from '../src/engine.js';

test('language defaults and fallbacks are English; Turkish translates only the event view', () => {
  setLanguage('en');
  const world = new World(4217);
  const snapshot = JSON.stringify(world.snapshot());
  const message = world.events[0].message;
  assert.equal(getLanguage(), 'en');
  assert.equal(eventText(message), 'The world awoke. Six lineages, thirty organisms.');
  setLanguage('tr');
  assert.equal(tr('Count', 'Sayı'), 'Sayı');
  assert.equal(eventText(message), message);
  assert.equal(JSON.stringify(world.snapshot()), snapshot);
  setLanguage('unsupported');
  assert.equal(getLanguage(), 'en');
  assert.equal(tr('Count', 'Sayı'), 'Count');
  assert.equal(eventText('Besin yenilenmesi %42 oldu.'), 'Food renewal is now 42%.');
  assert.equal(eventText('unknown future event'), 'unknown future event');
});

test('static translation keys are unique, complete and preserve lineage identifiers', () => {
  assert.equal(new Set(COPY.map(([english]) => english)).size, COPY.length);
  assert.ok(COPY.every(([english, turkish]) => english.trim() && turkish.trim()));
  for (const name of ['Akım', 'Çiy', 'Köz', 'Sis', 'Yankı', 'Filiz']) {
    assert.ok(!COPY.some(([english]) => english === name));
  }
});
