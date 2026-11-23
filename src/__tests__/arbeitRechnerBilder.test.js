// Bilder für die Arbeit-Rechner (Stebler Studios 11.11.2026, Skizzen A–H): «wie lang b» (Kalenderblätter, eines
// je Monat), «stundenlohn b» (Münzstapel Sie gegen Mindestlohn), «wie viel» = G (der Ersatz füllt den Lohn-Balken
// bis zu seiner Stelle, der Rest fällt weg). Farbe Arbeit = Haselnuss («Haselnuss reicht»).
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { berechneTaggeld, alvErsatzAnteil, alvBezugMonate } from '../data/alvRechner.js';
import { berechneMutterschaft, eoErsatzAnteil } from '../data/eoRechner.js';
import { ErsatzBalken, Kalenderblaetter, MuenzStapel } from '../components/RechnerForm.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const p = LIGHT_PALETTE;
const h = React.createElement;
const zeichne = (el) => renderToStaticMarkup(el);
const zaehle = (s, re) => (s.match(re) || []).length;
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('Rechnung: wie viel vom Lohn (eine Funktion je Rechner)', () => {
  it('ALV: Ersatz ÷ bisheriger Lohn, 80 % im üblichen Fall', () => {
    const r = berechneTaggeld({ versicherterVerdienst: 6000, hatKinder: true, beitragsmonate: 24, alter: 40 });
    expect(alvErsatzAnteil(6000, r)).toBeCloseTo(0.8, 5);
  });
  it('ALV: über dem Höchstbetrag fällt der Anteil unter den Satz (gedeckelt, UVV Art. 22)', () => {
    const r = berechneTaggeld({ versicherterVerdienst: 20000, hatKinder: true, beitragsmonate: 24, alter: 40 });
    expect(r.gedeckelt).toBe(true);
    expect(alvErsatzAnteil(20000, r)).toBeCloseTo(12350 * 0.8 / 20000, 2);
  });
  it('ALV: ohne Anspruch oder Lohn kein Anteil', () => {
    expect(alvErsatzAnteil(0, null)).toBeNull();
    expect(alvErsatzAnteil(400, berechneTaggeld({ versicherterVerdienst: 400 }))).toBeNull(); // unter 500 nicht versichert (AVIV Art. 40)
  });
  it('ALV: Bezugsdauer in Monaten = Taggelder ÷ 21,7 (AVIV Art. 40a), ohne Zahl nichts', () => {
    expect(alvBezugMonate(400)).toBeCloseTo(400 / 21.7, 5);
    expect(alvBezugMonate(null)).toBeNull();
  });
  it('EO: Taggeld ÷ Tageslohn (Jahr ÷ 360, EOV Art. 5), 80 % bis zum Höchstbetrag', () => {
    expect(eoErsatzAnteil(72000, berechneMutterschaft({ jahreseinkommen: 72000 }))).toBeCloseTo(0.8, 2);
    expect(eoErsatzAnteil(150000, berechneMutterschaft({ jahreseinkommen: 150000 }))).toBeLessThan(0.8);
    expect(eoErsatzAnteil(0, null)).toBeNull();
  });
  it('die Rechner rufen diese Funktionen auf, nicht inline', () => {
    expect(quelle('../AlvRechner.jsx')).toMatch(/alvErsatzAnteil\(parsedLohn, result\)/);
    expect(quelle('../AlvRechner.jsx')).toMatch(/alvBezugMonate\(result\.anspruchstage\)/);
    expect(quelle('../AlvRechner.jsx')).not.toMatch(/result\.anspruchstage \/ ALV_PARAMS\.taggelderProMonat/);
    expect(quelle('../EOrechner.jsx')).toMatch(/eoErsatzAnteil\(parsedEinkommen, result\.mutterschaft\)/);
  });
});

