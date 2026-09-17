import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isRTL, SUPPORTED_LANGUAGES, resolveInitialLang, createT } from '../index.js';
import en from '../en.js';
import de from '../de.js';
import fr from '../fr.js';
import itTranslations from '../it.js'; // nicht `it` — kollidiert mit vitest it()
import rm from '../rm.js';

// Sammelt alle Blatt-Pfade. Ein { sie, du }-Objekt zählt als EIN Blatt
// (Anrede-Variante), nicht als zwei verschachtelte Keys.
function flattenKeys(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && !('sie' in v || 'du' in v)) {
      flattenKeys(v, path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

describe('i18n Infrastruktur', () => {
  it('aktuelle Sprachen sind alle LTR', () => {
    for (const l of SUPPORTED_LANGUAGES) {
      expect(isRTL(l), `${l} sollte LTR sein`).toBe(false);
    }
  });

  it('isRTL erkennt Rechts-nach-links-Sprachen (Asyl-Ausbau)', () => {
    expect(isRTL('ar')).toBe(true);   // Arabisch
    expect(isRTL('fa')).toBe(true);   // Farsi/Dari
    expect(isRTL('ur')).toBe(true);   // Urdu
    expect(isRTL('he')).toBe(true);   // Hebräisch
  });

  it('isRTL ist robust bei Unbekanntem', () => {
    expect(isRTL('ti')).toBe(false);  // Tigrinya nutzt Ge’ez-Schrift, LTR
    expect(isRTL('sq')).toBe(false);  // Albanisch, LTR
    expect(isRTL(undefined)).toBe(false);
    expect(isRTL('')).toBe(false);
  });
});

describe('resolveInitialLang (Sprachauswahl-Vorrang)', () => {
  it('URL-Param hat Vorrang vor allem', () => {
    expect(resolveInitialLang({ urlLang: 'fr', stored: 'de', navLang: 'it-IT' })).toBe('fr');
    expect(resolveInitialLang({ urlLang: 'FR', stored: 'de' })).toBe('fr'); // case-insensitiv
  });

  it('ohne URL → gespeicherte Wahl', () => {
    expect(resolveInitialLang({ stored: 'it', navLang: 'de-CH' })).toBe('it');
  });

  it('ohne URL/Speicher → Browsersprache (Präfix)', () => {
    expect(resolveInitialLang({ navLang: 'de-CH' })).toBe('de');
    expect(resolveInitialLang({ navLang: 'rm' })).toBe('rm');
  });

  it('nicht unterstützte Werte werden übersprungen → Default en', () => {
    expect(resolveInitialLang({ urlLang: 'xx', stored: 'zz', navLang: 'ja-JP' })).toBe('en');
    expect(resolveInitialLang({})).toBe('en');
    expect(resolveInitialLang()).toBe('en');
  });

  it('nur unterstützte Sprachen werden je Stufe akzeptiert', () => {
    // unbekannte URL, aber gültiger Speicher → Speicher gewinnt
    expect(resolveInitialLang({ urlLang: 'xx', stored: 'fr' })).toBe('fr');
  });
});

// Schützt die Aktivierungs-Checkliste: jede SUPPORTED-Sprache braucht ein
// hreflang-Tag in index.html. Fängt "Sprache hinzugefügt, hreflang vergessen".
describe('hreflang-Vollständigkeit (index.html)', () => {
  const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
  const hreflangs = [...html.matchAll(/hreflang="([^"]+)"/g)].map(m => m[1]);

  it('für jede unterstützte Sprache existiert ein hreflang', () => {
    for (const l of SUPPORTED_LANGUAGES) {
      expect(hreflangs, `hreflang für ${l} fehlt in index.html`).toContain(l);
    }
  });

  it('x-default ist gesetzt', () => {
    expect(hreflangs).toContain('x-default');
  });
});

// Fängt Übersetzungs-Drift: Wenn ein Feature einen Key in en oder de ergänzt,
// aber eine Sprache nicht nachzieht, sehen deren Nutzer den deutschen Rückfall
// (K58) oder den rohen Schlüssel. Dieser Test verlangt, dass jede Sprache den
// en- und den de-Kanon vollständig abdeckt. (Zusätzliche, ungenutzte Keys in einer Sprache sind
// erlaubt — sie schaden nicht; nur fehlende sind ein Problem.)
describe('i18n-Parität (jede Sprache deckt den en- und den de-Kanon ab)', () => {
  const enKeys = flattenKeys(en);

  for (const [name, dict] of Object.entries({ de, fr, it: itTranslations, rm })) {
    it(`${name}.js hat keine fehlenden Keys gegenüber en`, () => {
      const have = new Set(flattenKeys(dict));
      const missing = enKeys.filter((k) => !have.has(k));
      expect(
        missing,
        `${name}.js fehlen ${missing.length} Keys gegenüber en: ${missing.slice(0, 25).join(', ')}`
      ).toEqual([]);
    });
  }

  // K58: Rückfall-Sprache ist Deutsch. Fehlt einer Sprache ein de-Schlüssel, sähen
  // ihre Leser:innen Deutsch — darum auch gegen den de-Kanon prüfen.
  const deKeys = flattenKeys(de);
  for (const [name, dict] of Object.entries({ en, fr, it: itTranslations, rm })) {
    it(`${name}.js hat keine fehlenden Keys gegenüber de (Rückfall-Sprache)`, () => {
      const have = new Set(flattenKeys(dict));
      const missing = deKeys.filter((k) => !have.has(k));
      expect(
        missing,
        `${name}.js fehlen ${missing.length} Keys (fallen auf DE zurück): ${missing.slice(0, 25).join(', ')}`
      ).toEqual([]);
    });
  }
});

// path -> Wert (Blatt). { sie, du } zählt als ein Blatt-Wert.
function flattenEntries(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && !('sie' in v || 'du' in v)) {
      flattenEntries(v, path, out);
    } else {
      out[path] = v;
    }
  }
  return out;
}

