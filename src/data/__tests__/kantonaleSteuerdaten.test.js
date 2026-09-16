import { describe, it, expect } from 'vitest';
import { schaetzeKantonaleSteuer, KANTONAL_DATA_VERSION } from '../kantonaleSteuerdaten.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import it_ from '../../i18n/it.js';
import rm from '../../i18n/rm.js';

// K13 (Bauliste §9-E20 / §10): der Kantons-/Gemeindesteuer-Faktor wird am Ergebnis als grobe
// Schätzung gekennzeichnet (Teil a). Teil (b) ist seit E37 gebaut: das Band, in dem der Faktor am
// ESTV-Steuerrechner 2026 geprüft ist, steht in src/data/steuerfaktorBand.js; zurückgehalten wird im
// TaxCalculator (Tests: steuerfaktorBand.test.js, steuerbandAnsicht.test.js). schaetzeKantonaleSteuer
// selbst rechnet weiter für jedes Einkommen — FinanzUebersicht und BehoerdenDossier nutzen es direkt.
describe('K13 — Kantons-/Gemeindesteuer-Faktor als grobe Schätzung kennzeichnen', () => {
  it('schaetzeKantonaleSteuer rechnet für jedes Einkommen mit demselben Faktor — das Band prüft der Aufrufer', () => {
    const tief = schaetzeKantonaleSteuer(500, 'ZH');
    const hoch = schaetzeKantonaleSteuer(200000, 'ZH');
    expect(tief).not.toBeNull();
    expect(hoch).not.toBeNull();
    expect(tief.faktor).toBe(hoch.faktor);
  });

  it('kennzeichnet das Ergebnis in allen 5 Sprachen als grobe Schätzung und nennt das geprüfte Band', () => {
    const dicts = { de, en, fr, it: it_, rm };
    for (const [lang, dict] of Object.entries(dicts)) {
      expect(dict.tax.roughEstimateBadge, lang).toBeTruthy();
      // E37: der alte Eichpunkt «rund 80 000» liess sich am ESTV-Rechner 2026 nicht bestätigen.
      expect(dict.tax.basedOnHauptort, lang).not.toMatch(/80[’'.,\s]?000/);
      for (const platzhalter of ['{min}', '{max}', '{tol}', '{year}']) expect(dict.tax.basedOnHauptort, lang).toContain(platzhalter);
    }
  });

  it('KANTONAL_DATA_VERSION bleibt als Orientierungs-Datenstand ausgewiesen', () => {
    expect(KANTONAL_DATA_VERSION).toMatch(/Orientierung/);
  });
});
