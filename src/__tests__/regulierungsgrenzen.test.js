import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HEARTFELT } from '../data/direktLinks.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js';
import rm from '../i18n/rm.js';
import en from '../i18n/en.js';

// Regulierungsgrenzen (23.09.2026): Maloja Plana braucht heute keine FINMA-Bewilligung
// und keinen Registereintrag, WEIL drei Zusagen gelten. Sie standen bisher nur in
// Dokumenten und wurden an jeder neuen Stelle von Hand wiederholt — hier sind sie
// festgehalten, damit sie nicht an der siebten Stelle vergessen gehen.
//
//   A · Jede Lebenssituation sagt, dass sie Orientierung ist und keine Beratung.
//   B · Kein bezahlter Link führt zu einem Finanz- oder Versicherungsanbieter.
//       (Provision für einen vermittelten Vertrag = Versicherungsvermittlung nach
//       VAG bzw. Anlageberatung nach FIDLEG — genau das wollen wir nicht sein.)
//   C · Die zwei Wechselpfade empfehlen keine bestimmte Kasse.
//
// Geprüft wird die Zusage, nicht ihre heutige Formulierung: die Muster fragen nach
// der Aussage, nicht nach einem bestimmten Satz. Rechtslage nicht juristisch
// geprüft — Bau-Liste K48.

const SPRACHEN = { de, fr, it: itTexte, rm, en };

// Die Aussage «das hier orientiert nur / ersetzt keine Beratung», in fünf Sprachen.
const HINWEIS = {
  de: /Rechtsberatung|Steuerberatung|Versicherungsberatung|Orientierung|orientier|keine verbindliche|kein medizinischer/i,
  fr: /conseil juridique|conseil fiscal|orientation|à titre indicatif|sans engagement|ne remplace/i,
  it: /consulenza legale|consulenza fiscale|orientamento|non vincolante|non sostituisce/i,
  rm: /cussegl giuridic|orientaziun|betg oblig|na remplazza/i,
  en: /legal advice|tax advice|orientation|guidance only|not binding|does not replace/i,
};

// Finanz- und Versicherungsanbieter: dort beginnt der bewilligungs- bzw.
// registerpflichtige Bereich. Bewusst nach Sache gefragt (Kasse, Bank, Vorsorge,
// Vergleichsportal), nicht nach einer Namensliste, die veraltet.
const FINANZNAH = /(versicher|assura|krankenkass|caisse-maladie|cassa-malati|insurance|\bbank\b|banque|banca|vorsorge|pension|hypothek|hypothe|3a|comparis|moneyland|bonus\.ch|finanz|finance)/i;

const lies = (datei) => readFileSync(join(process.cwd(), datei), 'utf8');

