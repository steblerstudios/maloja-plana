import { describe, it, expect, onTestFinished, beforeAll, afterAll } from 'vitest';
import { mapTaxFields } from '../taxImport.js';
import { calculateSozialhilfe, calculateIPV } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren, musterKanton } from '../config/__tests__/ipvBelegtSimulieren.js';

// Muster-Kanton (W3, 28.09.2026): GE wird für diese Datei zu einem festen Muster-Kanton ohne Modul —
// sonst brächen die Muster-Erwartungen, sobald GE sein eigenes Modell hat (ipvBelegtSimulieren.js).
let musterZurueck;
beforeAll(() => { musterZurueck = musterKanton('GE'); });
afterAll(() => musterZurueck());


// ─────────────────────────────────────────────────────────────
// Einkommens-Modell: Nebenerwerb (sideIncome) + steuerbares
// Reineinkommen (taxableIncome) als eigenes Feld.
// ─────────────────────────────────────────────────────────────

describe('taxImport: Reineinkommen → taxableIncome (1:1 Jahreswert)', () => {
  it('mappt Reineinkommen nach taxableIncome, NICHT nach monthlyIncome', () => {
    const { matched } = mapTaxFields([{ rawKey: 'Reineinkommen', rawValue: '60000' }]);
    const t = matched.find(m => m.target === 'taxableIncome');
    expect(t).toBeTruthy();
    expect(t.value).toBe(60000);            // 1:1, kein /12
    expect(t.period).toBe('annualRaw');
    expect(matched.some(m => m.target === 'monthlyIncome')).toBe(false);
  });

  it('erkennt steuerbares Einkommen / revenu imposable / reddito imponibile', () => {
    for (const key of ['Steuerbares Einkommen', 'Revenu imposable', 'Reddito imponibile', 'Taxable income']) {
      const { matched } = mapTaxFields([{ rawKey: key, rawValue: '55000' }]);
      expect(matched.some(m => m.target === 'taxableIncome' && m.value === 55000)).toBe(true);
    }
  });
});

describe('taxImport: Nebenerwerb → sideIncome (Jahreswert /12)', () => {
  it('mappt Nebenerwerb monatlich, separat vom Hauptlohn', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Bruttolohn', rawValue: '72000' },
      { rawKey: 'Nebenerwerb', rawValue: '12000' },
    ]);
    expect(matched.find(m => m.target === 'monthlyIncome').value).toBe(6000);
    const side = matched.find(m => m.target === 'sideIncome');
    expect(side.value).toBe(1000);          // 12000 / 12
    expect(side.period).toBe('annual');
  });
});

describe('Berechtigungslogik: Nebenerwerb zählt als Einkommen', () => {
  const base = {
    basis: { canton: 'GE', household: { adults: 1, children: [] } }, // (BS und VD seit 28.09.2026 mit eigenem Modell, darum GE — noch ohne Modul; Musterwerte 60 000 / 3 600 / 7 200 / 1 800)
    finanzen: { monthlyIncome: 2000 },
    wohnen: { rentAmount: 1100, utilities: 100 },
    versicherungen: { kkPremium: 320 },
  };

  it('Sozialhilfe-Defizit sinkt, wenn Nebenerwerb dazukommt', () => {
    const ohne = calculateSozialhilfe(base);
    const mit = calculateSozialhilfe({ ...base, finanzen: { ...base.finanzen, sideIncome: 800 } });
    expect(mit.income).toBe(ohne.income + 800);
    expect(mit.deficit).toBeLessThan(ohne.deficit);
  });

  it('IPV-Beitrag sinkt (oder gleich), wenn Nebenerwerb dazukommt (GE belegt simuliert, E9; bis 23.09.2026 LU, bis 28.09.2026 BS — beide seither mit eigenem Modell, VD ebenso)', () => {
    const zuruecksetzen = kantoneBelegtSimulieren(['GE']);
    onTestFinished(zuruecksetzen);
    const ohne = calculateIPV(base);
    const mit = calculateIPV({ ...base, finanzen: { ...base.finanzen, sideIncome: 800 } });
    expect(ohne.amount).toBeGreaterThan(0);
    expect((mit.amount || 0)).toBeLessThanOrEqual(ohne.amount || 0);
  });
});
