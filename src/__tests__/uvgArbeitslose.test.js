// «Unfall oder Krankheit», Schritt 2: Arbeitslose mit Anspruch auf Arbeitslosenentschädigung sind über die
// Arbeitslosenversicherung obligatorisch unfallversichert (UVG Art. 1a Abs. 1 Bst. b, Fedlex SR 832.20 Fassung
// 1.1.2026, geprüft 11.11.2026). Der Text zählte sie bis dahin pauschal zu den «Nicht-Erwerbstätigen», für die
// die Krankenkasse den Unfall deckt (Befund rechts-pruefer zu #817, 10.11.2026).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const zeile = (lang) => readFileSync(fileURLToPath(new URL(`../i18n/${lang}.js`, import.meta.url)), 'utf8')
  .split('\n').find((z) => /^\s+step2UnfallText: /.test(z));

const ERWARTET = {
  de: /UVG Art\. 1a Abs\. 1 Bst\. b/g,
  rm: /UVG Art\. 1a Abs\. 1 Bst\. b/g,
  fr: /LAA art\. 1a al\. 1 let\. b/g,
  it: /LAINF art\. 1a cpv\. 1 lett\. b/g,
  en: /UVG Art\. 1a para\. 1 let\. b/g,
};

describe('Unfall bei Arbeitslosigkeit', () => {
  for (const [lang, muster] of Object.entries(ERWARTET)) {
    it(`${lang}: die Ausnahme für Arbeitslose steht in jeder Anrede`, () => {
      const z = zeile(lang);
      expect(z, lang).toBeTruthy();
      expect((z.match(muster) || []).length).toBe(lang === 'en' ? 1 : 2);
    });
  }
});
