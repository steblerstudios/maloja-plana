import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { FinanzUebersicht, druckAbschnitte } from '../FinanzUebersicht.jsx';
import { BehoerdenDossier } from '../BehoerdenDossier.jsx';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../data/kantonaleSteuerdaten.js';

// ─────────────────────────────────────────────────────────────
// E38 · FinanzUebersicht und BehoerdenDossier nutzen dieselbe Regel wie der Steuerrechner:
// kantonssteuerFuerProfil() mit Steuerkanton, Nettolohn (bzw. direkt eingetragenem steuerbarem
// Einkommen), Einkommensart, Partnereinkommen, Zivilstand, Kinderzahl, Elterntarif-Bestätigung und
// den erfassten Abzügen. Zahl nur, wo die ESTV-Tabelle trägt — sonst keine Kantonszahl.
// Kein Aufrufer hat eine eigene Rechnung.
// E39 · Die Bundessteuer nutzt dasselbe steuerbare Einkommen (steuernFuerProfil).
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t, onNavigate: () => {}, chapters: [], ...props }));
const tausender = (n) => { const r = Math.round(n); return r >= 1000 ? r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’') : String(r); };

// R4: verheiratet ohne Partnerangabe zeigt keine Zahl mehr. Gemessen ist das Alleinverdiener-Ehepaar,
// darum tragen die verheirateten Profile hier das Partnereinkommen 0 ausdrücklich ein.
const profil = ({ canton = 'ZH', monat, verheiratet = false, kinder = 0, elterntarif, incomeType, partnerIncome, steuerkanton } = {}) => ({
  basis: { canton, maritalStatus: verheiratet ? 'married' : 'single', household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome ? { partnerIncome } : verheiratet ? { partnerIncome: '0' } : {}) } },
  finanzen: { monthlyIncome: monat, ...(incomeType ? { incomeType } : {}) },
  ...(steuerkanton ? { behoerden: { cantoneOfTaxation: steuerkanton } } : {}),
  wohnen: {},
  versicherungen: {},
  ...(elterntarif === undefined ? {} : { taxData: { elterntarif } }),
});

// Was die eine Regel für dieses Profil sagt — so rechnen beide Seiten.
const erwartet = (p) => {
  const s = steuernFuerProfil(steuerEingabenAusDaten(p));
  return { bund: s.bund, quelle: s.quelle, ...s.kanton };
};

const dossierDaten = (p) => {
  const e = erwartet(p);
  return { tax: e.bund ? { total: e.bund.steuer, taxableIncome: e.bund.steuerBaresEinkommen, taxableQuelle: e.quelle, kantonal: e.kantonal, kantonOhneZahl: !e.kantonal, datenstand: '2026' } : null };
};

const FAELLE = [
  { name: 'ZH ledig, 5 000/Monat', p: profil({ monat: 5000 }), zahl: true },
  { name: 'VD verheiratet, 2 Kinder, 9 000/Monat', p: profil({ canton: 'VD', monat: 9000, verheiratet: true, kinder: 2 }), zahl: true },
  { name: 'BE alleinerziehend bestätigt, 1 Kind, 6 000/Monat', p: profil({ canton: 'BE', monat: 6000, kinder: 1, elterntarif: true }), zahl: true },
  { name: 'BE ledig mit Kind, ohne Bestätigung', p: profil({ canton: 'BE', monat: 6000, kinder: 1 }), zahl: false },
  { name: 'GE verheiratet, 4 Kinder', p: profil({ canton: 'GE', monat: 12000, verheiratet: true, kinder: 4 }), zahl: false },
  { name: 'ZH ledig, 40 000/Monat (über der Tabelle)', p: profil({ monat: 40000 }), zahl: false },
  { name: 'ZH verheiratet mit Partnereinkommen', p: profil({ monat: 6000, verheiratet: true, partnerIncome: 3000 }), zahl: false, bund: false },
  { name: 'ZH ledig, Lohn als Bruttolohn erfasst', p: profil({ monat: 6000, incomeType: 'brutto' }), zahl: false, bund: false },
  // K62.1: Konkubinat ohne Kinder = Einzelbesteuerung → Zahl; in BE rechnet die ESTV Konkubinat anders als ledig.
  { name: 'ZH Konkubinat ohne Kinder, Partnereinkommen', p: profil({ monat: 6000, partnerIncome: 3000 }), zahl: true },
  { name: 'BE Konkubinat ohne Kinder, Partnereinkommen', p: profil({ canton: 'BE', monat: 6000, partnerIncome: 3000 }), zahl: false },
  { name: 'Wohnkanton ZH, Steuerkanton GE', p: profil({ monat: 6000, steuerkanton: 'GE' }), zahl: true },
];

