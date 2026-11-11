// «Unfall oder Krankheit», Schritt 2: Arbeitslose mit Anspruch auf Arbeitslosenentschädigung sind über die
// Arbeitslosenversicherung obligatorisch unfallversichert (UVG Art. 1a Abs. 1 Bst. b, Fedlex SR 832.20 Fassung
// 1.1.2026, geprüft 11.11.2026). Der Text zählte sie bis dahin pauschal zu den «Nicht-Erwerbstätigen», für die
// die Krankenkasse den Unfall deckt (Befund rechts-pruefer zu #817, 10.11.2026).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const zeile = (lang) => readFileSync(fileURLToPath(new URL(`../i18n/${lang}.js`, import.meta.url)), 'utf8')
  .split('\n').find((z) => /^\s+step2UnfallText: /.test(z));

// Suva als Versicherer (Art. 66 Abs. 3bis) und Ende der Deckung (Art. 3 Abs. 2): Hinweise rechts-pruefer 11.11.2026.
const ERWARTET = {
  de: [/UVG Art\. 1a Abs\. 1 Bst\. b, Art\. 66 Abs\. 3bis/g, /bei der Suva/g, /UVG Art\. 3 Abs\. 2\) — dann den Unfall wieder in der Krankenkasse/g],
  rm: [/UVG Art\. 1a Abs\. 1 Bst\. b, Art\. 66 Abs\. 3bis/g, /bei der Suva/g, /UVG Art\. 3 Abs\. 2\) — dann den Unfall wieder in der Krankenkasse/g],
  fr: [/LAA art\. 1a al\. 1 let\. b, art\. 66 al\. 3bis/g, /auprès de la Suva/g, /LAA art\. 3 al\. 2\)/g],
  it: [/LAINF art\. 1a cpv\. 1 lett\. b, art\. 66 cpv\. 3bis/g, /presso la Suva/g, /LAINF art\. 3 cpv\. 2\)/g],
  en: [/UVG Art\. 1a para\. 1 let\. b, Art\. 66 para\. 3bis/g, /with Suva/g, /UVG Art\. 3 para\. 2\)/g],
};

describe('Unfall bei Arbeitslosigkeit', () => {
  for (const [lang, muster] of Object.entries(ERWARTET)) {
    it(`${lang}: die Ausnahme für Arbeitslose steht in jeder Anrede`, () => {
      const z = zeile(lang);
      expect(z, lang).toBeTruthy();
      for (const m of muster) expect((z.match(m) || []).length, `${lang} ${m}`).toBe(lang === 'en' ? 1 : 2);
    });
  }
});
