// Wächter · Bauplan Lebensbereich, Finanzen (Entwurf Stebler Studios 20.11.2026: «Mischung aus S2 und S3 … gerne mal einbauen»).
// Der Monatsring ist die Szene; jedes Ring-Stück trägt das Bild seines Bereichs; Finanzen spricht in Fünflibern; jedes Bild
// einmal. Blatt: _werkbank/FINANZEN-BAUPLAN-2026-11-20.md, Skizze _werkbank/entwuerfe/finanzen-mischung.html.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { FinanzenSzene, lohnMuenzen, steuerFranken, notgroschen, LOHN_GRENZEN } from '../bereiche/finanzen/finanzen.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, attr, wert) => (html.match(new RegExp(attr + '="' + wert + '"', 'g')) || []).length;
const szene = (d) => renderToStaticMarkup(React.createElement(FinanzenSzene, {
  palette: LIGHT_PALETTE, t, data: d, isDarkMode: false, onNavigate: () => {},
  einkommen: 6200, verplant: 3965, titel: 'Jeden Monat bleiben', titelJahr: 'Jedes Jahr bleiben', zahl: 2235, kopf: () => null,
}));

describe('Bauplan Finanzen · jedes Bild einmal in der Szene', () => {
  const html = szene(DEMO_DATA);
  it('Münz-Lohn, Steuerfranken, Sparschwein, Drittel-Haus, Thermometer und Kalenderblatt je genau einmal', () => {
    expect(zaehle(html, 'data-bild', 'muenz-lohn')).toBe(1);
    expect(zaehle(html, 'data-bild', 'steuerfranken')).toBe(1);
    expect(zaehle(html, 'data-bild', 'sparschwein')).toBe(1);
    expect(zaehle(html, 'data-teil', 'drittel-haus')).toBe(1);
    expect(zaehle(html, 'data-teil', 'kalenderblatt')).toBe(1);
    expect((html.match(/data-franchise="klein"/g) || []).length).toBe(1);
    expect(zaehle(html, 'data-teil', 'monatsring')).toBe(1);
  });
  it('die Bilder hängen an ihren Ring-Stücken: Wohnen, Steuern, Versicherungen', () => {
    for (const k of ['wohnen', 'steuern', 'versicherungen']) expect(html).toContain('data-ring-bild="' + k + '"');
    expect(html).not.toContain('data-ring-bild="uebriges"');
  });
  it('unter der Münzleiste: Brutto und der Weg nach Ausbildung & Arbeit (F7-K4-1), dazu die Steuer am Steuerfranken', () => {
    expect(html).toContain('Wo steht Ihr Lohn? ›');
    expect(html).toContain('brutto');
    expect(html).toContain('data-teil="ring-unter-steuern"');
    expect(html).toContain('So viel Einkommenssteuer im Jahr, grob geschätzt');
  });
  it('Hauptzahlen stehen unter bzw. neben ihrem Bild (Regel «Zahl»)', () => {
    expect(html.indexOf('data-instrument-zahl="lohn"')).toBeGreaterThan(html.indexOf('data-bild="muenz-lohn"'));
    expect(html.indexOf('data-instrument-zahl="notgroschen"')).toBeGreaterThan(html.indexOf('data-bild="sparschwein"'));
  });
});

describe('Bauplan Finanzen · keine eigene Rechnung, nur die bestehenden', () => {
  it('rechnung.js ruft lohnBandState, steuernFuerProfil und reserveTankState', () => {
    const r = lies('bereiche/finanzen/rechnung.js');
    for (const f of ['lohnBandState', 'steuernFuerProfil', 'reserveTankState']) expect(r).toContain(f);
  });
  it('Lohn-Münzen: dieselben vier Zonen wie das Lohn-Barometer', () => {
    expect(LOHN_GRENZEN).toHaveLength(5);
    const l = lohnMuenzen(DEMO_DATA);
    expect(l.show).toBe(true);
    expect(l.fuell).toHaveLength(4);
    // gefüllt ist von links nach rechts: keine Zone ist voller als die vor ihr
    for (let i = 1; i < 4; i++) expect(l.fuell[i] <= l.fuell[i - 1] || l.fuell[i - 1] === 1).toBe(true);
  });
  it('Steuerfranken: Bund ist ein Teil der ganzen Steuer', () => {
    const s = steuerFranken(DEMO_DATA);
    expect(s.total).toBeGreaterThan(s.bund);
    expect(s.bundAnteil).toBeGreaterThan(0);
    expect(s.bundAnteil).toBeLessThan(1);
  });
  it('Sparschwein rechnet wie der Tank (Monate, Empfehlung 3, voll 6)', () => {
    const n = notgroschen(DEMO_DATA);
    expect(n.mode).toBe('months');
    expect(n.recommendMonths).toBe(3);
    expect(n.fullMonths).toBe(6);
  });
});

describe('Bauplan Finanzen · nichts doppelt im Kapitel', () => {
  const a = lies('components/FinanzAuswertung.jsx');
  it('kein grosser Tank mehr unter «Was sich daraus ergibt» (das Sparschwein ist der Notgroschen)', () => {
    expect(a).not.toMatch(/React\.createElement\(ReserveTank/);
  });
  it('der Lohn-Kasten zeigt im Kapitel nur noch den Armutsgrenzen-Befund', () => {
    expect(a).toContain("nurArmutsbefund: true");
  });
  it('das Kapitel ruft die Szene, nicht den Ring allein', () => {
    const k = lies('ChapterView.jsx');
    expect(k).toContain("import('./bereiche/finanzen/finanzen.js')");
    expect(k).not.toContain("import('./components/Monatsring.jsx')");
  });
});
