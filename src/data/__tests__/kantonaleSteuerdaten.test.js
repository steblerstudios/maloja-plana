import { describe, it, expect } from 'vitest';
import { schaetzeKantonaleSteuer, KANTONAL_DATA_VERSION } from '../kantonaleSteuerdaten.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import it_ from '../../i18n/it.js';
import rm from '../../i18n/rm.js';

// K13 (Bauliste §9-E20 / §10): der Kantons-/Gemeindesteuer-Faktor ist nur bei einem
// Einkommen von rund CHF 80'000 (ledig) geeicht (kantonaleSteuerdaten.js:3,
// freigabe-register.md Z. 39: "Faktor bei 80 000 geeicht, auf alles angewandt").
// Ein Einkommensband ist NIRGENDS im Code/in der Quelle belegt — nur der eine
// Eichpunkt. Also nur Teil (a) des Entscheids gebaut: am Ergebnis sichtbar als grobe
// Schätzung kennzeichnen. Teil (b) (ausserhalb eines Bands keine Zahl) bleibt offen,
// weil kein Band belegt ist — siehe PR-Body/Rückmeldung.
describe('K13 — Kantons-/Gemeindesteuer-Faktor als grobe Schätzung kennzeichnen', () => {
  it('liefert weiterhin eine Schätzung, auch weit weg vom Eichpunkt CHF 80\'000 — es gibt kein belegtes Band, das sie zurückhalten würde', () => {
    const tief = schaetzeKantonaleSteuer(500, 'ZH');
    const hoch = schaetzeKantonaleSteuer(200000, 'ZH');
    expect(tief).not.toBeNull();
    expect(hoch).not.toBeNull();
    expect(tief.faktor).toBe(hoch.faktor);
  });

  it('kennzeichnet das Ergebnis in allen 5 Sprachen als grobe Schätzung und nennt den Eichpunkt', () => {
    const dicts = { de, en, fr, it: it_, rm };
    for (const [lang, dict] of Object.entries(dicts)) {
      expect(dict.tax.roughEstimateBadge, lang).toBeTruthy();
      expect(dict.tax.basedOnHauptort, lang).toMatch(/80[’'.,\s]?000/);
    }
  });

  it('KANTONAL_DATA_VERSION bleibt als Orientierungs-Datenstand ausgewiesen', () => {
    expect(KANTONAL_DATA_VERSION).toMatch(/Orientierung/);
  });
});
