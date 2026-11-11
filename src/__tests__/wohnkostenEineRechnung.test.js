import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { wohnkostenRechnung, drittelGrenzeMiete } from '../data/wohnkosten.js';
import { wohnkostenRechnung as ausDemBauteil } from '../components/WohnkostenInstrument.jsx';
import { MietVergleich } from '../components/MietVergleich.jsx';

// Wohnkosten-Anteil und «Drittel»: EINE Rechnung für Kapitel Wohnen, Mietzins-Werkzeug und Budget
// (Stebler Studios 11.11.2026, «am liebsten alle drei vereint»; Befund B-R1 in
// stebler-studios/analysen/2026-11-10-instrumente-matrix-konzept.md).
// Bis dahin: Kapitel = alle Wohnkosten ÷ alle eigenen Einnahmen · Mietzins = Miete + NK ÷ nur Lohn ·
// Budget = Grenze ein Drittel des Haushaltseinkommens mit Partner. Dieselbe Person sah im Kapitel
// «30 %» und im Mietzins-Werkzeug «34 %» mit rotem «!».

const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

const profil = (finanzen = {}, wohnen = {}, basis = {}) => ({
  basis: { canton: 'ZH', household: { adults: 1, children: [] }, ...basis },
  wohnen: { rentAmount: '1650', utilities: '180', ...wohnen },
  finanzen: { monthlyIncome: '4000', incomeType: 'netto', ...finanzen },
});

describe('Wohnkosten · eine Rechnung', () => {
  it('das Bauteil im Kapitel rechnet mit derselben Funktion', () => {
    expect(ausDemBauteil).toBe(wohnkostenRechnung);
  });

  it('die «!»-Grenze auf dem Miet-Balken fällt genau mit «mehr als ein Drittel» zusammen', () => {
    // Nebeneinkommen zählt mit (vorher im Mietzins-Werkzeug nicht): 4000 + 1500 = 5500.
    const p = profil({ sideIncome: '1500', sideIncomeType: 'netto' });
    for (const miete of [1000, 1400, 1650, 1653, 1654, 1700, 2400]) {
      const r = wohnkostenRechnung(p.wohnen, p, miete);
      const grenze = drittelGrenzeMiete(r);
      expect(grenze).toBeGreaterThan(0);
      expect(miete > grenze).toBe(r.ueberDrittel);
    }
  });

  it('Hypothek und Gebäudeversicherung verschieben die Grenze für die Miete nach unten', () => {
    const p = profil({}, { rentAmount: '0', utilities: '200', mortgagePayment: '900', buildingsInsurance: '1200' });
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(r.kosten).toBe(1200);
    expect(drittelGrenzeMiete(r)).toBeCloseTo(4000 / 3 - 1200, 6);
  });

  // Seit 11.11.2026 (Partner-Haus): mit genau zwei Erwachsenen rechnet das Drittel mit dem Haushalt
  // (wohnenPartnerHaus.test.js). Ohne Urteil bleibt es, wo die Summe nicht trägt — z. B. drei Erwachsene.
  it('Partner/in und weitere Erwachsene: kein Urteil, die Miete gilt für den ganzen Haushalt', () => {
    const p = profil({}, {}, { maritalStatus: 'married', household: { adults: 3, children: [], partnerIncome: '5000' } });
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(r.mitPartner).toBe(true);
    expect(drittelGrenzeMiete(r)).toBe(0);
  });

  it('ohne Einkommen keine Grenze, nie geraten', () => {
    const p = profil({ monthlyIncome: '' });
    expect(drittelGrenzeMiete(wohnkostenRechnung(p.wohnen, p))).toBe(0);
    expect(drittelGrenzeMiete(null)).toBe(0);
  });
});

describe('Wohnkosten · Mietzins-Werkzeug zeigt dieselbe Zahl wie das Kapitel', () => {
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

  it('Anteil aus allen eigenen Einnahmen, nicht nur aus dem Lohn', () => {
    const p = profil({ sideIncome: '1500', sideIncomeType: 'netto' });
    const html = renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: p, isDarkMode: false }));
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(html).toContain('mietzinsView.rentShare(' + Math.round(r.anteil) + ')');
    expect(Math.round(r.anteil)).toBe(33); // 1830 ÷ 5500; vorher 1830 ÷ 4000 = 46 %
  });

  it('ohne Urteil (Partner/in und weitere Erwachsene) der Satz aus dem Kapitel statt der Faustregel', () => {
    const p = profil({}, {}, { maritalStatus: 'married', household: { adults: 3, children: [], partnerIncome: '5000' } });
    const html = renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: p, isDarkMode: false }));
    expect(html).toContain('wohnenInstrument.mitPartner');
    expect(html).not.toContain('mietzinsView.rentShareGuide');
  });
});

describe('Wohnkosten · Wächter: keine zweite Drittel-Rechnung', () => {
  const dateien = [];
  const sammle = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== '__tests__' && e.name !== 'i18n') sammle(p); }
      else if (/\.(jsx?|mjs)$/.test(e.name)) dateien.push(p);
    }
  };
  sammle(SRC);

  it('«Einkommen ÷ 3» steht nur in data/wohnkosten.js', () => {
    const muster = /(income|einkommen)\b[^;\n]{0,12}\/\s*3\b/i;
    const treffer = dateien.filter((f) => muster.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(SRC, f));
    expect(treffer).toEqual(['data/wohnkosten.js']);
  });

  it('Mietzins-Werkzeug und Budget holen die Grenze aus der einen Rechnung', () => {
    for (const f of ['components/MietVergleich.jsx', 'BudgetSync.jsx']) {
      const q = lies(f);
      // Über das Bauteil des Kapitels (re-export aus data/wohnkosten.js), damit kein eigener Baustein
      // entsteht, dessen Name im Startbündel stünde.
      expect(q).toMatch(/import \{ wohnkostenRechnung, drittelGrenzeMiete[^}]*\} from '\.\.?\/(components\/)?WohnkostenInstrument\.jsx'/);
      expect(q).toMatch(/thresholdValue: drittelGrenzeMiete\(/);
    }
  });
});
