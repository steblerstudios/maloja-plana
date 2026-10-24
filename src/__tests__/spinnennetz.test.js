// Spinnennetz (24.10.2026), seit dem Umzug im Kapitel Versicherungen. Gehalten wird:
// Achse 0 oben, Anteile auf 0..1 begrenzt; leer heisst ruhiger Hinweis statt einer Fläche;
// jeder Achsenname ist ein Knopf; kein Rot. Im Kapitel: eine Achse je Abschnitt, jeder
// Abschnitt hat einen kurzen Namen (sonst stünde der lange Titel im Bild), und der Wert ist
// der Anteil erledigter Felder — dieselbe Regel wie überall («trifft nicht zu» zählt mit).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Spinnennetz, netzPunkt, netzAnteil } from '../components/Spinnennetz.jsx';
import { versicherungsAchsen, ABSCHNITT_VON_FELD, VersicherungsNetz } from '../components/VersicherungsNetz.jsx';
import { BergDetail } from '../BergDetail.jsx';
import { getChapters } from '../config/constants.js';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  return typeof w === 'string' ? w : (w && w.sie) || k;
};
const achsen = (werte) => werte.map((a, i) => ({ key: 'a' + i, kurz: 'Achse ' + i, aria: 'Achse ' + i + ', ' + Math.round(a * 100) + ' %', anteil: a }));
const zeichne = (werte, pal = palette) => renderToStaticMarkup(React.createElement(Spinnennetz, {
  achsen: achsen(werte), onAchse: () => {}, ariaLabel: 'Netz', hinweis: 'HINWEIS', leerText: 'LEER', palette: pal,
}));
const versicherungen = () => getChapters(t).find((c) => c.key === 'versicherungen');

describe('Spinnennetz', () => {
  it('Achse 0 zeigt nach oben, 0 liegt in der Mitte', () => {
    const [x0, y0] = netzPunkt(0, 6, 1);
    const [xm, ym] = netzPunkt(3, 6, 0);
    expect(Math.round(x0)).toBe(180);
    expect(y0).toBeLessThan(ym);
    expect([Math.round(xm), Math.round(ym)]).toEqual([180, 124]);
  });

  it('Anteil ist auf 0 bis 1 begrenzt, Unlesbares zählt als 0', () => {
    expect(netzAnteil(1.5)).toBe(1);
    expect(netzAnteil(-0.2)).toBe(0);
    expect(netzAnteil('x')).toBe(0);
    expect(netzAnteil(0.4)).toBeCloseTo(0.4);
  });

  it('jeder Achsenname ist ein Knopf, der Hinweis steht darunter', () => {
    const html = zeichne([1, 0.5, 0.2, 0, 0, 0.1]);
    expect(html.match(/role="button"/g)).toHaveLength(6);
    expect(html).toContain('aria-label="Achse 1, 50 %"');
    expect(html).toContain('HINWEIS');
  });

  it('alles leer: keine Fläche, dafür der ruhige Hinweis', () => {
    const html = zeichne([0, 0, 0, 0, 0, 0]);
    expect(html).toContain('LEER');
    expect(html).not.toContain('<circle');
  });

  it('kein Rot im Netz', () => {
    const rot = new Proxy({}, { get: (_, k) => (k === 'rose' || k === 'roseDeep' ? '#FF0000' : '#777777') });
    expect(zeichne([0, 0.1, 0.2, 0.3, 0.4, 0.5], rot)).not.toContain('#FF0000');
  });

  it('steht nicht mehr in der Fortschritts-Karte des Dashboards', () => {
    const html = renderToStaticMarkup(React.createElement(BergDetail, {
      palette, t, chapters: [{ key: 'basis', title: 'Basis', fields: [] }], chapterCompletions: [50],
      chapterStatuses: ['begonnen'], chapterAccentColor: {}, onSelectChapter: () => {}, lang: 'de',
      mvo: { filled: 0, total: 0, pct: 0, fields: [] },
    }));
    expect(html).not.toContain('role="group"');
  });
});

describe('Spinnennetz im Kapitel Versicherungen', () => {
  it('jeder Abschnitt des Kapitels hat einen kurzen Achsennamen', () => {
    const a = versicherungsAchsen(versicherungen(), {}, t);
    expect(a.length).toBeGreaterThanOrEqual(3);
    for (const achse of a) expect(Object.keys(ABSCHNITT_VON_FELD)).toContain(achse.key);
    expect(a.map((x) => x.kurz)).toEqual(Object.values(de.chapters.versicherungen.netz.achse));
  });

  it('Wert = Anteil erledigter Felder, «trifft nicht zu» zählt mit', () => {
    const kapitel = versicherungen();
    const basis = versicherungsAchsen(kapitel, {}, t)[0];
    expect(basis.anteil).toBe(0);
    const d = { kkInsurer: 'Musterkasse', _na: ['kkModel'] };
    const n = kapitel.fields.findIndex((f) => f.k === 'bvgInsurer');
    expect(versicherungsAchsen(kapitel, d, t)[0].anteil).toBeCloseTo(2 / n);
  });

  it('zeigt den ehrlichen Hinweis: wie viel eingetragen ist, nicht wie gut versichert', () => {
    const html = renderToStaticMarkup(React.createElement(VersicherungsNetz, {
      chapter: versicherungen(), data: { kkInsurer: 'Musterkasse' }, onAbschnitt: () => {}, palette, tr: t,
    }));
    expect(html).toContain(de.chapters.versicherungen.netz.hinweis.sie);
    expect(html).toContain('aria-label="Grundversicherung');
  });
});
