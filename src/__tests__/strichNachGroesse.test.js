import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icons, Icon } from '../IconKern.jsx';
import '../IconSystem.jsx';

// Icon-Plan November 2026, Schritt 4 (docs/ICON-PLAN-2026-11.md). ICON_KONVENTION.md verlangt seit
// Juli: «Massstab ist die optische Strichstärke am Renderpunkt, nicht dieselbe Zahl. Ziel ~1,1–1,4 px.»
// Gebaut war es nie — alle Strich-Icons trugen fest 1,8, also bei 14 px nur ≈ 1,05 px und bei 32 px
// ≈ 2,4 px. Jetzt setzt `Icon` die Strichstärke aus der Grösse.

const wurzel = (html) => html.match(/<svg[^>]*>/)[0];
const istStrichIcon = (name) => {
  const w = wurzel(renderToStaticMarkup(React.createElement(Icons[name])));
  return /fill="none"/.test(w) && /stroke="/.test(w);
};
const STRICH = Object.keys(Icons).filter(istStrichIcon);
const optisch = (name, px) => {
  const w = wurzel(renderToStaticMarkup(React.createElement(Icon, { name, size: px })));
  const sw = Number((w.match(/stroke-width="([\d.]+)"/) || [])[1]);
  return (sw * px) / 24;
};

describe('Strich nach Grösse', () => {
  it('findet die Strich-Icons überhaupt (sonst prüft der Wächter die leere Menge)', () => {
    expect(STRICH.length).toBeGreaterThan(15);
    expect(STRICH).toEqual(expect.arrayContaining(['check', 'kreuz', 'search', 'ordner', 'download']));
  });

  it.each([12, 14, 16, 22, 32])('bei %i px liegt jeder Strich optisch zwischen 1,1 und 1,4 px', (px) => {
    const daneben = STRICH
      .map((n) => [n, optisch(n, px)])
      .filter(([, o]) => !(o >= 1.1 && o <= 1.4))
      .map(([n, o]) => `${n}: ${o.toFixed(2)} px`);
    expect(daneben).toEqual([]);
  });

  it('Flächen-Icons bleiben, wie sie gezeichnet sind', () => {
    // Die ausgestanzten Leitformen (Bauplan B2) nummerieren ihre Maske je Stelle — die Nummer
    // zählt hier nicht, nur die Zeichnung.
    const ohneNummer = (s) => s.replace(/leitform\d+/g, 'leitform');
    const roh = ohneNummer(renderToStaticMarkup(React.createElement(Icons.basis)));
    const imIcon = ohneNummer(renderToStaticMarkup(React.createElement(Icon, { name: 'basis', size: 14 })));
    expect(imIcon).toContain(roh);
  });
});
