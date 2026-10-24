// Spinnennetz der Lebensbereiche in der Fortschritts-Karte (24.10.2026). Gehalten wird:
// eine Achse je Kapitel, oben beginnend; der Wert ist dieselbe Prozentzahl wie in der
// Kapitelzeile (nichts Eigenes gerechnet); leer heisst ruhiger Hinweis statt einer Fläche;
// jeder Achsenname ist ein Knopf mit Kapitelname und Prozent.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LebensbereichNetz, netzPunkt, netzAnteil } from '../components/LebensbereichNetz.jsx';
import { BergDetail } from '../BergDetail.jsx';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  return typeof w === 'string' ? w : (w && w.sie) || k;
};
const KAPITEL = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall']
  .map((key) => ({ key, title: 'Kapitel ' + key, short: key, fields: [] }));
const zeichne = (chapterCompletions) => renderToStaticMarkup(React.createElement(LebensbereichNetz, {
  chapters: KAPITEL, chapterCompletions, chapterAccentColor: {}, onSelectChapter: () => {}, palette, t,
}));

describe('Spinnennetz der Lebensbereiche', () => {
  it('Achse 0 zeigt nach oben, 0 % liegt in der Mitte', () => {
    const [x0, y0] = netzPunkt(0, 7, 1);
    const [xm, ym] = netzPunkt(3, 7, 0);
    expect(Math.round(x0)).toBe(170);
    expect(y0).toBeLessThan(ym);
    expect([Math.round(xm), Math.round(ym)]).toEqual([170, 124]);
  });

  it('Anteil ist auf 0 bis 1 begrenzt, Unlesbares zählt als 0', () => {
    expect(netzAnteil(150)).toBe(1);
    expect(netzAnteil(-5)).toBe(0);
    expect(netzAnteil('x')).toBe(0);
    expect(netzAnteil(40)).toBeCloseTo(0.4);
  });

  it('jeder Achsenname ist ein Knopf mit Kapitelname und Prozent', () => {
    const html = zeichne([100, 50, 20, 0, 0, 10, 80]);
    expect(html.match(/role="button"/g)).toHaveLength(7);
    expect(html).toContain('aria-label="Kapitel wohnen, 50 %"');
    expect(html).toContain(de.fortschritt.netzHinweis);
  });

  it('alles leer: keine Fläche, dafür der ruhige Hinweis', () => {
    const html = zeichne([0, 0, 0, 0, 0, 0, 0]);
    expect(html).toContain(de.fortschritt.netzLeer);
    expect(html).not.toContain('<circle');
  });

  it('kein Rot im Netz', () => {
    const rot = new Proxy({}, { get: (_, k) => (k === 'rose' || k === 'roseDeep' ? '#FF0000' : '#777777') });
    const html = renderToStaticMarkup(React.createElement(LebensbereichNetz, {
      chapters: KAPITEL, chapterCompletions: [0, 10, 20, 30, 40, 50, 60], chapterAccentColor: {}, onSelectChapter: () => {}, palette: rot, t,
    }));
    expect(html).not.toContain('#FF0000');
  });

  it('steht in der Fortschritts-Karte', () => {
    const html = renderToStaticMarkup(React.createElement(BergDetail, {
      palette, t, chapters: KAPITEL, chapterCompletions: [100, 50, 20, 0, 0, 10, 80],
      chapterStatuses: KAPITEL.map(() => 'begonnen'), chapterAccentColor: {}, onSelectChapter: () => {}, lang: 'de',
      mvo: { filled: 0, total: 0, pct: 0, fields: [] },
    }));
    expect(html).toContain(de.fortschritt.netzAria);
  });
});
