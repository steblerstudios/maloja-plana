import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bestimmeSatz, bestimmeWartetage, ALV_PARAMS } from '../data/alvRechner.js';
import { generateCVTemplate, generateCVHTML, PERSOENLICH_FELDER } from '../cvGenerator.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Kapitel 5 «Ausbildung & Arbeit», Nachzug 10.11.2026: die K-Punkte nach dem Hauptbau (#814).
const quelle = (pfad) => readFileSync(fileURLToPath(new URL(pfad, import.meta.url)), 'utf8');

describe('ALV-Randfall 10 416: Wartetage nach Jahresverdienst (AVIG Art. 18 Abs. 1, AVIV Art. 6a)', () => {
  it('zwischen 10 416.01 und 10 416.66 im Monat (unter 125 000 im Jahr) 15 Tage — vorher 20', () => {
    expect(bestimmeWartetage({ versicherterVerdienst: 10416.5, hatKinder: false })).toBe(15);
    expect(bestimmeWartetage({ versicherterVerdienst: 125000 / 12, hatKinder: false })).toBe(15);
    expect(bestimmeWartetage({ versicherterVerdienst: 10416.66, hatKinder: false })).toBe(15);
    // 10 416.67 × 12 = 125 000.04 — «über 125 000» nach dem Wortlaut (AVIG Art. 18 Abs. 1 Bst. c)
    expect(bestimmeWartetage({ versicherterVerdienst: 10416.67, hatKinder: false })).toBe(20);
    expect(bestimmeWartetage({ versicherterVerdienst: 10417, hatKinder: false })).toBe(20);
  });
  it('die übrigen Grenzen genau auf dem Jahresbetrag', () => {
    expect(bestimmeWartetage({ versicherterVerdienst: 3000, hatKinder: false })).toBe(0);
    expect(bestimmeWartetage({ versicherterVerdienst: 3000.5, hatKinder: false })).toBe(5);
    expect(bestimmeWartetage({ versicherterVerdienst: 5000, hatKinder: true })).toBe(0);
    expect(bestimmeWartetage({ versicherterVerdienst: 5000.5, hatKinder: true })).toBe(5);
    expect(bestimmeWartetage({ versicherterVerdienst: 7500, hatKinder: false })).toBe(10);
    expect(bestimmeWartetage({ versicherterVerdienst: 7500.5, hatKinder: false })).toBe(15);
  });
});

describe('ALV-Randfall 3 797.50: 80 % solange das volle Taggeld höchstens 140 Fr. ist (AVIG Art. 22 Abs. 2 Bst. b, AVIV Art. 40a)', () => {
  const ohne = { hatKinder: false, ivGrad40: false };
  it('bis 3 797.50 im Monat 80 % — vorher ab 3 797.01 schon 70 %', () => {
    expect(bestimmeSatz({ versicherterVerdienst: 3797.3, ...ohne })).toBe(0.8);
    expect(bestimmeSatz({ versicherterVerdienst: 3797.5, ...ohne })).toBe(0.8);
    expect(bestimmeSatz({ versicherterVerdienst: 3798, ...ohne })).toBe(0.7);
  });
  it('entschieden wird am Taggeld, nicht am abgerundeten Monatsbetrag', () => {
    expect(ALV_PARAMS.satz80GrenzTaggeld).toBe(140);
    expect(ALV_PARAMS.taggelderProMonat).toBe(21.7);
  });
});

describe('Lebenslauf: Geburtsdatum, Nationalität, Zivilstand abwählbar', () => {
  const data = { basis: { firstName: 'Maria', lastName: 'Muster', dateOfBirth: '1990-04-01', nationality: 'CH', maritalStatus: 'single' } };
  const t = (k) => ({ 'cv.labelDob': 'Geburtsdatum', 'cv.labelNationality': 'Nationalität', 'cv.labelMaritalStatus': 'Zivilstand', 'cv.personalData': 'Persönliche Daten' }[k] || k);
  it('ohne Wahl wie bisher alle drei', () => {
    const html = generateCVHTML(generateCVTemplate(data, t), t);
    expect(html).toContain('Geburtsdatum:');
    expect(html).toContain('1990-04-01');
  });
  it('abgewählt steht die Angabe weder im Objekt noch im Ausdruck', () => {
    const cv = generateCVTemplate(data, t, { dateOfBirth: false });
    expect(cv.personal.dateOfBirth).toBe('');
    const html = generateCVHTML(cv, t);
    expect(html).not.toContain('Geburtsdatum:');
    expect(html).not.toContain('1990-04-01');
    expect(html).toContain('Zivilstand:');
  });
  it('alle drei abgewählt: kein leerer Abschnitt «Persönliche Daten»', () => {
    const aus = Object.fromEntries(PERSOENLICH_FELDER.map((f) => [f, false]));
    expect(generateCVHTML(generateCVTemplate(data, t, aus), t)).not.toContain('Persönliche Daten');
  });
  it('die Seite zeigt die Wahl', () => {
    expect(quelle('../CVGenerator.jsx')).toMatch(/'data-teil': 'persoenlich-wahl'/);
    for (const texte of [de, fr, it_, en, rm]) expect(texte.cv.persoenlichHinweis).toBeTruthy();
  });
});

describe('Texte', () => {
  it('«Drei Wege» — es folgen drei', () => {
    expect(de.edu.pathsIntro.sie).toContain('Drei Wege');
    expect(Object.keys(de.edu).filter((k) => /^path\dTitle$/.test(k))).toHaveLength(3);
    expect(en.edu.pathsIntro).toContain('Three routes');
  });
  it('Ausgesteuert: AHV je Kalenderjahr und Säule 3a, in Absätzen', () => {
    const text = de.aussteuerung.step3Text.sie;
    expect(text.split('\n\n')).toHaveLength(4);
    expect(text).toContain('AHVV Art. 28bis');
    expect(text).toContain('BVV 3 Art. 7');
    expect(quelle('../Aussteuerung.jsx')).toMatch(/t\('aussteuerung\.step3Text'\)\)\.split\('\\n\\n'\)/);
  });
  it('Stelle verloren: Sperrfrist verschiebt das Ende (OR Art. 336c)', () => {
    expect(de.stelleVerloren.step1Sperrfrist.sie).toContain('OR Art. 336c');
    expect(quelle('../StelleVerloren.jsx')).toContain("t('stelleVerloren.step1Sperrfrist')");
  });
  it('ALV-Rechner: Zwischenverdienst und Lohnbasis', () => {
    expect(de.alv.zwischenverdienst.sie).toContain('AVIG Art. 24');
    expect(de.alv.bruttolohnHint.sie).toContain('AVIV Art. 37');
    expect(quelle('../AlvRechner.jsx')).toContain("t('alv.zwischenverdienst')");
  });
});
