import { describe, it, expect, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────
// E37 / E38 · Der Steuerrechner zeigt die Kantons-/Gemeindesteuer aus der ESTV-Tabelle —
// nur dort, wo sie trägt.
//
// Kein DOM im Repo: wie in steuerkanton.test.js ersetzt ein kleiner Speicher die
// React-Hooks. useEffect wird gesammelt und nach dem ersten Aufruf ausgeführt, damit
// die Berechnung (calculateTax) wie im Browser in den Zustand fliesst.
//
// Erwartungen sind Messpunkte des ESTV-Steuerrechners 2026 (Hauptort, ohne Kirchensteuer;
// docs/sources/steuerfaktor-band-2026.messpunkte.json und kantonssteuer-kinder-2026.messpunkte.json):
//   ZH ledig, Brutto  80 000 → steuerbar Bund  67 927, Bundessteuer   906, K+G  7 039
//   ZH ledig, Brutto 150 000 → steuerbar Bund 128 739, Bundessteuer 5 014, K+G 18 912
//   ZH ledig, Tabelle von steuerbar 13 940 bis 265 539
// __KINDER_KOMMENTAR__
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
const { KantonssteuerOrientierung } = await import('../components/KantonssteuerOrientierung.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
  if (el.type === KantonssteuerOrientierung) kinder = KantonssteuerOrientierung(el.props);
  knoten(kinder, out);
  return out;
};
const texte = (alle) => alle.map((k) => k.props.children).flat().filter((c) => typeof c === 'string').join('\n');

const zeige = (steuerbar, { canton = 'ZH', kinder = 0, verheiratet = false, elterntarif } = {}) => {
  const data = {
    basis: { canton, maritalStatus: verheiratet ? 'married' : 'single', household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })) } },
    finanzen: { taxableIncome: steuerbar },
    versicherungen: {},
    ...(elterntarif === undefined ? {} : { taxData: { elterntarif } }),
  };
  zustand.slots = [];
  const render = () => {
    zustand.i = 0;
    zustand.effekte = [];
    return knoten(TaxCalculator({ palette, t, data, onSave: () => {}, onNavigate: () => {} }));
  };
  render();
  zustand.effekte.forEach((fn) => fn());
  const alle = render();
  const text = texte(alle);
  // Beträge in Anzeige-Reihenfolge: Bundessteuer, Kantons-/Gemeindesteuer, Gesamt.
  const betraege = text.split('\n').filter((z) => /^~ CHF \d+(\.\d+)?$/.test(z)).map((z) => Number(z.slice(6)));
  return { alle, text, betraege, orientierung: alle.find((k) => k.props['data-testid'] === 'kantonssteuer-orientierung') };
};

const imRahmen = (wert, estv) => Math.abs(wert - estv) <= Math.max(0.03 * estv, 50);

const zeigtZahl = (v, estvBund, estvKG) => {
  expect(v.orientierung).toBeUndefined();
  expect(v.text).toContain('tax.roughEstimateBadge');
  expect(v.text).toContain('tax.basedOnHauptort(2026)');
  expect(v.text).toContain('tax.totalEstimate');
  expect(v.text).toContain('tax.bandChecked(2026|16.09.2026)');
  expect(v.text).not.toContain('tax.netIncomeFederalOnly');
  expect(v.betraege).toHaveLength(3);
  const [bund, kantonal, total] = v.betraege;
  expect(Math.abs(bund - estvBund)).toBeLessThanOrEqual(1);
  expect(imRahmen(kantonal, estvKG)).toBe(true);
  expect(total).toBe(Math.round(bund) + kantonal);
};

const zeigtKeineZahl = (v, textKey) => {
  expect(v.orientierung).toBeDefined();
  expect(v.text).toContain(textKey);
  expect(v.text).not.toContain('tax.roughEstimateBadge');
  expect(v.text).not.toContain('tax.totalEstimate');
  expect(v.text).toContain('tax.netIncomeFederalOnly');
  expect(v.alle.filter((k) => k.type === 'a').map((k) => k.props.href)).toContain('https://swisstaxcalculator.estv.admin.ch/');
};

describe('E38 · Steuerrechner, Kanton Zürich, ledig, ohne Kinder', () => {
  it('steuerbar 67 927 (Brutto 80 000): Zahl ±3 % neben ESTV 7 039 — hier zeigte E37 keine Zahl', () => {
    zeigtZahl(zeige(67927), 906, 7039);
  });

  it('steuerbar 128 739 (Brutto 150 000): Zahl ±3 % neben ESTV 18 912', () => {
    zeigtZahl(zeige(128739), 5014, 18912);
  });

  it('über der Tabelle (steuerbar 300 000): keine Kantonszahl, Tabellenbereich genannt, Wege zum Amt', () => {
    const v = zeige(300000);
    zeigtKeineZahl(v, 'tax.bandOutside(13’940|265’539|2026)');
    expect(v.alle.filter((k) => k.type === 'a').map((k) => k.props.href)).toContain('https://www.zh.ch/de/steuern-finanzen/steuern.html');
  });

  it('unter der Tabelle (steuerbar 10 000): keine Kantonszahl', () => {
    zeigtKeineZahl(zeige(10000), 'tax.bandOutside(13’940|265’539|2026)');
  });
});

describe('E38 · mit Kindern', () => {
  // __KINDER_TESTS__

  it('ledig mit Kind ohne Bestätigung des Elterntarifs: keine Kantonszahl', () => {
    zeigtKeineZahl(zeige(60000, { kinder: 1 }), 'tax.bandNotChecked');
  });

  it('vier Kinder (nicht gemessen): keine Kantonszahl', () => {
    zeigtKeineZahl(zeige(120000, { verheiratet: true, kinder: 4 }), 'tax.bandNotChecked');
  });
});
