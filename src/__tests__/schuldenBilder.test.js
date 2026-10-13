// Dataviz-Runde Schulden (27.09.2026, Stebler Studios: A + B + C). Geprüft wird die Sache:
// A teilt «noch offen» nach Stufe, B zeigt jede Forderung dort, wo die Rate sie trifft,
// C zeigt jede offene Forderung einmal mit ihrer Stufe — ohne Rot, mit Text neben jedem Bild.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDebtPlan, prioritizeDebts, calculateDebtStatus } from '../schuldenCalc.js';
import { OffenBalken, AbbauZeitachse, MahnstufenUebersicht, AusserdemOffen, OffenePosten, summenJeStufe, STUFEN_TON, zeitraum, VerlustscheinZeitachse, BetreibungZeitleiste } from '../components/SchuldenBilder.jsx';
import { SchuldenManager } from '../SchuldenManager.jsx';
import de from '../i18n/de.js';
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

// Task 5 (Schulden R2, 05.10.2026): Verlustscheine mit Rolle, Lesezeile und Zeitachse.
describe('⑤ · VerlustscheinZeitachse', () => {
  const eintraege = [
    { id: 1, creditor: 'Bank Alpha', date: '2021-03-15', amount: 1200, rolle: 'schulde' },
    { id: 2, debtor: 'Frau Muster', date: '2010-06-01', amount: 800, rolle: 'geschuldet' },
    { id: 3, creditor: 'Ohne Datum AG', amount: 50 },
  ];
  const html = renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege, heute: '2026-10-05' })).replace(/&quot;/g, '"');
  it('Text neben jeder Linie: «verjährt am» mit dem errechneten Datum', () => {
    expect(html).toContain('schulden.verlustschein.verjaehrt{"datum":"15.03.2041"}');
    expect(html).toContain('schulden.verlustschein.verjaehrt{"datum":"01.06.2030"}');
  });
  it('ein Ton (STUFEN_TON[2]), kein Rot; «heute» steht als Text', () => {
    expect(html).toContain(palette.text + STUFEN_TON[2]);
    expect(html).not.toMatch(/rose|#c0|red/i);
    expect(html).toContain('schulden.verlustschein.zeitachse.heute{"datum":"05.10.2026"}');
  });
  it('Eintrag ohne Datum: keine Linie, keine Zeile', () => {
    expect(html).not.toContain('Ohne Datum AG');
    expect((html.match(/<li/g) || []).length).toBe(2);
  });
  it('nichts zu zeigen: leer', () => {
    expect(renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege: [{ id: 3, creditor: 'X' }], heute: '2026-10-05' }))).toBe('');
    expect(renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege: [], heute: '2026-10-05' }))).toBe('');
  });
  it('Erklärtext 149a Abs. 1 (mit Erben-Satz) steht darunter', () => {
    expect(html).toContain('schulden.verlustschein.verjaehrung');
  });
  it('Nachweis aus de.js: Wortlaut 149a Abs. 1 inkl. Erben, 149 Abs. 4 nur in der Rolle', () => {
    expect(de.schulden.verlustschein.verjaehrung).toContain('verjährt 20 Jahre nach der Ausstellung des Verlustscheines; gegenüber den Erben des Schuldners jedoch verjährt sie spätestens ein Jahr nach Eröffnung des Erbganges.');
    expect(de.schulden.verlustschein.verjaehrung).toContain('149a Abs. 1');
    expect(de.schulden.verlustschein.zinslos.sie).toContain('Der Schuldner hat … keine Zinsen zu zahlen.');
    expect(de.schulden.verlustschein.zinslos.sie).toContain('149 Abs. 4');
    // der allgemeine Erklärkasten sagt nicht mehr pauschal «zinslos»
    const kasten = typeof de.schulden.verlustschein.text === 'string' ? de.schulden.verlustschein.text : de.schulden.verlustschein.text.sie;
    expect(kasten).not.toMatch(/Abs\. 4|keine geschuldet/);
  });
});

