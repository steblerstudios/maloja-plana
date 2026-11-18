import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { leistungsKompass, wegeAusProbe, sozialhilfeAnzeige } from '../data/anspruchWege.js';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren, musterKanton } from '../config/__tests__/ipvBelegtSimulieren.js';

// ─────────────────────────────────────────────────────────────
// Behörden · Leistungen, eine Rechnung je Wahrheit (Instrumente-Matrix 10.11.2026, B-R2 und B-R6).
//
// B-R2 Kompass: Die Nadel stand an zwei Orten auf zwei Zählungen. Der Schnellcheck zählte die Wege aus
// data/anspruchWege.js, die Übersicht («Was steht mir zu?») ein eigenes `found{}`. Konkreter Unterschied: Die
// Übersicht liess die EL weg, solange die Einkommensart offen war (Regel von vor dem 03.11.2026, als die EL noch am
// Einkommen hing). Seither genügt der Rentenbezug (checkELEligibility), das Einkommen spielt keine Rolle mehr. Eine
// Rentnerin mit Betrag im Lohnfeld, aber ohne Art, sah also in der Übersicht «weitere Wege» (Nadel Süd) und im
// Schnellcheck «ein möglicher Weg» (Nadel Nord).
//
// B-R6 Sozialhilfe: Der Strich in der Übersicht rechnete seine Lage selbst (Einkommen roh), das Glas in Schnellcheck
// und Lebenssituationen über data/pegel.js (bei einer Lücke das angerechnete Einkommen, SKOS-RL D.2). Jetzt liest der
// Strich dieselben zwei Zahlen wie das Glas.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data }));

// Was die Übersicht anzeigt: den Zustand der Nadel und die Zahl der Wege, aus dem Text unter «Kompass».
const kompassInDerUebersicht = (html) => {
  if (html.includes('instrumente.kompassFoundOne')) return { state: 'found', anzahl: 1 };
  const m = /instrumente\.kompassFound\((\d+)\)/.exec(html);
  if (m) return { state: 'found', anzahl: Number(m[1]) };
  if (html.includes('instrumente.kompassNone')) return { state: 'none', anzahl: 0 };
  return { state: 'idle', anzahl: 0 };
};

// Dieselbe Probe, die beide Orte bauen: das Feld rechnet in netto um, Art netto.
const probeWieImFeld = (data, monthlyIncome) => ({ ...data, finanzen: { ...(data.finanzen || {}), monthlyIncome, incomeType: 'netto' } });

const rentnerinOhneArt = {
  basis: { canton: 'GE', birthDate: '1950-03-01', household: { adults: 1, children: [] } },
  // Betrag im Lohnfeld, aber keine Art: das Feld bleibt leer (EinkommenFeld «offen»).
  finanzen: { monthlyIncome: 2400, employmentType: 'retired', ahvRente: 2100, pkRente: 300 },
  wohnen: { rentAmount: 1300 },
  versicherungen: { kkPremium: 480 },
};

const lohnMitArt = (monthlyIncome) => ({
  basis: { canton: 'GE', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome, incomeType: 'netto' },
  wohnen: { rentAmount: 1000 },
  versicherungen: { kkPremium: 450 },
});

