import { describe, it, expect } from 'vitest';
import { LINK_TARGETS } from '../MerklisteView.jsx';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';

const present = (v) => typeof v === 'string'
  ? v.length > 0
  : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));

const resolve = (obj, path) => path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

describe('Merkliste Struktur', () => {
  it('LINK_TARGETS haben view + label, keine Duplikate', () => {
    const views = LINK_TARGETS.map(t => t.view);
    expect(views.length).toBeGreaterThan(0);
    expect(new Set(views).size).toBe(views.length);
    for (const t of LINK_TARGETS) {
      expect(t.view).toBeTruthy();
      expect(t.label.startsWith('nav.')).toBe(true);
    }
  });
});

describe.each([['en', en], ['fr', frLang], ['rm', rm]])('Merkliste i18n (%s)', (lang, dict) => {
  it('nav.merkliste + nav.sub.merkliste vorhanden', () => {
    expect(present(dict.nav.merkliste), `${lang}: nav.merkliste`).toBe(true);
    expect(present(dict.nav.sub.merkliste), `${lang}: nav.sub.merkliste`).toBe(true);
  });

  it('merkliste-Namespace vollständig', () => {
    for (const k of ['title', 'intro', 'placeholder', 'linkLabel', 'linkNone', 'add', 'empty', 'openTitle', 'doneTitle', 'markDone', 'undo']) {
      expect(present(dict.merkliste?.[k]), `${lang}: merkliste.${k}`).toBe(true);
    }
  });

  it('jedes LINK_TARGETS-Label existiert in i18n (keine rohen Keys im Dropdown)', () => {
    for (const t of LINK_TARGETS) {
      expect(present(resolve(dict, t.label)), `${lang}: ${t.label}`).toBe(true);
    }
  });
});
