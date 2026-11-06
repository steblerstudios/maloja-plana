// Eine Suche für Lupe und Menü (Fassung 9, F9-D1). Befund 05.11.2026: die Menü-Suche fand
// keinen einzigen Ablauf («heirat», «todesfall», «notfallkarte» → keine Treffer), die Lupe fand
// «Was steht mir zu?» und den Arztkoffer nicht. Beide lesen jetzt config/suche.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import { suchTreffer, SUCHLISTE } from '../config/suche.js';

const lese = (obj, pfad) => pfad.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
const t = (k) => { const v = lese(de, k); return typeof v === 'string' ? v : (v && (v.sie || v.du)) || k; };
const KAPITEL = [{ key: 'notfall', title: 'Notfall', description: 'Für den Ernstfall' }];

describe('Eine Suche', () => {
  for (const [anfrage, view] of [
    ['heirat', 'heirat'], ['todesfall', 'todesfall'], ['notfallkarte', 'notfallkarte'],
    ['bestattung', 'bestattung'], ['mietzins', 'mietzins'], ['was steht mir zu', 'situationen'],
    ['arztkoffer', 'gesundheit'], ['rucksack', 'gepaeck'], ['einstellungen', 'settings'],
  ]) {
    it(`«${anfrage}» findet ${view}`, () => {
      expect(suchTreffer(anfrage, t, KAPITEL).werkzeuge.map((v) => v.view)).toContain(view);
    });
  }

  it('findet Kapitel über Titel und Beschreibung', () => {
    expect(suchTreffer('ernstfall', t, KAPITEL).kapitel.map(({ ch }) => ch.key)).toEqual(['notfall']);
  });

  it('keine doppelten Einträge', () => {
    const keys = SUCHLISTE.map((v) => v.key || v.view);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('Lupe und Menü lesen dieselbe Suche (keine eigene Trefferregel mehr)', () => {
    for (const datei of ['SearchView.jsx', 'MobileNav.jsx']) {
      const src = fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
      expect(src, datei).toMatch(/suchTreffer\(/);
      expect(src, datei).not.toMatch(/aliases\.some\(/);
    }
  });
});
