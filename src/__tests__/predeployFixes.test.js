import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { lohnVergleichSperre } from '../data/lohnEinordnung.js';
import { UMLEITUNGEN } from '../utils/hashRouter.js';

const quelle = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');

describe('Predeploy 02.11.2026', () => {
  it('Direkteinstieg: Die Sprungmarke wird vor dem Umschreiben der Adresse gelesen', () => {
    const s = quelle('../main.jsx');
    expect(s.indexOf('const [startAnker]')).toBeGreaterThan(-1);
    expect(s.indexOf('const [startAnker]')).toBeLessThan(s.indexOf('replaceHash(view, chapterIdx)'));
    expect(s).toContain('springeZuAnker(startAnker)');
    expect(UMLEITUNGEN.notfalleinstieg.anker).toBeTruthy();
  });

  it('Der Medikamentenname geht nicht an compendium.ch', () => {
    const s = quelle('../MedicationManager.jsx');
    expect(s).not.toContain('search?q=');
    expect(s).not.toMatch(/encodeURIComponent\(med\.name\)/);
  });

  const profil = (f, v = {}) => ({ basis: { canton: 'ZH' }, wohnen: { rentAmount: '1200' }, finanzen: f, versicherungen: v });
  it('Selbständige: keine Abzüge von Angestellten, die Anzeige nennt die Beiträge', () => {
    const sh = calculateSozialhilfe(profil({ employmentType: 'selfEmployed', monthlyIncome: '3300', incomeType: 'brutto' }, { ahvContribution: '3600' }));
    expect(sh.income).toBe(3300);
    expect(sh.vorBeitraegen).toBe(true);
    const ang = calculateSozialhilfe(profil({ employmentType: 'employed', monthlyIncome: '3300', incomeType: 'brutto' }, { ahvContribution: '3600' }));
    expect(ang.income).toBeLessThan(3300);
    expect(ang.vorBeitraegen).toBe(false);
  });

  it('Rechner, Feld und Hinweis liegen hinter der Sperre', () => {
    expect(quelle('../AlvRechner.jsx')).toContain('lohnVergleichSperre(data, rentenalter)');
    expect(quelle('../components/EinkommenFeld.jsx')).toContain('lohnVergleichSperre(');
    expect(lohnVergleichSperre({ finanzen: { employmentType: 'selfEmployed', incomeType: 'netto' } }, false)).toBe('keinLohn');
  });
});