function placeholderTokens(v) {
  const s = v && typeof v === 'object' ? `${v.sie || ''} ${v.du || ''}` : String(v == null ? '' : v);
  return [...new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
}

// Fängt vertippte/weggelassene {param}-Platzhalter: wenn en "{query}" hat, eine
// Übersetzung aber "{querry}" oder den Platzhalter ganz weglässt, bricht die
// Interpolation still (Nutzer sieht "{query}" oder einen leeren Wert).
describe('i18n-Platzhalter-Parität ({param}-Tokens stimmen mit en überein)', () => {
  const enEntries = flattenEntries(en);

  for (const [name, dict] of Object.entries({ de, fr, it: itTranslations, rm })) {
    it(`${name}.js: keine vertippten/fehlenden {platzhalter}`, () => {
      const langEntries = flattenEntries(dict);
      const mismatches = [];
      for (const [path, enVal] of Object.entries(enEntries)) {
        if (!(path in langEntries)) continue; // fehlende Keys deckt der Paritäts-Test ab
        const a = placeholderTokens(enVal).join(',');
        const b = placeholderTokens(langEntries[path]).join(',');
        if (a !== b) mismatches.push(`${path} (en:[${a}] ${name}:[${b}])`);
      }
      expect(
        mismatches,
        `${mismatches.length} Platzhalter-Abweichung(en): ${mismatches.slice(0, 15).join(' · ')}`
      ).toEqual([]);
    });
  }
});

// Ein { sie } oder { du } ohne Gegenstück wird von createT NICHT aufgelöst
// (verlangt beide als String) und als rohes Objekt zurückgegeben -> React-Crash
// "Objects are not valid as a React child". Dieser Test fängt das vorab.
describe('i18n Anrede-Objekte sind vollständig (sie UND du als String)', () => {
  function findHalfAnrede(obj, path, out) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return;
    if ('sie' in obj || 'du' in obj) {
      if (typeof obj.sie !== 'string' || typeof obj.du !== 'string') {
        out.push(`${path} (sie:${typeof obj.sie}, du:${typeof obj.du})`);
      }
      return;
    }
    for (const [k, v] of Object.entries(obj)) findHalfAnrede(v, path ? `${path}.${k}` : k, out);
  }

  for (const [name, dict] of Object.entries({ en, de, fr, it: itTranslations, rm })) {
    it(`${name}.js: kein unvollständiges { sie }/{ du }-Objekt`, () => {
      const bad = [];
      findHalfAnrede(dict, '', bad);
      expect(
        bad,
        `${name}.js hat ${bad.length} unvollständige Anrede-Objekte: ${bad.slice(0, 15).join(' · ')}`
      ).toEqual([]);
    });
  }
});

