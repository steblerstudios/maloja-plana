// Säule-3a-Grenze einer Person (BVV 3 Art. 7 Abs. 1) — eine Regel für Steuer- und Vorsorge-Rechner.
// Befund Vortor 10.11.2026: Der Vorsorge-Rechner kannte nur «Freiberuflich», der Steuer-Rechner nur
// «Selbstständig» als selbständig, und dem Steuer-Rechner fehlten die 20 % ohne 2. Säule.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { saeule3aGrenzePerson, SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR } from '../data/saeule3a.js';
import { istSelbstaendig } from '../utils/anstellung.js';
import { zahltBeitraegeSelbst } from '../utils/monatsrechnung.js';

const W26 = SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR[2026];

describe('saeule3aGrenzePerson', () => {
  it('mit 2. Säule: der kleine Betrag, unabhängig vom Einkommen (Bst. a)', () => {
    expect(saeule3aGrenzePerson({ steuerjahr: 2026, hatPensionskasse: true, erwerbseinkommen: 300000 })).toBe(W26.mitPensionskasse);
  });

  it('ohne 2. Säule: 20 % des Erwerbseinkommens (Bst. b)', () => {
    expect(saeule3aGrenzePerson({ steuerjahr: 2026, hatPensionskasse: false, erwerbseinkommen: 60000 })).toBe(12000);
  });

  it('ohne 2. Säule: höchstens der grosse Betrag', () => {
    expect(saeule3aGrenzePerson({ steuerjahr: 2026, hatPensionskasse: false, erwerbseinkommen: 500000 })).toBe(W26.ohnePensionskasse);
  });

  it('ohne 2. Säule und ohne bekanntes Einkommen: der grosse Betrag als oberste Grenze', () => {
    expect(saeule3aGrenzePerson({ steuerjahr: 2026, hatPensionskasse: false, erwerbseinkommen: 0 })).toBe(W26.ohnePensionskasse);
    expect(saeule3aGrenzePerson({ steuerjahr: 2026, hatPensionskasse: false })).toBe(W26.ohnePensionskasse);
  });

  it('folgt dem Steuerjahr, rät kein unbelegtes', () => {
    expect(saeule3aGrenzePerson({ steuerjahr: 2027, hatPensionskasse: true })).toBe(7373);
    expect(saeule3aGrenzePerson({ steuerjahr: 1999, hatPensionskasse: true })).toBeNull();
  });
});

describe('istSelbstaendig — eine Regel für alle Rechner', () => {
  it('«Selbstständig» und «Freiberuflich» sind beide selbständig', () => {
    expect(istSelbstaendig({ employmentType: 'selfEmployed' })).toBe(true);
    expect(istSelbstaendig({ employmentType: 'freelance' })).toBe(true);
  });

  it('Angestellte, Lernende, Pensionierte und leere Angaben nicht', () => {
    for (const art of ['employed', 'apprentice', 'retired', undefined]) {
      expect(istSelbstaendig({ employmentType: art })).toBe(false);
    }
    expect(istSelbstaendig(undefined)).toBe(false);
  });

  it('die Monatsrechnung fragt dieselbe Regel', () => {
    expect(zahltBeitraegeSelbst).toBe(istSelbstaendig);
  });

  // Die Rechner dürfen die Frage nicht wieder selbst stellen — genau so entstand der Befund.
  it('Steuer- und Vorsorge-Rechner prüfen den Anstellungstyp nicht mehr von Hand', () => {
    for (const datei of ['../TaxCalculator.jsx', '../VorsorgeRechner.jsx']) {
      const quelle = readFileSync(fileURLToPath(new URL(datei, import.meta.url)), 'utf8');
      expect(quelle, datei).toContain('istSelbstaendig(');
      expect(quelle, datei).toContain('saeule3aGrenzePerson(');
      expect(quelle, datei).not.toMatch(/employmentType\s*===\s*'(selfEmployed|freelance)'/);
    }
  });
});
