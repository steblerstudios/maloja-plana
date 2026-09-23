import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { berechneBundessteuer, bundessteuerAusSteuerbarem } from '../steuerRechner.js';
import { steuernFuerProfil, steuerbaresEinkommenFuerProfil, steuerEingabenAusDaten } from '../kantonaleSteuerdaten.js';

// ─────────────────────────────────────────────────────────────
// E39 · Die Bundessteuer rechnet mit demselben steuerbaren Einkommen wie die Kantonstabelle
// (Nettolohn minus die Standardabzüge des ESTV-Steuerrechners).
//
// Erwartungen = `IncomeTaxFed` des ESTV-Steuerrechners 2026 (Spalte bundessteuerEstv) aus
//   docs/sources/steuerfaktor-band-2026.messpunkte.json   (ohne Kinder, 3 536 Punkte)
//   docs/sources/kantonssteuer-kinder-2026.messpunkte.json (1–3 Kinder, 10 608 Punkte)
// Eingabe = Nettolohn laut ESTV zum selben Bruttolohn (nettolohn-abzuege-2026.messpunkte.json).
// ledig mit Kindern = alleinerziehend → Elterntarif (Art. 36 Abs. 2bis DBG) bestätigt.
//
// Toleranz CHF 1: Die ESTV weist die Bundessteuer in ganzen Franken aus (alle Messwerte sind
// ganzzahlig), die App rundet nach Form. 58c-2026 auf 5 Rappen ab. Gemessen liegt die App an
// allen 14 144 Punkten höchstens CHF 0.50 daneben; das steuerbare Einkommen trifft genau.
// ─────────────────────────────────────────────────────────────

const lies = (datei) => JSON.parse(readFileSync(new URL('../../../docs/sources/' + datei, import.meta.url), 'utf-8'));
const ohneKinder = lies('steuerfaktor-band-2026.messpunkte.json');
const mitKindern = lies('kantonssteuer-kinder-2026.messpunkte.json');
const NETTO = new Map(lies('nettolohn-abzuege-2026.messpunkte.json').punkte.map((p) => [p[0], p[1]]));

// [kanton, zivilstand, kinder, brutto, steuerbarBund, bundessteuerEstv]
const PUNKTE = [
  ...ohneKinder.punkte.map((p) => [p[0], p[1], 0, p[2], p[3], p[4]]),
  ...mitKindern.punkte.map((p) => [p[0], p[1], p[2], p[3], p[4], p[5]]),
];

const bundAppFuer = (kanton, zivilstand, kinder, brutto) => steuernFuerProfil({
  kanton,
  nettolohnJahr: NETTO.get(brutto),
  verheiratet: zivilstand === 'verheiratet',
  kinder,
  elterntarif: kinder > 0,
});

