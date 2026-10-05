// Dataviz-Runde Schulden (27.09.2026, Stebler Studios: A + B + C). Geprüft wird die Sache:
// A teilt «noch offen» nach Stufe, B zeigt jede Forderung dort, wo die Rate sie trifft,
// C zeigt jede offene Forderung einmal mit ihrer Stufe — ohne Rot, mit Text neben jedem Bild.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDebtPlan, prioritizeDebts, calculateDebtStatus } from '../schuldenCalc.js';
import { OffenBalken, AbbauZeitachse, MahnstufenUebersicht, AusserdemOffen, OffenePosten, summenJeStufe, STUFEN_TON, zeitraum } from '../components/SchuldenBilder.jsx';
import { offenePosten } from '../utils/offenePosten.js';
import { LIGHT_PALETTE as palette, DARK_PALETTE } from '../config/constants.js';
import { betrag } from '../utils/geld.js';

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
  it('Summen mit Rappen wie die Karten — Total und Teile ergeben dieselben Zahlen', () => {
    const rappen = [
      { id: 1, creditor: 'Krankenkasse', amount: 100.5, status: 'open', category: 'krankenkasse' },
      { id: 2, creditor: 'Kreditkarte', amount: 200.5, status: 'open', category: 'kredit' },
    ];
    const html = renderToStaticMarkup(React.createElement(OffenBalken, { palette, t, prioritized: prioritizeDebts(rappen), status: calculateDebtStatus(rappen, HEUTE) }));
    expect(html).toContain(betrag(301, { stellen: 2 }));
    expect(html).toContain(betrag(100.5, { stellen: 2 }));
    expect(html).not.toContain('>' + betrag(301) + '<');
  });
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

