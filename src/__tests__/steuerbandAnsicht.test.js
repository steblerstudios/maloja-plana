import { describe, it, expect, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────
// E37 / K37 · Der Steuerrechner zeigt die Kantons-/Gemeindesteuer nur im geprüften Band.
//
// Kein DOM im Repo: wie in steuerkanton.test.js ersetzt ein kleiner Speicher die
// React-Hooks. useEffect wird gesammelt und nach dem ersten Aufruf ausgeführt, damit
// die Berechnung (calculateTax) wie im Browser in den Zustand fliesst.
//
// Eingaben sind ESTV-Messpunkte (Steuerrechner 2026, Zürich, ledig, ohne Kinder,
// docs/sources/steuerfaktor-band-2026.md): steuerbares Einkommen Bund
//   128 739 bei Brutto 150 000 → ESTV Kantons+Gemeindesteuer 18 912 (im Band)
//    67 927 bei Brutto  80 000 → ESTV Kantons+Gemeindesteuer  7 039 (ausserhalb)
// ─────────────────────────────────────────────────────────────

const zustand = { slots: [], i: 0, effekte: [] };
vi.mock('react', async (importOriginal) => {
  const R = await importOriginal();
  const useState = (init) => {
    const i = zustand.i++;
    if (!(i in zustand.slots)) zustand.slots[i] = typeof init === 'function' ? init() : init;
    return [zustand.slots[i], (v) => { zustand.slots[i] = typeof v === 'function' ? v(zustand.slots[i]) : v; }];
  };
  const useEffect = (fn) => { zustand.effekte.push(fn); };
  const gemockt = { ...R, useState, useEffect, useId: () => 'id' };
  return { ...gemockt, default: gemockt };
});

// useIsMobile hängt im Effekt einen resize-Listener an — ohne DOM ein stummer Ersatz.
globalThis.window ??= { innerWidth: 1024, addEventListener: () => {}, removeEventListener: () => {} };

const { TaxCalculator } = await import('../TaxCalculator.jsx');
const { LabeledField } = await import('../components/LabeledField.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
  knoten(kinder, out);
  return out;
};
const texte = (alle) => alle.map((k) => k.props.children).flat().filter((c) => typeof c === 'string').join('\n');

const zeige = (steuerbar, { kinder = [] } = {}) => {
  const data = { basis: { canton: 'ZH', household: { adults: 1, children: kinder } }, finanzen: { taxableIncome: steuerbar }, versicherungen: {} };
  zustand.slots = [];
  const render = () => {
    zustand.i = 0;
    zustand.effekte = [];
    return knoten(TaxCalculator({ palette, t, data, onSave: () => {}, onNavigate: () => {} }));
  };
  render();
  zustand.effekte.forEach((fn) => fn());
  const alle = render();
  return { alle, text: texte(alle), orientierung: alle.find((k) => k.props['data-testid'] === 'kantonssteuer-orientierung') };
};

describe('E37 · Steuerrechner, Kanton Zürich, ledig', () => {
  it('im Band (steuerbar 128 739): Kantonszahl als grobe Schätzung, höchstens ±15 % neben ESTV 18 912', () => {
    const v = zeige(128739);
    expect(v.orientierung).toBeUndefined();
    expect(v.text).toContain('tax.roughEstimateBadge');
    expect(v.text).toContain('tax.totalEstimate');
    expect(v.text).toMatch(/tax\.basedOnHauptort\(117.801\|165.219\|15\|2026\)/);
    // Beträge in Anzeige-Reihenfolge: Bundessteuer, Kantons-/Gemeindesteuer, Gesamt.
    const betraege = v.text.split('\n').filter((z) => /^~ CHF \d+$/.test(z)).map((z) => Number(z.slice(6)));
    expect(betraege).toHaveLength(3);
    const [bund, kantonal, total] = betraege;
    expect(total).toBe(bund + kantonal);
    expect(Math.abs(kantonal / 18912 - 1)).toBeLessThanOrEqual(0.15);
    expect(v.text).not.toContain('tax.netIncomeFederalOnly');
  });

  it('ausserhalb (steuerbar 67 927): keine Kantonszahl, Weg zum ESTV-Rechner und zur Steuerverwaltung', () => {
    const v = zeige(67927);
    expect(v.orientierung).toBeDefined();
    expect(v.text).toContain('tax.bandOutside(117');
    expect(v.text).not.toContain('tax.roughEstimateBadge');
    expect(v.text).not.toContain('tax.totalEstimate');
    const links = v.alle.filter((k) => k.type === 'a').map((k) => k.props.href);
    expect(links).toContain('https://swisstaxcalculator.estv.admin.ch/');
    expect(links).toContain('https://www.zh.ch/de/steuern-finanzen/steuern.html');
    expect(v.text).toContain('tax.netIncomeFederalOnly');
  });

  it('mit Kind (steuerbar 128 739): kein gemessenes Band → keine Kantonszahl', () => {
    const v = zeige(128739, { kinder: [{ age: 5 }] });
    expect(v.orientierung).toBeDefined();
    expect(v.text).toContain('tax.bandNotChecked');
    expect(v.text).not.toContain('tax.roughEstimateBadge');
  });
});
