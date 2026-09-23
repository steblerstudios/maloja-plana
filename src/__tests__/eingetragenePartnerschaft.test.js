import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { giltAlsVerheiratet, zivilstandLabel, ZIVILSTAND_EINGETRAGEN } from '../utils/zivilstand.js';
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
// Eingetragene Partnerschaft als Zivilstand (Bau-Liste K98, letzter Teil).
// Rechtlich der Ehe gleichgestellt: DBG Art. 9 Abs. 1bis, StHG Art. 3 Abs. 4, ATSG Art. 13a
// (Belege mit URL in src/utils/zivilstand.js). Die Zusage: wer «eingetragene Partnerschaft»
// wählt, bekommt überall dieselbe Rechnung wie verheiratet — und die Option ist in allen
// fünf Sprachen da.
// ─────────────────────────────────────────────────────────────

const SPRACHEN = { de, fr, it: italiano, en, rm };

const profil = ({ zivilstand, canton = 'ZH', monat = 6500, kinder = 0, partnerIncome = 0, taxableIncome } = {}) => ({
  basis: {
    canton, maritalStatus: zivilstand,
    household: { adults: 2, children: Array.from({ length: kinder }, () => ({ age: 8 })), partnerIncome },
  },
  finanzen: { monthlyIncome: monat, ...(taxableIncome ? { taxableIncome } : {}) },
  wohnen: {},
  versicherungen: {},
});
const regel = (p) => steuernFuerProfil(steuerEingabenAusDaten(p));

