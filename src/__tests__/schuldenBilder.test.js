// Dataviz-Runde Schulden (27.09.2026, Stebler Studios: A + B + C). Geprüft wird die Sache:
// A teilt «noch offen» nach Stufe, B zeigt jede Forderung dort, wo die Rate sie trifft,
// C zeigt jede offene Forderung einmal mit ihrer Stufe — ohne Rot, mit Text neben jedem Bild.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDebtPlan, prioritizeDebts, calculateDebtStatus } from '../schuldenCalc.js';
import { OffenBalken, AbbauZeitachse, MahnstufenUebersicht, summenJeStufe, STUFEN_TON, zeitraum } from '../components/SchuldenBilder.jsx';
import { LIGHT_PALETTE as palette, DARK_PALETTE } from '../config/constants.js';

const t = (k, v) => k + (v ? JSON.stringify(v) : '');
const HEUTE = '2026-09-27';
const debts = [
  { id: 1, creditor: 'Krankenkasse', amount: 1840, status: 'overdue', category: 'krankenkasse', stufe: 'mahnung' },
  { id: 2, creditor: 'Steueramt', amount: 3200, dueDate: '2026-10-31', status: 'open', category: 'steuern' },
  { id: 3, creditor: 'Kreditkarte', amount: 4500, interestRate: 12, status: 'open', category: 'kredit', stufe: 'zahlungsbefehl' },
  { id: 4, creditor: 'Busse', amount: 300, dueDate: '2026-09-10', status: 'open', category: 'bussen', stufe: 'rechnung' },
  { id: 5, creditor: 'Zahnarzt', amount: 680, status: 'paid', category: 'sonstige' },
];
const prioritized = prioritizeDebts(debts);

describe('A · summenJeStufe / OffenBalken', () => {
  it('teilt nur Offenes nach Stufe; die Summe ist «noch offen»', () => {
    expect(summenJeStufe(prioritized)).toEqual([{ tier: 1, summe: 2140 }, { tier: 2, summe: 3200 }, { tier: 3, summe: 4500 }]);
    expect(calculateDebtStatus(debts, HEUTE).totalDebt).toBe(9840);
  });
  it('jede Fläche steht auch als Text da, kein Rot', () => {
    const html = renderToStaticMarkup(React.createElement(OffenBalken, { palette, t, prioritized, status: calculateDebtStatus(debts, HEUTE) }));
    for (const k of ['schulden.tier1', 'schulden.tier2', 'schulden.tier3', 'schulden.bild.bezahlt', 'schulden.bild.naechstes']) expect(html).toContain(k);
    for (const rot of [palette.rose, palette.roseDeep]) expect(html.toLowerCase()).not.toContain(rot.toLowerCase());
  });
});

describe('B · createDebtPlan von/bis + AbbauZeitachse', () => {
  const plan = createDebtPlan(debts, 2450);
  it('jede Forderung beginnt, wo die vorige endet, und endet in ihrem Monat', () => {
    const r = plan.reihenfolge;
    expect(r.map(x => x.creditor)).toEqual(['Krankenkasse', 'Busse', 'Steueramt', 'Kreditkarte']);
    expect(r[0].von).toBe(0);
    for (let i = 1; i < r.length; i++) expect(r[i].von).toBeCloseTo(r[i - 1].bis, 6);
    for (const x of r) { expect(x.bis).toBeGreaterThan(x.monat - 1); expect(x.bis).toBeLessThanOrEqual(x.monat); }
    expect(r[0].bis).toBeCloseTo(1840 / 2450, 6);
  });
  it('eine Zeile je Forderung, mit Name und Monat als Text', () => {
    const html = renderToStaticMarkup(React.createElement(AbbauZeitachse, { palette, t, plan }));
    expect(html.match(/<li/g)).toHaveLength(4);
    expect(html).toContain('Kreditkarte');
    expect(html).toContain('schulden.bild.imMonat{&quot;n&quot;:&quot;1&quot;}');
  });
  // a11y-Prüfer 27.09.: der Beginn stand nur in der Grafik.
  it('Beginn und Ende stehen als Text: «Monat 3 bis 5» für die Kreditkarte', () => {
    const r = plan.reihenfolge;
    expect(zeitraum(r[0])).toEqual({ key: 'schulden.bild.imMonat', v: { n: '1' } });
    expect(zeitraum(r[2])).toEqual({ key: 'schulden.bild.vonBis', v: { von: '1', bis: '3' } });
    expect(zeitraum(r[3])).toEqual({ key: 'schulden.bild.vonBis', v: { von: '3', bis: '5' } });
  });
  it('ohne machbaren Plan kein Bild', () => {
    expect(renderToStaticMarkup(React.createElement(AbbauZeitachse, { palette, t, plan: null }))).toBe('');
  });
});

