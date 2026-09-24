// K117 · Konkubinat mit Kindern: eine fehlende Partnerangabe ist nicht 0.
//
// Befund der Vorab-Prüfung 24.09.2026 (swiss-precision-pruefer): ZH, Konkubinat, 2 Kinder,
// Nettolohn 70 000, Partnereinkommen nie beantwortet, Elterntarif → die App zeigte CHF 2 211
// Kantons- und Gemeindesteuer aus der Reihe «ledig, 2 Kinder». Das Quellenblatt
// (docs/sources/konkubinat-kantonssteuer-2026.md) nennt Konkubinat mit Kindern «nicht gemessen».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { kantonssteuerFuerProfil, steuernFuerProfil } from '../data/kantonaleSteuerdaten.js';
import { orientierungsText } from '../components/KantonssteuerOrientierung.jsx';

const fall = {
  kanton: 'ZH', nettolohnJahr: 70000, verheiratet: false, konkubinat: true,
  kinder: 2, elterntarif: true, partnerEinkommen: 0,
};

describe('K117 · Konkubinat mit Kindern ohne Partnerangabe', () => {
  it('Profil-Weg: keine Kantonszahl, eigener Grund', () => {
    const r = kantonssteuerFuerProfil({ ...fall, partnerAngegeben: false });
    expect(r.kantonal).toBeNull();
    expect(r.lage).toBe('ungeprueft');
    expect(r.grund).toBe('konkubinatKinderOffen');
  });

  it('Steuerrechner-Weg: der Probiermodus (partnerAngegeben true) überdeckt die fehlende Profilangabe nicht', () => {
    const s = steuernFuerProfil({ ...fall, partnerAngegeben: true, partnerAngegebenProfil: false });
    expect(s.kanton.kantonal).toBeNull();
    expect(s.kanton.grund).toBe('konkubinatKinderOffen');
    // Die Bundessteuer bleibt stehen — der Befund betrifft nur die Kantonstabelle.
    expect(s.bund).not.toBeNull();
  });

  it('der Text sagt, was fehlt', () => {
    const t = (k) => k;
    expect(orientierungsText(t, { lage: 'ungeprueft', grund: 'konkubinatKinderOffen' }, 2026)).toBe('tax.bandKonkubinatKinderOffen');
  });

  it('unverändert: Partnerangabe vorhanden (auch 0) → wie bisher eine Zahl', () => {
    const r = kantonssteuerFuerProfil({ ...fall, partnerAngegeben: true });
    expect(r.grund).toBeNull();
    expect(r.kantonal).not.toBeNull();
  });

  it('unverändert: Konkubinat ohne Kinder und fehlende Angabe → wie bisher (K62.1, wie ledig)', () => {
    const r = kantonssteuerFuerProfil({ ...fall, kinder: 0, elterntarif: false, partnerAngegeben: false });
    expect(r.grund).toBeNull();
  });

  it('unverändert: alleinstehend mit Kindern (nicht Konkubinat) → wie bisher eine Zahl', () => {
    const r = kantonssteuerFuerProfil({ ...fall, konkubinat: false, partnerAngegeben: false });
    expect(r.grund).toBeNull();
  });

  it('an der Aufrufstelle: der Steuerrechner gibt die Profilangabe an die Rechnung weiter', () => {
    const quelle = fs.readFileSync(path.resolve(__dirname, '..', 'TaxCalculator.jsx'), 'utf8');
    const eingaben = quelle.slice(quelle.indexOf('const eingaben = {'), quelle.indexOf('const steuern = steuernFuerProfil(eingaben)'));
    expect(eingaben).toMatch(/partnerAngegebenProfil: profilEingaben\.partnerAngegeben/);
  });
});
