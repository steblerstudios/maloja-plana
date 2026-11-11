// Ihr Haus in der Strasse = das Drittel-Haus klein (Stebler Studios 11.11.2026: «dieses Haus in die Stadt … das was
// heute Ihre Miete ist ersetzen», «ja genau cool»). Höhe = Miete, darin Füllung = Anteil und Drittel-Linie.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RegionalBarometer, HaeuserzeileKlein } from '../components/RegionalBarometer.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#555', soft: '#777', sand: '#c90', sage: '#6a6', gold: '#b80', sky: '#69c', skyDeep: '#357', roseDeep: '#a33', goldDeep: '#850', sageDeep: '#363' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const vergleich = { regional: 1732, national: 1446, year: 2024 };
const zeile = (p) => renderToStaticMarkup(React.createElement(RegionalBarometer, { palette, t, comparison: vergleich, userValue: 1900, kind: 'rent', form: 'haeuser', fillColor: '#7a5', ...p }));
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('Ihr Haus in der Strasse', () => {
  it('ist das Drittel-Haus: Füllung = Anteil der Haushöhe, Drittel-Linie bei einem Drittel', () => {
    const h = zeile({ drittel: { anteil: 30, ueberDrittel: false } });
    expect(h).toContain('data-teil="sie-drittel-haus"');
    const f = h.match(/<rect data-teil="sie-drittel-fuellung"[^>]*>/)[0];
    const l = h.match(/<line data-teil="sie-drittel-linie"[^>]*>/)[0];
    const hoehe = 84 - Number(l.match(/y1="([\d.]+)"/)[1]);           // ein Drittel der Haushöhe
    expect(Number(f.match(/height="([\d.]+)"/)[1])).toBeCloseTo(hoehe * 3 * 0.3, 6);
    expect(l).toContain('stroke="#111"');
  });
  it('über einem Drittel Rosé, mit Partner/in (ohne Urteil) nicht', () => {
    expect(zeile({ drittel: { anteil: 41, ueberDrittel: true } }).match(/<line data-teil="sie-drittel-linie"[^>]*>/)[0]).toContain('stroke="#a33"');
    expect(zeile({ drittel: { anteil: 41, ueberDrittel: true, mitPartner: true } }).match(/<line data-teil="sie-drittel-linie"[^>]*>/)[0]).toContain('stroke="#111"');
  });
  it('die Drittel-Linie quer über die Strasse entfällt, der Satz und das aria-Label bleiben', () => {
    const h = zeile({ drittel: { anteil: 41, ueberDrittel: true }, thresholdValue: 1700, showThresholdText: true });
    expect(h).not.toContain('data-teil="drittel-linie"');
    expect(h).toContain('thresholdBreachedLine');
  });
  it('ohne Einkommen (kein Anteil) bleibt Ihr Haus gefüllt wie bisher', () => {
    const h = zeile({ drittel: { anteil: null } });
    expect(h).not.toContain('sie-drittel-haus');
  });
  it('auch klein auf der Kachel', () => {
    const h = renderToStaticMarkup(React.createElement(HaeuserzeileKlein, { palette, comparison: vergleich, userValue: 1900, fillColor: '#7a5', drittel: { anteil: 30 } }));
    expect(h).toContain('data-teil="sie-drittel-haus"');
  });
  it('alle vier Orte geben die eine Wohnkosten-Rechnung mit', () => {
    expect(quelle('../components/WohnkostenInstrument.jsx')).toMatch(/form: 'haeuser', maxBreite: INSTRUMENT_GROESSE\.gross, drittel: r,/);
    expect(quelle('../components/MietVergleich.jsx')).toMatch(/drittel: r,/);
    expect(quelle('../BudgetSync.jsx')).toMatch(/drittel: wohn,/);
    expect(quelle('../components/InstrumentePanel.jsx')).toMatch(/h\(HaeuserzeileKlein, \{[^}]*drittel: wohnR \}/);
  });
});

