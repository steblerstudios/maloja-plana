import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { FinanzUebersicht, druckAbschnitte } from '../FinanzUebersicht.jsx';
import { BehoerdenDossier } from '../BehoerdenDossier.jsx';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { berechneBundessteuer } from '../data/steuerRechner.js';
import { schaetzeKantonaleSteuer } from '../data/kantonaleSteuerdaten.js';

// ─────────────────────────────────────────────────────────────
// E38 · FinanzUebersicht und BehoerdenDossier nutzen dieselbe Regel wie der Steuerrechner:
// schaetzeKantonaleSteuer() mit Kanton, steuerbarem Einkommen, Zivilstand, Kinderzahl und
// Elterntarif-Bestätigung. Zahl nur, wo die ESTV-Tabelle trägt — sonst keine Kantonszahl.
// Kein Aufrufer hat eine eigene Rechnung.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t, onNavigate: () => {}, chapters: [], ...props }));
const tausender = (n) => { const r = Math.round(n); return r >= 1000 ? r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’') : String(r); };

const profil = ({ canton = 'ZH', monat, verheiratet = false, kinder = 0, elterntarif } = {}) => ({
  basis: { canton, maritalStatus: verheiratet ? 'married' : 'single', household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })) } },
  finanzen: { monthlyIncome: monat },
  wohnen: {},
  versicherungen: {},
  ...(elterntarif === undefined ? {} : { taxData: { elterntarif } }),
});

// Was die eine Regel für dieses Profil sagt — so rechnen beide Seiten.
const erwartet = (p) => {
  const verheiratet = p.basis.maritalStatus === 'married';
  const kinder = p.basis.household.children.length;
  const elterntarif = p.taxData?.elterntarif === true;
  const bund = berechneBundessteuer({ bruttoEinkommen: p.finanzen.monthlyIncome * 12, verheiratet, kinder, elterntarif });
  return { bund, ...schaetzeKantonaleSteuer({ kanton: p.basis.canton, steuerbaresEinkommen: bund.steuerBaresEinkommen, bundessteuer: bund.steuer, verheiratet, kinder, elterntarif }) };
};

const dossierDaten = (p) => {
  const e = erwartet(p);
  return { tax: { total: e.bund.steuer, taxableIncome: e.bund.steuerBaresEinkommen, kantonal: e.kantonal, kantonOhneZahl: !e.kantonal, datenstand: '2026' } };
};

const FAELLE = [
  { name: 'ZH ledig, 5 000/Monat', p: profil({ monat: 5000 }), zahl: true },
  { name: 'VD verheiratet, 2 Kinder, 9 000/Monat', p: profil({ canton: 'VD', monat: 9000, verheiratet: true, kinder: 2 }), zahl: true },
  { name: 'BE alleinerziehend bestätigt, 1 Kind, 6 000/Monat', p: profil({ canton: 'BE', monat: 6000, kinder: 1, elterntarif: true }), zahl: true },
  { name: 'BE ledig mit Kind, ohne Bestätigung', p: profil({ canton: 'BE', monat: 6000, kinder: 1 }), zahl: false },
  { name: 'GE verheiratet, 4 Kinder', p: profil({ canton: 'GE', monat: 9000, verheiratet: true, kinder: 4 }), zahl: false },
  { name: 'ZH ledig, 40 000/Monat (über der Tabelle)', p: profil({ monat: 40000 }), zahl: false },
];

