import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV, calculateSozialhilfe } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren } from '../config/__tests__/ipvBelegtSimulieren.js';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { zahl } from '../utils/geld.js';

// ─────────────────────────────────────────────────────────────
// Leistungsliste auf dem Dashboard (25.09.2026): Schnell-Check und Leistungen sind
// eine Liste. Zwei Regeln, die sonst nur als Kommentar stünden:
//  1. Greift Sozialhilfe, zählt die IPV NICHT zusätzlich zum Total — sie wird
//     angerechnet (BS GKV § 17 Abs. 3), wie im vollen Schnellcheck. Bis 25.09.
//     zählte das Dashboard beide zusammen.
//  2. Die IPV-Zeile sagt dann «angerechnet» (schnellcheck.ipvSubsumed), nie
//     «kein Anspruch»; die Sozialhilfe-Zeile sagt ohne Aufstockung etwas Sachliches
//     (pegel.covered) statt eines Nein-Satzes.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (props) => renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, ...props }));
// Dieselbe Formatierung wie die Anzeige (Schweizer Tausender-Apostroph ’).
const betrag = (n) => '≈ CHF ' + zahl(n, { hoechstens: 2 });

const profil = (monthlyIncome) => ({
  basis: { canton: 'BS', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome, incomeType: 'netto' },
  wohnen: { rentAmount: 1000 },
  versicherungen: { kkPremium: 450 },
});

describe('Dashboard-Leistungsliste · IPV und Sozialhilfe', () => {
  let zuruecksetzen;
  beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['BS']); });
  afterAll(() => zuruecksetzen());

  it('Voraussetzung: bei 1000/Monat greifen beide', () => {
    expect(calculateIPV(profil(1000)).eligible).toBe(true);
    expect(calculateSozialhilfe(profil(1000)).eligible).toBe(true);
  });

  it('das Total ist die Sozialhilfe allein, die IPV-Zeile sagt «angerechnet»', () => {
    const html = render({ data: profil(1000) });
    const soz = calculateSozialhilfe(profil(1000)).deficit;
    const ipv = calculateIPV(profil(1000)).amount;
    expect(html).toContain(betrag(soz) + ' / schnellcheck.monat');
    expect(html).not.toContain(betrag(soz + ipv));
    expect(html).toContain('schnellcheck.ipvSubsumed');
    expect(html).not.toContain('dashboard.quickCheckNoResult');
  });

  it('ohne Aufstockung: sachlicher Satz und Pegel, kein Nein-Satz', () => {
    const html = render({ data: profil(6000) });
    expect(calculateSozialhilfe(profil(6000)).eligible).toBe(false);
    expect(html).toContain('pegel.covered');
    expect(html).toContain('pegel.bedarf');
    expect(html).not.toContain('dashboard.quickCheckNoResult');
    expect(html).not.toContain('sozialhilfeCalc.notEntitled');
  });
});

// ─────────────────────────────────────────────────────────────
// Steuer-Säulen (Instrument, 25.09.2026): EINE Zahl, die Bundessteuer — dieselbe
// Rechnung wie Steuerrechner und Finanz-Übersicht (E39: steuernFuerProfil).
// ─────────────────────────────────────────────────────────────
describe('Instrument Steuer-Säulen', () => {
  it('zeigt die Bundessteuer aus steuernFuerProfil, ohne Einkommen «einrichten»', async () => {
    const { InstrumentePanel } = await import('../components/InstrumentePanel.jsx');
    const { steuernFuerProfil, steuerEingabenAusDaten } = await import('../data/kantonaleSteuerdaten.js');
    const data = { basis: { canton: 'ZH', maritalStatus: 'ledig', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 6200 } };
    const erwartet = Math.round(steuernFuerProfil(steuerEingabenAusDaten(data)).bund.steuer);
    expect(erwartet).toBeGreaterThan(0);
    const mit = renderToStaticMarkup(React.createElement(InstrumentePanel, { palette, t, data, onNavigate: () => {}, eingebettet: true }));
    expect(mit).toContain('instrumente.steuerBetrag(' + zahl(erwartet) + ')');
    const ohne = renderToStaticMarkup(React.createElement(InstrumentePanel, { palette, t, data: { basis: {} }, onNavigate: () => {}, eingebettet: true }));
    expect(ohne).not.toContain('instrumente.steuerBetrag');
    expect(ohne).toContain('instrumente.setup');
  });
});

