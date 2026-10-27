import { describe, it, expect } from 'vitest';
import { getLebensMappePreview, generateLebensmappe } from '../dossierGenerator.js';
import { getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// F7-S1 (Sophie, 27.10.2026): «Alle Kapitel auf einen Blick» — die Lebensmappe liess Behörden & Rechtliches weg.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const chapters = getChapters(t);

describe('Lebensmappe · alle sieben Kapitel', () => {
  it('Maria: sieben Bereiche mit Angaben, Behörden mit Steuerkanton, Steuernummer und Frist', () => {
    const v = getLebensMappePreview(DEMO_DATA, chapters, t, []);
    expect(v.sections).toHaveLength(7);
    const b = v.sections.find((s) => s.key === 'behoerden');
    const werte = b.rows.map((r) => r.value);
    expect(werte).toContain('ZH-2024-123456');
    expect(werte).toContain('31.03.2027');
    expect(werte.some((w) => /Zürich/.test(w))).toBe(true);
  });

  it('auch im Druck', () => {
    expect(generateLebensmappe(DEMO_DATA, chapters, t, [])).toContain('ZH-2024-123456');
  });
});
