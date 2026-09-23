// Das Glossar erkennt seine Begriffe in jeder Sprache — nicht nur auf Deutsch.
//
// Bis 24.09.2026 kannte `GlossarText` nur die deutschen Schlüssel («AHV»,
// «Franchise»). Ein französischer Satz sagt «AVS», ein italienischer
// «franchigia» — markiert wurde dort nichts. Die Wortform kommt jetzt aus dem
// Kopfwort der übersetzten Erklärung selbst (siehe GlossarBegriff.jsx).
import { describe, it, expect } from 'vitest';
import { createT } from '../i18n/index.js';
import { GLOSSAR, kopfwoerter, zerlege } from '../GlossarBegriff.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht `it`: das überschriebe vitests it()
import rm from '../i18n/rm.js';

const SPRACHEN = { de, en, fr, it: itSprache, rm };
const tFuer = (lang) => createT({ ...SPRACHEN }, lang, 'sie');
const markiert = (satz, lang) => zerlege(satz, tFuer(lang))
  .filter((teil) => typeof teil !== 'string')
  .map((teil) => `${teil.wort}=${teil.key.replace('glossar.', '')}`);

describe('Kopfwort · die Form steht in der Erklärung selbst', () => {
  it('liest das Wort vor « — », ohne Klammer, Schrägstrich = zwei Formen', () => {
    expect(kopfwoerter('AVS — assurance-vieillesse')).toEqual(['AVS']);
    expect(kopfwoerter('Curatelle (Beistandschaft) — une mesure')).toEqual(['Curatelle']);
    expect(kopfwoerter('IPV/RIP — réduction')).toEqual(['IPV', 'RIP']);
  });

  it('ohne Gedankenstrich kein Kopfwort (ein fehlender Schlüssel kommt als Schlüssel zurück)', () => {
    expect(kopfwoerter('glossar.ipv')).toEqual([]);
    expect(kopfwoerter(undefined)).toEqual([]);
  });

  it('jede Erklärung in jeder Sprache hat ein Kopfwort', () => {
    const ohne = [];
    for (const lang of Object.keys(SPRACHEN)) {
      const t = tFuer(lang);
      for (const key of Object.values(GLOSSAR)) {
        if (kopfwoerter(t(key)).length === 0) ohne.push(`${lang}:${key}`);
      }
    }
    expect(ohne).toEqual([]);
  });
});

describe('Erkennen · je Sprache mit ihren eigenen Wörtern', () => {
  it('Französisch', () => {
    expect(markiert('La LAMal et l’AVS: la franchise et la quote-part.', 'fr'))
      .toEqual(['LAMal=kvg', 'AVS=ahv', 'franchise=franchise', 'quote-part=selbstbehalt']);
  });

  it('Italienisch', () => {
    expect(markiert('La franchigia e le PC completano l’AVS.', 'it'))
      .toEqual(['franchigia=franchise', 'PC=el', 'AVS=ahv']);
  });

  it('Englisch', () => {
    expect(markiert('Your deductible and co-payment, see your tax assessment.', 'en'))
      .toEqual(['deductible=franchise', 'co-payment=selbstbehalt', 'tax assessment=veranlagung']);
  });

  it('Rätoromanisch', () => {
    expect(markiert('La franchisa e la LAMal.', 'rm'))
      .toEqual(['franchisa=franchise', 'LAMal=kvg']);
  });

  it('Deutsch bleibt, wie es war', () => {
    expect(markiert('Die AHV-Rente, die Franchise und der Selbstbehalt.', 'de'))
      .toEqual(['AHV=ahv', 'Franchise=franchise', 'Selbstbehalt=selbstbehalt']);
  });
});

describe('Nicht erkennen · wo das Wort etwas anderes meint', () => {
  it('nicht nach «Wort-»: tax-deductible ist keine Franchise', () => {
    expect(markiert('Up to CHF 10,000 tax-deductible.', 'en')).toEqual([]);
  });

  it('nicht mitten im Wort: APC, AIDE, Franchisen-Stufe', () => {
    expect(markiert('APC AIDE', 'fr')).toEqual([]);
    expect(markiert('Die Franchisenstufe', 'de')).toEqual([]);
  });

  it('«tassazione individuale» ist die Individualbesteuerung, nicht die Veranlagung', () => {
    expect(markiert('Coniugato/a, tassazione individuale', 'it')).toEqual([]);
    expect(markiert('ina taxaziun individuala', 'rm')).toEqual([]);
    // … die gemeinsame Veranlagung dagegen schon, wie im Deutschen.
    expect(markiert('la tassazione congiunta', 'it')).toEqual(['tassazione=veranlagung']);
  });

  it('die zu allgemeinen englischen Wörter allein bleiben unmarkiert', () => {
    // «Assessment» und «Retention» waren Kopfwörter, bis die Messung zeigte,
    // dass sie auch «a binding assessment by your municipality» und die
    // «retention period» im Datenschutz trafen.
    expect(markiert('For a binding assessment, contact your municipality.', 'en')).toEqual([]);
    expect(markiert('Source for the retention period.', 'en')).toEqual([]);
  });
});

describe('Abdeckung · der Befund, der den Umbau ausgelöst hat', () => {
  // Wie viele Sätze je Sprache mindestens einen Begriff tragen, über alle
  // Übersetzungen ausser dem Glossar selbst. Stand 24.09.2026 vorher (nur
  // deutsche Schlüssel) grob: fr und it fast nichts. Nachher muss jede
  // Sprache mindestens halb so viele Sätze markieren wie Deutsch.
  const saetze = (o, out = []) => {
    if (typeof o === 'string') out.push(o);
    else if (o && typeof o === 'object') Object.values(o).forEach((v) => saetze(v, out));
    return out;
  };
  const zaehle = (lang) => {
    const { glossar, ...rest } = SPRACHEN[lang];
    const t = tFuer(lang);
    return saetze(rest).filter((s) => zerlege(s, t).length > 1).length;
  };

  it('jede Sprache markiert mindestens halb so viele Sätze wie Deutsch', () => {
    const basis = zaehle('de');
    expect(basis).toBeGreaterThan(100);
    for (const lang of ['en', 'fr', 'it', 'rm']) {
      expect({ lang, anteil: zaehle(lang) / basis >= 0.5 }).toEqual({ lang, anteil: true });
    }
  });
});
