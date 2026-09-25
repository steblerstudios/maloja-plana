import { describe, it, expect } from 'vitest';
import { tachoState } from '../data/franchiseTacho.js';
import { gaugeFrac } from '../components/Gauge.jsx';

// franchiseOpt-Form wie aus PraemienOrientierung: tiefe vs. hohe Franchise.
const opt = { lowFra: 300, highFra: 2500, annualSaving: 1400, reserve: 3200, sbMax: 700, breakEven: 1700 };

describe('tachoState: Franchise-Tacho-Zustand', () => {
  it('zeigt nichts ohne franchiseOpt oder ohne belegten Break-even', () => {
    expect(tachoState(null, 500).show).toBe(false);
    expect(tachoState({ ...opt, breakEven: null }, 500).show).toBe(false);
  });

  it('ohne erfasste Kosten → Orientierungsmodus, kein Zeiger', () => {
    const st = tachoState(opt, 0);
    expect(st.show).toBe(true);
    expect(st.mode).toBe('orientation');
    expect(st.needle).toBe(null);
  });

  it('Kosten unter Break-even → Modus below, Zeiger = Kosten (hohe Franchise günstiger)', () => {
    const st = tachoState(opt, 900);
    expect(st.mode).toBe('below');
    expect(st.needle).toBe(900);
    expect(st.high).toBe(2500);
  });

  it('Kosten über Break-even → Modus above (tiefe Franchise wäre günstiger gewesen)', () => {
    const st = tachoState(opt, 2600);
    expect(st.mode).toBe('above');
    expect(st.low).toBe(300);
  });

  it('Kosten genau am Break-even zählen noch als below (nicht schlechterstellen)', () => {
    expect(tachoState(opt, 1700).mode).toBe('below');
  });

  it('Skala ist ein 500er-Vielfaches, mindestens 2000, und deckt Break-even mit Luft', () => {
    const st = tachoState(opt, 0);
    expect(st.scaleMax % 500).toBe(0);
    expect(st.scaleMax).toBeGreaterThanOrEqual(2000);
    expect(st.scaleMax).toBeGreaterThan(opt.breakEven);
  });

  it('sehr hohe Kosten: Skala wächst mit, Zeiger bleibt innerhalb der Skala', () => {
    const st = tachoState(opt, 99999);
    expect(st.needle).toBe(99999);
    expect(st.needle).toBeLessThanOrEqual(st.scaleMax);
  });

  it('negative/ungültige Kosten werden als 0 behandelt', () => {
    expect(tachoState(opt, -50).mode).toBe('orientation');
    expect(tachoState(opt, 'abc').mode).toBe('orientation');
  });
});

describe('gaugeFrac: Skalen-Abbildung des Gauge-Primitivs', () => {
  it('bildet Wert linear auf 0..1 ab und klemmt an den Enden', () => {
    expect(gaugeFrac(0, 0, 100)).toBe(0);
    expect(gaugeFrac(50, 0, 100)).toBe(0.5);
    expect(gaugeFrac(100, 0, 100)).toBe(1);
    expect(gaugeFrac(-20, 0, 100)).toBe(0);
    expect(gaugeFrac(200, 0, 100)).toBe(1);
  });

  it('degeneriertes Intervall (max<=min) → 0 statt NaN', () => {
    expect(gaugeFrac(5, 10, 10)).toBe(0);
  });
});

// ─── Franchise-Kreuz (25.09.2026) ────────────────────────────────────────────
import { kreuzState } from '../data/franchiseTacho.js';
import { berechneFranchise } from '../data/kvgLeistungen.js';

