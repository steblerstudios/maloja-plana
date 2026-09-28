import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as cantonalData from '../cantonalData.js';
import { CANTON_CODES, calculateSozialhilfe } from '../cantonalData.js';

// Wächter (28.09.2026): die App kennt keine Mietzins-Limite. Bis dahin stand in cantonalData.js
// eine Tabelle mit 26 Kantonen ohne Quelle und ohne Stand; sie wurde als «kantonale
// Mietzins-Limite» angezeigt und deckelte die Wohnkosten der Sozialhilfe-Schnellrechnung.
// Wer eine Limite einführt, bringt sie belegt (je Gemeinde, mit `beleg`) — und passt diesen Test an.

const profil = (canton, miete, nebenkosten = 0) => ({
  basis: { canton, household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 0 },
  wohnen: { rentAmount: String(miete), utilities: String(nebenkosten) },
  versicherungen: { kkPremium: '0' },
});

describe('Mietzins-Limite: keine unbelegten Kantonswerte', () => {
  it('rechnet in jedem Kanton die ganze erfasste Miete ein, auch eine sehr hohe', () => {
    const falsch = [];
    for (const canton of CANTON_CODES) {
      const r = calculateSozialhilfe(profil(canton, 4800, 200));
      if (r.effectiveRent !== 5000) falsch.push(`${canton}: ${r.effectiveRent}`);
    }
    expect(falsch).toEqual([]);
  });

  it('gibt keine Limite als Zahl heraus und exportiert keine Kantonstabelle', () => {
    expect(calculateSozialhilfe(profil('ZH', 1200)).rentLimit).toBeUndefined();
    expect(cantonalData.CANTONAL_RENT_LIMITS).toBeUndefined();
    expect(cantonalData.getRentLimit).toBeUndefined();
  });

  it('kein Text behauptet mehr eine «kantonale Mietzins-Limite» mit Betrag', () => {
    for (const sprache of ['de', 'en', 'fr', 'it', 'rm']) {
      const quelle = readFileSync(new URL(`../../i18n/${sprache}.js`, import.meta.url), 'utf8');
      expect(quelle, sprache).not.toMatch(/rentWithin|rentOver|\brentLimit:/);
    }
  });
});
