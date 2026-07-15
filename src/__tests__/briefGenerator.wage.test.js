import { describe, it, expect } from 'vitest';
import { getLetterTemplates, generateLetter, getFristInfo, FRIST_TAGE, getJobOptions } from '../briefGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

const translations = { de, en, fr, it: itTranslations, rm };
const t = createT(translations, 'de');

// GE-Mindestlohn 24.59/Std., 42h/Woche → 182 Std./Monat. 3000/182 ≈ 16.48 < 24.59.
const dataGE = {
  basis: { firstName: 'Anna', lastName: 'Muster', canton: 'GE' },
  wohnen: { city: 'Genève' },
  finanzen: { monthlyIncome: '3000', employer: 'Muster AG' },
  ausbildung: { workHoursPerWeek: '42' },
};

describe('Lohn-Briefe', () => {
  describe('Vorlagen-Gating (🔴 Fix)', () => {
    it('Mindestlohn-Kanton (GE): wageClaim + unpaidWage werden angeboten', () => {
      const keys = getLetterTemplates(t, dataGE).map(x => x.key);
      expect(keys).toContain('wageClaim');
      expect(keys).toContain('unpaidWage');
    });
    it('Kanton OHNE Mindestlohn (ZH): KEIN wageClaim (kein erfundener Mindestlohn), aber unpaidWage', () => {
      const keys = getLetterTemplates(t, { basis: { canton: 'ZH' } }).map(x => x.key);
      expect(keys).not.toContain('wageClaim');
      expect(keys).toContain('unpaidWage');
    });
    it('ohne Kanton: kein wageClaim (nicht raten)', () => {
      const keys = getLetterTemplates(t, {}).map(x => x.key);
      expect(keys).not.toContain('wageClaim');
    });
  });

  describe('getFristInfo', () => {
    it('rechnet die Frist-Tage korrekt (30 / 10)', () => {
      expect(FRIST_TAGE.wageClaim).toBe(30);
      expect(FRIST_TAGE.unpaidWage).toBe(10);
      const base = new Date('2026-01-01T12:00:00');
      expect(getFristInfo('wageClaim', base).display).toBe('31.01.2026');
      expect(getFristInfo('wageClaim', base).iso).toBe('2026-01-31');
      expect(getFristInfo('unpaidWage', base).display).toBe('11.01.2026');
    });
    it('gibt null für Brieftypen ohne Frist', () => {
      expect(getFristInfo('leaseTermination')).toBeNull();
    });
  });

  describe('wageClaim (GE)', () => {
    const html = generateLetter('wageClaim', dataGE, t);
    it('nennt OR Art. 322, Arbeitgeber, Kantonsname', () => {
      expect(html).toContain('OR Art. 322');
      expect(html).toContain('Muster AG');
      expect(html).toContain('Genf');
    });
    it('rechnet den Lohn-Befund aus', () => {
      expect(html).toContain('16.48'); // 3000 / 182
      expect(html).toContain('24.59'); // GE-Mindestlohn
    });
    it('setzt die belegte Stelle ein (GE = OCIRT, verify:false)', () => {
      expect(html).toContain('OCIRT');
    });
    it('trägt das berechnete Frist-Datum ein', () => {
      expect(html).toContain(getFristInfo('wageClaim').display);
    });
  });

  // REGRESSION: Die alte 182h-Vollzeit-Annahme (`pruefeLohn`) erklärte korrekt bezahlte
  // Teilzeit-Angestellte für unterbezahlt — und dieser Befund führt zu einem Brief an den
  // Arbeitgeber, per Einschreiben. Ohne echte Wochenstunden wird nicht mehr geraten.
  describe('Teilzeit & fehlende Stunden (Fehlalarm-Schutz)', () => {
    it('Teilzeit 50% (21 Std./Woche): CHF 3000 sind 32.97/Std. → kein Unter-Mindestlohn-Befund', () => {
      const teilzeit = { ...dataGE, ausbildung: { workHoursPerWeek: '21' } };
      const html = generateLetter('wageClaim', teilzeit, t);
      expect(html).not.toContain('16.48'); // die falsche 182h-Zahl
      expect(html).toContain('[bitte ergänzen]');
    });
    it('ohne Wochenstunden: keine erfundenen Beträge, sondern „bitte ergänzen"', () => {
      const ohneStunden = { ...dataGE, ausbildung: {} };
      const html = generateLetter('wageClaim', ohneStunden, t);
      expect(html).not.toContain('16.48');
      expect(html).toContain('[bitte ergänzen]');
    });
    it('mit echten Vollzeit-Stunden (42): Befund wird weiterhin gerechnet', () => {
      const html = generateLetter('wageClaim', dataGE, t);
      expect(html).toContain('16.48');
      expect(html).toContain('24.59');
    });
  });

  describe('Empfänger: Arbeitgeber + Adresse', () => {
    it('Name UND Adresse belegt → beides steht im Empfängerfeld, keine Lücke', () => {
      const mitAdresse = { ...dataGE, finanzen: { ...dataGE.finanzen, employerAddress: 'Rue du Test 5\n1200 Genève' } };
      const html = generateLetter('wageClaim', mitAdresse, t);
      expect(html).toContain('Muster AG');
      expect(html).toContain('Rue du Test 5');
      expect(html).toContain('1200 Genève');
    });
    it('Name ohne Adresse → Name steht, Adresse bleibt als Lücke markiert', () => {
      const html = generateLetter('wageClaim', dataGE, t);
      expect(html).toContain('Muster AG');
      expect(html).toContain('[bitte ergänzen]');
    });
  });

  // Ein Brief über den Nebenjob darf NIE die Zahlen des Hauptjobs tragen — er geht per
  // Einschreiben an einen anderen Arbeitgeber.
  describe('Haupt- vs. Nebenerwerb', () => {
    const mitNeben = {
      ...dataGE,
      finanzen: {
        ...dataGE.finanzen,
        employerAddress: 'Rue du Test 5\n1200 Genève',
        sideIncome: '800', sideEmployer: 'Café Nebenan', sideEmployerAddress: 'Rue Petite 2\n1200 Genève',
        sideHoursPerWeek: '4',
      },
    };
    it('ohne Nebenerwerb: nur eine Anstellung zur Auswahl (keine Frage an die Nutzerin)', () => {
      expect(getJobOptions(dataGE).map(o => o.key)).toEqual(['main']);
    });
    it('mit Nebenerwerb: beide Anstellungen zur Auswahl', () => {
      expect(getJobOptions(mitNeben).map(o => o.key)).toEqual(['main', 'side']);
    });
    it('job=side: Brief geht an den Nebenjob-Arbeitgeber, nicht an den Hauptarbeitgeber', () => {
      const html = generateLetter('wageClaim', mitNeben, t, { job: 'side' });
      expect(html).toContain('Café Nebenan');
      expect(html).toContain('Rue Petite 2');
      expect(html).not.toContain('Muster AG');
    });
    it('job=side, fair bezahlt (800 auf 4 Std./Woche = 46.24/Std.): kein Befund, keine Zahlen', () => {
      const html = generateLetter('wageClaim', mitNeben, t, { job: 'side' });
      expect(html).not.toContain('16.48'); // die Hauptjob-Zahl darf hier nie auftauchen
      expect(html).toContain('[bitte ergänzen]'); // über dem Mindestlohn → nichts zu belegen
    });
    it('job=side, unterbezahlt (200 auf 4 Std./Woche = 11.56/Std.): rechnet MIT den Nebenjob-Zahlen', () => {
      const unterbezahlt = { ...mitNeben, finanzen: { ...mitNeben.finanzen, sideIncome: '200' } };
      const html = generateLetter('wageClaim', unterbezahlt, t, { job: 'side' });
      expect(html).toContain('11.56'); // 200 / (4×52/12) — der echte Nebenjob-Stundenlohn
      expect(html).toContain('24.59'); // GE-Mindestlohn
      expect(html).not.toContain('16.48'); // NICHT der Hauptjob
    });
    it('job=side ohne Nebenjob-Stunden: keine geratenen Beträge', () => {
      const ohneStd = { ...mitNeben, finanzen: { ...mitNeben.finanzen, sideHoursPerWeek: '' } };
      const html = generateLetter('wageClaim', ohneStd, t, { job: 'side' });
      expect(html).toContain('[bitte ergänzen]');
      expect(html).not.toContain('4.40'); // 800/182 — der Fehlalarm, den die 182h-Annahme erzeugt hätte
    });
    it('Vorgabe ohne job-Option: Hauptanstellung', () => {
      const html = generateLetter('wageClaim', mitNeben, t);
      expect(html).toContain('Muster AG');
      expect(html).not.toContain('Café Nebenan');
    });
    it('unpaidWage job=side: mahnt den Nebenjob-Lohn (800), nicht den Hauptlohn (3000)', () => {
      const html = generateLetter('unpaidWage', mitNeben, t, { job: 'side' });
      expect(html).toContain('Café Nebenan');
      expect(html).toContain('800');
      expect(html).not.toContain("3'000");
    });
  });

  describe('wageClaim (BS = verify:true → neutrale Formulierung, keine unbelegte Stelle)', () => {
    const dataBS = { ...dataGE, basis: { ...dataGE.basis, canton: 'BS' } };
    const html = generateLetter('wageClaim', dataBS, t);
    it('nutzt den neutralen Stellen-Fallback statt einer unbelegten BS-Stelle', () => {
      expect(html).toContain('die zuständige kantonale Stelle');
    });
  });

  describe('unpaidWage (Fix A + B)', () => {
    const html = generateLetter('unpaidWage', dataGE, t);
    it('nennt OR Art. 323', () => {
      expect(html).toContain('OR Art. 323');
    });
    it('Fix A: verweist auf Schlichtungsbehörde/Arbeitsgericht, NICHT auf die Mindestlohn-Kontrollstelle', () => {
      expect(html).toMatch(/Schlichtungsbehörde|Arbeitsgericht/);
    });
    it('Fix B: OR 82 nur mit Fachstellen-Vorbehalt', () => {
      expect(html).toContain('OR Art. 82');
      expect(html).toMatch(/Fachstelle/);
    });
    it('trägt das berechnete Frist-Datum ein', () => {
      expect(html).toContain(getFristInfo('unpaidWage').display);
    });
  });
});