describe('⑤ · Tab «Verlustscheine» — Rolle, Lesezeile, Bearbeiten', () => {
  const rendern = (verlustscheine, overrides = {}) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t, data: { schulden: [], betreibung: [], verlustscheine, finanzen: {}, basis: {} }, onSave: () => {}, onNavigate: () => {}, startView: 'verlustscheine', ...overrides,
  })).replace(/&quot;/g, '"');
  const schulde = { id: 1, creditor: 'Bank Alpha', amount: 1200, date: '2021-03-15', court: 'BA Basel', rolle: 'schulde' };
  const geschuldet = { id: 2, debtor: 'Frau Muster', amount: 800, date: '2010-06-01', rolle: 'geschuldet' };

  it('Lesezeile: Rolle, Name, ausgestellt, «verjährt am», Knopf «Bearbeiten» mit Namen — keine offenen Felder', () => {
    const h = rendern([schulde]);
    expect(h).toContain('schulden.verlustschein.rolle.schulde');
    expect(h).toContain('Bank Alpha');
    expect(h).toContain('schulden.verlustschein.ausgestellt{"datum":"15.03.2021"}');
    expect(h).toContain('schulden.verlustschein.verjaehrt{"datum":"15.03.2041"}');
    expect(h).toContain('aria-label="schulden.verlustschein.bearbeiten Bank Alpha"');
    expect(h).not.toContain('<input');
    expect(h).not.toContain('<select');
  });
  it('rolle «schulde»: Zins-Satz (SchKG 149 Abs. 4) steht da', () => {
    expect(rendern([schulde])).toContain('schulden.verlustschein.zinslos');
  });
  it('rolle «geschuldet»: kein Zins-Satz', () => {
    const h = rendern([geschuldet]);
    expect(h).not.toContain('schulden.verlustschein.zinslos');
    expect(h).toContain('schulden.verlustschein.rolle.geschuldet');
    expect(h).toContain('Frau Muster');
  });
  it('ohne Rolle: auch kein Zins-Satz', () => {
    expect(rendern([{ id: 3, creditor: 'Alt AG', debtor: 'Ich', amount: 5, date: '2020-01-01' }])).not.toContain('schulden.verlustschein.zinslos');
  });
  it('ohne Datum: «ohneDatum», keine Verjährung, keine Linie', () => {
    const h = rendern([{ id: 4, creditor: 'Ohne Datum AG', amount: 50, rolle: 'schulde' }]);
    expect(h).toContain('schulden.verlustschein.ohneDatum');
    expect(h).not.toContain('schulden.verlustschein.verjaehrt');
    expect(h).not.toContain('schulden.verlustschein.zeitachse.label');
    expect(h).not.toContain('schulden.verlustschein.zeitachse.heute');
  });
  it('Zeitachse steht im Tab, sobald ein Eintrag ein Datum hat', () => {
    expect(rendern([schulde])).toContain('schulden.verlustschein.zeitachse.label');
  });
  it('Alter Eintrag im deutschen Datumsformat wird gelesen', () => {
    const h = rendern([{ id: 5, creditor: 'Alt AG', amount: 5, date: '15.3.2021' }]);
    expect(h).toContain('schulden.verlustschein.verjaehrt{"datum":"15.03.2041"}');
  });
  it('Quelltext: Bearbeiten-Zustand, Rollen-Select zuerst, ein Namensfeld je Rolle, Fokus', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/\[bearbeite, setBearbeite\] = useState\(/);
    expect(q).toMatch(/schulden\.verlustschein\.rolle\.label/);
    expect(q).toMatch(/'rolle'/);
    expect(q).toMatch(/\.focus\(\)/);
  });
  it('Neuer Eintrag: ohne erfundenes Datum, im Bearbeiten-Modus (Quelltext)', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/handleAddVerlustschein = \(\) => \{[\s\S]*?date: ''[\s\S]*?setBearbeite\(entry\.id\)/);
  });
});

