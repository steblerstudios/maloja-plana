// «Zahlungsbefehl erhalten — was tun?», Schritt 2: jede Rechtsfolge mit ihrem Artikel, gegen Fedlex SR 281.1
// Fassung 1.1.2026 geprüft (11.11.2026): Art. 74 Abs. 2 (Teil bestreiten), Art. 82 (provisorische Rechtsöffnung),
// Art. 83 Abs. 2 (Aberkennungsklage innert 20 Tagen), Art. 88 Abs. 1 (Fortsetzung frühestens nach 20 Tagen).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const schritt2 = (lang) => {
  const s = readFileSync(fileURLToPath(new URL(`../i18n/${lang}.js`, import.meta.url)), 'utf8');
  const zeilen = s.split('\n').filter((z) => /^\s+step2Text: /.test(z) && /79, 80/.test(z));
  expect(zeilen, lang).toHaveLength(1);
  return zeilen[0];
};

const ERWARTET = {
  de: [/SchKG Art\. 74 Abs\. 2/g, /SchKG Art\. 82\)/g, /SchKG Art\. 83 Abs\. 2/g, /SchKG Art\. 88 Abs\. 1/g],
  rm: [/SchKG Art\. 74 Abs\. 2/g, /SchKG Art\. 82\)/g, /SchKG Art\. 83 Abs\. 2/g, /SchKG Art\. 88 Abs\. 1/g],
  fr: [/LP art\. 74 al\. 2/g, /LP art\. 82\)/g, /LP art\. 83 al\. 2/g, /LP art\. 88 al\. 1/g],
  it: [/LEF art\. 74 cpv\. 2/g, /LEF art\. 82\)/g, /LEF art\. 83 cpv\. 2/g, /LEF art\. 88 cpv\. 1/g],
  en: [/SchKG Art\. 74 para\. 2/g, /SchKG Art\. 82\)/g, /SchKG Art\. 83 para\. 2/g, /SchKG Art\. 88 para\. 1/g],
};

describe('Zahlungsbefehl, Schritt 2: SchKG-Zitate', () => {
  for (const [lang, muster] of Object.entries(ERWARTET)) {
    it(`${lang}: alle vier Artikel, in jeder Anrede`, () => {
      const z = schritt2(lang);
      const anreden = lang === 'en' ? 1 : 2;
      for (const m of muster) expect((z.match(m) || []).length, `${lang} ${m}`).toBe(anreden);
    });
  }
});
