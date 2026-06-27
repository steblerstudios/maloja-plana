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

// Fängt Übersetzungs-Drift: Wenn ein Feature einen Key in en (DEFAULT_LANG /
// Fallback) ergänzt, aber eine Sprache nicht nachzieht, sehen deren Nutzer den
// englischen Fallback. Dieser Test verlangt, dass jede Sprache den en-Kanon
// vollständig abdeckt. (Zusätzliche, ungenutzte Keys in einer Sprache sind
// erlaubt — sie schaden nicht; nur fehlende sind ein Problem.)
describe('i18n-Parität (jede Sprache deckt den en-Kanon ab)', () => {
  const enKeys = flattenKeys(en);

  for (const [name, dict] of Object.entries({ de, fr, it: itTranslations, rm })) {
    it(`${name}.js hat keine fehlenden Keys gegenüber en`, () => {
      const have = new Set(flattenKeys(dict));
      const missing = enKeys.filter((k) => !have.has(k));
      expect(
        missing,
        `${name}.js fehlen ${missing.length} Keys (fallen auf EN zurück): ${missing.slice(0, 25).join(', ')}`
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

// Der Übersetzungs-Kern selbst (Schlüssel-Auflösung, Fallback-Kette, Sie/Du-Wahl,
// Param-Interpolation) — mit kontrollierten Fixtures statt der echten Sprachdateien.
// DEFAULT_LANG ist 'en' (Fallback-Sprache).
describe('createT (Übersetzungs-Kern)', () => {
  const fixtures = {
    en: {
      greet: 'Hello',
      nested: { deep: 'Deep EN' },
      withParam: 'Hi {name}',
      count: 'Count: {n}',
      onlyEn: 'EN only',
      emptyStr: '',
    },
    de: {
      greet: { sie: 'Guten Tag', du: 'Hallo' },
      nested: { deep: 'Tief DE' },
      withParam: 'Hallo {name}',
    },
  };

  it('löst einen einfachen Key in der aktiven Sprache auf', () => {
    expect(createT(fixtures, 'de', 'sie')('nested.deep')).toBe('Tief DE');
  });

  it('fällt auf DEFAULT_LANG (en) zurück, wenn der Key in der Sprache fehlt', () => {
    expect(createT(fixtures, 'de', 'sie')('onlyEn')).toBe('EN only');
  });

  it('gibt den Key-String zurück, wenn nirgends vorhanden', () => {
    expect(createT(fixtures, 'de', 'sie')('does.not.exist')).toBe('does.not.exist');
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
    expect(createT(fixtures, 'de', 'sie')('count', { n: 0 })).toBe('Count: 0');
  });

  it('lässt unaufgelöste {param} sichtbar stehen', () => {
    expect(createT(fixtures, 'de', 'sie')('withParam', {})).toBe('Hallo {name}');
    expect(createT(fixtures, 'de', 'sie')('withParam')).toBe('Hallo {name}');
  });

  it('gibt einen leeren String zurück (nicht Fallback) bei absichtlich leerem Wert', () => {
    expect(createT(fixtures, 'en', 'sie')('emptyStr')).toBe('');
  });

  it('ist robust bei nicht geladener Sprache (translations[lang] undefined)', () => {
    // de fehlt 'count' → Fallback en; aber wenn die Sprache ganz fehlt:
    expect(createT(fixtures, 'xx', 'sie')('onlyEn')).toBe('EN only'); // Fallback en greift
    expect(createT(fixtures, 'xx', 'sie')('greet')).toBe('Hello');    // en-Wert (plain)
  });
});