describe('⑤ · Bearbeiten-Modus (Zustand über startBearbeite)', () => {
  const rendern = (e) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t, data: { schulden: [], betreibung: [], verlustscheine: [e], finanzen: {}, basis: {} }, onSave: () => {}, onNavigate: () => {}, startView: 'verlustscheine', startBearbeite: e.id,
  })).replace(/&quot;/g, '"');
  const nameFelder = (h) => [...h.matchAll(/aria-label="(schulden\.(?:creditor|debtor))"/g)].map(m => m[1]);
  it('rolle «schulde»: Rollen-Select zuerst, danach nur das Gläubiger-Feld', () => {
    const h = rendern({ id: 1, creditor: 'Bank Alpha', amount: 1, date: '2021-03-15', rolle: 'schulde' });
    expect(h.indexOf('<select')).toBeGreaterThan(-1);
    expect(h.indexOf('<select')).toBeLessThan(h.indexOf('<input'));
    expect(nameFelder(h)).toEqual(['schulden.creditor']);
    expect(h).toContain('schulden.verlustschein.fertig');
  });
  it('rolle «geschuldet»: nur das Schuldner-Feld', () => {
    expect(nameFelder(rendern({ id: 2, debtor: 'Frau Muster', amount: 1, date: '2010-06-01', rolle: 'geschuldet' }))).toEqual(['schulden.debtor']);
  });
  it('ohne Rolle: beide Namensfelder und die Rollen-Auswahl', () => {
    const h = rendern({ id: 3, creditor: 'A', debtor: 'B', amount: 1, date: '2020-01-01' });
    expect(nameFelder(h).sort()).toEqual(['schulden.creditor', 'schulden.debtor']);
    expect(h).toContain('<select');
    expect(h).toContain('schulden.verlustschein.rolle.schulde');
    expect(h).toContain('schulden.verlustschein.rolle.geschuldet');
  });
  it('Touch-Ziel: Knöpfe mindestens 44 px', () => {
    const h = rendern({ id: 1, creditor: 'Bank Alpha', amount: 1, rolle: 'schulde' });
    expect(h).toMatch(/<button[^>]*min-height:44px[^>]*>[^<]*schulden\.verlustschein\.fertig/);
  });
});

// Task 6 (Schulden R2, 05.10.2026): Betreibung als Lesezeile, Zeitleiste der ERFASSTEN Daten, Verbindung zur Forderung.
describe('④ · BetreibungZeitleiste — nur erfasste Registerdaten', () => {
  const eintraege = [
    { id: 1, creditor: 'Amt Alpha', registerDate: '2022-03-15', amount: 900 },
    { id: 2, creditor: 'Firma Beta', registerDate: '2023-06-01', amount: 150 },
    { id: 3, creditor: 'Ohne Datum AG', registerDate: '', amount: 50 },
  ];
  const html = renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, eintraege, heute: '2026-10-05' })).replace(/&quot;/g, '"');
  it('zwei Einträge mit Datum: zwei Punkte, Datum als Text', () => {
    expect((html.match(/<li/g) || []).length).toBe(2);
    expect((html.match(/data-punkt/g) || []).length).toBe(2);
    expect(html).toContain('schulden.betreibung.zeitleiste.eingetragen{"datum":"15.03.2022"}');
    expect(html).toContain('schulden.betreibung.zeitleiste.eingetragen{"datum":"01.06.2023"}');
  });
  it('Mutationswächter: kein errechnetes Ende (Registerdatum + 5 Jahre) im Markup', () => {
    expect(html).not.toContain('2027');
    expect(html).not.toContain('2028');
    expect(html).not.toMatch(/endet|erlischt|bis zum/);
    expect(html).not.toContain('auszugRegel');
  });
  it('Eintrag ohne Datum: nicht auf der Leiste', () => {
    expect(html).not.toContain('Ohne Datum AG');
  });
  it('Liste mit role="list", ein Ton, kein Rot, «heute» als Text', () => {
    expect(html).toMatch(/<ol[^>]*role="list"/);
    expect(html).not.toMatch(/rose|#c0|red/i);
    expect(html).toContain('schulden.betreibung.zeitleiste.heute{"datum":"05.10.2026"}');
  });
  it('«heute» und Punkte bleiben auf der Spur, auch bei Datum nach heute', () => {
    const spaet = renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, heute: '2026-10-05',
      eintraege: [{ id: 1, creditor: 'A', registerDate: '2026-12-01' }, { id: 2, creditor: 'B', registerDate: '2026-10-05' }] }));
    const links = [...spaet.matchAll(/left:(-?[\d.]+)%/g)].map(m => Number(m[1]));
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) { expect(l).toBeGreaterThanOrEqual(0); expect(l).toBeLessThanOrEqual(100); }
    for (const m of spaet.matchAll(/left:([\d.]+)%[^"]*?transform:translateX\(-([\d.]+)%\)/g)) expect(m[2]).toBe(m[1]);
  });
  it('nichts zu zeigen: leer', () => {
    expect(renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, eintraege: [{ id: 3, creditor: 'X', registerDate: '' }], heute: '2026-10-05' }))).toBe('');
    expect(renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, eintraege: [], heute: '2026-10-05' }))).toBe('');
  });
});