describe('kreuzState: Franchise-Kreuz', () => {
  // Monatsprämien so, dass die Ersparnis der hohen Franchise 1400/Jahr beträgt.
  const optK = { ...opt, lowPremium: 450, highPremium: 450 - 1400 / 12 };
  const gesamt = (fra, p, c) => p * 12 + berechneFranchise(fra, c, 700).eigenanteil;

  it('ohne Monatsprämien kein Kreuz (keine erfundenen Kurven)', () => {
    expect(kreuzState(opt, 500).show).toBe(false);
  });

  it('die Kurven sind die Gesamtkosten und kreuzen sich beim Break-even', () => {
    const st = kreuzState(optK, 900, new Date(2026, 8, 25));
    expect(st.show).toBe(true);
    for (const p of st.kurve) {
      expect(p.tief).toBeCloseTo(gesamt(300, 450, p.c), 6);
      expect(p.hoch).toBeCloseTo(gesamt(2500, optK.highPremium, p.c), 6);
    }
    // links vom Break-even ist die hohe Franchise günstiger, rechts die tiefe
    const links = st.gesamtBei(opt.breakEven - 300), rechts = st.gesamtBei(st.scaleMax);
    expect(links.hoch).toBeLessThan(links.tief);
    expect(rechts.tief).toBeLessThan(rechts.hoch);
  });

  it('Hochrechnung erst ab dem 60. Tag, lokal gezählt', () => {
    expect(kreuzState(optK, 400, new Date(2026, 1, 20)).hochrechnung).toBeNull();   // 20. Feb = Tag 51
    const st = kreuzState(optK, 900, new Date(2026, 8, 25));                           // 25. Sep = Tag 268
    expect(st.hochrechnung).toBe(Math.round(900 * 365 / 268));
    expect(st.scaleMax).toBeGreaterThanOrEqual(st.hochrechnung);
    expect(kreuzState(optK, 0, new Date(2026, 8, 25)).hochrechnung).toBeNull();
  });
});

// ─── Franchise-Vorschlag fürs Dashboard (25.09.2026) ─────────────────────────
import { franchiseVorschlag, franchiseOptimierer, gesundheitskostenBisher } from '../data/franchiseTacho.js';

describe('franchiseVorschlag', () => {
  const optK = { ...opt, lowPremium: 450, highPremium: 450 - 1400 / 12 };
  const sep = new Date(2026, 8, 25); // Tag 268 → Hochrechnung ×365/268

  it('ohne Kosten keine Einschätzung', () => {
    expect(franchiseVorschlag(optK, { costs: 0, eigeneFranchise: 300, heute: sep }).art).toBe('offen');
  });
  it('tiefe Kosten: hohe Franchise günstiger — Wechsel, mit Polster-Hinweis wenn es fehlt', () => {
    const v = franchiseVorschlag(optK, { costs: 400, eigeneFranchise: 300, ersparnisse: 1000, heute: sep });
    expect(v).toEqual({ art: 'wechsel', franchise: 2500, polster: true });
    expect(franchiseVorschlag(optK, { costs: 400, eigeneFranchise: 300, ersparnisse: 5000, heute: sep }).polster).toBe(false);
  });
  it('wer die günstigere schon hat: passt', () => {
    expect(franchiseVorschlag(optK, { costs: 400, eigeneFranchise: 2500, heute: sep }).art).toBe('passt');
  });
  it('entscheidet nach der Hochrechnung, nicht nach «bisher»', () => {
    // bisher 1400 < Break-even 1700, hochgerechnet ≈ 1907 > 1700 → tiefe Franchise günstiger
    const v = franchiseVorschlag(optK, { costs: 1400, eigeneFranchise: 2500, heute: sep });
    expect(v).toEqual({ art: 'wechsel', franchise: 300, polster: false });
  });
});

describe('gemeinsame Rechnung (Prämien-Seite = Instrument)', () => {
  it('franchiseOptimierer findet den Break-even, an dem die hohe Franchise teurer wird', () => {
    const o = franchiseOptimierer([{ franchise: 300, premium: 450 }, { franchise: 2500, premium: 330 }], 'erwachsen');
    expect(o.annualSaving).toBe(1440);
    expect(o.reserve).toBe(3200);
    const k = kreuzState(o, 100, new Date(2026, 8, 25)).gesamtBei;
    expect(k(o.breakEven).hoch).toBeGreaterThan(k(o.breakEven).tief);
    expect(k(o.breakEven - 50).hoch).toBeLessThanOrEqual(k(o.breakEven - 50).tief);
  });
  it('Gesundheitskosten: nur Belege des laufenden Jahres', () => {
    const data = { versicherungen: { kkBelege: [{ datum: '2026-03-01', betrag: 200 }, { datum: '2025-12-30', betrag: 999 }, { betrag: 50 }] } };
    expect(gesundheitskostenBisher(data, new Date(2026, 8, 25))).toBe(250);
  });
});