describe('E39 · Bundessteuer auf dem Nettolohn-Weg gegen die ESTV', () => {
  it('Spalten der Messdateien wie erwartet', () => {
    expect(ohneKinder.spalten.slice(0, 5)).toEqual(['kanton', 'zivilstand', 'brutto', 'steuerbarBund', 'bundessteuerEstv']);
    expect(mitKindern.spalten.slice(0, 6)).toEqual(['kanton', 'zivilstand', 'kinder', 'brutto', 'steuerbarBund', 'bundessteuerEstv']);
    expect(PUNKTE).toHaveLength(14144);
    expect(PUNKTE.every((p) => Number.isInteger(p[5]))).toBe(true);
  });

  it('an allen 14 144 Messpunkten: steuerbares Einkommen genau, Bundessteuer höchstens CHF 1 daneben', () => {
    const fehler = [];
    for (const [kt, zs, kinder, brutto, steuerbar, estv] of PUNKTE) {
      const r = bundAppFuer(kt, zs, kinder, brutto);
      if (r.steuerbar !== steuerbar || Math.abs(r.bund.steuer - estv) > 1) fehler.push([kt, zs, kinder, brutto, r.steuerbar, steuerbar, r.bund.steuer, estv]);
    }
    expect(fehler).toEqual([]);
  });

  // Feste Stichproben je Zivilstand × Kinderzahl (Kanton egal: die Bundessteuer ist in allen
  // Kantonen gleich), zwei Bruttolöhne. Werte aus den Messdateien abgeschrieben.
  it.each([
    ['ledig', 0, 80000, 71883, 906],
    ['ledig', 0, 150000, 134539, 5014],
    ['ledig', 1, 80000, 71883, 114],
    ['ledig', 1, 150000, 134539, 2744],
    ['ledig', 2, 100000, 89662, 133],
    ['ledig', 3, 150000, 134539, 1337],
    ['verheiratet', 0, 80000, 71883, 452],
    ['verheiratet', 0, 150000, 134539, 3203],
    ['verheiratet', 1, 100000, 89662, 480],
    ['verheiratet', 2, 120000, 107602, 551],
    ['verheiratet', 3, 150000, 134539, 1102],
  ])('%s, %i Kinder, Brutto %i (Nettolohn %i) → ESTV %i', (zs, kinder, brutto, netto, estv) => {
    expect(NETTO.get(brutto)).toBe(netto);
    const quelle = PUNKTE.find((p) => p[0] === 'ZH' && p[1] === zs && p[2] === kinder && p[3] === brutto);
    expect(quelle[5]).toBe(estv);
    const r = bundAppFuer('ZH', zs, kinder, brutto);
    expect(r.quelle).toBe('estv');
    expect(Math.abs(r.bund.steuer - estv)).toBeLessThanOrEqual(1);
    expect(r.bund.tarif).toBe(zs === 'verheiratet' ? 'verheiratet' : kinder > 0 ? 'eltern' : 'alleinstehend');
  });

  // Der Befund aus #182: vorher Nettolohn ohne Abzüge → zu hoch.
  it.each([
    ['ZH ledig', 'ZH', 'ledig', 0, 80000, 1021.85, 906],
    ['ZH alleinerziehend, 1 Kind', 'ZH', 'ledig', 1, 80000, 447, 114],
    ['VD verheiratet, 2 Kinder', 'VD', 'verheiratet', 2, 120000, 1670, 551],
  ])('%s: vorher %d, jetzt ESTV %i', (_, kt, zs, kinder, brutto, vorher, estv) => {
    const v = zs === 'verheiratet';
    const alt = berechneBundessteuer({ bruttoEinkommen: NETTO.get(brutto), verheiratet: v, kinder, elterntarif: kinder > 0 });
    expect(alt.steuer).toBe(vorher);
    const neu = bundAppFuer(kt, zs, kinder, brutto);
    expect(Math.abs(neu.bund.steuer - estv)).toBeLessThanOrEqual(1);
    // Kantonstabelle und Bundessteuer lesen dieselbe Zahl.
    expect(neu.kanton.steuerbar).toBe(neu.steuerbar);
    expect(neu.kanton.kantonal.bundessteuer).toBe(Math.round(neu.bund.steuer));
  });
});