describe('④ · Tab «Betreibung» — Lesezeile, Regeltext, Verbindung', () => {
  const rendern = (betreibung, schulden = [], overrides = {}) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t, data: { schulden, betreibung, verlustscheine: [], finanzen: {}, basis: {} }, onSave: () => {}, onNavigate: () => {}, startView: 'betreibung', ...overrides,
  })).replace(/&quot;/g, '"');
  const kreditkarte = { id: 7, creditor: 'Kreditkarte', amount: 4500, status: 'open', category: 'kredit', stufe: 'zahlungsbefehl' };
  const bt = { id: 1, creditor: 'Amt Alpha', amount: 900, registerDate: '2022-03-15', status: 'open' };

  it('Lesezeile: Name, Betrag, Datum, Status, «Bearbeiten» mit Namen — keine offenen Felder', () => {
    const h = rendern([bt]);
    expect(h).toContain('Amt Alpha');
    expect(h).toContain('15.03.2022');
    expect(h).toContain('schulden.statusOpen');
    expect(h).toContain('aria-label="schulden.betreibung.bearbeiten Amt Alpha"');
    expect(h).not.toContain('<input');
    expect(h).not.toContain('<select');
  });
  it('Regeltext 8a Abs. 4 steht, sobald es Einträge gibt — auch ohne Registerdatum', () => {
    expect(rendern([bt])).toContain('schulden.betreibung.auszugRegel');
    expect(rendern([{ id: 2, creditor: 'Ohne Datum AG', amount: 5, registerDate: '', status: 'open' }])).toContain('schulden.betreibung.auszugRegel');
    expect(rendern([])).not.toContain('schulden.betreibung.auszugRegel');
  });
  it('Eintrag ohne Datum: «ohneDatum» in der Liste, nicht auf der Leiste', () => {
    const h = rendern([{ id: 2, creditor: 'Ohne Datum AG', amount: 5, registerDate: '', status: 'open' }]);
    expect(h).toContain('schulden.betreibung.ohneDatum');
    expect(h).not.toContain('schulden.betreibung.zeitleiste.label');
  });
  it('verbundene Forderung: «verbundenMit» mit Name', () => {
    const h = rendern([{ ...bt, forderungId: 7 }], [kreditkarte]);
    expect(h).toContain('schulden.betreibung.verbundenMit{"name":"Kreditkarte"}');
    expect(h).not.toContain('schulden.betreibung.keineVerbindung');
  });
  it('gelöschte Forderung: «keineVerbindung», kein Absturz', () => {
    const h = rendern([{ ...bt, forderungId: 99 }], [kreditkarte]);
    expect(h).toContain('schulden.betreibung.keineVerbindung');
    expect(h).not.toContain('schulden.betreibung.verbundenMit');
  });
  it('Hinweiszeile nur für Zahlungsbefehl OHNE verbundene Betreibung', () => {
    expect(rendern([bt], [kreditkarte])).toContain('schulden.bild.ausForderungen');
    expect(rendern([{ ...bt, forderungId: 7 }], [kreditkarte])).not.toContain('schulden.bild.ausForderungen');
  });
  it('Quelltext: Verbindung als Zahl, ohne Automatik', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/forderungId/);
    expect(q).toMatch(/Number\(/);
  });
  it('Neuer Eintrag: KEIN automatisches «heute», direkt im Bearbeiten-Modus (Quelltext)', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    const fn = q.match(/handleAddBetreibung = \(\) => \{[\s\S]*?\n {2}\};/)[0];
    expect(fn).toMatch(/registerDate: ''/);
    expect(fn).not.toMatch(/heuteIso/);
    expect(fn).toMatch(/setBearbeite\(entry\.id\)/);
  });
  it('Löschen lässt den Fokus nicht auf body fallen (Quelltext)', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../SchuldenManager.jsx'), 'utf8');
    expect(q).toMatch(/handleDeleteBetreibung = [\s\S]*?fokusNach\.current = /);
  });
});