describe('giltAlsVerheiratet — eine Wahrheit', () => {
  it('Ehe und eingetragene Partnerschaft: ja; alle anderen: nein', () => {
    expect(giltAlsVerheiratet('married')).toBe(true);
    expect(giltAlsVerheiratet(ZIVILSTAND_EINGETRAGEN)).toBe(true);
    for (const z of ['single', 'cohabiting', 'divorced', 'widowed', '', undefined, null]) {
      expect(giltAlsVerheiratet(z)).toBe(false);
    }
  });

  it('kein Rechner vergleicht den Zivilstand an der Hilfsfunktion vorbei mit «married»', () => {
    // Unit-Tests der Funktion fangen nicht, dass jemand sie nicht benutzt. Darum die Quelle.
    const wurzel = path.resolve(__dirname, '..');
    const treffer = [];
    const gehe = (ordner) => {
      for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
        const p = path.join(ordner, e.name);
        if (e.isDirectory()) {
          if (e.name === '__tests__' || e.name === 'i18n') continue;
          gehe(p);
        } else if (/\.(js|jsx)$/.test(e.name) && !/\.test\./.test(e.name)) {
          const quelle = fs.readFileSync(p, 'utf8');
          if (/[!=]==\s*['"]married['"]|['"]married['"]\s*[!=]==/.test(quelle)) treffer.push(path.relative(wurzel, p));
        }
      }
    };
    gehe(wurzel);
    expect(treffer.filter((f) => f !== path.join('utils', 'zivilstand.js'))).toEqual([]);
  });
});

describe('Steuer: eingetragene Partnerschaft rechnet wie verheiratet', () => {
  const faelle = [
    { canton: 'ZH', monat: 6500, kinder: 0, partnerIncome: 0 },
    { canton: 'BE', monat: 8000, kinder: 2, partnerIncome: 0 },
    { canton: 'BS', monat: 5000, kinder: 1, partnerIncome: 0 },
    { canton: 'ZH', monat: 6500, kinder: 0, partnerIncome: undefined },
    { canton: 'VD', monat: 7000, kinder: 0, partnerIncome: 0, taxableIncome: 70000 },
  ];

  for (const f of faelle) {
    it(`${f.canton}, ${f.monat}/Monat, ${f.kinder} Kinder, Partnereinkommen ${f.partnerIncome}${f.taxableIncome ? ', direkt ' + f.taxableIncome : ''}`, () => {
      const ehe = profil({ ...f, zivilstand: 'married' });
      const ep = profil({ ...f, zivilstand: ZIVILSTAND_EINGETRAGEN });
      expect(steuerEingabenAusDaten(ep)).toEqual(steuerEingabenAusDaten(ehe));
      expect(regel(ep)).toEqual(regel(ehe));
    });
  }

  it('Gegenprobe: die Rechnung unterscheidet sich von ledig (sonst wäre der Vergleich leer)', () => {
    const f = { canton: 'ZH', monat: 6500, kinder: 0, partnerIncome: 0 };
    const ep = regel(profil({ ...f, zivilstand: ZIVILSTAND_EINGETRAGEN }));
    const ledig = regel(profil({ ...f, zivilstand: 'single' }));
    expect(steuerEingabenAusDaten(profil({ ...f, zivilstand: ZIVILSTAND_EINGETRAGEN })).verheiratet).toBe(true);
    expect(ep).not.toEqual(ledig);
  });
});

describe('Haushalt (IPV-Riegel)', () => {
  it('eingetragene Partnerschaft zählt als Haushalt mit zwei Erwachsenen', () => {
    expect(mehrereErwachsene({ adults: 1 }, { maritalStatus: ZIVILSTAND_EINGETRAGEN })).toBe(true);
    expect(mehrereErwachsene({ adults: 1 }, { maritalStatus: 'single' })).toBe(false);
  });
});

describe('Option und Übersetzung', () => {
  for (const [lang, tr] of Object.entries(SPRACHEN)) {
    it(`${lang}: die Option erscheint im Zivilstand, direkt nach «verheiratet»`, () => {
      const t = createT({ [lang]: tr, de }, lang, 'sie');
      const basis = getChapters(t).find((c) => c.key === 'basis');
      const feld = basis.fields.find((f) => f.k === 'maritalStatus');
      const werte = feld.options.map((o) => o.value);
      expect(werte).toContain(ZIVILSTAND_EINGETRAGEN);
      expect(werte.indexOf(ZIVILSTAND_EINGETRAGEN)).toBe(werte.indexOf('married') + 1);
      const label = feld.options.find((o) => o.value === ZIVILSTAND_EINGETRAGEN).label;
      // Eigener Text in jeder Sprache — kein Schlüssel, kein deutscher Rückfall ausser in de.
      expect(tr.chapters.basis.fields.maritalStatus.options.registeredPartnership).toBe(label);
      expect(label).not.toBe(tr.chapters.basis.fields.maritalStatus.options.married);
      if (lang !== 'de') expect(label).not.toBe(de.chapters.basis.fields.maritalStatus.options.registeredPartnership);
    });

    it(`${lang}: der Schalter «verheiratet» in Steuer- und Vorsorgerechner nennt die Partnerschaft mit`, () => {
      const ep = tr.chapters.basis.fields.maritalStatus.options.registeredPartnership.toLowerCase();
      // Das Kernwort der Option (z. B. «partnerschaft», «partenariat», «unione») steht auch im Schalter.
      const kern = { de: 'partnerschaft', fr: 'partenariat', it: 'unione domestica', en: 'partnership', rm: 'partenariat' }[lang];
      expect(ep).toContain(kern);
      expect(tr.tax.married.toLowerCase()).toContain(kern);
      expect(tr.vr.verheiratet.toLowerCase()).toContain(kern);
    });
  }
});

describe('Anzeige', () => {
  const t = createT({ de }, 'de', 'sie');

  it('zivilstandLabel: Text statt Schlüssel, unbekannte Werte unverändert', () => {
    expect(zivilstandLabel(ZIVILSTAND_EINGETRAGEN, t)).toBe('Eingetragene Partnerschaft');
    expect(zivilstandLabel('married', t)).toBe('Verheiratet');
    expect(zivilstandLabel('ledig', t)).toBe('ledig');
    expect(zivilstandLabel('', t)).toBe('');
  });

  it('Lebenslauf zeigt den Zivilstand als Text, nicht als «registeredPartnership»', () => {
    const cv = generateCVTemplate({ basis: { maritalStatus: ZIVILSTAND_EINGETRAGEN } }, t);
    expect(cv.personal.maritalStatus).toBe('Eingetragene Partnerschaft');
  });
});
