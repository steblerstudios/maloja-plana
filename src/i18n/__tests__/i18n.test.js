import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { isRTL, SUPPORTED_LANGUAGES, resolveInitialLang } from '../index.js';

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