// Sammelt alle Pfade, an denen de.js ein { sie, du }-Objekt führt.
function flattenAnredePaths(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if ('sie' in v || 'du' in v) out.push(path);
      else flattenAnredePaths(v, path, out);
    }
  }
  return out;
}

function resolvePath(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function isAnredeObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) && ('sie' in v || 'du' in v);
}

// R4 (16.09.2026): fr.js/it.js hatten für dieselben Schlüssel oft nur eine feste
// Anrede-Form (vous- bzw. tu/Lei-Form) statt { sie, du } wie de.js — Nutzer:innen,
// die "Du" gewählt haben, sahen in fr/it trotzdem die formelle Form (und umgekehrt).
// Das gesamte legal.*-Namespace (Datenschutz/Nutzung/FAQ) wurde in diesem PR
// nachgezogen; die App-weiten übrigen Stellen sind als bekannte Lücke gelistet
// (KNOWN_GAPS) — dieser Test lässt sie unverändert durch, schlägt aber an, wenn
// NEUE Schlüssel dieselbe Lücke bekommen (Regressionsschutz), und wird enger,
// sobald weitere Schlüssel nachgezogen werden (dann aus der Liste entfernen).
// K49 (17.09.2026): alle 237 fr- und 119 it-Lücken nachgezogen — beide Listen leer.
// Die Liste bleibt als Mechanismus stehen; neue Einträge nur mit Begründung.
const KNOWN_GAPS = {
  fr: [],
  it: [],
};

describe('de-{sie,du}-Schlüssel sind in fr/it ebenfalls { sie, du } (keine stille Einheitsform)', () => {
  const deAnredePaths = flattenAnredePaths(de);

  for (const [name, dict] of Object.entries({ fr, it: itTranslations })) {
    it(`${name}.js: kein NEUER de-{sie,du}-Schlüssel ohne { sie, du } (ausser bekannte Lücke)`, () => {
      const gaps = new Set(KNOWN_GAPS[name]);
      const unexpected = [];
      for (const path of deAnredePaths) {
        const val = resolvePath(dict, path);
        if (val === undefined) continue; // fehlende Keys deckt der Paritäts-Test ab
        if (!isAnredeObject(val) && !gaps.has(path)) unexpected.push(path);
      }
      expect(
        unexpected,
        `${name}.js: ${unexpected.length} neue Schlüssel ohne { sie, du }, nicht in KNOWN_GAPS: ${unexpected.slice(0, 15).join(', ')}`
      ).toEqual([]);
    });

    it(`${name}.js: KNOWN_GAPS enthält keine bereits behobenen Schlüssel (Liste aktuell halten)`, () => {
      const stale = KNOWN_GAPS[name].filter((path) => isAnredeObject(resolvePath(dict, path)));
      expect(
        stale,
        `${name}.js: ${stale.length} Schlüssel in KNOWN_GAPS sind bereits { sie, du } — aus der Liste entfernen: ${stale.slice(0, 15).join(', ')}`
      ).toEqual([]);
    });
  }
});

