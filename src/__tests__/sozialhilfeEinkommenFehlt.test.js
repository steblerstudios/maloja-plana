import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { generateBehoerdenJSON } from '../dossierGenerator.js';

// F8-S4 auch für Karte und Dossier: aus einem leeren Einkommensfeld wird kein Betrag.
const profil = (finanzen) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const t = (k) => k;

describe('einkommenFehlt', () => {
  it('leeres Profil: Flag gesetzt, die Rechnung selbst unverändert', () => {
    const s = calculateSozialhilfe(profil({}));
    expect(s.einkommenFehlt).toBe(true);
    expect(s.deficit).toBeGreaterThan(0);
  });
  it('eine 0 ist eine Antwort', () => {
    expect(calculateSozialhilfe(profil({ monthlyIncome: 0 })).einkommenFehlt).toBe(false);
  });
  it('Alimente ohne Lage: fehlt weiter; arbeitslos mit Alimenten: reicht', () => {
    expect(calculateSozialhilfe(profil({ alimenteReceived: 800 })).einkommenFehlt).toBe(true);
    expect(calculateSozialhilfe(profil({ alimenteReceived: 800, employmentType: 'unemployed' })).einkommenFehlt).toBe(false);
  });
  it('Dossier-JSON: kein Betrag, nicht anspruchsberechtigt', () => {
    const d = profil({});
    const j = generateBehoerdenJSON(d, { sozialhilfe: calculateSozialhilfe(d) }, t);
    const s = (typeof j === 'string' ? JSON.parse(j) : j).calculations.sozialhilfe;
    expect(s.eligible).toBe(false);
    expect(s.deficit).toBeNull();
  });
});