describe('E38 · dieselbe Regel in Finanzübersicht und Behördendossier', () => {
  it.each(FAELLE)('$name', ({ p, zahl }) => {
    const e = erwartet(p);
    expect(Boolean(e.kantonal)).toBe(zahl);

    const fu = render(FinanzUebersicht, { data: p });
    const bd = render(BehoerdenDossier, { data: p });
    const preview = getBehoerdenDossierPreview(p, [], t, dossierDaten(p));
    const steuern = preview.sections.find((s) => s.key === 'steuern');
    const json = generateBehoerdenJSON(p, dossierDaten(p)).calculations.tax;

    if (zahl) {
      const kg = tausender(e.kantonal.kantonalUndGemeinde);
      const total = tausender(e.kantonal.total);
      // Finanzübersicht: Gesamt + Aufteilung, gekennzeichnet, mit Hauptort-Hinweis; keine Orientierung.
      expect(fu).toContain('~ CHF ' + total);
      expect(fu).toContain('tax.cantonalAndMunicipal (tax.roughEstimateBadge): CHF ' + kg);
      expect(fu).toContain('tax.basedOnHauptort(2026)');
      expect(fu).not.toContain('kantonssteuer-orientierung');
      // Dossier (Ansicht, Vorschau, JSON): dieselben Zahlen.
      expect(bd).toContain('CHF ' + kg);
      expect(bd).toContain('CHF ' + total);
      expect(bd).toContain('tax.roughEstimateBadge');
      expect(steuern.rows.map((r) => r.value)).toContain('tax.basedOnHauptort(2026)');
      expect(json.cantonalAndMunicipal).toBe(e.kantonal.kantonalUndGemeinde);
      expect(json.totalEstimate).toBe(e.kantonal.total);
      expect(json.cantonalBasis).toMatch(/ESTV-Steuerrechner 2026, Hauptort .+, ohne Kirchensteuer, grobe Schätzung/);
    } else {
      // Keine Kantonszahl, keine Gesamtsumme — nur Bundessteuer und der Weg zum amtlichen Rechner.
      expect(fu).toContain('(tax.federalOnly)');
      expect(fu).toContain('kantonssteuer-orientierung');
      expect(fu).toContain('href="https://swisstaxcalculator.estv.admin.ch/"');
      expect(fu).not.toContain('tax.roughEstimateBadge');
      expect(bd).not.toContain('tax.totalEstimate');
      expect(bd).toContain('tax.noCantonalFigure');
      expect(steuern.rows.map((r) => r.label)).not.toContain('tax.totalEstimate');
      expect(json.cantonalAndMunicipal).toBeNull();
      expect(json.totalEstimate).toBeNull();
    }
  });

  it('das Dossier rechnet die Bundessteuer mit den Kindern aus dem Haushalt (wie die Finanzübersicht)', () => {
    const p = profil({ canton: 'VD', monat: 9000, verheiratet: true, kinder: 2 });
    const e = erwartet(p);
    expect(e.bund.tarif).toBe('verheiratet');
    expect(e.bund.kinderabzug).toBe(2 * 263);
    expect(render(BehoerdenDossier, { data: p })).toContain('CHF ' + tausender(e.bund.steuer));
    expect(render(FinanzUebersicht, { data: p })).toContain('tax.federalTax: CHF ' + tausender(e.bund.steuer));
  });

  it('Druck der Finanzübersicht: Kennzeichnung und Hinweis bei geschätzter Kantonssteuer', () => {
    const p = profil({ monat: 5000 });
    const e = erwartet(p);
    const w = { income: 5000, canton: 'ZH', taxResult: e.bund, kantonal: e.kantonal, ipv: {}, sozialhilfe: {}, el: {} };
    const html = druckAbschnitte(t, w)[0].zeilen.map((z) => z.html).join('');
    expect(html).toContain('finanzUebersicht.taxes (tax.roughEstimateBadge)');
    expect(html).toContain('tax.basedOnHauptort(2026)');
  });

  it('keiner der Aufrufer rechnet selbst: kein Faktor, kein eigener Tabellenzugriff', () => {
    for (const datei of ['../FinanzUebersicht.jsx', '../BehoerdenDossier.jsx', '../TaxCalculator.jsx', '../dossierGenerator.js']) {
      const code = readFileSync(new URL(datei, import.meta.url), 'utf-8');
      expect(code, datei).not.toMatch(/faktor|kantonssteuerTabelle|steuerfaktorBand/i);
    }
    for (const datei of ['../FinanzUebersicht.jsx', '../BehoerdenDossier.jsx', '../TaxCalculator.jsx']) {
      const code = readFileSync(new URL(datei, import.meta.url), 'utf-8');
      expect(code, datei).toMatch(/schaetzeKantonaleSteuer\(\{ kanton: /);
    }
  });
});
