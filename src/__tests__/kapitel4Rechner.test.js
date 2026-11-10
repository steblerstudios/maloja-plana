import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ahvBezugsalterFuerRechnung, ahvZukunftMonate, ikBeitragsjahreBisReferenzalter } from '../utils/ahvBezug.js';
import { berechneRentenzuschlag, berechneAltersrente } from '../data/ahvRechner.js';

// Kapitel 4 «Versicherungen & Vorsorge», 10.11.2026 (Entscheid Stebler Studios «Ja, alles»).
// B-17/B-18/B-19 aus BUGS.md und der fehlende Rentenzuschlag (AHVG Art. 34bis), nachgerechnet vom
// swiss-precision-pruefer am 09.11.2026.

const quelle = readFileSync(fileURLToPath(new URL('../VorsorgeRechner.jsx', import.meta.url)), 'utf8');

describe('B-18/B-19 · Rücktritt ist nicht AHV-Bezug', () => {
  it('rechnet die AHV nie früher als 2 Jahre vor dem Referenzalter', () => {
    expect(ahvBezugsalterFuerRechnung(58, 780)).toBe(63);
    expect(ahvBezugsalterFuerRechnung(60, 780)).toBe(63);
    expect(ahvBezugsalterFuerRechnung(64, 780)).toBe(64);
    expect(ahvBezugsalterFuerRechnung(67, 780)).toBe(67);
    // Frau JG 1962, Referenzalter 64 J 6 M: frühester abgebildeter Bezug 62 J 6 M
    expect(ahvBezugsalterFuerRechnung(60, 774)).toBe(62.5);
    expect(ahvBezugsalterFuerRechnung('', 780)).toBe(65);
  });

  it('lässt im Zukunftsbild die AHV ab dem Bezug fliessen, nicht ab dem Rücktritt mit 58', () => {
    const m = ahvZukunftMonate({ ruecktritt: 58, ahvBezug: 63, refAlterJahre: 65, lebenserwartung: 85 });
    expect(m.horizont).toBe(22 * 12);  // 63–85, nicht 58–85
    expect(m.vorbezug).toBe(24);       // 63–65, nicht 84 Monate
    expect(m.abRuecktritt).toBe(false);
    expect(ahvZukunftMonate({ ruecktritt: 65, ahvBezug: 65, refAlterJahre: 65, lebenserwartung: 85 }).abRuecktritt).toBe(true);
  });

  it('früher «beziehen» ergibt ab dem Referenzalter nicht mehr Rente (B-19)', () => {
    // Wie im Rechner: Bezugsalter UND Beitragsjahre aus dem AHV-Bezug, nicht aus dem Rücktritt.
    const rente = (ruecktritt) => {
      const bezug = ahvBezugsalterFuerRechnung(ruecktritt, 780);
      return berechneAltersrente({
        geburtsjahr: 1986, geschlecht: 'male', durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44 - (65 - bezug), bezugAlter: bezug, beitragsjahreReferenzalter: 44, stichtag: '2026-06-01',
      });
    };
    const r63 = rente(63), r58 = rente(58);
    expect(r58.monatsrenteReferenzalter).toBe(r63.monatsrenteReferenzalter);
    expect(r58.monatsrente).toBe(r63.monatsrente);
  });

  it('der Rechner rechnet die AHV überall mit ahvBezugAlter', () => {
    expect(quelle).toMatch(/const ahvBezugAlter = ahvBezugsalterFuerRechnung\(parsedBezugAlter, refAlterMonate\)/);
    expect(quelle).toMatch(/const parsedBeitragsjahre = beitragsjahreBeiBezug\(ahvBezugAlter\)/);
    expect(quelle).not.toMatch(/bezugAlter: parsedBezugAlter/);
    expect(quelle).toMatch(/ahvZukunftMonate\(\{ ruecktritt: parsedBezugAlter, ahvBezug: ahvBezugAlter/);
    expect(quelle).not.toMatch(/ahvVorbezugM = Math\.min\(ahvHorizonM/);
  });
});

describe('B-17 · IK-Auszug zählt die Jahre bis zum Rentenbeginn', () => {
  it('Mann JG 1986, IK 2007–2026: 20 Jahre im Auszug + 24 kommende = 44', () => {
    expect(ikBeitragsjahreBisReferenzalter({ ikBeitragsjahre: 20, letztesIkJahr: 2026, geburtsjahr: 1986, refAlterMonate: 780, volleDauer: 44, jetztJahr: 2026 })).toBe(44);
  });
  it('eine Lücke zwischen dem letzten erfassten Jahr und heute wird nicht aufgefüllt', () => {
    // IK endet 2015, heute 2026: 2016–2025 bleiben Lücke, gezählt wird 2026–2050 (25 Jahre)
    expect(ikBeitragsjahreBisReferenzalter({ ikBeitragsjahre: 10, letztesIkJahr: 2015, geburtsjahr: 1986, refAlterMonate: 780, volleDauer: 44, jetztJahr: 2026 })).toBe(35);
  });
  it('nach dem Referenzalter kommt nichts dazu', () => {
    expect(ikBeitragsjahreBisReferenzalter({ ikBeitragsjahre: 40, letztesIkJahr: 2025, geburtsjahr: 1958, refAlterMonate: 780, volleDauer: 44, jetztJahr: 2026 })).toBe(40);
  });
  it('der Rechner gibt mit IK die Jahre bis zum Referenzalter mit (nicht undefined)', () => {
    expect(quelle).toMatch(/beitragsjahreReferenzalter: ikResult \? ikBjReferenzalter : beitragsjahreReferenzalter/);
    expect(quelle).not.toMatch(/const bj = ikResult \? ikResult\.beitragsjahre/);
  });
});

describe('AHVG Art. 34bis · Rentenzuschlag Übergangsgeneration', () => {
  const z = (o) => berechneRentenzuschlag({ geschlecht: 'female', volleDauer: 44, beitragsjahre: 44, stichtag: '2026-06-01', ...o });
  it('Grundzuschlag nach Einkommen (4×/5× minimale Jahresrente 15 120) und Jahrgang', () => {
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 50000 })).toBe(160);   // ≤ 60 480
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 70000 })).toBe(100);   // ≤ 75 600
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 80000 })).toBe(50);
    expect(z({ geburtsjahr: 1961, durchschnittlichesJahreseinkommen: 50000 })).toBe(40);    // 25 %
    expect(z({ geburtsjahr: 1969, durchschnittlichesJahreseinkommen: 80000 })).toBe(13);    // 12.50 aufgerundet
  });
  it('bei unvollständiger Beitragsdauer anteilig (AHVV Art. 53quater Abs. 3)', () => {
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 50000, beitragsjahre: 22 })).toBe(80);
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 50000, beitragsjahre: 40 })).toBe(146); // 145.45 aufgerundet
  });
  it('rundet ohne Gleitkomma-Rest auf (160 × 44 % × 25/44 = 40, nicht 41)', () => {
    expect(z({ geburtsjahr: 1968, durchschnittlichesJahreseinkommen: 50000, beitragsjahre: 25 })).toBe(40);
  });
  it('nicht beim Vorbezug, nicht für Männer, nicht ausserhalb 1961–1969', () => {
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 50000, vorbezug: true })).toBe(0);
    expect(z({ geburtsjahr: 1964, durchschnittlichesJahreseinkommen: 50000, geschlecht: 'male' })).toBe(0);
    expect(z({ geburtsjahr: 1970, durchschnittlichesJahreseinkommen: 50000 })).toBe(0);
  });
  it('berechneAltersrente liefert ihn ohne Vorbezug und lässt ihn beim Vorbezug weg', () => {
    const r = (bezugAlter) => berechneAltersrente({ geburtsjahr: 1964, geschlecht: 'female', durchschnittlichesJahreseinkommen: 50000, beitragsjahre: 44, beitragsjahreReferenzalter: 44, bezugAlter, stichtag: '2026-06-01' });
    expect(r(65).rentenzuschlag).toBe(160);
    expect(r(63).rentenzuschlag).toBe(0);
  });
});

