import { describe, it, expect } from 'vitest';
import {
  CANTON_CODES,
  calculateSozialhilfe,
  calculateIPV,
  checkELEligibility,
  getRentLimit,
  getGrundbedarf,
} from '../cantonalData.js';

// ─────────────────────────────────────────────────────────────
// Persona-Matrix-QA
//
// Idee (Sophies Braindump): "Testpersonen — Mann/Frau Durchschnitt, alle
// Kantone, jede Familienkombi, arm bis reich — als Agenten durch Maloja
// laufen lassen und Fehler suchen: stimmt, was ein-/ausgeblendet und
// gerechnet wird?"
//
// Statt 1000 Browser-Durchläufe prüfen wir hier die *Entscheidungs- und
// Rechenlogik* (die steuert, was eine Person sieht) gegen Invarianten,
// die für JEDE denkbare Person gelten müssen. Bricht eine Invariante,
// haben wir einen echten Fehler gefunden.
// ─────────────────────────────────────────────────────────────

// Haushalts-Archetypen — jede realistische Kombination
const HOUSEHOLDS = {
  single:         { adults: 1, children: [] },
  couple:         { adults: 2, children: [] },
  singleParent1:  { adults: 1, children: [{ age: 5 }] },
  singleParent3:  { adults: 1, children: [{ age: 4 }, { age: 9 }, { age: 14 }] },
  family2k:       { adults: 2, children: [{ age: 3 }, { age: 9 }] },
  family4k:       { adults: 2, children: [{ age: 2 }, { age: 6 }, { age: 10 }, { age: 14 }] },
  largeFamily:    { adults: 2, children: [{ age: 1 }, { age: 3 }, { age: 5 }, { age: 8 }, { age: 11 }, { age: 15 }] },
  retiredSingle:  { adults: 1, children: [], isRetired: true },
  retiredCouple:  { adults: 2, children: [], isRetired: true },
};

// Einkommensstufen (monatlich netto) — arm bis gutverdienend
const INCOMES = [0, 1500, 3500, 5500, 8000, 15000];

function makePersona({ canton, household, monthlyIncome }) {
  const isRetired = Boolean(household.isRetired);
  return {
    basis: {
      canton,
      household: {
        adults: household.adults,
        children: household.children,
        isRetired,
        partnerIncome: household.adults > 1 ? Math.round(monthlyIncome * 0.4) : 0,
      },
    },
    finanzen: {
      monthlyIncome,
      employmentType: isRetired ? 'retired' : 'employed',
      // Rentner: AHV-Rente vorhanden, damit der EL-Pfad geprüft wird
      ahvRente: isRetired ? 1800 : 0,
      savingsAccount: 3000,
    },
    wohnen: { rentAmount: 1400, utilities: 150 },
    versicherungen: { kkPremium: 350 },
  };
}

// Vollständige Matrix einmal materialisieren
const MATRIX = [];
for (const canton of CANTON_CODES) {
  for (const [hhName, household] of Object.entries(HOUSEHOLDS)) {
    for (const monthlyIncome of INCOMES) {
      MATRIX.push({
        id: `${canton}/${hhName}/${monthlyIncome}`,
        canton, hhName, household, monthlyIncome,
        data: makePersona({ canton, household, monthlyIncome }),
      });
    }
  }
}

const finite = (n) => typeof n === 'number' && Number.isFinite(n);