// Task 3 (Schulden R2, 05.10.2026): ① «Ausserdem offen» und ② «Offene Posten» — nur lesen.
describe('① AusserdemOffen / ② OffenePosten', () => {
  const heute = '2026-10-05';
  const daten = {
    versicherungen: { kkBelege: [
      { id: 'b1', datum: '2026-09-01', betrag: 400, status: 'offen', frist: '2026-10-20' },
      { id: 'b2', datum: '', betrag: 240, status: 'offen' },
      { id: 'b3', datum: '2026-08-01', betrag: 90, status: 'offen', forderungId: '7' },
    ] },
    schulden: [
      { id: 7, creditor: '', amount: 90, status: 'open', stufe: 'rechnung', ausBeleg: 'b3', belegDatum: '2026-08-01' },
      { id: 8, creditor: 'Steueramt', amount: 300, status: 'open', stufe: 'mahnung' },
      { id: 9, creditor: '', amount: 50, status: 'open' },
    ],
  };
  const posten = offenePosten(daten, heute);
  const render = (C, p, pal = palette, onNavigate) => renderToStaticMarkup(React.createElement(C, { palette: pal, t, posten: p, onNavigate })).replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

  it('① ohne Arztrechnungen: nichts (kein «0 Rechnungen»)', () => {
    expect(render(AusserdemOffen, offenePosten({}, heute))).toBe('');
  });
  it('① nennt Anzahl, Betrag und nächste Frist', () => {
    const html = render(AusserdemOffen, posten, palette, () => {});
    expect(html).toContain('schulden.posten.ausserdem');
    expect(html).toContain('"anzahl":2');
    expect(html).toContain(betrag(640, { stellen: 2 }));
    expect(html).toContain('schulden.posten.naechsteFrist');
    expect(html).toContain('schulden.posten.zumTracker');
  });
  it('① Einzahl-Variante, und ohne Frist keine «nächste Frist»', () => {
    const eins = offenePosten({ versicherungen: { kkBelege: [{ id: 'x', betrag: 120, status: 'offen' }] } }, heute);
    const html = render(AusserdemOffen, eins);
    expect(html).toContain('schulden.posten.ausserdemEins');
    expect(html).not.toContain('naechsteFrist');
  });
  it('② beide Gruppen, Beleg ohne Datum, Herkunft, Summe', () => {
    const html = render(OffenePosten, posten, palette, () => {});
    expect(html).toContain('schulden.posten.zumTracker');
    expect(html).toContain('schulden.posten.titel');
    expect(html).toContain('schulden.posten.gruppeArzt');
    expect(html).toContain('schulden.posten.gruppeForderungen');
    expect(html).toContain('schulden.posten.ohneDatum');
    expect(html).toContain('schulden.posten.rechnungVom');
    expect(html).toContain('schulden.posten.ausArzt');
    expect(html).toContain('schulden.stufe.mahnung');
    expect(html).toContain('schulden.stufe.keine');
    expect(html).toContain(betrag(posten.summe, { stellen: 2 }));
    expect(html).toContain('<section');
    expect(html).toContain('aria-labelledby');
  });
  it('② Frist abgelaufen als Text; Knopf zum Tracker ruft onNavigate(kvg)', () => {
    const alt = offenePosten({ versicherungen: { kkBelege: [{ id: 'a', datum: '2026-05-01', betrag: 100, status: 'offen', frist: '2026-06-01' }] } }, heute);
    const html = render(OffenePosten, alt);
    expect(html).toContain('schulden.posten.fristAbgelaufen');
    const q = fs.readFileSync(path.resolve(__dirname, '../components/SchuldenBilder.jsx'), 'utf8');
    expect(q).toMatch(/onNavigate\('kvg'\)/);
  });
  it('② ohne Forderungen keine Forderungen-Gruppe', () => {
    const html = render(OffenePosten, offenePosten({ versicherungen: { kkBelege: [{ id: 'a', betrag: 10, status: 'offen' }] } }, heute));
    expect(html).not.toContain('gruppeForderungen');
  });
  it('② namenlose Forderung ohne Beleg heisst «Ohne Namen», nicht «Arztrechnung» und nicht «—»', () => {
    const p = offenePosten({ schulden: [{ id: 1, creditor: '', amount: 20, status: 'open' }] }, heute);
    const html = render(OffenePosten, p);
    expect(html).not.toContain('ohneDatum');
    expect(html).not.toContain('rechnungVom');
    expect(html).toContain('>schulden.posten.ohneName<');
    expect(html).not.toContain('>—<');
  });
  it('② Summe trägt ein sichtbares Etikett «Total» vor dem Betrag, in text.body', () => {
    const html = render(OffenePosten, posten);
    expect(html).toMatch(/schulden\.posten\.summe<\/span>\s*<span[^>]*>[^<]*CHF/);
    const summe = html.slice(html.indexOf('schulden.posten.summe'));
    expect(summe.slice(0, summe.indexOf('CHF'))).toContain('font-size:16px');
    expect(summe.slice(0, summe.indexOf('CHF'))).not.toContain('font-size:19px');
  });
  it('① Betrag in «Ausserdem offen» bricht nicht um', () => {
    const html = render(AusserdemOffen, posten, palette, () => {});
    expect(html).toContain('white-space:nowrap');
  });
  it('① ② Weg-Link steht mit Abstand oben (space.xs) in eigenem Wrapper', () => {
    expect(render(AusserdemOffen, posten, palette, () => {})).toMatch(/<div style="margin-top:4px"><button[^>]*class="mp-link"/);
    expect(render(OffenePosten, posten, palette, () => {})).toMatch(/<div style="margin-top:4px"><button[^>]*class="mp-link"/);
  });
  it('① ② erscheinen auch ohne Schulden, nur mit Arztbelegen (SchuldenManager)', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    const ov = q.slice(q.indexOf("view === 'overview'"), q.indexOf("betreibung.length > 0 && React.createElement('div', { style: { padding"));
    const zweig = ov.slice(ov.indexOf('prioritized.length === 0 && debtStatus.paid === 0'), ov.indexOf('React.createElement(AusserdemOffen'));
    expect(zweig).toMatch(/: React\.createElement\(OffenBalken,[^\n]*\),\s*$/);
    expect(ov).toMatch(/createElement\(AusserdemOffen,/);
    expect(ov).toMatch(/createElement\(OffenePosten,/);
    const nurArzt = offenePosten({ versicherungen: { kkBelege: [{ id: 'z', datum: '2026-09-01', betrag: 75, status: 'offen' }] }, schulden: [] }, heute);
    expect(render(AusserdemOffen, nurArzt)).toContain('schulden.posten.ausserdemEins');
    expect(render(OffenePosten, nurArzt)).toContain('schulden.posten.titel');
  });
  it('kein Rot, hell und dunkel', () => {
    for (const p of [palette, DARK_PALETTE]) {
      for (const C of [AusserdemOffen, OffenePosten]) {
        const html = render(C, posten, p).toLowerCase();
        for (const rot of [p.rose, p.roseDeep]) expect(html).not.toContain(rot.toLowerCase());
      }
    }
  });
});
