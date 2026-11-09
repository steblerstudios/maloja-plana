// Kapitel 3 · Finanzen (Durchgang 09.11.2026; Stebler Studios: «Ja, alles»).
//  F1 · Mindestlohn am Arbeitsort (finanzen.workCanton), leer = Wohnkanton und als Annahme gekennzeichnet
//  F3 · Steuerrechner: gesetzliche Grenzen nur 3a und Weiterbildung (13 000), Eingaben darüber gekappt
//  F10 · Rückerstattungs-Zahl nur mit Zürcher Freibeträgen, also nur für Zürich
import { describe, it, expect } from 'vitest';
import React from 'react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { arbeitsKanton } from '../data/lohnCheck.js';
import { TaxCalculator } from '../TaxCalculator.jsx';
import de from '../i18n/de.js';

const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const t = (k, p) => (p && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

describe('F1 · Arbeitsort', () => {
  it('erfasster Arbeitskanton geht vor, sonst Wohnkanton als Annahme', () => {
    expect(arbeitsKanton({ basis: { canton: 'GE' }, finanzen: { workCanton: 'VD' } })).toEqual({ kanton: 'VD', angenommen: false });
    expect(arbeitsKanton({ basis: { canton: 'GE' }, finanzen: {} })).toEqual({ kanton: 'GE', angenommen: true });
    expect(arbeitsKanton({})).toEqual({ kanton: null, angenommen: true });
  });
  it('Mindestlohn-Check und Lohn-Barometer lesen den Arbeitskanton, nicht basis.canton', () => {
    const kapitel = quelle('../ChapterView.jsx');
    expect(kapitel).toMatch(/const \{ kanton, angenommen: kantonAngenommen \} = arbeitsKanton\(allData\);\s*if \(kanton && kantonHatMindestlohn/);
    expect(quelle('../components/LohnEinordnung.jsx')).toContain('canton: arbeitsKanton(data).kanton');
  });
  it('Feld und Texte vorhanden', () => {
    expect(quelle('../config/constants.js')).toMatch(/k: 'workCanton', type: 'select', options: cantonOptions\(t\)/);
    expect(JSON.stringify(de.lohnCheck.arbeitsortAnnahme)).toContain('{kanton}');
  });
});

describe('F3 · Steuerrechner-Grenzen', () => {
  const html = renderToStaticMarkup(React.createElement(TaxCalculator, {
    palette, t, data: { basis: { canton: 'ZH', maritalStatus: 'single' }, finanzen: { employmentType: 'employed' } }, onSave: () => {},
  }));
  it('nur 3a und Weiterbildung tragen eine Grenze; Weiterbildung 13 000', () => {
    expect(html).toContain('tax.grenze_pension3a(');
    expect(html).toMatch(/tax\.grenze_education\([^)]*13.000/);
    expect(html).not.toContain('Max:');
  });
  it('gekappt wird bei der Eingabe und in der Schätzung (auch gespeicherte Werte)', () => {
    const s = quelle('../TaxCalculator.jsx');
    expect(s).toMatch(/const wert = grenze != null && roh > grenze \? grenze : roh;/);
    expect(s).toMatch(/pension3a: kappe\('pension3a'\), education: kappe\('education'\)/);
  });
});

describe('F10 · Rückerstattung nur Zürich', () => {
  it('die Zahl erscheint nur für ZH, sonst der Kantonshinweis', () => {
    const s = quelle('../SozialhilfeView.jsx');
    expect(s).toContain("rueckKanton !== 'ZH' && React.createElement('div', { role: 'status'");
    expect(s).toContain("rueckKanton === 'ZH' && React.createElement('div', {");
  });
});
