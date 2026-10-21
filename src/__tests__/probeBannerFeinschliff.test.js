// Tor-Vorlauf 21.10.2026 (a11y- und copy-Prüfer) zum Probier-Modus-Banner nach B5:
//   1. «Zurück» schloss die Rückfrage und entfernte den fokussierten Knopf — der Fokus
//      fiel auf <body>. Jetzt geht er zurück auf «In den Stand übernehmen».
//   2. «Verwerfen», «In den Stand übernehmen» und «Leer starten» waren ~28 bzw. ~20 px
//      hoch. Jetzt 44 px wie die Rückfrage-Knöpfe.
//   3. Die neuen rm-Texte waren nicht als provisorisch markiert.
//
// Kein DOM-Test (vitest ohne jsdom, siehe zweiTabs.test.js). Belegt sind darum Wächter
// am Quelltext; den Fokus selbst belegt der Browser-Lauf im PR.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const lies = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
const main = lies('main.jsx');

// Der Banner-Block, von `sandboxActive && …` bis zum Kommentar danach.
const banner = main.slice(
  main.indexOf("sandboxActive && React.createElement('div'"),
  main.indexOf('// Kein eigener Scroll-Kasten mehr'),
);
// Jeder Knopf im Banner, bis zu seiner Beschriftung t('sandbox.…').
const knopf = (schluessel) => {
  const ende = banner.indexOf(`}, t('sandbox.${schluessel}'))`);
  const anfang = banner.lastIndexOf("React.createElement('button'", ende);
  expect(ende).toBeGreaterThan(-1);
  expect(anfang).toBeGreaterThan(-1);
  return banner.slice(anfang, ende);
};

describe('Probier-Banner · Fokus nach «Zurück»', () => {
  it('«Zurück» merkt sich die Rückkehr, bevor es die Rückfrage schliesst', () => {
    expect(knopf('replaceBack')).toMatch(/onClick: rueckfrageZurueck\b/);
    const zeile = main.split('\n').find((z) => z.includes('const rueckfrageZurueck = () =>'));
    expect(zeile).toBeDefined();
    expect(zeile.indexOf('zurueckFokus.current = true')).toBeGreaterThan(-1);
    expect(zeile.indexOf('zurueckFokus.current = true')).toBeLessThan(zeile.indexOf('setErsetzenFragen(false)'));
  });

  it('«In den Stand übernehmen» trägt die Ref, die den Fokus bekommt', () => {
    expect(knopf('apply')).toMatch(/ref: uebernehmenKnopf, onClick: \(\) => applySandbox\(false\)/);
  });

  it('der Effekt fokussiert nur nach «Zurück», nicht beim Übernehmen oder Verwerfen', () => {
    const effekt = main.slice(main.indexOf('const zurueckFokus = React.useRef(false)'));
    const block = effekt.slice(effekt.indexOf('useEffect(() => {'), effekt.indexOf('}, [ersetzenFragen]);'));
    expect(block).toContain('if (ersetzenFragen || !zurueckFokus.current) return;');
    expect(block).toContain('zurueckFokus.current = false;');
    expect(block).toContain('uebernehmenKnopf.current.focus()');
    // Nur «Zurück» setzt das Zeichen; Schliessen/Übernehmen nicht.
    expect(main.match(/zurueckFokus\.current = true/g)).toHaveLength(1);
    const schliessen = main.split('\n').find((z) => z.includes('const probeSchliessen = () =>'));
    expect(schliessen).not.toContain('zurueckFokus');
  });

  it('die Rückfrage behält den Fokus auf «Zurück» beim Öffnen', () => {
    expect(knopf('replaceBack')).toMatch(/autoFocus: true/);
  });
});

describe('Probier-Banner · Tippflächen 44 px', () => {
  for (const k of ['discard', 'apply', 'startBlank', 'replaceBack', 'replaceConfirm']) {
    it(`${k}: minHeight 44px`, () => {
      expect(knopf(k)).toMatch(/minHeight: '44px'/);
    });
  }
});

describe('Probier-Banner · bricht auf dem Handy um', () => {
  it('Textspalte mit Basis 240px, nicht flex: 1 (Basis 0 bricht nie um)', () => {
    const spalte = banner.slice(0, banner.indexOf("t('sandbox.bannerTitle')"));
    expect(spalte).toMatch(/style: \{ flex: '1 1 240px', minWidth: 0 \}/);
    expect(spalte).not.toMatch(/style: \{ flex: 1, minWidth: 0 \}/);
  });
});

describe('Probier-Banner · rm-Texte als provisorisch markiert', () => {
  const zeilen = lies('i18n/rm.js').split('\n');
  for (const k of ['replaceQuestion', 'replaceBack', 'replaceConfirm', 'vorbehaltVD2027']) {
    it(`${k}: TODO(rm) direkt darüber`, () => {
      const i = zeilen.findIndex((z) => z.trimStart().startsWith(`${k}: `));
      expect(i).toBeGreaterThan(0);
      expect(zeilen[i - 1].trim()).toMatch(/^\/\/ TODO\(rm\): provisorisch — Gegenlese \(.+, \d{2}\.\d{2}\.\d{4}\)$/);
    });
  }
});
