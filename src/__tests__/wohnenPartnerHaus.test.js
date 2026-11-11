// Partner-Haus (Stebler Studios 11.11.2026 «Partner-Haus»; Fachprüfung swiss-precision-pruefer 11.11.2026):
// Lebt eine Partnerin/ein Partner mit erfasstem Nettolohn im Haushalt, rechnet das Drittel-Haus mit den
// Netto-Einnahmen des Haushalts (dieselbe Summe wie das Budget: haushaltsEinnahmen) — aber nur, wenn
//   • genau zwei Erwachsene im Haushalt sind (weitere Erwachsene haben kein Einkommensfeld),
//   • kein Lohn brutto erfasst ist.
// Sonst bleibt es ohne Urteil. Neu ohne Urteil auch: Partner/in erwartet, Feld leer (Befund 3c) — bisher
// wurde dann die Haushaltsmiete gegen das eigene Einkommen beurteilt.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { wohnkostenRechnung, drittelGrenzeMiete } from '../data/wohnkosten.js';
import { haushaltsEinnahmen } from '../data/haushaltsEinnahmen.js';

const profil = ({ lohn = 5000, partner, ehe = true, weitere = 0, brutto = false } = {}) => ({
  basis: { maritalStatus: ehe ? 'married' : 'single', household: { ...(partner !== undefined ? { partnerIncome: partner } : {}), ...(weitere ? { adultsList: Array.from({ length: weitere }, () => ({})) } : {}) } },
  finanzen: { monthlyIncome: lohn, ...(brutto ? { incomeType: 'brutto' } : {}) },
});
const wohnen = { rentAmount: 2600, utilities: 250 };

describe('Partner-Haus: Haushalt mit zwei Erwachsenen', () => {
  it('rechnet mit den Netto-Einnahmen des Haushalts — dieselbe Summe wie das Budget', () => {
    const d = profil({ partner: '4000' });
    const r = wohnkostenRechnung(wohnen, d, null);
    expect(r.haushalt).toBe(true);
    expect(r.mitPartner).toBe(false);
    expect(r.einkommen).toBe(haushaltsEinnahmen(d).total);
    expect(r.einkommen).toBe(9000);
    expect(r.anteil).toBeCloseTo(2850 / 9000 * 100, 6);
    expect(r.ueberDrittel).toBe(false);
  });
  it('urteilt über einem Drittel des Haushalts — und setzt die «!»-Grenze', () => {
    const r = wohnkostenRechnung(wohnen, profil({ partner: '2000' }), null);
    expect(r.haushalt).toBe(true);
    expect(r.ueberDrittel).toBe(true);
    expect(drittelGrenzeMiete(r)).toBeCloseTo(7000 / 3 - 250, 6);
  });
  it('Konkubinat zählt gleich (Budget kennt keinen Unterschied)', () => {
    const d = profil({ partner: '4000', ehe: false, weitere: 1 });
    expect(wohnkostenRechnung(wohnen, d, null).haushalt).toBe(true);
  });
});

describe('Partner-Haus: ohne Urteil, wo die Summe nicht trägt', () => {
  it('drei Erwachsene: kein Einkommensfeld für die dritte Person', () => {
    const r = wohnkostenRechnung(wohnen, profil({ partner: '4000', ehe: false, weitere: 2 }), null);
    expect(r.haushalt).toBe(false);
    expect(r.mitPartner).toBe(true);
    expect(drittelGrenzeMiete(r)).toBe(0);
  });
  it('eigener Lohn brutto erfasst', () => {
    const r = wohnkostenRechnung(wohnen, profil({ partner: '4000', brutto: true }), null);
    expect(r.haushalt).toBe(false);
    expect(r.mitPartner).toBe(true);
  });
  it('Partner/in erwartet, Feld leer: kein Urteil (bisher Haushaltsmiete gegen eigenes Einkommen)', () => {
    const r = wohnkostenRechnung(wohnen, profil({ lohn: 6000 }), null);
    expect(r.partnerOffen).toBe(true);
    expect(r.mitPartner).toBe(true);
    expect(r.einkommen).toBe(6000);
    expect(drittelGrenzeMiete(r)).toBe(0);
  });
  it('Partnereinkommen ausdrücklich 0: das eigene ist das Haushaltseinkommen, Urteil wie allein', () => {
    const r = wohnkostenRechnung(wohnen, profil({ lohn: 6000, partner: '0' }), null);
    expect(r.partnerOffen).toBe(false);
    expect(r.mitPartner).toBe(false);
    expect(r.ueberDrittel).toBe(true);
  });
  it('allein, ledig: unverändert', () => {
    const r = wohnkostenRechnung(wohnen, profil({ lohn: 6000, ehe: false }), null);
    expect(r).toMatchObject({ haushalt: false, mitPartner: false, partnerOffen: false, einkommen: 6000 });
  });
});

describe('Partner-Haus: Texte sagen, wessen Einnahmen gemeint sind', () => {
  const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
  it('Kapitel und Kachel nennen den Haushalt, offenes Feld führt zum Eintragen', () => {
    const w = quelle('../components/WohnkostenInstrument.jsx');
    expect(w).toMatch(/r\.haushalt \? 'instrumente\.wohnkostenSatzHaushalt'/);
    expect(w).toMatch(/r\.partnerOffen \? 'wohnenInstrument\.partnerOffen'/);
    expect(w).toMatch(/r\.haushalt \? 'instrumente\.wohnkostenSatzHaushalt'/);
  });
  it('alle fünf Sprachen haben die neuen Sätze', async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const s = (await import(`../i18n/${lang}.js`)).default;
      for (const k of ['anteilHaushalt', 'partnerOffen']) expect(s.wohnenInstrument[k], lang + '.' + k).toBeTruthy();
      expect(s.instrumente.wohnkostenSatzHaushalt, lang).toBeTruthy();
    }
  });
});