describe('④ · Bearbeiten-Modus Betreibung (Zustand über startBearbeite)', () => {
  const kreditkarte = { id: 7, creditor: 'Kreditkarte', amount: 4500, status: 'open', stufe: 'zahlungsbefehl' };
  const bezahlt = { id: 8, creditor: 'Zahnarzt', amount: 680, status: 'paid' };
  const rendern = (e, schulden = [kreditkarte, bezahlt]) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t, data: { schulden, betreibung: [e], verlustscheine: [], finanzen: {}, basis: {} }, onSave: () => {}, onNavigate: () => {}, startView: 'betreibung', startBearbeite: e.id,
  })).replace(/&quot;/g, '"');
  const e1 = { id: 1, creditor: 'Amt Alpha', amount: 900, registerDate: '2022-03-15', status: 'open' };
  it('Select «Verbunden mit»: leere Wahl + offene Forderungen, keine bezahlte', () => {
    const h = rendern(e1);
    expect(h).toContain('aria-label="schulden.betreibung.verbinden"');
    expect(h).toContain('>Kreditkarte');
    expect(h).not.toMatch(/<option[^>]*>Zahnarzt/);
  });
  it('gewählte Forderung ist ausgewählt', () => {
    expect(rendern({ ...e1, forderungId: 7 })).toMatch(/<option value="7" selected/);
  });
  it('Fertig-Knopf mit Namen, mindestens 44 px', () => {
    const h = rendern(e1);
    expect(h).toContain('aria-label="schulden.betreibung.fertig Amt Alpha"');
    expect(h).toMatch(/<button[^>]*min-height:44px[^>]*>[^<]*schulden\.betreibung\.fertig/);
  });
});

describe('④ · Nachweis aus de.js — Wortlaut SchKG 8a Abs. 4', () => {
  it('drei Sätze wörtlich (Sie-Form)', () => {
    const r = de.schulden.betreibung.auszugRegel;
    expect(r.sie).toBe('Dritte sehen eine Betreibung im Auszug bis fünf Jahre nach Abschluss des Verfahrens (SchKG Art. 8a Abs. 4). Wann Ihr Verfahren als abgeschlossen gilt, kann Ihnen das Betreibungsamt sagen. Behörden mit einem hängigen Verfahren können auch danach noch Auszüge verlangen.');
    expect(r.du).toContain('Wann dein Verfahren als abgeschlossen gilt, kann dir das Betreibungsamt sagen.');
  });
});