// Der Übersetzungs-Kern selbst (Schlüssel-Auflösung, Fallback-Kette, Sie/Du-Wahl,
// Param-Interpolation) — mit kontrollierten Fixtures statt der echten Sprachdateien.
// Rückfall-Sprache ist seit K58 'de' (FALLBACK_LANG); Startsprache bleibt 'en'.
describe('Vorsorge-Szenario: Referenzalter als Platzhalter, nicht fest «65»', () => {
  // AHV 21: Frauen JG 1961–63 haben ein Referenzalter unter 65 (64 J 3/6/9 M). Die
  // Szenariotexte müssen den echten Wert aus dem Rechner zeigen, nicht pauschal 65.
  const all = { en, de, fr, it: itTranslations, rm };
  const keys = ['vr.zukunftSzenarioFrueh', 'vr.zukunftSzenarioAufschub', 'vr.zukunftSzenarioReferenz'];
  for (const lang of Object.keys(all)) {
    it(`${lang}: {referenzalter} wird eingesetzt, keine feste 65`, () => {
      const t = createT(all, lang, 'sie');
      for (const key of keys) {
        const out = t(key, { dauer: '2 X', referenzalter: '64 Y 6 Z' });
        expect(out, `${lang} ${key}`).toContain('64 Y 6 Z');
        expect(out, `${lang} ${key}`).not.toMatch(/65/);
        expect(out, `${lang} ${key}`).not.toMatch(/\{\w+\}/);
      }
    });
  }
});

describe('createT (Übersetzungs-Kern)', () => {
  const fixtures = {
    de: {
      greet: { sie: 'Guten Tag', du: 'Hallo' },
      nested: { deep: 'Tief DE' },
      withParam: 'Hallo {name}',
      count: 'Anzahl: {n}',
      onlyDe: 'nur DE',
      emptyStr: '',
    },
    en: {
      greet: 'Hello',
      nested: { deep: 'Deep EN' },
      withParam: 'Hi {name}',
      onlyEn: 'EN only',
    },
  };

  it('löst einen einfachen Key in der aktiven Sprache auf', () => {
    expect(createT(fixtures, 'de', 'sie')('nested.deep')).toBe('Tief DE');
    expect(createT(fixtures, 'en', 'sie')('nested.deep')).toBe('Deep EN');
  });

  it('fällt auf FALLBACK_LANG (de) zurück, wenn der Key in der Sprache fehlt (K58)', () => {
    expect(createT(fixtures, 'en', 'sie')('onlyDe')).toBe('nur DE');
    expect(createT(fixtures, 'en', 'du')('greet')).toBe('Hello'); // eigene Sprache geht vor
  });

  it('kein Rückfall auf Englisch mehr', () => {
    expect(createT(fixtures, 'de', 'sie')('onlyEn')).toBe('onlyEn');
  });

  it('gibt den Key-String zurück, wenn nirgends vorhanden', () => {
    expect(createT(fixtures, 'en', 'sie')('does.not.exist')).toBe('does.not.exist');
  });

  it('{sie,du}: Standard Sie, Du nur bei anrede="du"', () => {
    expect(createT(fixtures, 'de', 'sie')('greet')).toBe('Guten Tag');
    expect(createT(fixtures, 'de', 'du')('greet')).toBe('Hallo');
    expect(createT(fixtures, 'de', undefined)('greet')).toBe('Guten Tag'); // kein anrede → Sie
  });

  it('interpoliert {param}', () => {
    expect(createT(fixtures, 'de', 'sie')('withParam', { name: 'Sofie' })).toBe('Hallo Sofie');
  });

  it('interpoliert den Wert 0 korrekt (kein Falsy-Zero-Bug)', () => {
    expect(createT(fixtures, 'en', 'sie')('count', { n: 0 })).toBe('Anzahl: 0');
  });

  it('lässt unaufgelöste {param} sichtbar stehen', () => {
    expect(createT(fixtures, 'de', 'sie')('withParam', {})).toBe('Hallo {name}');
    expect(createT(fixtures, 'de', 'sie')('withParam')).toBe('Hallo {name}');
  });

  it('gibt einen leeren String zurück (nicht Fallback) bei absichtlich leerem Wert', () => {
    expect(createT(fixtures, 'de', 'sie')('emptyStr')).toBe('');
  });

  it('ist robust bei nicht geladener Sprache (translations[lang] undefined)', () => {
    // Sprache ganz nicht geladen → Rückfall de, Anrede wie gewählt:
    expect(createT(fixtures, 'xx', 'sie')('onlyDe')).toBe('nur DE');
    expect(createT(fixtures, 'xx', 'du')('greet')).toBe('Hallo');
  });
});

