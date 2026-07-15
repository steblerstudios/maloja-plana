import { describe, it, expect } from 'vitest';
import { getLetterTemplates, generateLetter, getFristInfo, FRIST_TAGE } from '../briefGenerator.js';
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