describe('E39 · ein steuerbares Einkommen je Profil', () => {
  it('bundessteuerAusSteuerbarem zieht nichts mehr ab und bezieht den Satz auf den Nettolohn', () => {
    const r = bundessteuerAusSteuerbarem({ steuerbaresEinkommen: 67927, einkommen: 71883 });
    expect(r.steuerBaresEinkommen).toBe(67927);
    expect(r.steuer).toBe(906);
    expect(r.bruttoEinkommen).toBe(71883);
    expect(r.abzuege).toBe(71883 - 67927);
    expect(r.effektiverSatz).toBe(Math.round((906 / 71883) * 10000) / 100);
    expect(bundessteuerAusSteuerbarem({ steuerbaresEinkommen: 67927 }).effektiverSatz).toBe(Math.round((906 / 67927) * 10000) / 100);
  });

  it('direkt eingetragen: unverändert, auch bei Bruttolohn und Partnereinkommen', () => {
    for (const extra of [{}, { einkommensart: 'brutto' }, { partnerEinkommen: 3000, verheiratet: true }]) {
      expect(steuerbaresEinkommenFuerProfil({ nettolohnJahr: 90000, direktSteuerbar: 67927, ...extra })).toEqual({ steuerbar: 67927, quelle: 'direkt', grund: null });
    }
    const r = steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 90000, direktSteuerbar: 67927, partnerEinkommen: 3000 });
    expect(r.bund.steuer).toBe(906);
    // Die Kantonstabelle ist für einen zweiten Verdienst nicht gemessen (E38) — dort bleibt es bei keiner Zahl.
    expect(r.kanton).toMatchObject({ lage: 'ungeprueft', grund: 'partner' });
  });

  it('Bruttolohn: keine Zahl für Bund und Kanton', () => {
    const r = steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 80000, einkommensart: 'brutto' });
    expect(r).toMatchObject({ steuerbar: null, grund: 'brutto', bund: null });
    expect(r.kanton).toMatchObject({ lage: 'ungeprueft', grund: 'brutto' });
  });

  it('verheiratet mit Partnereinkommen: keine Zahl (Art. 9 Abs. 1 und Art. 33 Abs. 2 DBG nicht gemessen)', () => {
    const r = steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 80000, verheiratet: true, partnerEinkommen: 1 });
    expect(r).toMatchObject({ steuerbar: null, grund: 'partner', bund: null });
  });

  it('Konkubinat ohne Kinder: Bundessteuer auf dem eigenen Einkommen, Kanton ohne Zahl', () => {
    const r = steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, partnerEinkommen: 4000 });
    expect(r.quelle).toBe('estv');
    expect(r.bund.steuer).toBe(906);
    expect(r.kanton.grund).toBe('partner');
  });

  it('nicht verheiratet mit Partnereinkommen und Kindern: keine Zahl (Kinderabzug kann hälftig sein, Art. 35 Abs. 1 lit. a DBG)', () => {
    expect(steuernFuerProfil({ nettolohnJahr: 71883, partnerEinkommen: 4000, kinder: 1, elterntarif: true })).toMatchObject({ bund: null, grund: 'partner' });
  });

  it('mehr als 3 Kinder: Bundessteuer ja (Abzüge je Kind), Kantonstabelle nein', () => {
    const r = steuernFuerProfil({ kanton: 'GE', nettolohnJahr: 134539, verheiratet: true, kinder: 4 });
    expect(r.steuerbar).toBe(134539 - 4000 - 3700 - 4 * 700 - 2800 - 4 * 6800);
    expect(r.bund).not.toBeNull();
    expect(r.kanton.kantonal).toBeNull();
  });

  it('ohne Lohn: keine Bundessteuer-Zahl', () => {
    expect(steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 0 })).toMatchObject({ bund: null, grund: 'keinLohn' });
  });

  it('selbst erfasste Abzüge wirken auf Bund und Kanton gleich', () => {
    const r = steuernFuerProfil({ kanton: 'ZH', nettolohnJahr: 71883, berufsauslagen: 5000, weitereAbzuege: 7258 });
    expect(r.steuerbar).toBe(71883 - 5000 - 1800 - 7258);
    expect(r.bund.steuerBaresEinkommen).toBe(r.steuerbar);
    expect(r.kanton.steuerbar).toBe(r.steuerbar);
  });

  it('Profil-Eingaben: Nebenerwerb zählt zum Nettolohn, Bruttolohn im Nebenerwerb sperrt wie im Hauptlohn', () => {
    const basis = { basis: { canton: 'ZH', maritalStatus: 'married', household: { adults: 2, children: [{ age: 8 }], partnerIncome: 0 } } };
    const e = steuerEingabenAusDaten({ ...basis, finanzen: { monthlyIncome: 5000, sideIncome: 1000, taxableIncome: '' }, taxData: { workCosts: 3000, pension3a: 7258, elterntarif: true } });
    expect(e).toMatchObject({ kanton: 'ZH', nettolohnJahr: 72000, direktSteuerbar: 0, einkommensart: null, verheiratet: true, kinder: 1, elterntarif: true, berufsauslagen: 3000, weitereAbzuege: 7258 });
    expect(steuerEingabenAusDaten({ ...basis, finanzen: { monthlyIncome: 5000, sideIncome: 1000, sideIncomeType: 'brutto', incomeType: 'netto' } }).einkommensart).toBe('brutto');
    expect(steuerEingabenAusDaten({ ...basis, finanzen: { monthlyIncome: 5000, sideIncomeType: 'brutto', incomeType: 'netto' } }).einkommensart).toBe('netto');
    expect(steuerEingabenAusDaten({ ...basis, behoerden: { cantoneOfTaxation: 'GE' }, finanzen: { monthlyIncome: 5000 } }).kanton).toBe('GE');
  });
});