describe('Bild G: der Ersatz füllt den Lohn-Balken bis zu seiner Stelle', () => {
  it('80 %: Füllung 80 % der Breite, der Rest als «fällt weg»', () => {
    const svg = zeichne(h(ErsatzBalken, { palette: p, anteil: 0.8 }));
    expect(svg).toMatch(/data-ersatz-anteil="0\.8"/);
    expect(svg).toMatch(/data-teil="ersatz"[^>]*width="80"/);
    expect(svg).toMatch(/data-teil="faellt-weg"[^>]*width="20"/);
  });
  it('in Haselnuss, hell und dunkel', () => {
    expect(zeichne(h(ErsatzBalken, { palette: p, anteil: 0.8 }))).toContain(bereichFillColor('arbeit', false));
    expect(zeichne(h(ErsatzBalken, { palette: DARK_PALETTE, anteil: 0.8 }))).toContain(bereichFillColor('arbeit', true));
  });
  it('ohne Anteil kein Bild', () => {
    expect(zeichne(h(ErsatzBalken, { palette: p, anteil: null }))).toBe('');
  });
});

describe('Bild «wie lange»: Kalenderblätter, eines je Monat', () => {
  it('400 Taggelder ≈ 18,4 Monate → 19 Blätter, das letzte nur teilweise gefüllt', () => {
    const svg = zeichne(h(Kalenderblaetter, { palette: p, monate: 400 / 21.7 }));
    expect(zaehle(svg, /data-blatt="\d+"/g)).toBe(19);
    expect(zaehle(svg, /data-voll="ja"/g)).toBe(18);
  });
  it('200 Taggelder ≈ 9,2 Monate → 10 Blätter; ohne Zahl kein Bild', () => {
    expect(zaehle(zeichne(h(Kalenderblaetter, { palette: p, monate: 200 / 21.7 })), /data-blatt="\d+"/g)).toBe(10);
    expect(zeichne(h(Kalenderblaetter, { palette: p, monate: null }))).toBe('');
  });
});

describe('Bild Stundenlohn: Münzstapel Sie gegen Mindestlohn', () => {
  const hoehe = (svg, wer) => Number((svg.match(new RegExp('data-stapel="' + wer + '"[^>]*data-hoehe="([\\d.]+)"')) || [])[1]);
  it('die Stapel sind so hoch wie die Beträge, mit einem Strich auf der Höhe des Mindestlohns', () => {
    const svg = zeichne(h(MuenzStapel, { palette: p, sie: 24, mindest: 20 }));
    expect(hoehe(svg, 'sie') / hoehe(svg, 'mindest')).toBeCloseTo(24 / 20, 2);
    expect(svg).toMatch(/data-strich="mindestlohn"/);
  });
  it('knapp darunter ist sichtbar niedriger (keine Rundung auf ganze Münzen)', () => {
    const svg = zeichne(h(MuenzStapel, { palette: p, sie: 23.5, mindest: 24 }));
    expect(hoehe(svg, 'sie')).toBeLessThan(hoehe(svg, 'mindest'));
  });
  it('ohne Mindestlohn kein Bild', () => {
    expect(zeichne(h(MuenzStapel, { palette: p, sie: 24, mindest: null }))).toBe('');
  });
});

describe('Die Bilder stehen in den Rechnern', () => {
  it('ALV: Ersatz-Balken und Kalenderblätter', () => {
    expect(quelle('../AlvRechner.jsx')).toMatch(/React\.createElement\(ErsatzBalken,/);
    expect(quelle('../AlvRechner.jsx')).toMatch(/React\.createElement\(Kalenderblaetter,/);
  });
  it('EO: Ersatz-Balken', () => {
    expect(quelle('../EOrechner.jsx')).toMatch(/React\.createElement\(ErsatzBalken,/);
  });
  it('Stundenlohn: Münzstapel je Lesart mit Mindestlohn', () => {
    expect(quelle('../Stundenlohn.jsx')).toMatch(/React\.createElement\(MuenzStapel,/);
  });
});
