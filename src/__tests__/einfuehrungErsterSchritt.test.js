import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { Tour } from '../Tour.jsx';
import { naechsterSchritt, grundordnung } from '../utils/vollstaendigkeit.js';

// Tester-Rückmeldung 24.09.2026: nach der Einführung «ok und jetzt…? wo fang ich an».
// Der nächste Schritt stand schon auf der Übersicht («Was ist jetzt dran?»), aber
// Einführung und Rundgang endeten beide auf «Los geht's», ohne ihn zu zeigen.
// Zusage: der Rundgang endet AM ersten Schritt, und sein letzter Knopf öffnet ihn.

const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const palette = new Proxy({}, { get: () => '#000' });
const t = (k, v) => (v && v.name ? k + ':' + v.name : k);

const chapters = [
  { key: 'basis', title: 'Persönliche Basis', fields: [
    { k: 'firstName', label: 'Vorname', mvo: true },
    { k: 'hobby', label: 'Hobby' },
    { k: 'canton', label: 'Kanton', mvo: true },
  ] },
  { key: 'wohnen', title: 'Wohnen', fields: [{ k: 'miete', label: 'Miete', mvo: true }] },
];

describe('naechsterSchritt — eine Quelle für Übersicht und Rundgang', () => {
  it('nennt das erste offene Grundordnungs-Feld, nicht ein empfohlenes', () => {
    const s = naechsterSchritt(chapters, { basis: { firstName: 'A' } });
    expect(s.label).toBe('Kanton');
    expect(s.chapterIdx).toBe(0);
  });

  it('springt ins nächste Kapitel, wenn das erste erledigt ist', () => {
    const s = naechsterSchritt(chapters, { basis: { firstName: 'A', canton: 'BS' } });
    expect(s.label).toBe('Miete');
    expect(s.chapterIdx).toBe(1);
  });

  it('ist null, wenn die Grundordnung steht (kein erfundener Schritt)', () => {
    expect(naechsterSchritt(chapters, { basis: { firstName: 'A', canton: 'BS' }, wohnen: { miete: 1 } })).toBeNull();
  });

  it('stimmt mit grundordnung() überein', () => {
    const data = { basis: { canton: 'BS' } };
    expect(naechsterSchritt(chapters, data)).toEqual(grundordnung(chapters, data).fields.find((f) => !f.done));
  });
});

describe('Rundgang — der letzte Knopf führt zum Schritt', () => {
  const letzte = [{ key: 'start' }];

  it('mit abschluss trägt der letzte Knopf den Namen des Schritts, nicht «Fertig»', () => {
    const html = renderToStaticMarkup(React.createElement(Tour, {
      palette, t, steps: letzte, abschluss: { label: 'Mit «Kanton» beginnen', onClick: () => {} },
    }));
    expect(html).toContain('Mit «Kanton» beginnen');
    expect(html).not.toContain('>tour.done<');
  });

  it('ohne abschluss (Grundordnung steht) bleibt es beim ruhigen «Fertig»', () => {
    const html = renderToStaticMarkup(React.createElement(Tour, { palette, t, steps: letzte }));
    expect(html).toContain('>tour.done<');
  });

  it('die letzte Station zeigt auf ein Ziel, das die Übersicht wirklich trägt', () => {
    const main = lies('main.jsx');
    const stationen = main.match(/const TOUR_STEPS = \[([\s\S]*?)\];/)[1];
    const letzteStation = stationen.trim().split('\n').pop();
    const ziel = letzteStation.match(/target: '([^']+)'/)?.[1];
    expect(ziel).toBe('naechster-schritt');
    expect(lies('Dashboard.jsx')).toContain(`'data-tour': '${ziel}'`);
  });

  it('main.jsx reicht dem Rundgang den Schritt aus derselben Quelle weiter', () => {
    expect(lies('main.jsx')).toMatch(/abschluss:[\s\S]{0,120}naechsterSchritt\(chapters, activeData\)/);
  });
});