// ─────────────────────────────────────────────────────────────
// Einkommen brutto ODER netto (25.09.2026): gerechnet wird mit netto; brutto wird geschätzt
// umgerechnet (bruttoZuNettoRichtwert). Ohne bekannte Art kein Vorbefüllen.
// ─────────────────────────────────────────────────────────────
describe('Dashboard-Leistungsliste · Einkommen brutto/netto', () => {
  let zuruecksetzen;
  beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['BS']); });
  afterAll(() => zuruecksetzen());

  it('Art offen: Feld leer, Hinweis statt Rechnung', () => {
    const p = profil(1000); delete p.finanzen.incomeType;
    const html = render({ data: p });
    expect(html).toContain('einkommensart.offenNetto');
    expect(html).not.toContain('schnellcheck.ipvSubsumed');
    expect(html).toContain('schnellcheck.enterIncome');
  });

  it('brutto: rechnet mit dem geschätzten Netto und zeigt es an', async () => {
    const { bruttoZuNettoRichtwert } = await import('../data/ahvRechner.js');
    const p = profil(1100); p.finanzen.incomeType = 'brutto';
    const netto = bruttoZuNettoRichtwert(1100);
    const html = render({ data: p });
    expect(html).toContain('einkommensfeld.nettoGeschaetzt(' + zahl(netto) + ')');
    // Eine Wahrheit (Predeploy 25.09.2026): die Sozialhilfe-Rechnung mit dem BRUTTO-Profil ergibt
    // dieselbe Lücke wie das Dashboard — sie rechnet brutto selbst um.
    const soz = calculateSozialhilfe(p).deficit;
    expect(calculateSozialhilfe(p).einkommenGeschaetzt).toBe(true);
    expect(html).toContain(betrag(soz) + ' / schnellcheck.monat');
  });

  it('brutto nahe am Bedarf: «knapp» — bei netto nicht', () => {
    // Bedarf BS, 1 Person, Miete 1000, KK 450 → Netto knapp darunter
    const bedarf = calculateSozialhilfe(profil(0)).totalBedarf;
    // 3 % über dem Bedarf: innerhalb der Knapp-Schwelle, aber nicht gleich (Gegenprobe mit Schwelle 0 → rot)
    const brutto = Math.round(bedarf * 1.03 / 0.936);   // unter der BVG-Schwelle: netto = brutto × 0.936
    const p = profil(brutto); p.finanzen.incomeType = 'brutto';
    expect(render({ data: p })).toContain('einkommensfeld.knapp');
    expect(render({ data: profil(Math.round(bedarf * 1.03)) })).not.toContain('einkommensfeld.knapp');
  });
});

describe('istKnapp — einseitige Schwelle (Fachprüfung 25.09.2026)', () => {
  it('97 %–110 % des Bedarfs, ohne Alter bis 115 %', async () => {
    const { istKnapp } = await import('../components/EinkommenFeld.jsx');
    const sh = (q) => ({ totalBedarf: 3000, income: 3000 * q });
    expect(istKnapp(sh(0.96))).toBe(false);
    expect(istKnapp(sh(0.97))).toBe(true);
    expect(istKnapp(sh(1.10))).toBe(true);
    expect(istKnapp(sh(1.12))).toBe(false);
    expect(istKnapp(sh(1.12), true)).toBe(true);
    expect(istKnapp(sh(1.16), true)).toBe(false);
    expect(istKnapp(null)).toBe(false);
  });
});
