// Die Strasse Wohnen (Stebler Studios 11.11.2026; seit 18.11.2026 nach dem Bauplan Wohnen: drei Fragen, eine Strasse,
// jedes Bild einmal). Drittel-Haus (Frage A) · Vergleichshaus mit Tür = Fass (Frage B + C) · Wegweiser «möglich ›».
// Bis 18.11.2026 prüfte diese Datei die Häuserzeile im RegionalBarometer (form 'haeuser', «Sie»-Drittel-Haus darin).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WohnenStrasse, Vergleichshaus, lageZurRegion } from '../bereiche/wohnen/wohnen.js';
import { INSTRUMENT_GROESSE } from '../config/tokens.js';
import { PEGEL_SCALE } from '../data/pegel.js';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#555', soft: '#777', sand: '#c90', sage: '#6a6', gold: '#b80', sky: '#69c', skyDeep: '#357', roseDeep: '#a33', goldDeep: '#850', sageDeep: '#363' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const vergleich = { regional: 1732, national: 1446, diffPct: 19.8, year: 2024, roomKey: 'r3' };
const lage = (netto, p = {}) => ({ kanton: 'ZG', netto, vergleich, lage: lageZurRegion(netto, vergleich.regional), ...p });
const haus = (p = {}) => renderToStaticMarkup(React.createElement(Vergleichshaus, { palette, lage: lage(1900), fuell: '#7a5', kanton: 'ZG', groesse: 'gross', ...p }));
const r = (p = {}) => ({ anteil: 30, ueberDrittel: false, mitPartner: false, brutto: false, haushalt: false, kosten: 1830, einkommen: 6100, partnerEinkommen: 0, ...p });
const strasse = (p = {}) => renderToStaticMarkup(React.createElement(WohnenStrasse, { palette, t, r: r(), ml: lage(1900), hilfe: null, groesse: 'gross', isDarkMode: false, ...p }));
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const tag = (h, teil) => (h.match(new RegExp('<[^>]*data-teil="' + teil + '"[^>]*>')) || [''])[0];

