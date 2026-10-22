// Charts rechnet wie das Kapitel Finanzen (Entscheid Stebler Studios 21.10.2026).
// Vorher: Charts zählte BVG (steckt im Nettolohn), die Haftpflicht-Versicherungssumme und
// Hausrat-/Fahrzeug-Jahresprämien als Monatsausgaben. Beispiel: 4'197 statt 3'720.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChartsAdvanced } from '../ChartsAdvanced.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { sumAllExpenses, sumTotalIncome } from '../utils/monatsrechnung.js';
import { betrag } from '../utils/geld.js';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  return typeof w === 'string' ? w : (w && w.sie) || k;
};
const zeichne = (data) => renderToStaticMarkup(React.createElement(ChartsAdvanced, { palette, t, data }));
const fr = (x) => betrag(x, { hoechstens: 2 });

describe('Charts rechnet wie das Kapitel Finanzen', () => {
  it('Beispiel Maria: Ausgaben und Rest wie im Kapitel', () => {
    const aus = sumAllExpenses(DEMO_DATA.finanzen, DEMO_DATA);
    const ein = sumTotalIncome(DEMO_DATA.finanzen);
    const html = zeichne(DEMO_DATA);
    expect(html).toContain(fr(aus));
    expect(html).toContain(fr(ein - aus));
  });

  it('BVG ist keine Ausgabe, steht aber als Hinweis da', () => {
    const html = zeichne(DEMO_DATA);
    expect(html).not.toMatch(/>BVG \(\d+%\)</);
    expect(html).toContain(de.budgetSync.bvgReferenceNote);
  });

  it('Haftpflicht-Versicherungssumme wird nicht zur Monatsausgabe', () => {
    const data = {
      finanzen: { monthlyIncome: '5000', groceries: '400' },
      versicherungen: { liabilityAmount: '5000000', householdInsuranceAmount: '240', autoInsuranceAmount: '900' },
    };
    const html = zeichne(data);
    expect(html).toContain(fr(400));
    expect(html).not.toContain(fr(5000000 + 400));
    expect(html).toContain(fr(4600));
  });

  it('Familienzulagen und bezahlte Alimente zählen wie im Kapitel', () => {
    const data = { finanzen: { monthlyIncome: '4000', familienzulagen: '430', alimentePaid: '600', groceries: '500' } };
    const html = zeichne(data);
    expect(html).toContain(fr(4430));
    expect(html).toContain(fr(1100));
    expect(html).toContain(fr(3330));
  });
});
