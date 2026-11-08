import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { Icons, muenzenBereit } from '../IconKern.jsx';
import '../IconSystem.jsx';

// Icon-Plan November 2026, Bauplan B2 (Entscheid Stebler Studios 07.11.2026, «Ja, B2 starten»).
// Leitformen in der Stufe «mittel», ausgestanzt; Kapitel Gesundheit = Arztkoffer; Ast Notfall = Herz
// mit Puls; Edelweiss-Stern statt Kreuz; Auflagen der Rechts-Prüfung vom 07.11.2026.

const SRC = resolve(__dirname, '..');
const zeichne = (name) => renderToStaticMarkup(React.createElement(Icons[name]));
// Die Leitformen kommen wie die Münzen nachgeladen (IconMuenzen.jsx); gezeichnet wird nach dem Laden.
beforeAll(() => muenzenBereit());
const NEU = ['basis', 'basisFamilie', 'ausbildung', 'helm', 'notfall', 'herzPuls', 'versicherungen'];

describe('B2 · Leitformen ausgestanzt', () => {
  it('die Leitformen malen kein «white» — helle Details sind Löcher, der Hintergrund scheint durch', () => {
    const falsch = NEU.filter((n) => /white|#fff/i.test(zeichne(n).replace(/<mask[\s\S]*?<\/mask>/g, '')));
    expect(falsch).toEqual([]);
  });
  it('jede Stelle bekommt ihre eigene Maske (zweimal gezeichnet = zwei ids)', () => {
    const zwei = renderToStaticMarkup(React.createElement('div', null,
      React.createElement(Icons.notfall, { key: 1 }), React.createElement(Icons.notfall, { key: 2 })));
    const ids = [...zwei.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
  });
  it('Edelweiss-Stern: acht Blätter, jedes um die Blütenmitte gedreht (vorher ergab es ein Kreuz)', () => {
    const svg = zeichne('versicherungen');
    const drehungen = [...svg.matchAll(/transform="translate\(12 12\.5\) scale\(1\.12\) rotate\(([\d.]+)\)"/g)].map((m) => Number(m[1]));
    expect(drehungen).toEqual([22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]);
  });
});

describe('B2 · Rechts-Auflagen (Rechts-Prüfung 07.11.2026)', () => {
  it('das Thema Versicherung trägt dasselbe Edelweiss-Schild — kein Kreuz im Schild (WSchG Art. 2/8)', () => {
    expect(Icons.insurance).toBeDefined();
    const ohneIds = (s) => s.replace(/ id="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '');
    expect(ohneIds(zeichne('insurance'))).toBe(ohneIds(zeichne('versicherungen')));
    expect(readFileSync(join(SRC, 'IconKern.jsx'), 'utf8')).not.toMatch(/Swiss cross/i);
  });
  it('der Arztkoffer (Icon «notfall») wird nirgends als Seiten-, Kachel- oder Kopf-Zeichen verwendet — dort steht das Herz mit Puls, nie ein roter Koffer', () => {
    const dateien = [];
    const lauf = (d) => readdirSync(d).forEach((f) => {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (f !== '__tests__' && f !== 'i18n') lauf(p); } else if (/\.(jsx?|mjs)$/.test(f)) dateien.push(p);
    });
    lauf(SRC);
    const muster = /(icon|ikon|name)\s*:\s*'notfall'|kachel\([^)]*,\s*'notfall'\s*,|ansichtIkon\([^)]*'notfall'/;
    const treffer = dateien.flatMap((p) => readFileSync(p, 'utf8').split('\n')
      .map((z, i) => [z, i + 1]).filter(([z]) => muster.test(z) && !/chapterKey|chapterIcons|bereich:|kapitel:|key: 'notfall'|notfall: 'notfall'/.test(z))
      .map(([z, i]) => `${p.replace(SRC + '/', '')}:${i}: ${z.trim().slice(0, 90)}`));
    expect(treffer).toEqual([]);
  });
});
