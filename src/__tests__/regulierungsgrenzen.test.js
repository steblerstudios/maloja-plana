import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HEARTFELT, BRANCHEN_ERLAUBT } from '../data/direktLinks.js';
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
//   B · Jeder bezahlte Link trägt eine freigegebene Branche (Erlaubnisliste).
//       Versicherungsverträge anbieten oder vermitteln = VAG Art. 40, Empfehlung
//       eines Finanzinstruments = FIDLEG — genau das wollen wir nicht sein.
//   C · Die zwei Wechselpfade empfehlen keine bestimmte Kasse.
//
// Geprüft wird die Zusage, nicht ihre heutige Formulierung: die Muster fragen nach
// der Aussage, nicht nach einem bestimmten Satz. Rechtslage nicht juristisch
// geprüft — Bau-Liste K48.
//
// Was diese Tests NICHT halten (Rechts-Prüfung 23.09.2026, damit die Grenze
// aufgeschrieben ist statt angenommen):
//   · Sie lesen i18n-Texte und Quelltext, sie rendern nichts. Die Aussage «15 von 15
//     Ansichten zeigen den Hinweis im Bild» ist eine Handmessung, kein Test.
//   · Die Prüfung der zwei Wechselpfade greift die Zeichenkette `alpha.noAdviceHint`
//     im JSX ab. Ein gleichwertiger anderer Hinweis würde sie rot machen, obwohl die
//     Zusage hält — das pinnt die Schreibweise, nicht die Sache. Bewusst behalten,
//     weil kein leichterer Ersatz da ist; wer hier umbaut, prüft die Sache neu.

const SPRACHEN = { de, fr, it: itTexte, rm, en };

// Die Aussage «das hier orientiert nur / ersetzt keine Beratung», in fünf Sprachen.
const HINWEIS = {
  de: /Rechtsberatung|Steuerberatung|Versicherungsberatung|Orientierung|keine verbindliche|rechtsverbindlich|kein medizinischer/i,
  fr: /conseil juridique|conseil fiscal|orientation|à titre indicatif|sans engagement|ne remplace/i,
  it: /consulenza legale|consulenza fiscale|orientamento|non vincolante|non sostituisce/i,
  rm: /cussegl giuridic|orientaziun|betg oblig|na remplazza/i,
  en: /legal advice|tax advice|orientation|guidance only|not binding|does not replace/i,
};

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
    // Erlaubnisliste, nicht Verbotsliste. Die erste Fassung dieses Tests suchte nach
    // Wörtern wie «versicher», «bank», «vorsorge» — und liess Raiffeisen, VIAC,
    // frankly, neon, Yuh, Swiss Life, AXA, Helvetia und Selma anstandslos durch
    // (gemessen 23.09.2026). Eine Verbotsliste geht an jedem Namen vorbei, den sie
    // nicht kennt; eine Erlaubnisliste kann das nicht.
    const pruefe = (liste) => liste
      .filter((e) => e.affiliate)
      .filter((e) => !BRANCHEN_ERLAUBT.includes(e.branche));

    it('jeder bezahlte Eintrag trägt eine freigegebene Branche', () => {
      expect(pruefe(HEARTFELT).map((e) => e.name), 'bezahlter Link ohne freigegebene Branche = VAG/FIDLEG-Risiko').toEqual([]);
    });

    it('Gegenprobe: das Muster erkennt echte Anbieter, die eine Wortliste durchlässt', () => {
      const echte = ['Raiffeisen', 'VIAC', 'frankly', 'neon', 'Yuh', 'Swiss Life', 'AXA', 'Helvetia', 'Selma', 'PostFinance'];
      const erfunden = echte.map((name, i) => ({ key: 'test' + i, name, url: `https://${name.toLowerCase().replace(/ /g, '')}.ch`, affiliate: true }));
      // Ohne `branche` fällt jeder einzelne durch — unabhängig davon, wie der Name klingt.
      expect(pruefe(erfunden).length).toBe(echte.length);
      // Mit freigegebener Branche käme er durch: darum ist `branche` ein bewusster
      // Eintrag von Hand und keine Ableitung aus dem Namen.
      expect(pruefe([{ key: 't', name: 'Ein Saatgut-Laden', affiliate: true, branche: 'tiere' }]).length).toBe(0);
      // Ein unbezahlter Link bleibt frei, auch bei einer Bank.
      expect(pruefe([{ key: 't', name: 'Raiffeisen', affiliate: false }]).length).toBe(0);
    });

    it('die Branchen-Erlaubnisliste enthält keine Finanz- oder Versicherungsbranche', () => {
      const VERBOTEN = /versicher|bank|vorsorge|finanz|kredit|anlage|3a/i;
      const durchgerutscht = BRANCHEN_ERLAUBT.filter((b) => VERBOTEN.test(b));
      expect(durchgerutscht, 'regulierte Branche in der Erlaubnisliste').toEqual([]);
      // Gegenprobe: das Muster würde eine solche Branche erkennen.
      expect(['digital', 'versicherung'].filter((b) => VERBOTEN.test(b))).toEqual(['versicherung']);
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
      // Echte Gegenprobe: ein Block mit einem Kassennamen fällt durch, einer ohne nicht.
      // (Die frühere zweite Zeile wiederholte nur die positive Behauptung von oben —
      // eine Wiederholung ist keine Gegenprobe, Befund der Rechts-Prüfung 23.09.2026.)
      const mitName = { ...de.kvgWechsel, step1Text: 'Wechseln Sie zur Sanitas.' };
      expect(JSON.stringify(mitName)).toMatch(VERSICHERER);
      // Der Platzhalter im KK-Scanner (src/KKScanner.jsx) nennt Kassennamen bewusst —
      // als Eingabe-Beispiel, nicht als Empfehlung. Darum prüft C nur die Wechseltexte.
    });
  });
});
