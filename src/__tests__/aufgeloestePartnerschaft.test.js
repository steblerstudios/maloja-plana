import { describe, it, expect } from 'vitest';
import { giltAlsVerheiratet, zivilstandLabel, ZIVILSTAND_AUFGELOEST, ZIVILSTAND_EINGETRAGEN } from '../utils/zivilstand.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../data/kantonaleSteuerdaten.js';
import { mehrereErwachsene } from '../config/kantonsModell.js';
import { getChapters } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import { generateCVTemplate } from '../cvGenerator.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
// Nicht `import it …` — das würde vitests `it` überschreiben.
import italiano from '../i18n/it.js';

// ─────────────────────────────────────────────────────────────
// «Aufgelöste Partnerschaft» als Zivilstand. Amtlicher Status nach ZStV Art. 8 lit. d Ziff. 1;
// steuerlich und in den Sozialversicherungen wie geschieden bzw. verwitwet (DBG Art. 9
// Abs. 1bis, ATSG Art. 13a Abs. 2/3 — Belege mit URL in src/utils/zivilstand.js).
// Die Zusage: wer sie wählt, rechnet wie alleinstehend — nie wie verheiratet —, und die
// Option steht in allen fünf Sprachen mit dem amtlichen Begriff da.
// ─────────────────────────────────────────────────────────────

const SPRACHEN = { de, fr, it: italiano, en, rm };
const opt = (tr) => tr.chapters.basis.fields.maritalStatus.options;

const profil = ({ zivilstand, canton = 'ZH', monat = 6500, kinder = 0, adults = 1 } = {}) => ({
  basis: {
    canton, maritalStatus: zivilstand,
    household: { adults, children: Array.from({ length: kinder }, () => ({ age: 8 })) },
  },
  finanzen: { monthlyIncome: monat },
  wohnen: {},
  versicherungen: {},
});
const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

describe('gilt nicht als verheiratet', () => {
  it('giltAlsVerheiratet: nein', () => {
    expect(ZIVILSTAND_AUFGELOEST).toBe('dissolvedPartnership');
    expect(giltAlsVerheiratet(ZIVILSTAND_AUFGELOEST)).toBe(false);
  });

  for (const f of [
    { canton: 'ZH', monat: 6500, kinder: 0 },
    { canton: 'BE', monat: 8000, kinder: 2 },
    { canton: 'GE', monat: 5200, kinder: 1 },
  ]) {
    it(`Steuer ${f.canton}, ${f.monat}/Monat, ${f.kinder} Kinder: dieselbe Rechnung wie geschieden und verwitwet`, () => {
      const aufgeloest = profil({ ...f, zivilstand: ZIVILSTAND_AUFGELOEST });
      for (const vergleich of ['divorced', 'widowed']) {
        const p = profil({ ...f, zivilstand: vergleich });
        expect(steuerEingabenAusDaten(aufgeloest)).toEqual(steuerEingabenAusDaten(p));
        expect(regel(aufgeloest)).toEqual(regel(p));
      }
    });
  }

  it('Gegenprobe: die Rechnung unterscheidet sich von verheiratet (sonst wäre der Vergleich leer)', () => {
    const f = { canton: 'ZH', monat: 6500, kinder: 0, adults: 2 };
    const aufgeloest = regel(profil({ ...f, zivilstand: ZIVILSTAND_AUFGELOEST }));
    const ehe = regel(profil({ ...f, zivilstand: 'married' }));
    expect(steuerEingabenAusDaten(profil({ ...f, zivilstand: ZIVILSTAND_AUFGELOEST })).verheiratet).toBe(false);
    expect(aufgeloest).not.toEqual(ehe);
  });

  it('Haushalt (IPV-Riegel): allein lebend zählt als ein Erwachsener, wie geschieden', () => {
    expect(mehrereErwachsene({ adults: 1 }, { maritalStatus: ZIVILSTAND_AUFGELOEST })).toBe(false);
    expect(mehrereErwachsene({ adults: 1 }, { maritalStatus: 'divorced' })).toBe(false);
    expect(mehrereErwachsene({ adults: 2 }, { maritalStatus: ZIVILSTAND_AUFGELOEST })).toBe(true);
  });
});

describe('Option und Übersetzung', () => {
  // Amtliche Begriffe aus ZStV Art. 8 lit. d Ziff. 1 in der jeweiligen Sprachfassung
  // (en: Fedlex führt die ZStV nicht auf Englisch; «dissolved» wie in PartG en).
  const KERN = { de: 'aufgelöst', fr: 'partenariat dissous', it: 'unione domestica sciolta', en: 'dissolved', rm: 'partenadi schlià' };

  for (const [lang, tr] of Object.entries(SPRACHEN)) {
    it(`${lang}: die Option erscheint im Zivilstand, mit eigenem, amtlichem Text`, () => {
      const t = createT({ [lang]: tr, de }, lang, 'sie');
      const basis = getChapters(t).find((c) => c.key === 'basis');
      const feld = basis.fields.find((f) => f.k === 'maritalStatus');
      const eintrag = feld.options.find((o) => o.value === ZIVILSTAND_AUFGELOEST);
      expect(eintrag).toBeTruthy();
      expect(eintrag.label).toBe(opt(tr).dissolvedPartnership);
      expect(eintrag.label.toLowerCase()).toContain(KERN[lang]);
      expect(eintrag.label).not.toBe(opt(tr)[ZIVILSTAND_EINGETRAGEN]);
      if (lang !== 'de') expect(eintrag.label).not.toBe(opt(de).dissolvedPartnership);
    });

    it(`${lang}: gleiche Anzeige mit Sie und Du`, () => {
      const sie = createT({ [lang]: tr, de }, lang, 'sie');
      const du = createT({ [lang]: tr, de }, lang, 'du');
      expect(zivilstandLabel(ZIVILSTAND_AUFGELOEST, du)).toBe(zivilstandLabel(ZIVILSTAND_AUFGELOEST, sie));
    });
  }
});

describe('Anzeige', () => {
  const t = createT({ de }, 'de', 'sie');

  it('zivilstandLabel: Text statt Schlüssel', () => {
    expect(zivilstandLabel(ZIVILSTAND_AUFGELOEST, t)).toBe('Aufgelöste Partnerschaft');
  });

  it('Lebenslauf nutzt dieselbe Quelle — Text, nicht «dissolvedPartnership»', () => {
    const cv = generateCVTemplate({ basis: { maritalStatus: ZIVILSTAND_AUFGELOEST } }, t);
    expect(cv.personal.maritalStatus).toBe(zivilstandLabel(ZIVILSTAND_AUFGELOEST, t));
    expect(cv.personal.maritalStatus).toBe('Aufgelöste Partnerschaft');
  });
});
