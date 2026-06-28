import { describe, it, expect } from 'vitest';
import { SEARCH_VIEWS } from '../SearchView.jsx';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';

// Werkzeuge, die über Dashboard-Kachelraster bzw. Mobile-Menü erreichbar sind
// und daher auch auffindbar sein MÜSSEN. Single source für die Suche ist
// SEARCH_VIEWS; dieser Vertrag fängt künftige Drift (Tool ergänzt, Suche
// vergessen) ab. 'search' selbst und Kapitel-Aktionen (mindestlohn) ausgenommen.
const SEARCHABLE_TOOLS = [
  'finanzuebersicht', 'merkliste', 'calendar', 'sync', 'premium', 'praemien',
  'kvg', 'vorsorge', 'eo', 'stipendien', 'tax', 'taxImport', 'sozialhilfe',
  'alv', 'asyl', 'direktlinks', 'tresor', 'cv', 'unterlagen', 'flyer',
  'kk', 'budget', 'schulden', 'organ', 'charts', 'export', 'notifications',
];

const present = (v) => typeof v === 'string'
  ? v.length > 0
  : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));
const resolve = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

describe('SearchView Katalog', () => {
  it('Einträge eindeutig, mit nav/sub/icon', () => {
    const views = SEARCH_VIEWS.map(v => v.view);
    expect(new Set(views).size).toBe(views.length);
    for (const v of SEARCH_VIEWS) {
      expect(v.nav.startsWith('nav.')).toBe(true);
      // sub ist optional — nicht jedes Werkzeug hat einen Beschreibungs-Key.
      if (v.sub !== undefined) expect(v.sub.startsWith('nav.sub.')).toBe(true);
      expect(v.icon).toBeTruthy();
    }
  });

  it('jede Such-View ist eine gültige Navigations-View', () => {
    for (const v of SEARCH_VIEWS) {
      expect(VALID_VIEWS.has(v.view), `unbekannte View: ${v.view}`).toBe(true);
    }
  });

  it('alle erreichbaren Werkzeuge sind auffindbar (Drift-Guard)', () => {
    const searchable = new Set(SEARCH_VIEWS.map(v => v.view));
    for (const view of SEARCHABLE_TOOLS) {
      expect(searchable.has(view), `Werkzeug nicht in der Suche: ${view}`).toBe(true);
    }
  });
});

describe.each([['en', en], ['fr', frLang], ['rm', rm]])('Search i18n (%s)', (lang, dict) => {
  it('nav.search + nav.sub.search + search-Namespace vorhanden', () => {
    expect(present(dict.nav.search), `${lang}: nav.search`).toBe(true);
    expect(present(dict.nav.sub.search), `${lang}: nav.sub.search`).toBe(true);
    for (const k of ['title', 'placeholder', 'empty', 'toolsTitle', 'chaptersTitle']) {
      expect(present(dict.search?.[k]), `${lang}: search.${k}`).toBe(true);
    }
  });

  it('alle Katalog-Labels (nav + sub) existieren — keine rohen Keys', () => {
    for (const v of SEARCH_VIEWS) {
      expect(present(resolve(dict, v.nav)), `${lang}: ${v.nav}`).toBe(true);
      if (v.sub !== undefined) {
        expect(present(resolve(dict, v.sub)), `${lang}: ${v.sub}`).toBe(true);
      }
    }
  });
});
