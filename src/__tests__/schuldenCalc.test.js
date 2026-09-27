import { describe, it, expect } from 'vitest';
import { calculateDebtStatus, createDebtPlan, calculateBetreibungsRegisterImpact, prioritizeDebts, PLAN_MAX_MONATE, istUeberfaellig, formatVerlustschein } from '../schuldenCalc.js';
import { alsIsoDatum } from '../utils/fristen.js';
import fs from 'node:fs';
import path from 'node:path';
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
    expect(p).toEqual({ machbar: false, grund: 'zins', zinsMonat: 1000 });
  });
  it('Zinsen übersteigen die Rate erst später → trotzdem «reicht nicht für die Zinsen»', () => {
    // Fall des Fach-Prüfers: Miete 20'000 zinslos zuerst, Kredit 20'000 zu 15 % wächst derweil.
    const p = createDebtPlan([
      { id: 1, creditor: 'Miete', amount: 20000, status: 'open', category: 'wohnen' },
      { id: 2, creditor: 'Kredit', amount: 20000, interestRate: 15, status: 'open', category: 'kredit' },
    ], 300);
    expect(p.machbar).toBe(false);
    expect(p.grund).toBe('zins');
    expect(p.zinsMonat).toBeGreaterThanOrEqual(300);
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
  it('bezahlte oder erledigte Betreibungen zählen nicht mit', () => {
    expect(calculateBetreibungsRegisterImpact([{ amount: 3000, status: 'open' }, { amount: 900, status: 'paid' }, { amount: 50, status: 'erledigt' }], 3000).totalDebt).toBe(3000);
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
    // Rückstände mit ihren Folgen begründet, nicht mit der Empfehlung für laufende Rechnungen
    expect(de.schulden.tier1Reason).toContain('OR Art. 257d');
    expect(de.schulden.tier1Reason).toContain('Laufende Rechnungen');
    expect(de.schulden.steuer.text.sie).toContain('StHG Art. 9 Abs. 4');
    expect(de.schulden.steuer.text.sie).toContain('Bei privaten Schulden');
    expect(de.schulden.tier2Reason).toContain('DBG Art. 167 Abs. 4');
    expect(de.schulden.planQuelle).toContain('schuldeninfo.ch');
    expect(de.schulden.planQuelle).toContain('caritas');
  });
  it('Wer dauerhaft zu wenig hat: keine Ratenvereinbarung — im Ablauf und vor dem Ratengesuch', () => {
    expect(de.mahnung.step5Text.sie).toContain('keine Ratenvereinbarungen oder Schuldanerkennungen');
    expect(de.briefe.installmentRequest.hinweis.budget.du).toContain('von Ratenvereinbarungen ab');
  });
  it('Wertungen ohne Quelle sind weg', () => {
    expect(de.debtLevels).toBeUndefined();
    expect(de.debtRecommendations).toBeUndefined();
  });
});

// Fehler aus dem Rundgang 27.09.2026 nachmittags.
describe('istUeberfaellig — eine Regel für Übersicht und Karte', () => {
  it('Fälligkeit vorbei, Status «offen» → überfällig (vorher sagte die Karte «Offen»)', () => {
    expect(istUeberfaellig({ status: 'open', dueDate: '2026-09-10' }, HEUTE)).toBe(true);
  });
  it('der Fälligkeitstag selbst ist noch nicht überfällig', () => {
    expect(istUeberfaellig({ status: 'open', dueDate: HEUTE }, HEUTE)).toBe(false);
  });
  it('bezahlt ist nie überfällig, «Überfällig» ohne Datum schon', () => {
    expect(istUeberfaellig({ status: 'paid', dueDate: '2026-01-01' }, HEUTE)).toBe(false);
    expect(istUeberfaellig({ status: 'overdue' }, HEUTE)).toBe(true);
  });
  it('die Übersicht zählt genau, was die Karte «überfällig» nennt', () => {
    const debts = [
      { status: 'open', dueDate: '2026-09-10', amount: 300 },
      { status: 'overdue', amount: 1840 },
      { status: 'open', dueDate: '2026-10-31', amount: 3200 },
      { status: 'open', amount: 4500 },
    ];
    const karte = debts.filter(d => istUeberfaellig(d, HEUTE)).reduce((s, d) => s + d.amount, 0);
    expect(calculateDebtStatus(debts, HEUTE).overdue).toBe(karte);
    expect(karte).toBe(2140);
  });
  it('die Karte im Schuldenmanager fragt istUeberfaellig, nicht nur den Status', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '..', 'SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/statusLabel = \(d\) => [^\n]*istUeberfaellig\(d\)/);
    expect(q).toMatch(/statusLabel\(debt\)/);
  });
});

describe('Betreibung und Verlustschein — Datum und Status lesbar', () => {
  it('neue Verlustscheine tragen ein ISO-Datum', () => {
    expect(formatVerlustschein({}).date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('alte Einträge «27.9.2026» erscheinen im Datumsfeld', () => {
    expect(alsIsoDatum('27.9.2026')).toBe('2026-09-27');
    expect(alsIsoDatum('2026-09-27')).toBe('2026-09-27');
    expect(alsIsoDatum('31.2.2026')).toBe('');
    expect(alsIsoDatum(undefined)).toBe('');
  });
  it('der Schuldenmanager legt ISO und «open» an, liest alte Werte über alsIsoDatum', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '..', 'SchuldenManager.jsx'), 'utf8');
    expect(q).not.toMatch(/toLocaleDateString\('de-CH'\)/);
    expect(q).not.toMatch(/status: 'active'/);
    expect(q).toMatch(/value: alsIsoDatum\(entry\.registerDate\)/);
    expect(q).toMatch(/value: alsIsoDatum\(entry\.date\)/);
  });
  it('die Knöpfe heissen nach dem, was sie anlegen', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '..', 'SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/handleAddBetreibung[^\n]*t\('schulden\.addBetreibung'\)/);
    expect(q).toMatch(/handleAddVerlustschein[^\n]*t\('schulden\.addVerlustschein'\)/);
    expect(de.schulden.addBetreibung).toBe('Betreibung erfassen');
  });
});
