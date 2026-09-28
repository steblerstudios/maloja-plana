// Finanzübersicht, Karten (28.09.2026): die EL-Karte erklärt, warum kein Anspruch besteht, und
// führt zur EL-Seite; der Armutsgrenzen-Befund rechnet mit den Einnahmen des ganzen Haushalts —
// derselben Summe wie das Monatsbudget (data/haushaltsEinnahmen.js), nicht mit einer eigenen.
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateSozialhilfe, getHouseholdInfo } from '../config/cantonalData.js';
import FinanzUebersicht from '../FinanzUebersicht.jsx';
import { haushaltsEinnahmen } from '../data/haushaltsEinnahmen.js';
import { berechneArmutsgrenze } from '../data/sozialhilfeRechner.js';
import { DEMO_DATA } from '../config/demoData.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const seite = (d) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: d, onNavigate: () => {} }));

// Eine Person, Zürich, Nettolohn erfasst, Miete bekannt — die Basis, auf der der Befund erscheinen darf.
const allein = (finanzen = {}, rest = {}) => ({
  basis: { canton: 'ZH', maritalStatus: 'single', dateOfBirth: '1992-03-01', ...(rest.basis || {}) },
  finanzen: { monthlyIncome: '1800', incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: '1400' },
  versicherungen: { kkPremium: '350' },
});

// Die Erwartung, unabhängig von der Seite gerechnet: verfügbares Netto (Haushaltssumme − Steuern −
// Prämie) gegen die haushaltsgenaue Armutsgrenze.
const erwartetUnterGrenze = (d) => {
  const sh = calculateSozialhilfe(d);
  const hh = getHouseholdInfo(d);
  const grenze = berechneArmutsgrenze({ grundbedarf: sh.grundbedarf, effektiveWohnkosten: sh.effectiveRent, personenAb16: hh.adults });
  const verfuegbar = haushaltsEinnahmen(d).total - Number(d.finanzen.monthlyTax || 0) - Number(d.versicherungen.kkPremium || 0);
  return grenze > 0 && verfuegbar < grenze;
};

beforeAll(() => { preloadPLZ(); });

describe('EL-Karte der Finanzübersicht', () => {
  it('ohne AHV/IV-Rente: sagt, dass EL nur mit Rente in Frage kommt — nicht «nicht anwendbar»', () => {
    const html = seite(allein());
    expect(html).toContain('sozialhilfe.elOnlyAhvIv');
    expect(html).not.toContain('finanzUebersicht.notApplicable');
  });
  it('mit IV-Rente und knappem Einkommen: möglicher Anspruch', () => {
    const html = seite(allein({ monthlyIncome: '500', ivRente: '1200' }));
    expect(html).toContain('sozialhilfe.elPossible');
  });
  it('ist ein Knopf wie die Nachbarkarten (führt zur EL-Seite)', () => {
    const html = seite(allein());
    const iSozialhilfe = html.indexOf('finanzUebersicht.sozialhilfe<');
    const iEl = html.indexOf('finanzUebersicht.el<');
    expect(iSozialhilfe).toBeGreaterThan(-1);
    expect(iEl).toBeGreaterThan(iSozialhilfe);
    // Der letzte Karten-Knopf vor dem EL-Titel muss NACH dem Sozialhilfe-Titel beginnen — sonst
    // gehört er zur Sozialhilfe-Karte und die EL-Karte ist keiner.
    expect(html.lastIndexOf('role="button"', iEl)).toBeGreaterThan(iSozialhilfe);
  });
});

describe('Armutsgrenzen-Befund rechnet mit den Einnahmen des Haushalts', () => {
  it('Nebenerwerb ohne Angabe der Art zählt mit — wie im Monatsbudget', () => {
    const d = allein({ sideIncome: '600' });
    expect(haushaltsEinnahmen(d).total).toBe(2400);
    expect(erwartetUnterGrenze(d)).toBe(true);
    expect(seite(d)).toContain('finanzUebersicht.belowPoverty');
  });
  it('Nebenerwerb ausdrücklich brutto: kein Befund (die Summe ist kein Geld auf dem Konto)', () => {
    const d = allein({ sideIncome: '600', sideIncomeType: 'brutto' });
    expect(haushaltsEinnahmen(d).bruttoDabei).toBe(true);
    expect(seite(d)).not.toContain('finanzUebersicht.belowPoverty');
  });
  it('Partner-Netto hebt den Haushalt über die Grenze: kein Befund', () => {
    const d = allein({}, { basis: { maritalStatus: 'married', household: { adultsList: [{ name: 'P' }], partnerIncome: '3000' } } });
    expect(haushaltsEinnahmen(d).partner).toBe(3000);
    expect(erwartetUnterGrenze(d)).toBe(false);
    expect(seite(d)).not.toContain('finanzUebersicht.belowPoverty');
  });
  it('Befund und Rechnung stimmen für alle vier Fälle überein', () => {
    const faelle = [
      allein(),
      allein({ sideIncome: '600' }),
      allein({ monthlyIncome: '3200' }),
      allein({}, { basis: { maritalStatus: 'married', household: { adultsList: [{ name: 'P' }], partnerIncome: '3000' } } }),
    ];
    for (const d of faelle) {
      expect(seite(d).includes('finanzUebersicht.belowPoverty')).toBe(erwartetUnterGrenze(d));
    }
  });
  it('Beispiel Maria Muster: kein Befund', () => {
    expect(seite(DEMO_DATA)).not.toContain('finanzUebersicht.belowPoverty');
  });
});
