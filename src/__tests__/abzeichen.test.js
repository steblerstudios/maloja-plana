import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { muenzenBereit } from '../IconKern.jsx';
import { FamilienZeichen, ZEICHEN_BILD, LEITFORMEN } from '../IconAbzeichen.jsx';
import { SEITEN_ZEICHEN, ZEICHEN, LEITFORM_KAPITEL, LEITFORM_AST, seitenBild } from '../config/seitenZeichen.js';
import { ABLAEUFE, SEARCH_VIEWS } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { getBereich } from '../data/lebensbereiche.js';

// Icon-Plan November 2026, Bauplan B3 (Entscheid Stebler Studios 08.11.2026, «Ja, B3 starten»).
// Das Bauteil zeichnet jede Seite aus der Tabelle in B1: Leitform + Abzeichen (voll, leer, Fünfliber).

beforeAll(() => muenzenBereit());
const BEREICH = new Map();
for (const e of [...ABLAEUFE, ...SEARCH_VIEWS, ...WERKZEUGE]) {
  const k = e.key || e.view;
  if (k && k !== 'chapter' && e.bereich) BEREICH.set(k, e.bereich);
}
const zeichne = (view, dunkel = false) => renderToStaticMarkup(React.createElement(FamilienZeichen, seitenBild(view, BEREICH.get(view), dunkel)));
const NOTFALL_ROT = [getBereich('notfall').light, getBereich('notfall').dark];

describe('B3 · jedes Zeichen und jede Leitform ist gezeichnet', () => {
  it('jedes Zeichen aus dem Wörterbuch hat eine Zeichnung (der Fünfliber ist die Finanzen-Leitform)', () => {
    const fehlt = Object.keys(ZEICHEN).filter((z) => z !== 'fuenfliber' && !ZEICHEN_BILD[z]);
    expect(fehlt).toEqual([]);
    expect(Object.keys(ZEICHEN_BILD).filter((z) => !ZEICHEN[z])).toEqual([]);
  });
  it('jede Leitform aus der Tabelle hat eine Zeichnung', () => {
    const alle = new Set([...Object.values(LEITFORM_KAPITEL), ...Object.values(LEITFORM_AST)]);
    expect([...alle].filter((l) => !LEITFORMEN.includes(l))).toEqual([]);
  });
});

describe('B3 · jede Seite, hell und dunkel', () => {
  it('jede Seite der Tabelle wird gezeichnet, mit Abzeichen in der Farbe aus lebensbereiche.js', () => {
    const falsch = [];
    for (const view of Object.keys(SEITEN_ZEICHEN)) {
      for (const dunkel of [false, true]) {
        const b = seitenBild(view, BEREICH.get(view), dunkel);
        const svg = zeichne(view, dunkel);
        if (!svg.startsWith('<svg')) { falsch.push(`${view}: nichts gezeichnet`); continue; }
        if (b.zeichen && !svg.toLowerCase().includes(b.farbe.toLowerCase())) falsch.push(`${view} ${dunkel ? 'dunkel' : 'hell'}: Abzeichen-Farbe fehlt`);
        if (b.zeichen && b.art === 'leer' && b.zeichen !== 'fuenfliber' && !/r="5\.1" fill="none"/.test(svg)) falsch.push(`${view}: leer ohne Ring`);
      }
    }
    expect(falsch).toEqual([]);
  });
  it('Rechts-Auflage: der Arztkoffer ist nie in Notfall-Rot (die Leitform trägt die Kapitelfarbe)', () => {
    const rot = Object.keys(SEITEN_ZEICHEN).filter((v) => seitenBild(v, BEREICH.get(v)).leitform === 'arztkoffer')
      .filter((v) => [false, true].some((d) => NOTFALL_ROT.includes(seitenBild(v, BEREICH.get(v), d).formFarbe)));
    expect(rot).toEqual([]);
  });
  it('jede Stelle hat eigene Masken (zweimal dieselbe Seite = verschiedene ids)', () => {
    const ids = (s) => [...s.matchAll(/<mask id="([^"]+)"/g)].map((m) => m[1]);
    const a = ids(zeichne('kind')); const b = ids(zeichne('kind'));
    expect(a.filter((x) => b.includes(x))).toEqual([]);
  });
});
