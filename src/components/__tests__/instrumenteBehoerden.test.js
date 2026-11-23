// Behörden bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «Behörden (G + H)»):
// Steuerfrist (Kalenderblatt · Abstand · Satz) und Behördengänge (Kästchen · «1/5» · Satz).
// Dieselben Regeln wie das Kapitel Behörden.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { fristAbstand } from '../../utils/fristAbstand.js';
import { GaengeKlein } from '../BehoerdenInstrument.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', sand: '#c90' };
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const jetzt = new Date(2026, 10, 10, 12).getTime(); // 10.11.2026 mittags

describe('fristAbstand: eine Regel für Kapitel und Kachel', () => {
  it('unter 60 Tagen in Tagen', () => {
    expect(fristAbstand('2026-11-30', jetzt)).toEqual({ tage: 20, n: 20, einheit: 'tage', vorbei: false });
  });
  it('45 Tage bleiben Tage (Grenze 60)', () => {
    expect(fristAbstand('2026-12-25', jetzt)).toMatchObject({ tage: 45, einheit: 'tage' });
  });
  it('ab 60 Tagen in Monaten', () => {
    expect(fristAbstand('2027-03-31', jetzt)).toMatchObject({ einheit: 'monate', n: 5, vorbei: false });
  });
  it('vorbei', () => {
    expect(fristAbstand('2026-11-01', jetzt)).toMatchObject({ tage: -9, n: 9, einheit: 'tage', vorbei: true });
  });
  it('ungültig: nichts', () => {
    expect(fristAbstand('', jetzt)).toBeNull();
  });
  it('das Kapitel nutzt dieselbe Regel', () => {
    expect(quelle('../BehoerdenInstrument.jsx')).toMatch(/const a = fristAbstand\(iso\);/);
  });
});

describe('Behördengänge klein', () => {
  it('ein Kästchen je Gang, erledigte gefüllt, keine Wörter, 64 px', () => {
    const html = renderToStaticMarkup(React.createElement(GaengeKlein, { palette, erledigt: 2, total: 5 }));
    expect(html).toContain('data-gaenge="klein"');
    expect(html).toContain('max-width:64px');
    expect((html.match(/<rect/g) || []).length).toBe(5);
    expect((html.match(/fill="#c90"/g) || []).length).toBe(2);
    expect(html).not.toMatch(/<text/);
  });
});

describe('Kachel-Regeln', () => {
  const panel = quelle('../InstrumentePanel.jsx');
  it('eine erledigte alte Frist zeigt keine Zahl', () => {
    expect(panel).toMatch(/const fristZeigen = fristAb && \(!fristAb\.vorbei \|\| fristVorbei\);/);
  });
  it('Gänge zählen mit derselben Erledigt-Regel wie das Kapitel', () => {
    expect(panel).toMatch(/GAENGE\.filter\(\(g\) => gangErledigt\(g\.id, gespeicherteHaken\(\), bh\)\)/);
  });
  it('Kalenderblatt in der App-Sprache', () => {
    expect(panel).toMatch(/h\(Kalenderblatt, \{ iso: fristIso, palette, locale: blattLocale/);
  });
  it('Behörden steht in der Kapitelzeile', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/behoerden: \['steuerfrist', 'gaenge'\]/);
  });
});
