import { describe, it, expect } from 'vitest';
import { SEARCH_VIEWS } from '../SearchView.jsx';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { alleWege } from '../data/gepaeck.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
// NICHT `it` nennen — das überschreibt vitests `it`, und kein Test lädt mehr.
import itLang from '../i18n/it.js';
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
      // Der Label-Key muss nicht unter `nav.` liegen (zwei Abläufe tragen ihren
      // Titel); dass er in jeder Sprache auflöst, prüft der i18n-Block unten.
      expect(typeof v.nav === 'string' && v.nav.length > 0).toBe(true);
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

  // Befund 24.09.2026: von 19 Abläufen im Dashboard fand die Suche einen.
  it('jeder geführte Ablauf ist auffindbar — über seinen Titel', () => {
    expect(ABLAEUFE.length).toBeGreaterThanOrEqual(19);
    for (const a of ABLAEUFE) {
      const label = resolve(de, a.nav);
      const text = typeof label === 'string' ? label : label.sie;
      const wort = text.split(/[\s&]+/)[0].toLowerCase();
      const treffer = SEARCH_VIEWS.filter((v) => [resolve(de, v.nav), v.view, ...(v.aliases || [])]
        .some((x) => String(typeof x === 'object' ? x.sie : x).toLowerCase().includes(wort)));
      expect(treffer.map((v) => v.view), `«${wort}» findet ${a.view} nicht`).toContain(a.view);
    }
  });

  it('jeder Weg im Gepäck ist auch über die Suche erreichbar', () => {
    const searchable = new Set(SEARCH_VIEWS.map((v) => v.view));
    // Kapitel-/Sammelansichten ohne eigenen Such-Eintrag.
    const ausgenommen = new Set(['situationen', 'mietzins']);
    for (const w of alleWege()) {
      if (ausgenommen.has(w.view)) continue;
      expect(searchable.has(w.view), `Gepäck-Weg ${w.key} → ${w.view} nicht in der Suche`).toBe(true);
    }
  });
});

describe.each([['de', de], ['en', en], ['fr', frLang], ['it', itLang], ['rm', rm]])('Search i18n (%s)', (lang, dict) => {
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
