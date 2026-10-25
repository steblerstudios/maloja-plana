// Fassung 6 (VERGLEICH.md «Geldfluss, Kuchen, Balken … nachentschieden», 24.10.2026 abends):
// Balken, Kuchen und Sankey im Kapitel Finanzen, je eine Frage, alle aus utils/monatsrechnung.js.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { kuchenDaten, KuchenImKapitel } from '../components/Kuchen.jsx';
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

describe('Kuchen: «Wofür geht es weg?»', () => {
  it('Stücke = alle Ausgabenposten + «bleibt»; Summe = Einkommen', () => {
    const d = profil();
    const { stuecke, summe } = kuchenDaten(d, t, palette);
    expect(stuecke.map((s) => s.key)).toEqual(['rent', 'healthInsurance', 'tax', 'groceries', 'bleibt']);
    expect(summe).toBe(5000);
    expect(stuecke.find((s) => s.key === 'bleibt').value).toBe(5000 - sumAllExpenses(d.finanzen, d));
  });
  it('brutto erfasster Lohn: kein Stück «bleibt»', () => {
    const { stuecke } = kuchenDaten(profil({ incomeType: 'brutto' }), t, palette);
    expect(stuecke.some((s) => s.key === 'bleibt')).toBe(false);
  });
  it('im Minus: kein «bleibt», nur die Ausgaben', () => {
    const { stuecke } = kuchenDaten(profil({ monthlyIncome: 1000 }), t, palette);
    expect(stuecke.some((s) => s.key === 'bleibt')).toBe(false);
  });
  it('ohne Ausgaben: nichts', () => {
    expect(renderToStaticMarkup(React.createElement(KuchenImKapitel, { data: { finanzen: {} }, t, palette }))).toBe('');
  });
  it('Liste mit Betrag und Prozent, Bild für Screenreader stumm', () => {
    const html = renderToStaticMarkup(React.createElement(KuchenImKapitel, { data: profil(), t, palette }));
    expect(html).toContain('Ausgaben-Übersicht');
    expect(html).toContain('aria-hidden="true"');
    expect(html.replace(/<[^>]+>/g, '')).toContain('CHF 1’500 · 30 %');
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

describe('Balken unter «Jeden Monat bleiben»: unterteilt', () => {
  it('Wohnen · Versicherungen · Steuern · Übriges mit Legende', () => {
    const kapitel = getChapters(t).find((c) => c.key === 'finanzen');
    const d = profil();
    const html = renderToStaticMarkup(React.createElement(ChapterViewComplete, {
      palette, t, chapter: kapitel, data: d.finanzen, allData: d, onUpdate: () => {}, onUpdateIn: () => {}, onNavigate: () => {},
    }));
    const balken = html.slice(html.indexOf('data-teil="monat-balken"'));
    expect(balken).toContain('Wohnen');
    expect(balken).toContain('Versicherungen');
    expect(balken).toContain('Steuern');
    expect(balken).toContain('Übriges');
    // Wohnen 1’500 von 5’000 Einkommen = 30 % Breite.
    expect(balken).toContain('width:30%');
  });
});
