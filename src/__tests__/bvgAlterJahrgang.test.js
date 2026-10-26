import { describe, it, expect } from 'vitest';
import { alterUndRentenalter, nettoMonatAusProfil } from '../utils/nettoAusProfil.js';
import { bruttoZuNettoRichtwert } from '../data/lohnAbzuege.js';
import { berechneBVGGuthaben } from '../data/ahvRechner.js';

// BVV 2 Art. 13 (fedlex gelesen 26.10.2026): «Das für die Berechnung der Altersgutschrift massgebende Alter des
// Versicherten ergibt sich aus der Differenz zwischen dem laufenden Kalenderjahr und dem Geburtsjahr.»
const heute = new Date(2026, 9, 22);

describe('bvgAlter nach BVV 2 Art. 13', () => {
  it('Kalenderjahr minus Geburtsjahr, unabhängig vom Geburtstag', () => {
    expect(alterUndRentenalter({ dateOfBirth: '2001-11-15' }, heute)).toMatchObject({ alter: 24, bvgAlter: 25 });
    expect(alterUndRentenalter({ dateOfBirth: '2001-02-15' }, heute)).toMatchObject({ alter: 25, bvgAlter: 25 });
    expect(alterUndRentenalter({}, heute).bvgAlter).toBeUndefined();
  });

  it('Netto-Richtwert: wer 2026 25 wird, hat schon den PK-Sparanteil (7 %), auch vor dem Geburtstag', () => {
    const vorGeburtstag = nettoMonatAusProfil(5000, 'brutto', { dateOfBirth: '2001-11-15' }, heute).netto;
    const nachGeburtstag = nettoMonatAusProfil(5000, 'brutto', { dateOfBirth: '2001-02-15' }, heute).netto;
    expect(vorGeburtstag).toBe(nachGeburtstag);
    expect(vorGeburtstag).toBe(bruttoZuNettoRichtwert(5000, 25, false));
    expect(vorGeburtstag).toBeLessThan(bruttoZuNettoRichtwert(5000, 24, false));
  });
});

describe('BVG-Hochrechnung: Stufe je Jahr nach Jahrgang', () => {
  const basis = { jahresbruttolohn: 80000, austrittsalter: 65, stichtag: heute };
  it('Geburt Nov. 1991: heute 34, im Jahr 2026 aber 35 → schon 10 %', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 34, geburtsjahr: 1991 });
    expect(r.jahresDetail[0]).toMatchObject({ alter: 34, gutschriftSatz: 10 });
    expect(r.jahresDetail).toHaveLength(31); // Zahl der Jahre bleibt am Alter am Tag
  });
  it('letzter Durchlauf bei noch nicht erreichtem Geburtstag: Stufenalter 65 bleibt in der Tabelle (18 %)', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 34, geburtsjahr: 1991 });
    expect(r.jahresDetail[30]).toMatchObject({ alter: 64, gutschriftSatz: 18 });
  });
  it('gebrochenes Referenzalter (Frau JG 1963, 64 J 9 M): Stufenalter höchstens 65, letzte Stufe 18 %', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 62, austrittsalter: 64.75, geburtsjahr: 1963 });
    expect(r.jahresDetail.map(d => d.gutschriftSatz)).toEqual([18, 18, 18]);
  });
  it('Grenze 24/25: Jahrgang 2002 bekommt 2026 noch keine, 2027 die erste Gutschrift (7 %)', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 23, geburtsjahr: 2002 });
    expect(r.jahresDetail.slice(0, 2).map(d => d.gutschriftSatz)).toEqual([0, 7]);
  });
  it('ohne Geburtsjahr wie bisher (Stufe nach Alter am Tag)', () => {
    const r = berechneBVGGuthaben({ ...basis, alter: 34 });
    expect(r.jahresDetail[0]).toMatchObject({ alter: 34, gutschriftSatz: 7 });
  });
});
