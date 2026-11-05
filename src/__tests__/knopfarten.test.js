// Knopfarten aus einer Quelle (Fassung 9, Stebler Studios 05.11.2026: Farbrollen Variante B
// «Ja, so» und «setze alle Empfehlungen um und beachte die Rundungen der Knöpfe»).
// Gold = handeln, Grün = gut/erledigt, Blau = informieren und Fristen, Rot = warnen.
// Regeln im Markenhandbuch, docs/brand/brand-guidelines.md §7 «Knöpfe».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { knopfStil, linkStil, auswahlStil, KNOPF_RADIUS } from '../components/PrimaryButton.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

const SRC = path.resolve(__dirname, '..');
const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'vendor' ? [] : dateien(p);
  return /\.jsx$/.test(e.name) ? [p] : [];
});
const rel = (p) => path.relative(SRC, p).split(path.sep).join('/');

// Props-Objekt jedes createElement('button', {...}) (Klammern gezählt).
const knopfProps = (src) => {
  const out = [];
  const re = /createElement\('button',\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length, tiefe = 1;
    while (i < src.length && tiefe > 0) { if (src[i] === '{') tiefe++; else if (src[i] === '}') tiefe--; i++; }
    out.push({ zeile: src.slice(0, m.index).split('\n').length, text: src.slice(m.index, i) });
  }
  return out;
};

describe('Knopfarten: der Baustein', () => {
  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: Hauptknopf Sand, Neben und Link sandDeep, Gefahr roseDeep, alles 6 px`, () => {
      expect(KNOPF_RADIUS).toBe('6px');
      for (const art of ['haupt', 'neben', 'gefahr', 'leise']) expect(knopfStil(p, art).borderRadius).toBe('6px');
      expect(knopfStil(p, 'haupt')).toMatchObject({ background: p.sand, color: p.onSand });
      expect(knopfStil(p, 'neben')).toMatchObject({ background: 'transparent', color: p.sandDeep, border: '1px solid ' + p.sandDeep });
      expect(knopfStil(p, 'gefahr')).toMatchObject({ color: p.roseDeep, border: '1px solid ' + p.roseDeep });
      expect(knopfStil(p, 'gefahr', { gefuellt: true })).toMatchObject({ background: p.roseBtn, color: '#fff' });
      expect(linkStil(p)).toMatchObject({ color: p.sandDeep, textDecoration: 'underline' });
      expect(auswahlStil(p, true)).toMatchObject({ background: p.sand, color: p.onSand, borderRadius: '6px' });
      expect(knopfStil(p, 'haupt').minHeight).toBe('44px');
    });
  }
});

describe('Knopfarten: die Ansichten', () => {
  it('Grün ist keine Knopffarbe mehr (kein palette.sageBtn ausserhalb der Farbtafel)', () => {
    const treffer = dateien(SRC).filter((d) => /palette\.sageBtn/.test(fs.readFileSync(d, 'utf8'))).map(rel);
    expect(treffer).toEqual([]);
  });

  // Erlaubte Rundungen an <button>: die Knopf-Rundung, Reiter oben rund, Kreise für Symbolknöpfe.
  const ERLAUBT = /^(KNOPF_RADIUS|radius\.sm|radius\.sm \+ 'px'|KNOPF_RADIUS \+ ' ' \+ KNOPF_RADIUS \+ ' 0 0'|'50%')$/;
  // Karten und Listenzeilen, die als <button> woanders hinführen (Entscheid M3: bleiben Karten).
  const KARTEN = new Set(['Dashboard.jsx', 'MobileNav.jsx', 'components/Leistungsliste.jsx']);

  it('Textknöpfe sind 6 px rund — keine Pillen, keine anderen Rundungen', () => {
    const verstoesse = [];
    let gezaehlt = 0;
    for (const d of dateien(SRC)) {
      const r = rel(d);
      for (const { zeile, text } of knopfProps(fs.readFileSync(d, 'utf8'))) {
        for (const m of text.matchAll(/borderRadius:\s*([^,}\n]+)/g)) {
          gezaehlt++;
          const wert = m[1].trim();
          if (!ERLAUBT.test(wert) && !KARTEN.has(r)) verstoesse.push(`${r}:${zeile} ${wert}`);
        }
      }
    }
    expect(gezaehlt).toBeGreaterThan(30);
    expect(verstoesse).toEqual([]);
  });
});
