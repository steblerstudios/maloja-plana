import { describe, it, expect } from 'vitest';
import { SEARCH_VIEWS } from '../SearchView.jsx';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';

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
      expect(v.sub.startsWith('nav.sub.')).toBe(true);
      expect(v.icon).toBeTruthy();
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
      expect(present(resolve(dict, v.sub)), `${lang}: ${v.sub}`).toBe(true);
    }
  });
});
