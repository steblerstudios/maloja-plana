import { describe, it, expect } from 'vitest';
import { isRTL, SUPPORTED_LANGUAGES } from '../index.js';

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