describe('Vergleichshaus gross (Stebler Studios 11.11.2026: Kanton, Schweiz «zu einem vereinen», Fahnen je Stock, Tür = Tonne)', () => {
  const gross = (p) => zeile({ drittel: { anteil: 30 }, maxBreite: 256, kanton: 'ZG', ...p });
  it('ein Haus statt zwei: Kanton und Schweiz als Stöcke auf derselben Skala wie Ihr Haus', () => {
    const h = gross();
    expect(h).toContain('data-teil="vergleichs-haus"');
    const yK = Number(h.match(/data-teil="stock-kanton"[^>]*y1="([\d.]+)"/)[1]);
    const yN = Number(h.match(/data-teil="stock-schweiz"[^>]*y1="([\d.]+)"/)[1]);
    expect(yK).toBeLessThan(yN);                         // Region 1732 höher als Schweiz 1446
    expect(h).toMatch(/data-teil="stock-kanton"[^>]*stroke="#b80"/);   // Ihre Miete 1900 über der Region: gold
    expect(h).toMatch(/data-teil="stock-schweiz"[^>]*stroke-dasharray="5 3"/);
  });
  it('Fahnen je Stock: «ZG 1’732» und «CH Ø 1’446», mindestens 13 px bei 256', () => {
    const h = gross();
    expect(h).toMatch(/data-teil="fahne-kanton"[^>]*>ZG 1’732</);
    expect(h).toMatch(/data-teil="fahne-schweiz"[^>]*>CH Ø 1’446</);
    const s = Number(h.match(/data-teil="fahne-kanton"[^>]*font-size="([\d.]+)"/)[1]);
    expect(s * 256 / 132).toBeGreaterThanOrEqual(13);
  });
  it('Tür = Tonne: grau gefüllt nach Einkommen gegen Grenze, Grenze als Linie; ohne Programm schlicht', () => {
    const mit = gross({ tuer: { programm: true, stand: { mode: 'clear', fraction: 0.5 }, farbe: '#5A6472' } });
    const f = mit.match(/<rect data-teil="tuer-fuellung"[^>]*>/)[0];
    expect(f).toContain('fill="#5A6472"');
    expect(Number(f.match(/height="([\d.]+)"/)[1])).toBeCloseTo(24 * 0.5 / 1.25, 6);
    expect(mit).toContain('data-teil="tuer-grenze"');
    const ohne = gross({ tuer: { programm: false, stand: null } });
    expect(ohne).toContain('data-programm="nein"');
    expect(ohne).not.toContain('tuer-fuellung');
  });
  it('der Wegweiser steht IN der Strasse rechts vom Vergleichshaus, auf dem Boden, ausserhalb des Bildes (role=img)', () => {
    const h = gross({ tuer: { programm: true, stand: null, schild: React.createElement('span', { id: 'weg' }, 'W') } });
    expect(h).toMatch(/data-teil="strasse-mit-schild"[\s\S]*data-teil="wegweiser-in-strasse"[^>]*><span id="weg">W<\/span>/);
    const bild = h.slice(h.indexOf('role="img"'), h.indexOf('data-teil="wegweiser-in-strasse"'));
    expect(bild).not.toContain('id="weg"');
    expect(h).toMatch(/padding-bottom:49\.4\d*%/);   // Boden 84 von 170
  });
  it('C · Fahne am Kanton-Stock: «Sie −13 %» aus lageZurRegion, aussen rechts, Rand in der Lage-Farbe', () => {
    const h = gross({ userValue: 1500 });   // 1500 gegen 1732 → −13 %, salbei
    const f = h.slice(h.indexOf('data-teil="fahne-abstand"'));
    expect(h).toMatch(/data-teil="fahne-abstand" data-ort="aussen"/);
    expect(f).toMatch(/stroke="#6a6"/);
    expect(f).toMatch(/>Sie −13 %</);
    expect(gross({ userValue: 1740 })).toMatch(/>Sie ≈ 0 %</);
    expect(gross({ userValue: 1900 })).toMatch(/data-teil="fahne-abstand"[\s\S]*>Sie \+10 %</);
  });
  it('Schrift der Strasse auch bei 375 px Bildschirm (Strasse ~319 px) mindestens 13 px', () => {
    const h = gross();
    const s = Number(h.match(/data-teil="fahne-kanton"[^>]*font-size="([\d.]+)"/)[1]);
    expect(s * 319 / 170).toBeGreaterThanOrEqual(13);
  });
  it('EU als Stock: gepunktet blau, Prozent-Fahne, unter dem Schweizer Stock', () => {
    const h = gross({ ausland: { eu: { hoehe: 679, pct: -53 } } });
    expect(h).toMatch(/data-teil="stock-eu"[^>]*stroke="#357"/);
    expect(h).toMatch(/data-teil="fahne-eu"[^>]*>EU −53 %</);
    const yN = Number(h.match(/data-teil="stock-schweiz"[^>]*y1="([\d.]+)"/)[1]);
    const yE = Number(h.match(/data-teil="stock-eu"[^>]*y1="([\d.]+)"/)[1]);
    expect(yE).toBeGreaterThan(yN);
  });
  it('unter den Häusern nur noch Ihr Betrag; die Legenden-Zeilen entfallen (aria-Label bleibt)', () => {
    const h = gross();
    const b = h.slice(h.indexOf('data-teil="strasse-betraege"'));
    expect(b).toContain('1’900');
    expect(b).not.toContain('strasse.regionKanton');
    expect(h).not.toMatch(/>po\.regionalCompare\.nationalVal/);
    expect(h).toMatch(/aria-label="[^"]*po\.regionalCompare\.rent\.yourVal/);
  });
  it('mittel (Mietzins, Budget) bleibt bei drei Häusern und den Legenden-Zeilen', () => {
    const h = zeile({ drittel: { anteil: 30 }, kanton: 'ZG' });
    expect(h).not.toContain('vergleichs-haus');
    expect(h).toMatch(/>po\.regionalCompare\.nationalVal/);
  });
  it('Kapitel gibt die Tür aus derselben Mietbeiträge-Einschätzung mit; die Szene darunter ohne Tonne', () => {
    const w = quelle('../components/WohnkostenInstrument.jsx');
    expect(w).toMatch(/const mz = canton \? mietzinsEinschaetzung\(allData, canton\) : null;/);
    expect(w).toMatch(/tuer: strassenTuer,/);
    expect(w).toMatch(/React\.createElement\(MietzinsSzene, \{ palette, t, data: allData, isDarkMode, onNavigate, ohneTuer: !!vergleich \}\)/);
  });
});
