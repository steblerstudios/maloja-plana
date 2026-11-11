// Arbeit: vier Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «Arbeit (E + F)», dann
// «Dienstjahre + Kündigungsfrist, Ferien mit neuem Feld & Pensum brauchen wir ja eh alles»).
// Rechtsaussagen am Fedlex-Volltext geprüft (OR, Fassung 1.10.2026): 335b, 335c, 344a, 346, 329a.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dienstLage, ferienLage, pensumLage } from '../../utils/arbeitsverhaeltnis.js';
import deTexte from '../../i18n/de.js';

const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const am = (j, m, t) => new Date(j, m - 1, t, 9);

describe('dienstLage: OR 335b / 335c', () => {
  it('Probezeit: der erste Monat, dann nicht mehr', () => {
    expect(dienstLage('2026-10-15', am(2026, 11, 10))).toMatchObject({ monate: 0, inProbezeit: true, kuendigungsfristMonate: 1 });
    expect(dienstLage('2026-10-10', am(2026, 11, 10))).toMatchObject({ monate: 1, inProbezeit: false });
  });
  it('Monatsende: 31.1. bis 28.2. ist noch kein voller Monat', () => {
    expect(dienstLage('2026-01-31', am(2026, 2, 28)).monate).toBe(0);
  });
  it('Grenzen 1 / 2–9 / ab 10 Dienstjahren', () => {
    expect(dienstLage('2025-11-11', am(2026, 11, 10)).kuendigungsfristMonate).toBe(1); // 1. Dienstjahr
    expect(dienstLage('2025-11-10', am(2026, 11, 10)).kuendigungsfristMonate).toBe(2); // 2. Dienstjahr
    expect(dienstLage('2017-11-11', am(2026, 11, 10)).kuendigungsfristMonate).toBe(2); // 9. Dienstjahr
    expect(dienstLage('2017-11-10', am(2026, 11, 10)).kuendigungsfristMonate).toBe(3); // 10. Dienstjahr
  });
  it('kein oder künftiges Datum: nichts', () => {
    expect(dienstLage('', am(2026, 11, 10))).toBeNull();
    expect(dienstLage('2027-01-01', am(2026, 11, 10))).toBeNull();
  });
});

// Eine Rechnung je Wahrheit (Matrix 10.11.2026 §6 Regel 3): Ferien und Pensum standen inline im Panel.
describe('ferienLage: Anspruch und Bezug im laufenden Jahr', () => {
  it('offen = Anspruch − bezogen, Anteile für das Bild', () => {
    expect(ferienLage('25', '13')).toEqual({ jahr: 25, bezogen: 13, offen: 12, anteilBezogen: 13 / 25, anteilOffen: 12 / 25 });
  });
  it('Komma und Halbtage', () => {
    expect(ferienLage('22,5', '2.5')).toMatchObject({ jahr: 22.5, bezogen: 2.5, offen: 20 });
  });
  it('mehr bezogen als Anspruch: offen 0, Bild voll, nie über 1', () => {
    expect(ferienLage('20', '23')).toMatchObject({ offen: 0, anteilBezogen: 1, anteilOffen: 0 });
  });
  it('ohne Bezug: Anspruch allein, offen unbekannt (kein erfundener Stand)', () => {
    expect(ferienLage('25', '')).toEqual({ jahr: 25, bezogen: null, offen: null, anteilBezogen: null, anteilOffen: null });
    expect(ferienLage('25', undefined).offen).toBeNull();
  });
  it('ohne Anspruch, 0 oder ungültig: nichts', () => {
    expect(ferienLage('', '5')).toBeNull();
    expect(ferienLage('0', '0')).toBeNull();
    expect(ferienLage('abc', '1')).toBeNull();
    expect(ferienLage('-3', '1')).toBeNull();
  });
  it('ungültiger Bezug zählt als nicht erfasst', () => {
    expect(ferienLage('25', '-1').offen).toBeNull();
    expect(ferienLage('25', 'x').offen).toBeNull();
  });
});

describe('pensumLage: Wochenstunden gegen die Rechenbasis des Lohnvergleichs (40 Std., BFS)', () => {
  it('Teilzeit: Anteil und gerundete Prozent', () => {
    expect(pensumLage('32')).toEqual({ stunden: 32, basis: 40, anteil: 0.8, prozent: 80, vollzeit: false });
    expect(pensumLage('16,5')).toMatchObject({ stunden: 16.5, prozent: 41 });
  });
  it('ab 40 Std. Vollzeit, Anteil nie über 1', () => {
    expect(pensumLage('40')).toMatchObject({ anteil: 1, prozent: 100, vollzeit: true });
    expect(pensumLage('42')).toMatchObject({ stunden: 42, anteil: 1, prozent: 100, vollzeit: true });
  });
  it('leer, 0 oder unplausibel (über der Obergrenze des Lohn-Checks): nichts', () => {
    expect(pensumLage('')).toBeNull();
    expect(pensumLage('0')).toBeNull();
    expect(pensumLage('abc')).toBeNull();
    expect(pensumLage('200')).toBeNull();
  });
});