describe('C · MahnstufenUebersicht', () => {
  it('jede offene Forderung einmal, mit Stufe als lesbarem Text', () => {
    const html = renderToStaticMarkup(React.createElement(MahnstufenUebersicht, { palette, t, prioritized }));
    expect(html.match(/<li/g)).toHaveLength(4);
    expect(html).toContain('>Krankenkasse: schulden.stufe.mahnung</span>');
    expect(html).toContain('>Steueramt: schulden.bild.stufeOffen</span>');
    expect(html).not.toContain('Zahnarzt');
  });
});

describe('Schuldenmanager nach der Runde', () => {
  const q = fs.readFileSync(path.resolve(__dirname, '..', 'SchuldenManager.jsx'), 'utf8');
  // Beträge ohne Rot (Dataviz-Runde 27.09.). Entfernen nutzt den gemeinsamen loeschKnopf aus dem
  // Hauptknopf-System (#416): Zweitknopf ohne rote Fläche, nur der Text trägt die Warnfarbe.
  it('kein Rot auf Beträgen; Entfernen über den gemeinsamen loeschKnopf, keine rote Fläche', () => {
    expect(q).not.toMatch(/background: palette\.rose/);
    expect(q).not.toMatch(/istUeberfaellig\(debt\) \? palette\.roseDeep/);
    expect(q).toMatch(/color: debt\.status === 'paid' \? \(palette\.sageDeep \|\| palette\.sage\) : palette\.text/);
    expect(q.match(/style: (\{ \.\.\.)?loeschKnopf/g)).toHaveLength(3);
  });
  it('die Begründung einer Stufe steht einmal je Stufe, nicht je Forderung', () => {
    expect(q).not.toMatch(/tier1Reason'\)/);
    expect(q).toMatch(/t\('schulden\.tier' \+ tier \+ 'Reason'\)/);
  });
  it('der Krankenkassen-Satz nur bei Krankenkassen-Forderungen', () => {
    expect(q).toMatch(/const kk = debt\.category === 'krankenkasse';/);
    expect(q).toMatch(/kk && React\.createElement\('div', \{ id: id \+ '-hilfe'/);
  });
  it('die Knöpfe beim Raten-Feld stehen nicht in dessen Beschreibung', () => {
    const hilfe = q.slice(q.indexOf("id: 'plan-rate-hilfe'"), q.indexOf('Knöpfe AUSSERHALB'));
    expect(hilfe).not.toMatch(/createElement\('button'/);
  });
  it('Übersicht zeigt Bild A und C', () => {
    expect(q).toMatch(/createElement\(OffenBalken,/);
    expect(q).toMatch(/createElement\(MahnstufenUebersicht,/);
    expect(q).toMatch(/createElement\(AbbauZeitachse,/);
  });
});

// WCAG 1.4.11: jede Stufen-Fläche hält gegen die Fläche mindestens 3:1, hell und dunkel.
describe('Kontrast der Stufen-Töne', () => {
  const kanal = (h, i) => parseInt(h.slice(1 + 2 * i, 3 + 2 * i), 16) / 255;
  const lum = (rgb) => { const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); const [r, g, b] = rgb.map(f); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const kontrast = (a, b) => { const [h, d] = [lum(a), lum(b)].sort((p, q) => q - p); return (h + 0.05) / (d + 0.05); };
  for (const [name, p] of [['hell', palette], ['dunkel', DARK_PALETTE]]) {
    it(name + ': alle drei Stufen ≥ 3:1 gegen surface, in abnehmender Stärke', () => {
      const werte = [1, 2, 3].map(s => {
        const a = parseInt(STUFEN_TON[s], 16) / 255;
        const mix = [0, 1, 2].map(i => a * kanal(p.text, i) + (1 - a) * kanal(p.surface, i));
        return kontrast(mix, [0, 1, 2].map(i => kanal(p.surface, i)));
      });
      for (const w of werte) expect(w).toBeGreaterThanOrEqual(3);
      expect(werte[0]).toBeGreaterThan(werte[1]);
      expect(werte[1]).toBeGreaterThan(werte[2]);
    });
  }
});