// K46 (17.09.2026): Die App siezt standardmässig. Ein deutscher Text ohne
// { sie, du } darf darum keine Du-Form enthalten, und die sie-Fassung eines
// Objekts auch nicht. Wortgrenzen über \p{L} (JS-\b versagt bei Umlauten);
// ohne Beachtung der Gross-/Kleinschreibung, damit auch «Dein …» am Satzanfang zählt.
describe('K46 · deutsche Texte duzen nur in der du-Fassung', () => {
  const DU = /(?<!\p{L})(du|dein\p{L}*|dich|dir)(?!\p{L})/iu;
  const treffer = [];
  const walk = (o, p) => {
    if (typeof o === 'string') { if (DU.test(o)) treffer.push(p); return; }
    if (Array.isArray(o)) { o.forEach((x, i) => walk(x, `${p}[${i}]`)); return; }
    if (!o || typeof o !== 'object') return;
    if (isAnredeObject(o)) { if (DU.test(o.sie)) treffer.push(`${p} (sie)`); return; }
    for (const k of Object.keys(o)) walk(o[k], p ? `${p}.${k}` : k);
  };
  walk(de, '');

  it('keine Du-Form in Einheitstexten oder sie-Fassungen', () => {
    expect(treffer, `de.js duzt in der Sie-Ansicht: ${treffer.slice(0, 20).join(', ')}`).toEqual([]);
  });

  it('Gegenprobe: das Muster erkennt Du-Formen, aber nicht Sie-Formen', () => {
    expect('Deine KK-Last').toMatch(DU);
    expect('Melde dich beim RAV').toMatch(DU);
    expect('Ihre KK-Last').not.toMatch(DU);
    expect('Durchschnitt, Dirigent, Direktlink').not.toMatch(DU);
  });
});

// K73 (17.09.2026): Ist der deutsche Text ein Einheitstext, darf der italienische
// Einheitstext nicht duzen — er erschiene sonst geduzt in der Sie-Ansicht.
describe('K73 · italienische Einheitstexte duzen nicht', () => {
  const TU = /(?<!\p{L})(tu|tuo|tua|tuoi|tue|ti)(?!\p{L})/u;
  const flach = (o, p = '', out = {}) => {
    if (typeof o === 'string' || isAnredeObject(o)) { out[p] = o; return out; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return out;
    for (const k of Object.keys(o)) flach(o[k], p ? `${p}.${k}` : k, out);
    return out;
  };
  const D = flach(de);
  const I = flach(itTranslations);

  it('kein tu/tuo/ti in it, wo de keine Anrede-Varianten hat', () => {
    const treffer = Object.keys(D).filter((k) => typeof D[k] === 'string' && typeof I[k] === 'string' && TU.test(I[k]));
    expect(treffer, `it.js duzt in der Sie-Ansicht: ${treffer.slice(0, 20).join(', ')}`).toEqual([]);
  });

  it('Gegenprobe: das Muster erkennt die Du-Form, nicht die Lei-Form', () => {
    expect('Riverifica i tuoi diritti').toMatch(TU);
    expect('I Suoi dati appartengono a Lei.').not.toMatch(TU);
    expect('Tutti i dati restano sul dispositivo').not.toMatch(TU);
  });
});