describe('Kachel-Regeln (Fachprüfung 10.11.2026)', () => {
  const panel = quelle('../InstrumentePanel.jsx');
  it('Lernende bekommen keine 335c-Frist, sondern den Lehrvertrag-Satz', () => {
    expect(panel).toMatch(/mehr: istLernend\(data\?\.finanzen\) \? \[t\('instrumente\.dienstLehre'\)\]/);
    expect(deTexte.instrumente.dienstLehre).toMatch(/344a[\s\S]*346/);
  });
  it('in Monat 2 und 3 der Hinweis auf eine längere Probezeit', () => {
    expect(panel).toMatch(/dienst\.monate < 3 \? \[t\('instrumente\.dienstProbezeitLaenger'\)\]/);
  });
  it('Vorbehalt nennt Vertrag, NAV und GAV und den unbefristeten Vertrag', () => {
    expect(deTexte.instrumente.dienstFrist).toMatch(/unbefristetem Vertrag[\s\S]*Vertrag, NAV oder GAV/);
  });
  it('Pensum: ab 40 Std. «Vollzeit», nie über 100 % — aus pensumLage, nicht inline', () => {
    expect(panel).toMatch(/const pensum = pensumLage\(arbeit\.workHoursPerWeek\);/);
    expect(panel).toMatch(/pensum\.vollzeit\s*\n?\s*\? t\('instrumente\.pensumVollzeit'/);
    expect(panel).not.toMatch(/stunden \/ LSE_VOLLZEIT_STUNDEN_WOCHE/);
  });
  it('Ferien: offene Tage nur mit erfasstem Bezug, Mindestanspruch nach 329a — aus ferienLage, nicht inline', () => {
    expect(panel).toMatch(/const ferien = ferienLage\(arbeit\.ferienTageJahr, arbeit\.ferienTageBezogen\);/);
    expect(panel).not.toMatch(/const tageZahl = /);
    expect(deTexte.instrumente.ferienMinimum).toMatch(/4 Wochen pro Dienstjahr[\s\S]*20\. Altersjahr 5 Wochen[\s\S]*329a/);
  });
  it('Lohn: Zahl nur, wenn auch das Barometer eine Lage zeigt (lohnLage)', () => {
    expect(panel).toMatch(/const lohn = lohnLage\(data\);/);
    expect(quelle('../LohnEinordnung.jsx')).toMatch(/const \{ state, sperre: lageSperre, bvgAlter, rentenalter, beitragsfrei \} = lohnLage\(data\);/);
  });
  it('Arbeit steht mit vier Instrumenten in der Kapitelzeile', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/ausbildung: \['lohn', 'dienst', 'ferien', 'pensum'\]/);
  });
});

describe('Kapitel Arbeit: die Instrumente unter dem Lohn-Barometer («… wo wir sehen mit dem Lohn-Barometer»)', () => {
  const kapitel = quelle('../../ChapterView.jsx');
  it('Dienstjahre, Ferien und Pensum stehen direkt unter dem Barometer', () => {
    expect(kapitel).toMatch(/data-teil': 'ausbildung-lohn'[\s\S]{0,400}data-teil': 'ausbildung-instrumente'/);
    expect(kapitel).toMatch(/nur: \['dienst', 'ferien', 'pensum'\]/);
  });
  it('im eigenen Kapitel kein Klick ins Leere: Sprung zum Feld bzw. zur Angaben-Liste', () => {
    expect(kapitel).toMatch(/getElementById\('ausbildung-employmentStart'\)/);
    expect(kapitel).toMatch(/querySelector\('\[data-teil="angaben-liste"\]'\)/);
  });
});

// Bilder Arbeit (Stebler Studios 11.11.2026, Skizzen A–C: «pensum und die uhr … ferien mit der sonne von b … mit den
// dienstjahren … die ringe»). Alle drei sind Bilder aus dem Lebensbereich und müssen die Zahl tragen, nicht nur zeigen.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InstrumentePanel } from '../InstrumentePanel.jsx';
import { LIGHT_PALETTE } from '../../config/constants.js';
import { createT } from '../../i18n/index.js';

