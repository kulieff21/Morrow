import { COPY } from './translations.js';

let language = 'en';
export const getLanguage = () => language;
export const tr = (english, turkish) => language === 'tr' ? turkish : english;
export function setLanguage(value) {
  language = value === 'tr' ? 'tr' : 'en';
  return language;
}

// Translate a view of canonical engine events; never edit the saved world state.
export function eventText(message = '') {
  if (language === 'tr') return message;
  const events = new Map([
    ['Dünya uyandı. Altı soy, otuz canlı.', 'The world awoke. Six lineages, thirty organisms.'],
    ['Havuza bir avuç besin bırakıldı.', 'A handful of food was added to the pond.'],
    ['Akışa bir kaya eklendi.', 'A rock was added to the current.'],
    ['Son canlı da kayboldu. Yeni bir dünya başlatabilirsin.', 'The last organism is gone. You can start a new world.'],
    ['Mevsimler dönmeye başladı.', 'The season cycle started.'],
    ['Mevsim döngüsü durdu.', 'The season cycle stopped.'],
    ['Kıtlık başladı. Besin yenilenmesi %15.', 'Drought began. Food renewal is 15%.'],
    ['Bolluk geri geldi. Besin yenilenmesi %100.', 'Abundance returned. Food renewal is 100%.'],
  ]);
  const renewal = message.match(/^Besin yenilenmesi %(\d+) oldu\.$/);
  return events.get(message) ?? (renewal ? `Food renewal is now ${renewal[1]}%.` : message);
}

export function initLanguage(onChange = () => {}) {
  const root = document.documentElement;
  const saved = new URLSearchParams(window.location.search).get('lang');
  setLanguage(saved);
  const byEnglish = new Map(COPY);
  const bindings = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) continue;
    const english = node.textContent.trim();
    if (byEnglish.has(english)) bindings.push({ node, english, original: node.textContent });
  }
  const attributes = [];
  for (const element of document.querySelectorAll('[aria-label], [title], meta[name="description"]')) {
    for (const name of ['aria-label', 'title', 'content']) {
      const english = element.getAttribute(name);
      if (byEnglish.has(english)) attributes.push({ element, name, english });
    }
  }
  const title = document.title;
  const localized = [...document.querySelectorAll('[data-tr]')].map((element) => ({
    element, english: element.dataset.en ?? element.textContent, turkish: element.dataset.tr,
  }));
  const select = document.getElementById('language-select');
  function apply(value) {
    setLanguage(value);
    root.lang = language;
    document.title = tr(title, byEnglish.get(title) ?? title);
    for (const { node, english, original } of bindings) {
      node.textContent = original.replace(english, tr(english, byEnglish.get(english)));
    }
    for (const { element, name, english } of attributes) element.setAttribute(name, tr(english, byEnglish.get(english)));
    for (const { element, english, turkish } of localized) {
      element.textContent = tr(english, turkish);
    }
    for (const link of document.querySelectorAll('[data-language-link]')) {
      const url = new URL(link.getAttribute('href'), window.location.href);
      if (language === 'tr') url.searchParams.set('lang', 'tr'); else url.searchParams.delete('lang');
      link.href = url.href;
    }
    if (select) select.value = language;
    onChange(language);
  }
  select?.addEventListener('change', () => {
    const url = new URL(window.location.href);
    if (select.value === 'tr') url.searchParams.set('lang', 'tr'); else url.searchParams.delete('lang');
    window.history.replaceState(null, '', url);
    apply(select.value);
  });
  apply(language);
  return apply;
}
