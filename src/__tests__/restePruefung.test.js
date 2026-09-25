import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
// NICHT `it` nennen — das überschreibt vitests `it`, und kein Test lädt mehr.
import itLang from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { SEARCH_VIEWS } from '../config/ansichtenRegister.js';

// Reste aus der Links-/Abläufe-Prüfung vom 24./25.09.2026, belegt am Fedlex-Wortlaut
// der am 25.09.2026 geltenden Fassung (SPARQL + Filestore):
// FamZG Art. 5 (Stand 01.01.2026): Kinderzulage mind. 215, Ausbildungszulage mind. 268 Franken.
// OR Art. 266m (Stand 01.01.2026): Kündigung der Familienwohnung nur mit ausdrücklicher
// Zustimmung des Ehegatten; Abs. 3 sinngemäss für eingetragene Partnerschaften.
const SPRACHEN = [['de', de], ['fr', fr], ['it', itLang], ['en', en], ['rm', rm]];

describe('Gültigkeitshinweise behaupten keine Frist ohne Grundlage', () => {
  // Weder IK-Auszug noch Lohnzettel, Kontoauszug oder KK-Karte haben eine gesetzliche
  // Gültigkeitsdauer. Vorher stand «5 Jahre» / «1 Jahr gültig» in allen fünf Sprachen.
  const OHNE_GRUNDLAGE = ['ikExtract', 'paySlip', 'bankStatement', 'kkCard'];
  for (const [lang, dict] of SPRACHEN) {
    for (const key of OHNE_GRUNDLAGE) {
      it(`${lang}: expiryHints.${key} nennt keine Dauer`, () => {
        const text = dict.expiryHints?.[key];
        expect(text, `${lang}.expiryHints.${key} fehlt`).toBeTruthy();
        expect(text).not.toMatch(/\d/);
      });
    }
  }
});

describe('Familienzulage nennt die geltenden Mindestansätze', () => {
  for (const [lang, dict] of SPRACHEN) {
    it(`${lang}: 215 statt 200`, () => {
      const text = dict.orientation.familienzulagen;
      expect(text).toMatch(/CHF 215\b/);
      expect(text).not.toMatch(/CHF 200\b/);
    });
  }
});

describe('Mietkündigungsbrief stützt die Familienwohnung auf OR 266m', () => {
  for (const [lang, dict] of SPRACHEN) {
    it(`${lang}: nennt Art. 266m, nicht mehr nur ZGB/CC 169`, () => {
      const note = dict.briefe.leaseTermination.legalNote;
      expect(note).toMatch(/266m/);
      expect(note).not.toMatch(/169/);
    });
  }
});

describe('EO-Rechner verspricht nur, was er rechnet', () => {
  // Der Rechner kennt Mutterschaft, Vaterschaft, Adoption, Betreuung — keinen Dienst.
  // Dienst hat seinen eigenen Ablauf (#/dienst).
  const DIENST = /dienst|service|servizio|servetsch/i;
  for (const [lang, dict] of SPRACHEN) {
    it(`${lang}: Menütexte zum EO-Rechner ohne Dienst`, () => {
      expect(dict.nav.sub.eo).not.toMatch(DIENST);
      expect(dict.anspruch.items.eo.sub).not.toMatch(DIENST);
    });
  }
  it('Register: die Suche zeigt für eo den geprüften Untertitel', () => {
    expect(SEARCH_VIEWS.find((a) => a.view === 'eo')?.sub).toBe('nav.sub.eo');
  });
});

describe('Keine Frist behauptet, Wochenenden verlängerten sie nicht', () => {
  // ATSG Art. 38 Abs. 3 verlängert auf den nächsten Werktag und gilt u. a. für die EL (ELG Art. 1).
  // Maloja rechnet das nicht ein — das darf der Text sagen, nicht mehr (Predeploy-Gate 25.09.2026).
  const BEHAUPTUNG = /verlängern die Frist hier nicht|ne prolongent pas ce délai|non prolungano questo termine|do not extend this deadline/;
  for (const [lang, dict] of SPRACHEN) {
    it(`${lang}: nirgends in den Texten`, () => {
      expect(JSON.stringify(dict)).not.toMatch(BEHAUPTUNG);
    });
  }
});
