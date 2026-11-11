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
