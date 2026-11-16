import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SEITEN } from '../../scripts/seiten-inhalt.mjs';
import { SPRACHEN, RAHMEN } from '../../scripts/seiten-sprachen.mjs';

// Rechtsprüfung 16.11.2026 (EL, ALV, AHV): Der allgemeine Hinweis «nennt bewusst keine Beträge und Fristen»
// stimmt auf Seiten zu reinem Bundesrecht nicht — dort gelten Fristen und Altersgrenzen überall gleich und
// werden genannt. Diese Seiten tragen `bundesrecht: true` und einen eigenen Hinweis; alle übrigen den alten.
const lies = (pfad, s) => fs.readFileSync(path.resolve(process.cwd(), 'public', ...`${s.praefix}${pfad}`.split('/'), 'index.html'), 'utf8');
const ohneTags = (t) => t.replace(/<[^>]+>/g, '');

describe('Erklärseiten zu Bundesrecht: eigener Hinweis', () => {
  it('jede Sprache hat beide Texte, und der neue verspricht nicht «keine Fristen»', () => {
    for (const s of SPRACHEN) {
      expect(RAHMEN[s.code].kurzhinweisBund, s.code).toBeTruthy();
      expect(RAHMEN[s.code].vorbehaltBund, s.code).toBeTruthy();
    }
    expect(RAHMEN.de.kurzhinweisBund).not.toMatch(/keine Beträge und Fristen/);
    expect(RAHMEN.de.vorbehaltBund).not.toMatch(/keine Beträge, Fristen/);
  });

  it('mindestens eine Seite ist so markiert, und es sind nicht alle', () => {
    const bund = SEITEN.filter((s) => s.bundesrecht);
    expect(bund.length).toBeGreaterThan(0);
    expect(bund.length).toBeLessThan(SEITEN.length);
  });

  for (const seite of SEITEN) {
    it(`/${seite.pfad}/ trägt in allen Sprachen den passenden Hinweis`, () => {
      for (const s of SPRACHEN) {
        const html = lies(seite.pfad, s);
        const R = RAHMEN[s.code];
        const kurz = seite.bundesrecht ? R.kurzhinweisBund : R.kurzhinweis;
        const vor = seite.bundesrecht ? R.vorbehaltBund : R.vorbehalt;
        expect(html.replace(/&amp;/g, '&'), `${s.code} kurz`).toContain(kurz);
        expect(ohneTags(html), `${s.code} Vorbehalt`).toContain(ohneTags(vor));
      }
    });
  }
});
