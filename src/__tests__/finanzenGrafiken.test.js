// Fassung 6 (VERGLEICH.md «Geldfluss, Kuchen, Balken … nachentschieden», 24.10.2026 abends):
// Balken, Kuchen und Sankey im Kapitel Finanzen, je eine Frage, alle aus utils/monatsrechnung.js.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ringDaten, Monatsring } from '../components/Monatsring.jsx';
import { GeldflussImKapitel } from '../components/Geldfluss.jsx';
import { ChapterViewComplete } from '../ChapterView.jsx';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { sumAllExpenses } from '../utils/monatsrechnung.js';

const t = createT({ de }, 'de', 'sie');
const palette = LIGHT_PALETTE;
const profil = (finanzen = {}) => ({
  basis: {},
  finanzen: { monthlyIncome: 5000, incomeType: 'netto', groceries: 600, monthlyTax: 400, ...finanzen },
  wohnen: { rentAmount: 1500 },
  versicherungen: { kkPremium: 400 },
});

// F7-K2-2 (Stebler Studios 01.11.2026): Zahl, Balken und Kuchen sind ein Bild.
describe('Monatsring: «Wofür geht es weg?»', () => {
  const ring = (d) => {
    const verplant = sumAllExpenses(d.finanzen, d);
    return { data: d, t, palette, einkommen: Number(d.finanzen.monthlyIncome) || 0, verplant, titel: 'Jeden Monat bleiben', titelJahr: 'Jedes Jahr bleiben', zahl: (Number(d.finanzen.monthlyIncome) || 0) - verplant };
  };
  it('Gruppen = alle Ausgabenposten; ihre Summe sind die Ausgaben, der Rest ist, was bleibt', () => {
    const d = profil();
    const { gruppen, basis, rest } = ringDaten(ring(d));
    expect(gruppen.map((g) => g.key)).toEqual(['wohnen', 'uebriges', 'versicherungen', 'steuern']);
    expect(gruppen.reduce((a, g) => a + g.wert, 0)).toBe(sumAllExpenses(d.finanzen, d));
    expect(basis).toBe(5000);
    expect(rest).toBe(2100);
  });
  it('im Minus: nichts bleibt, gemessen an den Ausgaben', () => {
    const { basis, rest } = ringDaten(ring(profil({ monthlyIncome: 1000 })));
    expect(rest).toBe(0);
    expect(basis).toBe(2900);
  });
  it('Zahl und Anteil in der Mitte, Bereiche mit Betrag, grösster zuerst, Bild für Screenreader stumm', () => {
    const html = renderToStaticMarkup(React.createElement(Monatsring, ring(profil())));
    const klar = html.replace(/<[^>]+>/g, '');
    expect(html).toContain('aria-hidden="true"');
    expect(klar).toContain('Jeden Monat bleibenCHF 2’10042 %');
    // Die Summe macht die Rechnung sichtbar: 5’000 − 2’900 = 2’100.
    expect(klar).toContain('Wofür geht es weg?CHF 2’900');
    expect(klar).toContain('CHF 1’50030 %');
    expect(klar.indexOf('CHF 1’500')).toBeLessThan(klar.indexOf('CHF 600'));
    // Der Balken misst wie der Ring am Einkommen: 1’500 von 5’000.
    expect(html).toContain('width:30%');
  });
  it('geschlossen je Bereich ein Stück im Ring', () => {
    const d = { ...profil(), wohnen: { rentAmount: 1500, utilities: 200 } };
    const html = renderToStaticMarkup(React.createElement(Monatsring, ring(d)));
    expect((html.match(/pathLength/gi) || []).length).toBe(ringDaten(ring(d)).gruppen.length + 1); // + was bleibt
  });
  it('eine Gruppe mit mehreren Posten lässt sich aufklappen, eine mit einem nicht', () => {
    const d = { ...profil(), wohnen: { rentAmount: 1500, utilities: 200 } };
    const html = renderToStaticMarkup(React.createElement(Monatsring, ring(d)));
    expect(html.match(/aria-expanded/g) || []).toHaveLength(1);
  });
});

describe('Sankey: nur mit zwei oder mehr Einnahmequellen', () => {
  const render = (d) => renderToStaticMarkup(React.createElement(GeldflussImKapitel, { data: d, t, palette }));
  it('ein Lohn: kein Fluss', () => {
    expect(render(profil())).toBe('');
  });
  it('Lohn + Familienzulagen: Fluss', () => {
    expect(render(profil({ familienzulagen: 215 }))).not.toBe('');
  });
  it('Lohn + Nebenerwerb (netto): Fluss', () => {
    expect(render(profil({ sideIncome: 800, sideIncomeType: 'netto' }))).not.toBe('');
  });
});
