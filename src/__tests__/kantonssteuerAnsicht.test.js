import { describe, it, expect, vi } from 'vitest';

// ─────────────────────────────────────────────────────────────
// E37 / E38 · Der Steuerrechner zeigt die Kantons-/Gemeindesteuer aus der ESTV-Tabelle —
// nur dort, wo sie trägt.
// E39 · Bundessteuer und Kantonstabelle nutzen dasselbe steuerbare Einkommen; die Seite zeigt
// genau eines (auch auf dem Nettolohn-Weg trifft die Bundessteuer die ESTV auf CHF 1).
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
//   Nettolohn-Weg (Nettolohn laut ESTV, docs/sources/nettolohn-abzuege-2026.messpunkte.json):
//   ZH ledig, 1 Kind (alleinerziehend), Brutto  80 000 → Nettolohn  71 883, K+G  3 689
//   VD verheiratet, 2 Kinder,          Brutto 120 000 → Nettolohn 107 602, K+G 11 340
//   ZH ledig, ohne Kinder,             Brutto  80 000 → Nettolohn  71 883, K+G  7 039
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
// R4: estvLink/kantonsLink rendern seit dem a11y-Hinweis (WCAG 3.2.5) über ExternerLink
// statt eines rohen <a> — knoten() muss es wie KantonssteuerOrientierung expandieren,
// damit das erzeugte <a href> weiter unten gefunden wird.
const { ExternerLink } = await import('../components/ExternerLink.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);

const knoten = (el, out = []) => {
  if (Array.isArray(el)) { el.forEach((c) => knoten(c, out)); return out; }
  if (!el || typeof el !== 'object' || !el.props) return out;
  out.push(el);
  let kinder = el.props.children;
  if (el.type === LabeledField && typeof kinder === 'function') kinder = kinder('id');
  if (el.type === KantonssteuerOrientierung) kinder = KantonssteuerOrientierung(el.props);
  if (el.type === ExternerLink) knoten(ExternerLink(el.props), out);
  knoten(kinder, out);
  return out;
};
const texte = (alle) => alle.map((k) => k.props.children).flat().filter((c) => typeof c === 'string').join('\n');

// R4: verheiratet = Alleinverdiener-Ehepaar wie gemessen → Partnereinkommen 0 ausdrücklich eingetragen.
const zeige = (steuerbar, { canton = 'ZH', kinder = 0, verheiratet = false, elterntarif, nettolohn, incomeType, partnerIncome } = {}) => {
  const data = {
    basis: { canton, maritalStatus: verheiratet ? 'married' : 'single', household: { adults: verheiratet ? 2 : 1, children: Array.from({ length: kinder }, () => ({ age: 8 })), ...(partnerIncome ? { partnerIncome } : verheiratet ? { partnerIncome: '0' } : {}) } },
    // steuerbar = direkt eingetragenes steuerbares Einkommen; nettolohn = Weg über den Nettolohn.
    finanzen: nettolohn ? { monthlyIncome: nettolohn / 12, ...(incomeType ? { incomeType } : {}) } : { taxableIncome: steuerbar },
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
  // ESTV rundet auf ganze Franken, die App auf 5 Rappen (Form. 58c) → höchstens CHF 1 daneben.
  expect(Math.abs(bund - estvBund)).toBeLessThanOrEqual(1);
  expect(imRahmen(kantonal, estvKG)).toBe(true);
  expect(total).toBe(Math.round(bund) + kantonal);
};

const zeigtKeineZahl = (v, textKey, bund = 'mitBund') => {
  expect(v.orientierung).toBeDefined();
  expect(v.text).toContain(textKey);
  expect(v.text).not.toContain('tax.roughEstimateBadge');
  expect(v.text).not.toContain('tax.totalEstimate');
  if (bund === 'mitBund' && v.betraege.length) expect(v.text).toContain('tax.netIncomeFederalOnly');
  expect(v.alle.filter((k) => k.type === 'a').map((k) => k.props.href)).toContain('https://swisstaxcalculator.estv.admin.ch/');
};

// E39: genau ein steuerbares Einkommen auf der Seite, mit ehrlicher Beschriftung.
const einSteuerbares = (v, wert, label) => {
  const boxen = v.alle.filter((k) => k.props['data-testid'] === 'steuerbares-einkommen');
  expect(boxen).toHaveLength(1);
  const inhalt = texte(knoten(boxen[0].props.children));
  expect(inhalt).toContain(label + '\nCHF ' + wert + '\n');
  expect(inhalt).toContain(label === 'tax.taxableIncomeEstimated' ? 'tax.taxableEstimatedHint' : 'tax.taxableEnteredHint');
  expect(v.text).not.toContain('cantonalTaxableBasis');
};

const keineBundessteuer = (v, textKey) => {
  expect(v.betraege).toEqual([]);
  expect(v.text).toContain(textKey);
  expect(v.alle.some((k) => k.props['data-testid'] === 'bundessteuer-ohne-zahl')).toBe(true);
  expect(v.alle.some((k) => k.props['data-testid'] === 'steuerbares-einkommen')).toBe(false);
  expect(v.text).not.toContain('tax.netIncome\n');
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

  it('Nettolohn 71 883 (Brutto 80 000): die Tabelle wird mit steuerbar 67 927 gelesen → ±3 % neben ESTV 7 039', () => {
    const v = zeige(null, { nettolohn: 71883 });
    zeigtZahl(v, 906, 7039);
    einSteuerbares(v, 67927, 'tax.taxableIncomeEstimated');
  });

  it('direkt eingetragen: ein steuerbares Einkommen, als eingetragen beschriftet', () => {
    einSteuerbares(zeige(67927), 67927, 'tax.taxableIncome');
  });

  it('Lohn als Bruttolohn erfasst: weder Bundessteuer noch Kantonszahl', () => {
    const v = zeige(null, { nettolohn: 80000, incomeType: 'brutto' });
    zeigtKeineZahl(v, 'tax.bandNotCheckedBrutto');
    // Die Begründung steht bei der Kantonssteuer; bei der Bundessteuer nur der kurze Hinweis.
    keineBundessteuer(v, 'tax.noTaxFigure');
    expect(v.text).not.toContain('tax.federalNotCheckedBrutto');
  });

  it('verheiratet mit Partnereinkommen (nicht gemessen): weder Bundessteuer noch Kantonszahl', () => {
    const v = zeige(null, { nettolohn: 71883, verheiratet: true, partnerIncome: 2000 });
    zeigtKeineZahl(v, 'tax.bandNotCheckedPartner');
    keineBundessteuer(v, 'tax.federalNotCheckedPartner');
  });

  it('Konkubinat ohne Kinder: Bundessteuer auf dem eigenen Einkommen (ESTV 906), keine Kantonszahl', () => {
    const v = zeige(null, { nettolohn: 71883, partnerIncome: 2000 });
    zeigtKeineZahl(v, 'tax.bandNotCheckedPartner', 'mitBund');
    expect(v.betraege).toEqual([906]);
    einSteuerbares(v, 67927, 'tax.taxableIncomeEstimated');
  });

  it('Konkubinat mit Kind: keine Bundessteuer (Kinderabzug kann aufgeteilt sein)', () => {
    const v = zeige(null, { nettolohn: 71883, partnerIncome: 2000, kinder: 1, elterntarif: true });
    keineBundessteuer(v, 'tax.federalNotCheckedPartner');
  });

  it('unter der Tabelle (steuerbar 10 000): keine Kantonszahl', () => {
    zeigtKeineZahl(zeige(10000), 'tax.bandOutside(13’940|265’539|2026)');
  });
});

describe('E38 · mit Kindern', () => {
  it('ZH alleinerziehend mit 1 Kind, Elterntarif bestätigt, Nettolohn 71 883: ±3 % neben ESTV 3 689', () => {
    const v = zeige(null, { nettolohn: 71883, kinder: 1, elterntarif: true });
    zeigtZahl(v, 114, 3689);
    einSteuerbares(v, 60427, 'tax.taxableIncomeEstimated');
  });

  it('ZH alleinerziehend, direkt steuerbar 60 427: Bundessteuer = ESTV 114 (Elterntarif), K+G ±3 % neben 3 689', () => {
    zeigtZahl(zeige(60427, { kinder: 1, elterntarif: true }), 114, 3689);
  });

  it('VD verheiratet mit 2 Kindern, Nettolohn 107 602: ±3 % neben ESTV 11 340', () => {
    const v = zeige(null, { canton: 'VD', nettolohn: 107602, verheiratet: true, kinder: 2 });
    zeigtZahl(v, 551, 11340);
    einSteuerbares(v, 82874, 'tax.taxableIncomeEstimated');
  });

  it('VD verheiratet mit 2 Kindern, direkt steuerbar 82 874: Bundessteuer = ESTV 551', () => {
    zeigtZahl(zeige(82874, { canton: 'VD', verheiratet: true, kinder: 2 }), 551, 11340);
  });

  it('ledig mit Kind ohne Bestätigung des Elterntarifs: keine Kantonszahl', () => {
    zeigtKeineZahl(zeige(60000, { kinder: 1 }), 'tax.bandNotChecked');
  });

  it('vier Kinder (nicht gemessen): keine Kantonszahl', () => {
    // K86: verheiratet mit eingetragenem (gemeinsamem) Wert → kein «Nettoeinkommen», dafür der Hinweis.
    const v = zeige(120000, { verheiratet: true, kinder: 4 });
    zeigtKeineZahl(v, 'tax.bandNotChecked', 'gemeinsamDirekt');
    expect(v.text).toContain('tax.gemeinsamDirektHinweis');
    expect(v.text).not.toContain('tax.netIncomeFederalOnly');
  });
});
