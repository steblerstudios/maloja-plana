// Regressions-Tests für die Anzeige-Logik der Anspruchs-Instrumente
// (Pegel + Prämien-Beleg). Sie prüfen NICHT die Sozialhilfe-/IPV-Berechnung
// selbst (das tun cantonalData/sozialhilfeRechner-Tests), sondern dass die
// Instrumente die berechneten Werte EHRLICH anzeigen — kein Betrag, den der
// Rest der App verneint, keine Zahl, die eine Zusage vortäuscht.
import { describe, it, expect } from 'vitest';
import { sozialhilfePegelState } from '../pegel.js';
import { praemienBelegState } from '../praemienBeleg.js';
import { calculateSozialhilfe, calculateIPV } from '../../config/cantonalData.js';

describe('sozialhilfePegelState — Vermögens-Gate (B1)', () => {
  // ZH, Einperson: Bedarf klar über dem Einkommen → Aufstockung.
  const gapData = {
    basis: { canton: 'ZH' },
    finanzen: { monthlyIncome: 1000 },
    wohnen: { rentAmount: 1500 },
    versicherungen: { kkPremium: 300 },
  };

  it('zeigt im Normalfall die Aufstockung als "gap" mit dem Defizit als Betrag', () => {
    const sh = calculateSozialhilfe(gapData);
    const state = sozialhilfePegelState(gapData);
    expect(sh.deficit).toBeGreaterThan(0);
    expect(sh.vermoegenUeberFreibetrag).toBe(0);
    expect(state.mode).toBe('gap');
    expect(state.amount).toBe(sh.deficit);
  });

  it('behauptet KEINE Aufstockung, wenn Vermögen über dem Freibetrag liegt', () => {
    // Gleicher Bedarf/Defizit wie oben, aber Ersparnisse über dem SKOS-Freibetrag.
    const data = { ...gapData, finanzen: { ...gapData.finanzen, savingsAccount: 30000 } };
    const sh = calculateSozialhilfe(data);
    const state = sozialhilfePegelState(data);
    // Die Berechnung meldet weiterhin ein Defizit …
    expect(sh.deficit).toBeGreaterThan(0);
    expect(sh.vermoegenUeberFreibetrag).toBeGreaterThan(0);
    // … der Pegel darf aber KEINEN Aufstockungs-Betrag zeigen (sonst widerspräche
    // er der Ergebnisliste, die Sozialhilfe bei Vermögen über Freibetrag weglässt).
    expect(state.mode).toBe('vermoegen');
    expect(state.amount).toBe(0);
    expect(state.vermoegenUeber).toBe(sh.vermoegenUeberFreibetrag);
  });

  it('zeigt "covered", wenn das Einkommen den Bedarf erreicht', () => {
    const data = { ...gapData, finanzen: { monthlyIncome: 6000 } };
    const state = sozialhilfePegelState(data);
    expect(state.mode).toBe('covered');
    expect(state.amount).toBe(0);
  });

  it('ist "empty" ohne Miet-Kontext', () => {
    const data = { ...gapData, wohnen: { rentAmount: 0 } };
    expect(sozialhilfePegelState(data).mode).toBe('empty');
  });
});

describe('praemienBelegState — Verbilligung nie über der Prämie (B2)', () => {
  // ZG, Einperson, tiefes Einkommen → hohe IPV; niedrige Prämie eingetragen.
  const base = {
    basis: { canton: 'ZG' },
    finanzen: { monthlyIncome: 500 },
    versicherungen: { kkPremium: 200 },
  };

  it('deckelt die angezeigte Verbilligung auf die eingetragene Prämie', () => {
    const ipv = calculateIPV(base);
    const state = praemienBelegState(base);
    // Voraussetzung des Tests: die rohe IPV liegt hier ÜBER der Prämie …
    expect(ipv.amount).toBeGreaterThan(base.versicherungen.kkPremium);
    // … der Beleg zeigt aber nie mehr als die Prämie (eine Verbilligung senkt die
    // Prämie, ist keine Auszahlung) und „selbst" bleibt bei 0, nie negativ.
    expect(state.mode).toBe('eligible');
    expect(state.verbilligung).toBe(base.versicherungen.kkPremium);
    expect(state.selbst).toBe(0);
    expect(state.verbilligung).toBeLessThanOrEqual(state.praemie);
  });

  it('zeigt bei ausreichender Prämie die volle Verbilligung und den Selbstbehalt', () => {
    const data = { ...base, versicherungen: { kkPremium: 400 } };
    const ipv = calculateIPV(data);
    const state = praemienBelegState(data);
    expect(ipv.amount).toBeLessThan(400);
    expect(state.verbilligung).toBe(ipv.amount);
    expect(state.selbst).toBe(400 - ipv.amount);
  });

  it('ist "nopremium", wenn Anspruch besteht aber keine Prämie erfasst ist', () => {
    const data = { ...base, versicherungen: { kkPremium: 0 } };
    expect(praemienBelegState(data).mode).toBe('nopremium');
  });

  it('ist "over" bei Einkommen über der Grenze', () => {
    const data = { ...base, finanzen: { monthlyIncome: 6000 } }; // 72k/Jahr > 60k ZG-Grenze
    expect(praemienBelegState(data).mode).toBe('over');
  });

  it('ist "empty" ohne Kanton oder Einkommen', () => {
    expect(praemienBelegState({ basis: { canton: '' }, finanzen: { monthlyIncome: 500 } }).mode).toBe('empty');
    expect(praemienBelegState({ basis: { canton: 'ZG' }, finanzen: { monthlyIncome: 0 } }).mode).toBe('empty');
  });
});