describe('Texte nach der Fachprüfung (10.11.2026)', () => {
  it('Frauen 1961–1969 sehen den Vorbezug ab 62 immer, auch neben dem Hinweis zum frühesten Bezug', () => {
    expect(quelle).toMatch(/fruehesterVorbezugMonate\(\{ geschlecht: data\.basis\?\.gender, geburtsjahr: birthYear \}\) < refAlterMonate - 24 && t\('vr\.bezugAlterUebergang'\)/);
  });
  it('Szenario und Annahme rechnen mit dem AHV-Bezug, nicht fest mit 63', () => {
    expect(quelle).not.toMatch(/const ahvMin = 63/);
    expect(quelle).toMatch(/zukunftSzenarioBridge', \{ von: ret, bis:/);
    expect(quelle).toMatch(/angenommeneBeitragsjahreFuer\(ahvBezugAlter, refAlterJahre\)/);
  });
  it('Selbständige gelten nicht automatisch als mit Pensionskasse', () => {
    expect(quelle).toMatch(/\(!selbstaendig && !!\(bvgResult && bvgResult\.versichert\)\)/);
  });
});

describe('Säule 3a im Rechner höchstens der Höchstabzug', () => {
  it('die Hochrechnung nimmt den begrenzten Jahresbetrag', () => {
    expect(quelle).toMatch(/const saeule3aJahr = Math\.min\(saeule3aAnnual, saeule3aGrenze\)/);
    expect(quelle).toMatch(/s3aAnnual: saeule3aJahr/);
    expect(quelle).toMatch(/saeule3aBalance \+ \(saeule3aJahr \* yearsLeft\)/);
  });
});
