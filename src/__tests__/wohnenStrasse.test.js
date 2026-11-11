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

describe('Nachbarhäuser (Skizze B, Stebler Studios 11.11.2026)', () => {
  const gross = (p) => zeile({ drittel: { anteil: 30 }, maxBreite: 256, kanton: 'ZG', ...p });
  it('gross: Kanton-Kürzel im Regionshaus, «CH» im Schweizer Haus, Regionshaus hellgrün', () => {
    const h = gross();
    expect(h).toMatch(/<text data-teil="strasse-kuerzel"[^>]*>ZG<\/text>/);
    expect(h).toMatch(/>CH<\/text>/);
    expect(h).toMatch(/fill="#7a5" fill-opacity="0.18"/);
  });
  it('gross: Beträge direkt unter den Häusern, die Legenden-Zeilen entfallen', () => {
    const h = gross();
    const b = h.slice(h.indexOf('data-teil="strasse-betraege"'));
    expect(b).toContain('1’900');
    expect(b).toContain('1’732');
    expect(b).toContain('1’446');
    expect(b).toContain('strasse.regionKanton{&quot;kanton&quot;:&quot;ZG&quot;}');
    // sichtbar keine Legenden-Zeilen mehr (im aria-Label stehen die Werte weiter)
    expect(h).not.toMatch(/>po\.regionalCompare\.nationalVal/);
    expect(h).not.toMatch(/(>|svg>)po\.regionalCompare\.rent\.yourVal/);
    expect(h).toMatch(/aria-label="[^"]*po\.regionalCompare\.rent\.yourVal/);
  });
  it('mittel (Mietzins, Budget): keine Kürzel, die Legenden-Zeilen bleiben (sonst unter 13 px)', () => {
    const h = zeile({ drittel: { anteil: 30 }, kanton: 'ZG' });
    expect(h).not.toContain('strasse-kuerzel');
    expect(h).not.toContain('strasse-betraege');
    expect(h).toMatch(/>po\.regionalCompare\.nationalVal/);
  });
  it('Kürzel bei 256 px mindestens 13 px', () => {
    const h = gross();
    const s = Number(h.match(/data-teil="strasse-kuerzel"[^>]*font-size="([\d.]+)"/)[1]);
    expect(s * 256 / 132).toBeGreaterThanOrEqual(13);
  });
});

describe('Kantonshaus gross: Mischung A–C (Stebler Studios 11.11.2026, «eine Mischung aller»)', () => {
  const gross = (p) => zeile({ drittel: { anteil: 30 }, maxBreite: 256, kanton: 'ZG', ...p });
  it('C: die Form der Karte — ein Umriss mit flachem Dach, hellgrün', () => {
    const h = gross();
    expect(h).toMatch(/<g data-teil="kanton-haus"><path d="M44 84V[\d.]+L58 [\d.]+L72 [\d.]+V84Z" fill="#7a5" fill-opacity="0.18"/);
  });
  it('A: Fahne mit Prozent aus lageZurRegion, Rand in der Lage-Farbe', () => {
    const ueber = gross({ userValue: 1900 });   // 1900 gegen 1732 → +10 %, gold
    expect(ueber).toMatch(/data-teil="kanton-fahne"[\s\S]*stroke="#b80"[\s\S]*>\+10 %<\/text>/);
    const unter = gross({ userValue: 1500 });   // −13 %, salbei
    expect(unter).toMatch(/data-teil="kanton-fahne"[\s\S]*stroke="#6a6"[\s\S]*>−13 %<\/text>/);
    expect(gross({ userValue: 1740 })).toMatch(/>≈ 0 %<\/text>/);
  });
  it('B: Tür in Behörden-Grau nur mit Programm', () => {
    expect(gross({ kantonProgramm: true, tuerFarbe: '#5A6472' })).toMatch(/data-teil="kanton-tuer"[^>]*fill="#5A6472"/);
    expect(gross({ kantonProgramm: false })).not.toContain('kanton-tuer');
  });
  it('mittel bleibt das bisherige Regionshaus (Dach in der Lage-Farbe, ohne Fahne)', () => {
    const h = zeile({ drittel: { anteil: 30 }, kanton: 'ZG' });
    expect(h).not.toContain('kanton-haus');
    expect(h).not.toContain('kanton-fahne');
  });
  it('Kapitel gibt Programm und Behörden-Farbe mit', () => {
    expect(quelle('../components/WohnkostenInstrument.jsx')).toMatch(/kantonProgramm: PROGRAMM_KANTONE\.includes\(canton\), tuerFarbe: bereichFillColor\('behoerden', isDarkMode\)/);
  });
});