describe('Regulierungsgrenzen', () => {
  describe('A · Lebenssituationen sagen, dass sie Orientierung sind', () => {
    for (const [lang, texte] of Object.entries(SPRACHEN)) {
      it(`${lang}: jede footerNote trägt den Hinweis`, () => {
        const gefunden = [];
        const geh = (knoten, pfad) => {
          for (const [k, v] of Object.entries(knoten || {})) {
            if (k === 'footerNote') {
              gefunden.push([pfad, typeof v === 'string' ? v : Object.values(v || {}).join(' ')]);
            } else if (v && typeof v === 'object') geh(v, pfad ? pfad + '.' + k : k);
          }
        };
        geh(texte, '');
        expect(gefunden.length, `${lang}: keine footerNote gefunden — Struktur geändert?`).toBeGreaterThan(0);
        const ohne = gefunden.filter(([, text]) => !HINWEIS[lang].test(text)).map(([pfad]) => pfad);
        expect(ohne, `${lang} ohne Hinweis: ${ohne.join(', ')}`).toEqual([]);
      });
    }

    it('Gegenprobe: das Muster lässt eine Fusszeile ohne Hinweis durchfallen', () => {
      expect('Die Fristen stehen in der Police.').not.toMatch(HINWEIS.de);
      expect('Dies ist Orientierung, keine Rechtsberatung.').toMatch(HINWEIS.de);
    });

    it('die beiden Wechselpfade tragen den Hinweis im Fuss', () => {
      for (const datei of ['src/KVGWechsel.jsx', 'src/ZusatzWechsel.jsx']) {
        expect(lies(datei), `${datei}: kein Orientierungs-Hinweis im Fuss`).toMatch(/alpha\.noAdviceHint/);
      }
      // …und der Schlüssel existiert in allen fünf Sprachen, sonst zeigt der Fuss den Schlüsselnamen.
      for (const [lang, texte] of Object.entries(SPRACHEN)) {
        expect(texte.alpha?.noAdviceHint, `${lang}: alpha.noAdviceHint fehlt`).toBeTruthy();
      }
    });
  });

  describe('B · kein bezahlter Link in den regulierten Bereich', () => {
    it('kein Affiliate-Eintrag zeigt auf einen Finanz- oder Versicherungsanbieter', () => {
      const bezahlt = HEARTFELT.filter((e) => e.affiliate);
      const heikel = bezahlt.filter((e) => FINANZNAH.test(e.name) || FINANZNAH.test(e.url || ''));
      expect(heikel.map((e) => e.name), 'Provision von einem Finanz-/Versicherungsanbieter = VAG/FIDLEG').toEqual([]);
    });

    it('Gegenprobe: ein erfundener Kassen-Affiliate würde auffallen', () => {
      const erfunden = [{ key: 'test', name: 'Beispiel Krankenkasse', url: 'https://beispiel-versicherung.ch', affiliate: true }];
      const heikel = erfunden.filter((e) => e.affiliate && (FINANZNAH.test(e.name) || FINANZNAH.test(e.url || '')));
      expect(heikel.length).toBe(1);
      // …und ein unbezahlter Link auf dieselbe Adresse bleibt erlaubt.
      expect([{ ...erfunden[0], affiliate: false }].filter((e) => e.affiliate).length).toBe(0);
    });
  });

  describe('C · die Wechselpfade empfehlen keine bestimmte Kasse', () => {
    // Namen der grössten Krankenversicherer. Ein Name in den Wechseltexten hiesse:
    // Maloja steuert eine Wahl — der erste Schritt Richtung Vermittlung.
    // «assura» mit Wortgrenze: sonst schlägt das Muster auf dem französischen
    // «assurance» an und misst die eigene Ungenauigkeit statt der Texte.
    const VERSICHERER = /(helsana|swica|sanitas|\bassura\b|concordia|visana|atupri|sympany|groupe mutuel|\bkpt\b|\bcss\b|agrisano|\bsupra\b)/i;

    for (const block of ['kvgWechsel', 'zusatzWechsel']) {
      for (const [lang, texte] of Object.entries(SPRACHEN)) {
        it(`${block} (${lang}): kein Versicherername in den Texten`, () => {
          expect(texte[block], `i18n-Block ${block} fehlt in ${lang}`).toBeTruthy();
          const treffer = JSON.stringify(texte[block]).match(VERSICHERER) || [];
          expect(treffer, `${block}/${lang} nennt: ${treffer.join(', ')}`).toEqual([]);
        });
      }
    }

    it('Gegenprobe: das Muster erkennt einen Versicherernamen', () => {
      expect(JSON.stringify({ tipp: 'Wechseln Sie zur Helsana.' })).toMatch(VERSICHERER);
      // Der Platzhalter im KK-Scanner (src/KKScanner.jsx) nennt Kassennamen bewusst —
      // als Eingabe-Beispiel, nicht als Empfehlung. Darum prüft C nur die Wechseltexte.
      expect(JSON.stringify(de.kvgWechsel)).not.toMatch(VERSICHERER);
    });
  });
});
