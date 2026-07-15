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
// `incomeType: 'brutto'` ist ab Predeploy-Runde 8 PFLICHT für jeden Befund: der Mindestlohn
// ist ein Brutto-Stundenlohn, und die App rät im Feld-Hinweis ausdrücklich zu Netto. Ohne
// ausdrückliches 'brutto' gibt es keinen Befund ('basisUnklar') — siehe eigener Block unten.
const dataGE = {
  basis: { firstName: 'Anna', lastName: 'Muster', canton: 'GE' },
  wohnen: { city: 'Genève' },
  finanzen: { monthlyIncome: '3000', employer: 'Muster AG', incomeType: 'brutto' },
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
        sideHoursPerWeek: '4', sideIncomeType: 'brutto',
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
    // 🔴 Predeploy-Runde 8: Der Betrag war mit EINEM Monatslohn vorbefüllt, während der
    // Zeitraum offen blieb — wer 3 Monate schuldig war, mahnte gedruckt ein Drittel ein.
    // Jetzt bleibt der Forderungsbetrag offen; der Monatslohn steht nur als benannter
    // Anhalt daneben. Der Nebenjob-Bezug bleibt: nie der Hauptlohn.
    it('unpaidWage job=side: Monatslohn als Anhalt (800), nie der Hauptlohn (3000)', () => {
      const html = generateLetter('unpaidWage', mitNeben, t, { job: 'side' });
      expect(html).toContain('Café Nebenan');
      expect(html).toContain('800');
      expect(html).not.toContain("3'000");
    });
    it('unpaidWage: Forderungsbetrag bleibt offen, solange der Zeitraum offen ist', () => {
      const html = generateLetter('unpaidWage', mitNeben, t);
      // Zeitraum UND Betrag sind Selbst-Eintrag — der Brief behauptet keine Summe.
      expect(html).toContain('[bitte ergänzen]');
      expect(html).toContain('Monatslohn'); // der Anhalt, klar als „pro Monat" benannt
    });
  });

  // 🔴 Predeploy-Runde 8 — Netto/Brutto. Die App fragt die Einkommensart ab und rät im
  // Feld-Hinweis ausdrücklich zu NETTO („Netto ist was auf Ihrem Konto ankommt"), die
  // Mindestlöhne sind aber BRUTTO. Vorher wurde `incomeType` im ganzen Lohn-Pfad nie
  // gelesen: GE/CHF 4'000 netto auf 42 Std. → 21.98/Std. < 24.59 → Warnung → Einschreiben,
  // obwohl brutto ~4'550 = 25.00/Std. wären, also legal. Wer der Anleitung der App folgte,
  // beschuldigte seinen Arbeitgeber zu Unrecht.
  describe('Netto/Brutto (Falschanschuldigungs-Schutz)', () => {
    const dataNetto = { ...dataGE, finanzen: { ...dataGE.finanzen, monthlyIncome: '4000', incomeType: 'netto' } };
    const dataOhneArt = { ...dataGE, finanzen: { ...dataGE.finanzen, monthlyIncome: '4000', incomeType: undefined } };

    it('netto: keine Beträge im Brief (Mindestlohn ist brutto)', () => {
      const html = generateLetter('wageClaim', dataNetto, t);
      expect(html).not.toContain('21.98'); // die falsche Netto-gegen-Brutto-Zahl
      expect(html).toContain('[bitte ergänzen]');
    });
    it('Einkommensart nicht gesetzt: keine Beträge (Basis unbekannt, nicht „brutto" annehmen)', () => {
      const html = generateLetter('wageClaim', dataOhneArt, t);
      expect(html).not.toContain('21.98');
      expect(html).toContain('[bitte ergänzen]');
    });
    it('brutto: Befund wird gerechnet', () => {
      const dataBrutto = { ...dataGE, finanzen: { ...dataGE.finanzen, monthlyIncome: '4000', incomeType: 'brutto' } };
      expect(generateLetter('wageClaim', dataBrutto, t)).toContain('21.98');
    });
    it('Nebenerwerb hat eine EIGENE Einkommensart — die des Hauptjobs zählt dort nicht', () => {
      const neben = {
        ...dataGE,
        finanzen: { ...dataGE.finanzen, incomeType: 'brutto', sideIncome: '200', sideEmployer: 'Café Nebenan', sideHoursPerWeek: '4', sideIncomeType: 'netto' },
      };
      const html = generateLetter('wageClaim', neben, t, { job: 'side' });
      expect(html).not.toContain('11.56'); // 200/(4×52/12) — darf bei netto nicht erscheinen
      expect(html).toContain('[bitte ergänzen]');
    });
  });

  // 🔴 Predeploy-Runde 8 — der Brief wurde auch dann angeboten, wenn die App den Verdacht
  // selbst widerlegt hatte: GE/CHF 8'000 auf 42 Std. = 43.96/Std., Befund 'ok', und der
  // Brief behauptete trotzdem „dass mein Stundenlohn unter dem … Mindestlohn liegen dürfte"
  // — mit leeren Beträgen. Jetzt entscheidet der Befund, nicht der Wohnort.
  describe('Vorlagen-Gating am BEFUND, nicht nur am Kanton', () => {
    it('gut bezahlt (GE, 8000 auf 42 Std. = 43.96/Std.): KEIN wageClaim angeboten', () => {
      const gutBezahlt = { ...dataGE, finanzen: { ...dataGE.finanzen, monthlyIncome: '8000' } };
      expect(getLetterTemplates(t, gutBezahlt).map(x => x.key)).not.toContain('wageClaim');
    });
    it('unter Mindestlohn: wageClaim angeboten', () => {
      expect(getLetterTemplates(t, dataGE).map(x => x.key)).toContain('wageClaim');
    });
    it('Daten unvollständig (keine Stunden): wageClaim bleibt angeboten — die App weiss es nicht, statt es besser zu wissen', () => {
      const ohneStunden = { ...dataGE, ausbildung: {} };
      expect(getLetterTemplates(t, ohneStunden).map(x => x.key)).toContain('wageClaim');
    });
    it('gut bezahlter Hauptjob, aber unterbezahlter Nebenjob: wageClaim angeboten', () => {
      const nebenUnter = {
        ...dataGE,
        finanzen: { ...dataGE.finanzen, monthlyIncome: '8000', sideIncome: '200', sideEmployer: 'Café Nebenan', sideHoursPerWeek: '4', sideIncomeType: 'brutto' },
      };
      expect(getLetterTemplates(t, nebenUnter).map(x => x.key)).toContain('wageClaim');
    });
  });

  // BS war bis 2026-07-15 verify:true (neutrale Formulierung). Seit der amtlichen
  // Gegenprüfung an gesetzessammlung.bs.ch + bs.ch/wsu/awa nennt der Brief Gesetz + Stelle.
  describe('wageClaim (BS — amtlich belegt)', () => {
    const dataBS = { ...dataGE, basis: { ...dataGE.basis, canton: 'BS' } };
    const html = generateLetter('wageClaim', dataBS, t);
    it('nennt das MiLoG und das AWA statt der neutralen Formulierung', () => {
      expect(html).toContain('MiLoG');
      expect(html).toContain('Amt für Wirtschaft und Arbeit');
      expect(html).not.toContain('die zuständige kantonale Stelle');
    });
    it('rechnet mit dem BS-Mindestlohn 22.20', () => {
      expect(html).toContain('22.20');
    });
  });

  describe('wageClaim (NE — amtlich belegt)', () => {
    const dataNE = { ...dataGE, basis: { ...dataGE.basis, canton: 'NE' } };
    const html = generateLetter('wageClaim', dataNE, t);
    it('nennt die LEmpl Art. 32a ff. und den ORCT — kein erfundenes „Mindestlohngesetz“', () => {
      expect(html).toContain('LEmpl');
      expect(html).toContain('ORCT');
      expect(html).not.toContain('Mindestlohngesetz');
      expect(html).not.toContain('die zuständige kantonale Stelle');
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
