import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { schildState } from '../data/schutzschild.js';
import { BVG_PARAMS } from '../data/ahvRechner.js';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { kantoneBelegtSimulieren, musterKanton } from '../config/__tests__/ipvBelegtSimulieren.js';

// Muster-Kanton (W3, 28.09.2026): GE wird für diese Datei zu einem festen Muster-Kanton ohne Modul —
// sonst brächen die Muster-Erwartungen, sobald GE sein eigenes Modell hat (ipvBelegtSimulieren.js).
let musterZurueck;
beforeAll(() => { musterZurueck = musterKanton('GE'); });
afterAll(() => musterZurueck());


// Die «Kann»-Punkte der Abschlussprüfung zu #388 (swiss-precision, 25.09.2026) als Regeln.
const t = (k, p) => (p && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

describe('BVG-Eintrittsschwelle: «mehr als» (BVG Art. 7 Abs. 1), wie lohnAbzuege.js', () => {
  const pflicht = (annualIncome) => schildState({ kkInsurer: 'X' }, { employed: true, annualIncome, lohnBasis: 'brutto' })
    .pflicht.items.some((i) => i.key === 'bvg');
  it('genau die Schwelle: nicht versichert; einen Franken darüber: versichert', () => {
    expect(pflicht(BVG_PARAMS.eintrittsschwelle)).toBe(false);
    expect(pflicht(BVG_PARAMS.eintrittsschwelle + 1)).toBe(true);
  });
});

describe('Mietzins BS: Referenzalter und Kinder ohne Alter sichtbar', () => {
  const render = (household) => renderToStaticMarkup(React.createElement(MietzinsOrientierung, { palette, t,
    data: { basis: { canton: 'BS', maritalStatus: 'single', household: { adults: 1, children: [], ...household } }, finanzen: { monthlyIncome: 3000, dreizehnter: 'no' }, wohnen: { rentAmount: 1200 } } }));
  it('pensioniert: Hinweis MBG § 4 Abs. 2; sonst nicht', () => {
    expect(render({ isRetired: true })).toContain('mietzinsView.referenzalterBS');
    expect(render({})).not.toContain('mietzinsView.referenzalterBS');
  });
  it('Kind ohne Alter: Hinweis; mit Alter nicht', () => {
    expect(render({ children: [{ name: 'X' }] })).toContain('mietzinsView.kindOhneAlter');
    expect(render({ children: [{ age: 4 }] })).not.toContain('mietzinsView.kindOhneAlter');
  });
});

describe('Schnellcheck: IPV-Jahreseinkommen wie die IPV (inkl. Nebenerwerb)', () => {
  it('nennt Hauptlohn × 12 + Nebenerwerb × 12, nicht nur den Hauptlohn', () => {
    // (BS und VD seit 28.09.2026 mit eigenem Modell, darum GE — noch ohne Modul; Musterwerte 60 000 / 3 600 / 7 200 / 1 800)
    const zurueck = kantoneBelegtSimulieren(['GE']);
    try {
      const data = { basis: { canton: 'GE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
        finanzen: { monthlyIncome: 3500, incomeType: 'netto', sideIncome: 500, dreizehnter: 'no' }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 400 } };
      const html = renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, data, onNavigate: () => {} }));
      // Einkommen ohne Sozialhilfe-Anspruch, sonst zeigt die Zeile «in der Sozialhilfe enthalten».
      expect(html).toContain('dashboard.quickCheckResult(48’000|');
    } finally { zurueck(); }
  });
});
