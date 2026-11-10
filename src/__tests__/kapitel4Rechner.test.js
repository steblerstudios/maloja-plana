import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { berechneRentenzuschlag, berechneAltersrente } from '../data/ahvRechner.js';

// Kapitel 4 «Versicherungen & Vorsorge», 10.11.2026 (Entscheid Stebler Studios «Ja, alles»).
// B-17/B-18/B-19 sind auf main schon behoben (utils/ahvZukunftsbild.js, utils/ikHochrechnung.js, eigene
// Tests); dieser Test hält, was Kapitel 4 dazu bringt: Rentenzuschlag (AHVG Art. 34bis), 3a-Grenze, Hinweise.

const quelle = readFileSync(fileURLToPath(new URL('../VorsorgeRechner.jsx', import.meta.url)), 'utf8');

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
  it('der Rechner zeigt ihn, mit Hinweis zum geteilten Einkommen bei Ehe', () => {
    expect(quelle).toMatch(/ahvResult\.rentenzuschlag > 0 && React\.createElement/);
    expect(quelle).toMatch(/gutschriftTeilen \|\| verheiratet \? ' ' \+ t\('vr\.rentenzuschlagSplitting'\)/);
  });
});

describe('Hinweise im Rechner (Kapitel 4)', () => {
  it('Frauen 1961–1969 sehen den Vorbezug ab 62 immer beim Bezugsalter', () => {
    expect(quelle).toMatch(/fruehesterVorbezugMonate\(\{ geschlecht: data\.basis\?\.gender, geburtsjahr: birthYear \}\) < refAlterMonate - 24 && t\('vr\.bezugAlterUebergang'\)/);
  });
  it('Rücktritt vor dem frühesten Bezug: das Feld sagt, ab wann die AHV gerechnet ist', () => {
    expect(quelle).toMatch(/ahvBezugAlter > parsedBezugAlter && t\('vr\.bezugAlterFrueh'/);
  });
  it('Umwandlungssatz vor dem Referenzalter und Einkaufssperre beim Kapitalbezug', () => {
    expect(quelle).toMatch(/t\('vr\.umwandlungssatzVorReferenzalter'/);
    expect(quelle).toMatch(/t\('vr\.kbEinkaufSperre'\)/);
  });
});

describe('Säule 3a im Rechner höchstens der Höchstabzug', () => {
  it('die Hochrechnung nimmt den begrenzten Jahresbetrag', () => {
    expect(quelle).toMatch(/const saeule3aJahr = Math\.min\(saeule3aAnnual, saeule3aGrenze\)/);
    expect(quelle).toMatch(/s3aAnnual: saeule3aJahr/);
    expect(quelle).toMatch(/saeule3aBalance \+ \(saeule3aJahr \* yearsLeft\)/);
  });
  it('Selbständige gelten nicht automatisch als mit Pensionskasse', () => {
    expect(quelle).toMatch(/\(!selbstaendig && !!\(bvgResult && bvgResult\.versichert\)\)/);
  });
});
