import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { auswahlLabel } from '../utils/auswahlLabel.js';
import { generateCVTemplate, generateCVHTML, generateJSONResume } from '../cvGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Seitenrundgang 27.09.2026: gespeicherte Auswahl-Schlüssel standen roh in der Anzeige —
// Lebenslauf «bachelor», Dashboard «Franchise f1500, standard».
const t = createT({ de }, 'de', 'sie');

describe('auswahlLabel', () => {
  it('zeigt das Etikett der Sprache', () => {
    expect(auswahlLabel('ausbildung', 'educationLevel', 'bachelor', t)).toBe('Bachelor');
    expect(auswahlLabel('versicherungen', 'franchise', 'f1500', t)).toBe('1’500');
    expect(auswahlLabel('versicherungen', 'kkModel', 'standard', t)).toBe('Standard (freie Arztwahl)');
    expect(auswahlLabel('basis', 'nationality', 'swiss', t)).toBe('Schweizer/in');
  });
  it('leer bleibt leer, Unbekanntes bleibt stehen', () => {
    expect(auswahlLabel('ausbildung', 'educationLevel', '', t)).toBe('');
    expect(auswahlLabel('ausbildung', 'educationLevel', undefined, t)).toBe('');
    expect(auswahlLabel('ausbildung', 'educationLevel', 'Fachhochschule', t)).toBe('Fachhochschule');
  });
});

describe('Lebenslauf zeigt Etiketten, keine Schlüssel', () => {
  const data = { basis: { firstName: 'Maria', lastName: 'Muster', nationality: 'swiss', maritalStatus: 'single' }, ausbildung: { educationLevel: 'bachelor', schoolName: 'ZHAW' } };
  it('Vorlage, HTML und JSON Resume', () => {
    const cv = generateCVTemplate(data, t);
    expect(cv.personal.nationality).toBe('Schweizer/in');
    expect(cv.education.highest).toBe('Bachelor');
    const html = generateCVHTML(cv, t);
    expect(html).toContain('Schweizer/in');
    expect(html).not.toMatch(/>\s*swiss\b|: swiss\b/);
    expect(generateJSONResume(data, t).education[0].studyType).toBe('Bachelor');
  });
});

describe('Dashboard-Satz Versicherungen', () => {
  it('liest Franchise und Modell nicht roh', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'Dashboard.jsx'), 'utf8');
    expect(src).not.toMatch(/value: chData\.franchise \}|parts\.push\(chData\.kkModel\)/);
  });
});