const tt = createT({ de: deTexte }, 'de', 'sie');
const vorJahren = (n) => { const d = new Date(); d.setFullYear(d.getFullYear() - n); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 10); };
const zeichne = (ausbildung, props = {}) => renderToStaticMarkup(React.createElement(InstrumentePanel, {
  palette: LIGHT_PALETTE, t: tt, data: { ausbildung }, onNavigate: () => {}, nur: ['dienst', 'ferien', 'pensum'], ...props,
}));
const svgVon = (html, key) => (html.match(new RegExp('<svg[^>]*data-' + key + '="[a-z]+"[\\s\\S]*?</svg>')) || [''])[0];
const zaehle = (s, re) => (s.match(re) || []).length;
const arbeit = { employmentStart: vorJahren(7), ferienTageJahr: '25', ferienTageBezogen: '13', workHoursPerWeek: '32' };

describe('Dienstjahre: ein Ring je volles Dienstjahr, die Fristwechsel als dicke Ringe', () => {
  it('7 Jahre → 7 Ringe; Ring 1 erreicht, Ring 9 nur als Hinweis, wo die Frist wechselt', () => {
    const svg = svgVon(zeichne(arbeit), 'dienst');
    expect(zaehle(svg, /data-ring="\d+"/g)).toBe(7);
    expect(svg).toMatch(/data-fristwechsel="1" data-erreicht="ja"/);
    expect(svg).toMatch(/data-fristwechsel="9" data-erreicht="nein"/);
  });
  it('2 Jahre und 12 Jahre: verschieden viele Ringe (heute ab 5 Jahren alle gleich), höchstens 10', () => {
    const zwei = zaehle(svgVon(zeichne({ ...arbeit, employmentStart: vorJahren(2) }), 'dienst'), /data-ring="\d+"/g);
    const zwoelf = svgVon(zeichne({ ...arbeit, employmentStart: vorJahren(12) }), 'dienst');
    expect(zwei).toBe(2);
    expect(zaehle(zwoelf, /data-ring="\d+"/g)).toBe(10);
    expect(zwoelf).toMatch(/data-fristwechsel="9" data-erreicht="ja"/);
  });
});

describe('Ferien: Sonne mit 12 Strahlen, bezogene grau', () => {
  it('13 von 25 bezogen → 6 von 12 Strahlen grau', () => {
    const svg = svgVon(zeichne(arbeit), 'ferien');
    expect(zaehle(svg, /data-strahl="\d+"/g)).toBe(12);
    expect(zaehle(svg, /data-bezogen="ja"/g)).toBe(6);
  });
  it('ohne erfassten Bezug: kein Strahl grau (kein erfundener Stand)', () => {
    const svg = svgVon(zeichne({ ...arbeit, ferienTageBezogen: '' }), 'ferien');
    expect(zaehle(svg, /data-bezogen="ja"/g)).toBe(0);
  });
  it('alles bezogen: alle grau', () => {
    expect(zaehle(svgVon(zeichne({ ...arbeit, ferienTageBezogen: '25' }), 'ferien'), /data-bezogen="ja"/g)).toBe(12);
  });
});

describe('Pensum: Uhr mit Zifferblatt, Füllung = Stunden ÷ 40', () => {
  it('Uhr hat Stundenstriche und eine Füllung', () => {
    const svg = svgVon(zeichne(arbeit), 'pensum');
    expect(zaehle(svg, /data-stundenstrich/g)).toBe(4);
    expect(svg).toMatch(/data-pensum-anteil="0\.8"/);
  });
});

describe('Zuhause Arbeit: dieselben Bilder gross (256), Kachel klein (64)', () => {
  const breite = (svg) => Number((svg.match(/max-width:(\d+)px/) || [])[1]);
  it('ohne «zuhause» klein', () => {
    const html = zeichne(arbeit);
    for (const k of ['dienst', 'ferien', 'pensum']) expect(breite(svgVon(html, k)), k).toBe(64);
  });
  it('mit «zuhause» gross, je eine ganze Zeile', () => {
    const html = zeichne(arbeit, { zuhause: true });
    for (const k of ['dienst', 'ferien', 'pensum']) {
      expect(svgVon(html, k), k).toMatch(new RegExp('data-' + k + '="gross"'));
      expect(breite(svgVon(html, k)), k).toBe(256);
    }
  });
  it('das Kapitel Arbeit zeigt das Zuhause', () => {
    expect(quelle('../../ChapterView.jsx')).toMatch(/nur: \['dienst', 'ferien', 'pensum'\], zuhause: true/);
  });
});
