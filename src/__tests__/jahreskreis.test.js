// Jahreskreis in «Was ansteht» (24.10.2026). Gehalten wird: der Ring beginnt oben mit dem
// 1. Januar und läuft im Uhrzeigersinn, Einträge anderer Jahre fallen weg, mehrere Einträge
// am selben Tag liegen nicht aufeinander, und die festen Stichtage kommen nur aus dem,
// was die App schon belegt (KVG-Kündigung nach BAG-Werktagsregel, eigene Steuerfrist).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Jahreskreis, winkelFuerTag, jahreskreisPunkte } from '../components/Jahreskreis.jsx';
import { werktagAmOderDavor } from '../utils/fristen.js';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, params) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  const s = typeof w === 'string' ? w : (w && w.sie) || k;
  return params ? s.replace(/\{(\w+)\}/g, (_, p) => params[p]) : s;
};
const zeichne = (props) => renderToStaticMarkup(React.createElement(Jahreskreis, {
  jahr: 2026, heuteIso: '2026-10-24', eintraege: [], gewaehlterMonat: 9, onMonat: () => {}, locale: 'de-CH', palette, t, ...props,
}));

describe('Jahreskreis', () => {
  it('1. Januar oben, 1. Juli etwa unten, 31. Dezember knapp vor oben', () => {
    expect(winkelFuerTag('2026-01-01', 2026)).toBeLessThan(1);
    expect(winkelFuerTag('2026-07-02', 2026)).toBeCloseTo(180, 0);
    expect(winkelFuerTag('2026-12-31', 2026)).toBeGreaterThan(359);
  });

  it('Schaltjahr: der 31. Dezember bleibt im Kreis', () => {
    expect(winkelFuerTag('2028-12-31', 2028)).toBeLessThan(360);
  });

  it('Einträge anderer Jahre und ohne Datum fallen weg', () => {
    const p = jahreskreisPunkte([{ key: 'a', iso: '2025-05-01' }, { key: 'b', iso: '2026-05-01' }, { key: 'c', iso: '' }], 2026);
    expect(p.map((x) => x.key)).toEqual(['b']);
  });

  it('mehrere Einträge am selben Tag liegen nicht aufeinander', () => {
    const p = jahreskreisPunkte([{ key: 'a', iso: '2026-03-10' }, { key: 'b', iso: '2026-03-10' }], 2026);
    expect(Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y)).toBeGreaterThan(5);
  });

  it('zwölf Monate sind Knöpfe, der gewählte ist gedrückt', () => {
    const html = zeichne({});
    expect(html.match(/role="button"/g)).toHaveLength(12);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it('die Liste trägt Titel und Quelle der festen KVG-Frist', () => {
    const iso = werktagAmOderDavor('2026-11-30');
    const html = zeichne({ eintraege: [{ key: 'k', iso, art: 'frist', farbe: '#777777', titel: de.calendar.jahreskreis.kvgTitle, quelle: de.calendar.jahreskreis.kvgSource }] });
    expect(html).toContain(de.calendar.jahreskreis.kvgTitle);
    expect(html).toContain('KVG Art. 7 Abs. 2');
  });

  it('leeres Jahr: ruhiger Hinweis statt leerer Liste', () => {
    expect(zeichne({ jahr: 2030 })).toContain(de.calendar.jahreskreis.empty);
  });

  it('nur das laufende Jahr zeigt den Heute-Strich', () => {
    expect(zeichne({})).toContain('<line');
    expect(zeichne({ jahr: 2027 })).not.toContain('<line');
  });
});
