import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Sammel-Fix 14.10.2026, Punkt 4: Xdo (heartfelt10) behauptete «kein Konto, kein
// Tracking, Daten bleiben auf dem Gerät» als eigene Tatsache. Maloja hat die App nicht
// geprüft (App-Store-Etiketten können verknüpfte Daten nennen) — wie bei Nexter (heartfelt27)
// steht die Angabe als Aussage des Anbieters da.
const finde = (sprache) => {
  const m = JSON.stringify(sprache).match(/"heartfelt10":"((?:[^"\\]|\\.)*)"/);
  return m && JSON.parse('"' + m[1] + '"');
};
const marker = { de: /Laut Anbieter/, en: /According to the maker/, fr: /Selon l’éditeur/, it: /Secondo il produttore/, rm: /Tenor il purschider/ };

describe('Xdo: Datenschutz-Angaben als Aussage des Anbieters', () => {
  for (const [name, sprache] of Object.entries({ de, en, fr, it: it_, rm })) {
    it(name, () => {
      const text = finde(sprache);
      expect(text).toBeTruthy();
      expect(text).toMatch(marker[name]);
    });
  }
});