describe('Frage A · Ihr Haus in der Strasse ist das Drittel-Haus', () => {
  it('das Drittel-Haus steht in der Strasse, mit Drittel-Linie in graphit', () => {
    const h = strasse();
    expect(h).toContain('data-teil="strasse-drittel"');
    expect(tag(h, 'drittel-haus-drittel')).toContain('stroke="#111"');
  });
  it('über einem Drittel Rosé, mit Partner/in (ohne Urteil) nicht', () => {
    expect(tag(strasse({ r: r({ anteil: 41, ueberDrittel: true }) }), 'drittel-haus-drittel')).toContain('stroke="#a33"');
    expect(tag(strasse({ r: r({ anteil: 41, ueberDrittel: true, mitPartner: true }) }), 'drittel-haus-drittel')).toContain('stroke="#111"');
  });
  // Überholt 18.11.2026 (Bauplan Wohnen): die Drittel-Linie quer über die Strasse gibt es nicht mehr; das Drittel trägt
  // nur das Drittel-Haus. Der Satz «mehr als ein Drittel» steht darunter (drittel-satz im Kapitel).
  it('keine Drittel-Linie quer über die Strasse, nur die Linie im Drittel-Haus', () => {
    const h = strasse({ r: r({ anteil: 41, ueberDrittel: true }) });
    expect(h).not.toContain('data-teil="drittel-linie"');
    expect((h.match(/data-teil="drittel-haus-drittel"/g) || []).length).toBe(1);
  });
  it('ohne Einkommen (kein Anteil): kein Drittel-Haus, das Vergleichshaus bleibt', () => {
    const h = strasse({ r: r({ anteil: null }) });
    expect(h).not.toContain('data-teil="drittel-haus"');
    expect(h).toContain('data-teil="vergleichs-haus"');
  });
  // Überholt 18.11.2026 (Bauplan Wohnen): auf der Kachel «Miete» steht kein Drittel-Haus mehr in der Häuserzeile,
  // sondern das Vergleichshaus klein; das Drittel-Haus klein trägt die Kachel «Wohnkosten» (instrumenteWohnen.test.js).
  it('die Kacheln: Drittel-Haus klein für Wohnkosten, Vergleichshaus klein für Miete — aus derselben Rechnung', () => {
    const panel = quelle('../components/InstrumentePanel.jsx');
    expect(panel).toMatch(/const wohnR = wohnkostenRechnung\(data\?\.wohnen, data, null\);/);
    expect(panel).toMatch(/h\(DrittelHaus, \{[^}]*groesse: 'klein'/);
    expect(panel).toMatch(/h\(Vergleichshaus, \{[^}]*netto: wohnR\.netto[^}]*\}[^)]*groesse: 'klein' \}/);
  });
  it('Kapitel, Werkzeug und Budget rechnen mit der einen Wohnkosten-Rechnung', () => {
    const z = quelle('../bereiche/wohnen/zuhause.jsx');
    expect(z).toMatch(/const r = wohnkostenRechnung\(wohnen, data, probe\);/);
    expect(z).toMatch(/h\(WohnenStrasse, \{ palette, t, r, ml, hilfe, groesse: 'gross'/);
    expect(z).toMatch(/h\(WohnenStrasse, \{ palette, t, r, ml, hilfe, groesse: 'mittel'/);
    expect(quelle('../BudgetSync.jsx')).toMatch(/const wohn = useMemo\(\(\) => wohnkostenRechnung\(data\?\.wohnen, data\), \[data\]\);/);
  });
});

describe('Frage B · Vergleichshaus (Stebler Studios 11.11.2026: Kanton, Schweiz «zu einem vereinen», Fahnen je Stock, Tür = Fass)', () => {
  it('ein Haus: Kanton und Schweiz als Stöcke auf derselben Skala wie Ihre Miete', () => {
    const h = haus();
    expect(h).toContain('data-teil="vergleichs-haus"');
    const yK = Number(tag(h, 'stock-kanton').match(/y1="([\d.]+)"/)[1]);
    const yN = Number(tag(h, 'stock-schweiz').match(/y1="([\d.]+)"/)[1]);
    expect(yK).toBeLessThan(yN);                                       // Kanton 1732 höher als Schweiz 1446
    expect(tag(h, 'stock-kanton')).toContain('stroke="#b80"');          // Ihre Miete 1900 über dem Kanton: gold
    expect(tag(h, 'stock-schweiz')).toContain('stroke-dasharray="4 3"');
    expect(tag(h, 'vergleich-fuellung')).toContain('fill="#7a5"');      // Füllung = Ihre Nettomiete, Wohnen-Farbe
  });
  it('Lage-Farbe mit ±2 %-Schwelle: darunter salbei, etwa gleich neutral', () => {
    expect(tag(haus({ lage: lage(1500) }), 'stock-kanton')).toContain('stroke="#6a6"');
    expect(tag(haus({ lage: lage(1760) }), 'stock-kanton')).toContain('stroke="#555"');
  });
  it('Fahnen je Stock: «ZG 1’732» und «CH Ø 1’446», mindestens 13 px auf der halben Bildbreite', () => {
    const h = haus();
    expect(h).toMatch(/data-teil="fahne-kanton"[^>]*>ZG 1’732</);
    expect(h).toMatch(/data-teil="fahne-schweiz"[^>]*>CH Ø 1’446</);
    const s = Number(tag(h, 'fahne-kanton').match(/font-size="([\d.]+)"/)[1]);
    expect(s * INSTRUMENT_GROESSE.gross * 0.55 / 100).toBeGreaterThanOrEqual(13);
  });
  it('Fahnen nur gross; mittel und klein ohne Wörter', () => {
    expect(haus({ groesse: 'mittel' })).not.toMatch(/<text/);
    expect(haus({ groesse: 'klein' })).not.toMatch(/<text/);
  });
  it('Tür = Fass: grau gefüllt nach Einkommen gegen Grenze, Grenze als Linie; ohne Programm schlicht', () => {
    const mit = haus({ tuer: { programm: true, fass: { mode: 'clear', fraction: 0.5 }, farbe: '#5A6472' } });
    expect(mit).toContain('data-fass="ja"');
    const f = tag(mit, 'tuer-fuellung');
    expect(f).toContain('fill="#5A6472"');
    expect(Number(f.match(/height="([\d.]+)"/)[1])).toBeCloseTo(24 * 0.5 / PEGEL_SCALE, 6);
    expect(mit).toContain('data-teil="tuer-grenze"');
    const ohne = haus({ tuer: { programm: false, fass: null } });
    expect(ohne).toContain('data-programm="nein"');
    expect(ohne).toContain('data-fass="nein"');
    expect(ohne).not.toContain('tuer-fuellung');
  });
  it('klein: schlichte Tür, auch wenn ein Fass da wäre', () => {
    const h = haus({ groesse: 'klein', tuer: { programm: true, fass: { mode: 'clear', fraction: 0.5 }, farbe: '#5A6472' } });
    expect(h).toContain('data-fass="nein"');
    expect(h).not.toContain('tuer-fuellung');
  });
  it('EU als Stock: gepunktet blau, Prozent-Fahne, unter dem Schweizer Stock — nur gross', () => {
    const mitEu = lage(1900, { ausland: { eu: { hoehe: 679, pct: -53 } } });
    const h = haus({ lage: mitEu });
    expect(tag(h, 'stock-eu')).toContain('stroke="#357"');
    expect(h).toMatch(/data-teil="fahne-eu"[^>]*>EU −53 %</);
    const yN = Number(tag(h, 'stock-schweiz').match(/y1="([\d.]+)"/)[1]);
    const yE = Number(tag(h, 'stock-eu').match(/y1="([\d.]+)"/)[1]);
    expect(yE).toBeGreaterThan(yN);
    expect(haus({ lage: mitEu, groesse: 'mittel' })).not.toContain('stock-eu');
  });
  it('ohne Vergleich: kein Bild', () => {
    expect(haus({ lage: null })).toBe('');
    expect(haus({ lage: { netto: 1900 } })).toBe('');
  });
});

describe('Die Strasse: Hauptzahlen unter dem Haus, Wegweiser auf dem Boden', () => {
  it('der Wegweiser steht IN der Strasse rechts vom Vergleichshaus, ausserhalb des Bildes', () => {
    const hilfe = { programm: true, fass: { mode: 'clear', fraction: 0.5 }, moeglich: true, url: 'https://zg.ch/x' };
    const h = strasse({ hilfe, onNavigate: () => {} });
    const vergleich = h.indexOf('data-teil="strasse-vergleich"');
    const weg = h.indexOf('data-teil="wegweiser-in-strasse"');
    expect(vergleich).toBeGreaterThan(-1);
    expect(weg).toBeGreaterThan(vergleich);
    const bild = h.slice(h.indexOf('data-teil="vergleichs-haus"'), h.indexOf('</svg>', h.indexOf('data-teil="vergleichs-haus"')));
    expect(bild).not.toContain('mietzins-cta');
    expect(h.slice(weg)).toContain('data-teil="mietzins-cta"');
  });
  it('kein Wegweiser über der Grenze und ohne Programm', () => {
    expect(strasse({ hilfe: { programm: true, fass: { mode: 'over', fraction: 1.25 }, moeglich: false } })).not.toContain('wegweiser-in-strasse');
    expect(strasse({ hilfe: { programm: false, fass: null, moeglich: false } })).not.toContain('wegweiser-in-strasse');
  });
  it('Regel «Zahl» (Matrix §10): keine Fahne «Sie» im Haus, die Lage steht gross unter dem Vergleichshaus', () => {
    const h = strasse({ ml: lage(1500) });                 // 1500 gegen 1732 → −13 %
    expect(h).not.toContain('fahne-abstand');
    expect(h).not.toMatch(/>Sie [−+≈]/);
    expect(h).toMatch(/data-instrument-zahl="miete"[^>]*font-size:[^;"]+[^>]*>−13 %</);
    expect(strasse({ ml: lage(1740) })).toMatch(/data-instrument-zahl="miete"[^>]*>≈ 0 %</);
    expect(strasse({ ml: lage(1900) })).toMatch(/data-instrument-zahl="miete"[^>]*>\+10 %</);
  });
  it('unter dem Vergleichshaus klein Ihr Betrag über betrag(), unter dem Drittel-Haus die Wohnkosten', () => {
    const h = strasse();
    expect(h).toMatch(/data-teil="strasse-betrag"[^>]*>strasse\.eigen: CHF 1’900</);
    expect(h).toMatch(/data-teil="wohnkosten-franken"[^>]*>wohnenInstrument\.titel: CHF 1’830</);
    expect(strasse({ ausprobiert: true })).toMatch(/data-teil="strasse-betrag"[^>]*>strasse\.ausprobiert: CHF 1’900</);
  });
});

describe('Frage C · die Tür kommt aus der einen Mietbeiträge-Einschätzung', () => {
  it('Kapitel und Werkzeug geben die Tür aus mietzinsHilfe mit (mietzinsEinschaetzung)', () => {
    expect(quelle('../bereiche/wohnen/rechnung.js')).toMatch(/const e = mietzinsEinschaetzung\(data, kanton\);/);
    const z = quelle('../bereiche/wohnen/zuhause.jsx');
    expect(z).toMatch(/const hilfe = mietzinsHilfe\(profil, /);
    expect(z).toMatch(/const tuer = hilfe \? \{ programm: hilfe\.programm, fass: hilfe\.fass, farbe: behoerden \} : null;/);
  });
});