describe('Behörden · Leistungs-Kompass: eine Zählung für Übersicht und Schnellcheck (B-R2)', () => {
  let musterZurueck, zuruecksetzen;
  beforeAll(() => { musterZurueck = musterKanton('GE'); zuruecksetzen = kantoneBelegtSimulieren(['GE']); });
  afterAll(() => { zuruecksetzen(); musterZurueck(); });

  it('leistungsKompass zählt genau die Wege aus wegeAusProbe', () => {
    for (const probe of [probeWieImFeld(rentnerinOhneArt, 0), lohnMitArt(1000), lohnMitArt(3000), lohnMitArt(9000)]) {
      const k = leistungsKompass(probe);
      expect(k.anzahl).toBe(wegeAusProbe(probe).wege.length);
    }
  });

  it('Rentnerin, Einkommensart offen: die Übersicht zeigt dieselbe Nadel wie der Schnellcheck', () => {
    // Voraussetzung: im Schnellcheck zählt die EL (Rentenbezug genügt).
    const probe = probeWieImFeld(rentnerinOhneArt, 0);
    const imSchnellcheck = leistungsKompass(probe);
    expect(wegeAusProbe(probe).wege.map((w) => w.key)).toContain('el');
    expect(imSchnellcheck.state).toBe('found');

    const html = render(rentnerinOhneArt);
    expect(kompassInDerUebersicht(html)).toEqual({ state: imSchnellcheck.state, anzahl: imSchnellcheck.anzahl });
    // Die Zeile, die gezählt wird, steht auch da.
    expect(html).toContain('schnellcheck.el');
  });

  it('Lohn mit Art: Übersicht und Schnellcheck zählen gleich, ob mit oder ohne Wege', () => {
    for (const lohn of [1000, 3000, 9000]) {
      const html = render(lohnMitArt(lohn));
      const k = leistungsKompass(probeWieImFeld(lohnMitArt(lohn), lohn));
      expect(kompassInDerUebersicht(html), 'Lohn ' + lohn).toEqual({ state: k.state, anzahl: k.anzahl });
    }
  });
});

describe('Behörden · Sozialhilfe: der Strich in der Übersicht liest das Glas (B-R6)', () => {
  let musterZurueck, zuruecksetzen;
  beforeAll(() => { musterZurueck = musterKanton('GE'); zuruecksetzen = kantoneBelegtSimulieren(['GE']); });
  afterAll(() => { zuruecksetzen(); musterZurueck(); });

  // Die Übersicht zeigt den Strich, wo kein Betrag steht: Vermögen über dem Freibetrag («zuerst»), Einkommen deckt
  // den Bedarf, oder knapp darüber. Gemessen 11.11.2026: in diesen Fällen sind die Zahlen von Strich und Glas heute
  // gleich (die Rechnung setzt die Lücke bei «Vermögen zuerst» auf 0, dann gilt auch im Glas das rohe Einkommen).
  // Der Test hält fest, dass es so bleibt: der Strich rechnet nicht mehr selbst, er liest das Glas.
  const faelle = {
    'Vermögen zuerst': { ...lohnMitArt(1500), finanzen: { monthlyIncome: 1500, incomeType: 'netto', savingsAccount: 60000 } },
    'Einkommen deckt': lohnMitArt(6000),
    'Lohn knapp darüber': { ...lohnMitArt(3300), finanzen: { monthlyIncome: 3300, incomeType: 'netto', employmentType: 'employed' } },
  };

  it('Voraussetzung: in allen Fällen steht kein Betrag, sondern der Strich', () => {
    for (const [name, data] of Object.entries(faelle)) {
      const sh = calculateSozialhilfe(data);
      expect(sh.eligible && (sh.vermoegenUeberFreibetrag || 0) === 0, name).toBe(false);
      expect(sozialhilfeAnzeige(data), name).not.toBeNull();
    }
  });

  it('der Strich steht dort, wo im Glas das Wasser steht, und die Linie dort, wo im Glas der Bedarf steht', () => {
    for (const [name, data] of Object.entries(faelle)) {
      const glas = sozialhilfeAnzeige(probeWieImFeld(data, data.finanzen.monthlyIncome));
      const html = render(data);
      const max = Math.max(glas.bedarf, glas.income, 1);
      const wasser = /data-teil="soz-strich-einkommen"[^>]*width:([\d.]+)%/.exec(html);
      const linie = /data-teil="soz-strich-bedarf"[^>]*left:calc\(([\d.]+)% - 1px\)/.exec(html);
      expect(wasser, name + ': Strich gezeichnet').not.toBeNull();
      expect(linie, name + ': Linie gezeichnet').not.toBeNull();
      expect(wasser[1], name).toBe((glas.income / max * 100).toFixed(1));
      expect(linie[1], name).toBe((glas.bedarf / max * 100).toFixed(1));
    }
  });
});