describe('E38 · dieselbe Regel in Finanzübersicht und Behördendossier', () => {
  it.each(FAELLE)('$name', ({ p, zahl, bund = true }) => {
    const e = erwartet(p);
    expect(Boolean(e.kantonal)).toBe(zahl);
    expect(Boolean(e.bund)).toBe(bund);

    const fu = render(FinanzUebersicht, { data: p });
    const bd = render(BehoerdenDossier, { data: p });
    const preview = getBehoerdenDossierPreview(p, [], t, dossierDaten(p));
    const steuern = preview.sections.find((s) => s.key === 'steuern');
    const json = generateBehoerdenJSON(p, dossierDaten(p), t).calculations.tax;

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
      // E40: feste Kennung + Text in der App-Sprache (hier der Test-Übersetzer: Schlüssel(Parameter)).
      expect(json.cantonalBasis).toEqual({ code: 'estv_hauptort_ohne_kirchensteuer', text: 'behoerdenDossier.jsonTexte.kantonBasis(2026|' + e.kantonal.hauptort + ')', dataVersion: '2026', hauptort: e.kantonal.hauptort });
    } else if (!bund) {
      // E39: kein steuerbares Einkommen → weder Bundes- noch Kantonszahl; Dossier ohne Steuerteil.
      expect(fu).toContain('tax.noTaxFigure');
      expect(fu).not.toContain('tax.federalOnly');
      expect(fu).toContain('kantonssteuer-orientierung');
      // Bruttolohn: die Begründung steht in der Orientierung darunter (nicht doppelt).
      expect(fu).toContain(p.finanzen.incomeType === 'brutto' ? 'tax.bandNotCheckedBrutto' : 'tax.federalNotCheckedPartner');
      if (p.finanzen.incomeType === 'brutto') expect(fu).not.toContain('tax.federalNotCheckedBrutto');
      expect(bd).not.toContain('tax.federalTax');
      expect(steuern).toBeUndefined();
      expect(json).toBeUndefined();
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
    // E39: steuerbar nach den ESTV-Standardabzügen, nicht der Nettolohn × 12
    expect(e.bund.steuerBaresEinkommen).toBe(108000 - 3240 - 3700 - 1400 - 2800 - 13600);
    expect(render(BehoerdenDossier, { data: p })).toContain('tax.taxableIncomeEstimated');
    expect(render(BehoerdenDossier, { data: p })).toContain('CHF ' + tausender(e.bund.steuerBaresEinkommen));
    expect(e.bund.kinderabzug).toBe(2 * 263);
    expect(render(BehoerdenDossier, { data: p })).toContain('CHF ' + tausender(e.bund.steuer));
    expect(render(FinanzUebersicht, { data: p })).toContain('tax.federalTax: CHF ' + tausender(e.bund.steuer));
  });

  // Der echte Eingabeweg: Nettolohn laut ESTV (docs/sources/nettolohn-abzuege-2026.messpunkte.json)
  // als Monatslohn erfasst, Erwartung = ESTV Kantons- + Gemeindesteuer (kantonssteuer-kinder-2026 bzw.
  // steuerfaktor-band-2026.messpunkte.json), Hauptort, Brutto 80 000 (AG, ZH), 120 000 (VD), 70 000 (BE).
  it.each([
    ['AG', false, 2, 71883, 2274],
    ['ZH', false, 0, 71883, 7039],
    ['VD', true, 2, 107602, 11340],
    ['BE', false, 1, 63063, 5764],
  ])('Eingabeweg Nettolohn: %s verheiratet=%s, %i Kinder, Nettolohn %i → ±3 %% neben ESTV %i', (canton, verheiratet, kinder, netto, estv) => {
    const p = profil({ canton, monat: netto / 12, verheiratet, kinder, elterntarif: kinder > 0 && !verheiratet ? true : undefined });
    const e = erwartet(p);
    expect(e.lage).toBe('innerhalb');
    expect(Math.abs(e.kantonal.kantonalUndGemeinde - estv)).toBeLessThanOrEqual(Math.max(0.03 * estv, 50));
    expect(render(FinanzUebersicht, { data: p })).toContain('CHF ' + tausender(e.kantonal.kantonalUndGemeinde));
    expect(render(BehoerdenDossier, { data: p })).toContain('CHF ' + tausender(e.kantonal.kantonalUndGemeinde));
  });

  // E39: dieselbe Bundessteuer wie im Steuerrechner (kantonssteuerAnsicht.test.js zeigt dort 906 / 114 / 551)
  // und wie die ESTV (IncomeTaxFed, Messdateien); Nettolohn laut ESTV als Monatslohn erfasst.
  it.each([
    ['ZH', false, 0, 71883, 906, 67927],
    ['ZH', false, 1, 71883, 114, 60427],
    ['VD', true, 2, 107602, 551, 82874],
  ])('E39 Bundessteuer: %s verheiratet=%s, %i Kinder, Nettolohn %i → ESTV %i, steuerbar %i', (canton, verheiratet, kinder, netto, estv, steuerbar) => {
    const p = profil({ canton, monat: netto / 12, verheiratet, kinder, elterntarif: kinder > 0 && !verheiratet ? true : undefined });
    const e = erwartet(p);
    expect(e.bund.steuer).toBe(estv);
    expect(e.bund.steuerBaresEinkommen).toBe(steuerbar);
    const fu = render(FinanzUebersicht, { data: p });
    const bd = render(BehoerdenDossier, { data: p });
    expect(fu).toContain('tax.federalTax: CHF ' + tausender(estv) + ' +');
    expect(bd).toContain('CHF ' + tausender(estv) + 'common.perYear');
    expect(bd).toContain('tax.taxableIncomeEstimated');
    expect(bd).toContain('CHF ' + tausender(steuerbar) + '<');
    const json = generateBehoerdenJSON(p, dossierDaten(p), t).calculations.tax;
    expect(json).toMatchObject({ taxableIncome: steuerbar, federalTax: estv });
    expect(json.taxableIncomeBasis).toEqual({ code: 'estv_standardabzuege', text: 'behoerdenDossier.jsonTexte.basisEstv(2026)', dataVersion: '2026' });
  });

  it('Druck der Finanzübersicht: Kennzeichnung und Hinweis bei geschätzter Kantonssteuer', () => {
    const p = profil({ monat: 5000 });
    const e = erwartet(p);
    const w = { income: 5000, canton: 'ZH', taxResult: e.bund, kantonal: e.kantonal, ipv: {}, sozialhilfe: {}, el: {} };
    const html = druckAbschnitte(t, w)[0].zeilen.map((z) => z.html).join('');
    expect(html).toContain('finanzUebersicht.taxes (tax.roughEstimateBadge)');
    expect(html).toContain('tax.basedOnHauptort(2026)');
    // E39: ohne steuerbares Einkommen (z. B. Bruttolohn) steht «keine Schätzung», kein Betrag.
    const ohne = druckAbschnitte(t, { income: 5000, canton: 'ZH', taxResult: null, steuerOhneZahl: 'brutto', kantonal: null, ipv: {}, sozialhilfe: {}, el: {} })[0].zeilen.map((z) => z.html).join('');
    expect(ohne).toContain('finanzUebersicht.taxes</td><td class="r">tax.noTaxFigure');
  });

  it('keiner der Aufrufer rechnet selbst: kein Faktor, kein eigener Tabellenzugriff', () => {
    for (const datei of ['../FinanzUebersicht.jsx', '../BehoerdenDossier.jsx', '../TaxCalculator.jsx', '../dossierGenerator.js']) {
      const code = readFileSync(new URL(datei, import.meta.url), 'utf-8');
      expect(code, datei).not.toMatch(/faktor|kantonssteuerTabelle|steuerfaktorBand/i);
    }
    for (const datei of ['../FinanzUebersicht.jsx', '../BehoerdenDossier.jsx', '../TaxCalculator.jsx']) {
      const code = readFileSync(new URL(datei, import.meta.url), 'utf-8');
      expect(code, datei).toMatch(/steuernFuerProfil\(/);
      expect(code, datei).not.toMatch(/schaetzeKantonaleSteuer\(|kantonssteuerFuerProfil\(|berechneBundessteuer\(|steuerbarNachEstv\(/);
    }
  });
});
