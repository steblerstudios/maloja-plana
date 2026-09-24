import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Grauzonen-Sammlung 24.09.2026 (docs/GRAUZONEN.md, Nr. 4 und 13): zwei Sätze waren live
// falsch. Geprüft wird die Zusage, nicht der Wortlaut.
const SPRACHEN = { de, en, fr, it: itTranslations, rm };
const fassungen = (v) => (typeof v === 'string' ? [v] : [v.sie, v.du]);

describe('ALV unter 12 Beitragsmonaten — die Befreiung nach AVIG Art. 14 Abs. 2 wird genannt', () => {
  for (const [lang, tr] of Object.entries(SPRACHEN)) {
    it(lang, () => {
      const satz = tr.alv.anspruchUnklar;
      expect(satz).toMatch(/\b90\b/);  // höchstens 90 Taggelder (AVIG Art. 27 Abs. 4)
      expect(satz).toMatch(/14/);      // Art. 14 Abs. 2
    });
  }
});

describe('Trennung — getrennte Besteuerung gilt für das ganze Jahr, nicht erst ab der Trennung', () => {
  const ganzesJahr = { de: /ganze Jahr/, fr: /toute l’année/, it: /tutto l’anno/, en: /whole year/, rm: /l’entir onn/ };
  for (const [lang, tr] of Object.entries(SPRACHEN)) {
    it(lang, () => {
      for (const text of fassungen(tr.trennung.step4Text)) expect(text).toMatch(ganzesJahr[lang]);
    });
  }
});

describe('Trennungs-Ablauf nennt die ALV-Befreiung (AVIG Art. 14 Abs. 2) und führt zum ALV-Rechner', () => {
  for (const [lang, tr] of Object.entries(SPRACHEN)) {
    it(lang, () => {
      expect(tr.trennung.step5TextAlv).toMatch(/\b90\b/);
      expect(tr.trennung.step5TextAlv).toMatch(/14/);
      expect(tr.trennung.step5LinkAlv).toBeTruthy();
    });
  }
});
