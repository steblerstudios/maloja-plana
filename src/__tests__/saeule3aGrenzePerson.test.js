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

  // Fachprüfung 11.11.2026: das Jahr im Grenz-Text folgt dem Tarif, statt fest «2026» zu sagen.
  it('der 3a-Grenz-Text nennt das Tarifjahr, nicht ein festes Jahr', async () => {
    const de = (await import('../i18n/de.js')).default;
    expect(de.tax.grenze_pension3a).toContain('{jahr}');
    expect(readFileSync(fileURLToPath(new URL('../TaxCalculator.jsx', import.meta.url)), 'utf8')).toContain('jahr: STEUER_DATA_VERSION');
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

// Fachprüfung 11.11.2026: Angestellte unter der BVG-Eintrittsschwelle (BVG Art. 2 Abs. 1, 2026: «mehr als» 22 680)
// gehören keiner Pensionskasse an → 20 % des Lohns (BVV 3 Art. 7 Abs. 1 Bst. b), nicht der kleine Betrag.
describe('steuer3aGrenzePerson — der Steuer-Rechner mit echten Profilen', async () => {
  const { steuer3aGrenzePerson } = await import('../TaxCalculator.jsx');
  const profil = (finanzen, versicherungen = {}) => ({ finanzen, versicherungen });

  it('angestellt unter der Schwelle (18 000 brutto): 20 % = 3 600', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed', incomeType: 'brutto', monthlyIncome: 1500 }), 2026)).toBe(3600);
  });
  it('genau an der Schwelle (22 680) ist noch nicht versichert: 20 % = 4 536', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed', incomeType: 'brutto', monthlyIncome: 1890 }), 2026)).toBe(4536);
  });
  it('angestellt über der Schwelle: der kleine Betrag', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed', incomeType: 'brutto', monthlyIncome: 6000 }), 2026)).toBe(W26.mitPensionskasse);
  });
  it('angestellt, Lohn netto oder leer: wie bisher der kleine Betrag', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed', incomeType: 'netto', monthlyIncome: 1500 }), 2026)).toBe(W26.mitPensionskasse);
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed' }), 2026)).toBe(W26.mitPensionskasse);
  });
  it('eine eingetragene Kasse geht immer vor', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'employed', incomeType: 'brutto', monthlyIncome: 1500 }, { bvgInsurer: 'Kasse X' }), 2026)).toBe(W26.mitPensionskasse);
    expect(steuer3aGrenzePerson(profil({ employmentType: 'freelance' }, { bvgInsurer: 'Kasse X' }), 2026)).toBe(W26.mitPensionskasse);
  });
  it('selbständig ohne Kasse: der grosse Betrag als oberste Grenze', () => {
    expect(steuer3aGrenzePerson(profil({ employmentType: 'selfEmployed', incomeType: 'brutto', monthlyIncome: 1500 }), 2026)).toBe(W26.ohnePensionskasse);
  });
});