describe('Persona-Matrix: Sozialhilfe-Logik für jede Person plausibel', () => {
  it('liefert nie NaN/undefined und konsistente eligible/deficit-Werte', () => {
    const problems = [];
    for (const p of MATRIX) {
      const r = calculateSozialhilfe(p.data);
      if (![r.grundbedarf, r.effectiveRent, r.rentLimit, r.totalBedarf, r.income, r.deficit].every(finite)) {
        problems.push(`${p.id}: nicht-finite Zahl ${JSON.stringify(r)}`);
        continue;
      }
      if (r.deficit < 0) problems.push(`${p.id}: deficit < 0 (${r.deficit})`);
      if (r.eligible !== (r.deficit > 0)) problems.push(`${p.id}: eligible/deficit inkonsistent (${r.eligible}/${r.deficit})`);
      if (r.effectiveRent > r.rentLimit) problems.push(`${p.id}: effectiveRent > rentLimit`);
      if (r.effectiveRent > 1400 + 150) problems.push(`${p.id}: effectiveRent über tatsächlicher Miete`);
    }
    expect(problems).toEqual([]);
  });

  it('Sozialhilfe-Defizit sinkt monoton mit steigendem Einkommen (arm → reich)', () => {
    const problems = [];
    for (const canton of CANTON_CODES) {
      for (const [hhName, household] of Object.entries(HOUSEHOLDS)) {
        let prev = Infinity;
        for (const monthlyIncome of INCOMES) {
          const r = calculateSozialhilfe(makePersona({ canton, household, monthlyIncome }));
          if (r.deficit > prev + 0.5) {
            problems.push(`${canton}/${hhName}: deficit steigt bei Einkommen ${monthlyIncome} (${r.deficit} > ${prev})`);
          }
          prev = r.deficit;
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('Persona-Matrix: IPV (Prämienverbilligung) für jede Person plausibel', () => {
  it('Betrag/Prozent immer im gültigen Bereich, eligible⇔Betrag>0', () => {
    const problems = [];
    for (const p of MATRIX) {
      const r = calculateIPV(p.data);
      if (!finite(r.amount)) { problems.push(`${p.id}: amount nicht finit`); continue; }
      if (r.amount < 0) problems.push(`${p.id}: amount < 0`);
      if (r.eligible && r.amount <= 0) problems.push(`${p.id}: eligible aber amount<=0`);
      if (!r.eligible && r.amount !== 0) problems.push(`${p.id}: nicht eligible aber amount!=0`);
      if (r.eligible) {
        if (r.reductionPercent < 0 || r.reductionPercent > 100) problems.push(`${p.id}: reductionPercent ausserhalb 0-100 (${r.reductionPercent})`);
        if (r.annual > r.maxAnnual) problems.push(`${p.id}: annual > maxAnnual`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('IPV-Beitrag sinkt monoton mit steigendem Einkommen', () => {
    const problems = [];
    for (const canton of CANTON_CODES) {
      for (const [hhName, household] of Object.entries(HOUSEHOLDS)) {
        let prev = Infinity;
        for (const monthlyIncome of INCOMES) {
          const r = calculateIPV(makePersona({ canton, household, monthlyIncome }));
          const amt = r.amount || 0;
          if (amt > prev) problems.push(`${canton}/${hhName}: IPV steigt bei Einkommen ${monthlyIncome} (${amt} > ${prev})`);
          prev = amt;
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('Persona-Matrix: EL nur für AHV/IV-Beziehende', () => {
  it('Nicht-Rentner sind nie EL-berechtigt, Rentner-Pfad liefert konsistente Werte', () => {
    const problems = [];
    for (const p of MATRIX) {
      const r = checkELEligibility(p.data);
      if (![r.totalIncome, r.totalExpenses].every(finite)) { problems.push(`${p.id}: EL nicht-finit`); continue; }
      const isRetired = Boolean(p.household.isRetired);
      if (!isRetired && r.eligible) problems.push(`${p.id}: Nicht-Rentner als EL-berechtigt markiert`);
      if (!isRetired && r.isAHVIV) problems.push(`${p.id}: Nicht-Rentner als AHV/IV markiert`);
    }
    expect(problems).toEqual([]);
  });
});

describe('Persona-Matrix: Haushalts-Hilfsfunktionen robust für 1–10 Personen', () => {
  it('getGrundbedarf und getRentLimit liefern für jede Grösse positive endliche Werte', () => {
    const problems = [];
    for (let size = 1; size <= 10; size++) {
      const gb = getGrundbedarf(size);
      if (!finite(gb) || gb <= 0) problems.push(`getGrundbedarf(${size})=${gb}`);
      for (const canton of CANTON_CODES) {
        const rl = getRentLimit(canton, size);
        if (!finite(rl) || rl <= 0) problems.push(`getRentLimit(${canton},${size})=${rl}`);
      }
    }
    expect(problems).toEqual([]);
  });
});
