import { describe, it, expect } from 'vitest';
import { calculateDebtStatus, createDebtPlan, calculateBetreibungsRegisterImpact, prioritizeDebts, PLAN_MAX_MONATE } from '../schuldenCalc.js';
import de from '../i18n/de.js';

// Erste Tests für schuldenCalc.js (27.09.2026). Jeder Fall hier war vorher ein Fehler:
// Bezahltes in «Gesamtschulden», Schulden ohne Datum als «bald fällig», Status «Überfällig»
// ignoriert, Plan mit fester Rate und einem Zinssatz, Endlos-Plan, «kritisch» ohne Einkommen.

const HEUTE = '2026-09-27';

describe('calculateDebtStatus', () => {
  const debts = [
    { amount: 100, status: 'open', dueDate: '2026-09-01' },   // Datum vorbei → überfällig
    { amount: 200, status: 'overdue', dueDate: '' },           // Status überfällig, ohne Datum
    { amount: 300, status: 'open', dueDate: '2026-12-31' },    // noch nicht fällig
    { amount: 400, status: 'open', dueDate: '' },              // ohne Datum
    { amount: 500, status: 'paid', dueDate: '2026-01-01' },    // bezahlt
    { amount: 50, status: 'open', dueDate: '2026-02-31' },     // ungültiges Datum → ohne Datum
  ];
  const s = calculateDebtStatus(debts, HEUTE);
  it('Gesamt zählt nur Offenes, Bezahltes separat', () => {
    expect(s.totalDebt).toBe(1050);
    expect(s.paid).toBe(500);
  });
  it('überfällig = Datum vorbei ODER Status «Überfällig»', () => {
    expect(s.overdue).toBe(300);
  });
  it('ohne gültiges Datum ist nicht «bald fällig»', () => {
    expect(s.upcoming).toBe(300);
    expect(s.ohneDatum).toBe(450);
  });
  it('die Teile ergeben das Ganze', () => {
    expect(s.overdue + s.upcoming + s.ohneDatum).toBe(s.totalDebt);
  });
  it('heute fällig ist noch nicht überfällig', () => {
    expect(calculateDebtStatus([{ amount: 10, status: 'open', dueDate: HEUTE }], HEUTE).overdue).toBe(0);
  });
});

describe('createDebtPlan', () => {
  it('ohne Zins: 1200 mit 100/Monat → 12 Monate, keine Zinsen', () => {
    const p = createDebtPlan([{ id: 1, creditor: 'A', amount: 1200, status: 'open' }], 100);
    expect(p).toMatchObject({ machbar: true, monate: 12, zinsTotal: 0 });
  });
  it('je Schuld ihr eigener Satz, bezahlte Schulden zählen nicht', () => {
    const p = createDebtPlan([
      { id: 1, creditor: 'Kredit', amount: 1000, interestRate: 12, status: 'open', category: 'kredit' },
      { id: 2, creditor: 'Alt', amount: 5000, interestRate: 30, status: 'paid' },
    ], 100);
    expect(p.machbar).toBe(true);
    expect(p.monate).toBe(11); // 1 % pro Monat auf 1000, 100 Rate
    expect(p.zinsTotal).toBeGreaterThan(50);
    expect(p.zinsTotal).toBeLessThan(60);
  });
  it('Reihenfolge folgt den Stufen: Miete vor Kredit', () => {
    const p = createDebtPlan([
      { id: 1, creditor: 'Kredit', amount: 300, interestRate: 10, status: 'open', category: 'kredit' },
      { id: 2, creditor: 'Miete', amount: 300, status: 'open', category: 'wohnen' },
    ], 100);
    expect(p.reihenfolge.map(r => r.creditor)).toEqual(['Miete', 'Kredit']);
    expect(p.reihenfolge[0].monat).toBe(3);
  });
  it('Rate deckt nicht einmal die Zinsen → nicht machbar statt Endlos-Plan', () => {
    const p = createDebtPlan([{ id: 1, amount: 100000, interestRate: 12, status: 'open' }], 500);
    expect(p).toEqual({ machbar: false, grund: 'zins', zinsErsterMonat: 1000 });
  });
  it('knapp über den Zinsen → dauert zu lange, ehrlich gemeldet', () => {
    const p = createDebtPlan([{ id: 1, amount: 100000, interestRate: 12, status: 'open' }], 1001);
    expect(p).toEqual({ machbar: false, grund: 'dauer' });
    expect(PLAN_MAX_MONATE).toBe(360);
  });
  it('ohne Rate oder ohne offene Schuld → nichts', () => {
    expect(createDebtPlan([{ id: 1, amount: 100, status: 'open' }], 0)).toBeNull();
    expect(createDebtPlan([{ id: 1, amount: 100, status: 'paid' }], 50)).toBeNull();
  });
});

describe('calculateBetreibungsRegisterImpact', () => {
  it('ohne Einkommen keine Zahl (vorher: geteilt durch 1 → «kritisch»)', () => {
    expect(calculateBetreibungsRegisterImpact([{ amount: 3000 }], 0)).toEqual({ totalDebt: 3000, monatseinkommen: null });
  });
  it('mit Einkommen: wie viele Monatseinkommen, ohne Wertung', () => {
    expect(calculateBetreibungsRegisterImpact([{ amount: 3000 }, { amount: 1500 }], 3000)).toEqual({ totalDebt: 4500, monatseinkommen: 1.5 });
  });
});

describe('prioritizeDebts (Quelle: schuldeninfo.ch 2011, Caritas)', () => {
  it('Miete, Krankenkasse, Alimente, Bussen vor Steuern vor den übrigen', () => {
    const r = prioritizeDebts([
      { id: 1, category: 'kredit', amount: 1, status: 'open' },
      { id: 2, category: 'steuern', amount: 1, status: 'open' },
      { id: 3, category: 'krankenkasse', amount: 1, status: 'open' },
    ]);
    expect(r.map(d => d.tier)).toEqual([1, 2, 3]);
  });
});

describe('Texte Abbau-Plan, Steuern und Raten (27.09.2026)', () => {
  it('Steuer-Hinweis: Schuldzinsen ja (DBG 33), Tilgung nein (DBG 34 Bst. c), Verzugszins offen', () => {
    const txt = de.schulden.steuer.text.sie;
    expect(txt).toContain('DBG Art. 33 Abs. 1 Bst. a');
    expect(txt).toContain('DBG Art. 34 Bst. c');
    expect(txt).toContain('StHG Art. 13 Abs. 1');
    expect(txt).toMatch(/Verzugszinsen .* sagt das Gesetz nicht ausdrücklich/);
  });
  it('Stufen belegt: Bussen mit Begründung, Steuern mit DBG 167 Abs. 4, Quelle im Plan', () => {
    expect(de.schulden.tier1Reason).toContain('ganz bezahlt');
    expect(de.schulden.tier2Reason).toContain('DBG Art. 167 Abs. 4');
    expect(de.schulden.planQuelle).toContain('schuldeninfo.ch');
    expect(de.schulden.planQuelle).toContain('caritas');
  });
  it('Wer dauerhaft zu wenig hat: keine Ratenvereinbarung — im Ablauf und vor dem Ratengesuch', () => {
    expect(de.mahnung.step5Text.sie).toContain('keine Ratenvereinbarungen oder Schuldanerkennungen');
    expect(de.briefe.installmentRequest.hinweis.budget.du).toContain('raten Schuldenberatungen von Ratenvereinbarungen ab');
  });
  it('Wertungen ohne Quelle sind weg', () => {
    expect(de.debtLevels).toBeUndefined();
    expect(de.debtRecommendations).toBeUndefined();
  });
});
