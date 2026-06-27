import { describe, it, expect } from 'vitest';
import en from '../i18n/en.js';
import frLang from '../i18n/fr.js';
import rm from '../i18n/rm.js';

const present = (v) => typeof v === 'string'
  ? v.length > 0
  : (v && typeof v === 'object' && (present(v.sie) || present(v.du)));

// i18n-Vollständigkeit der "AHV mit Auslandbezug"-Orientierung (en/fr/rm).
// de/it ergänzt die Anrede-Parallel-Session.
describe.each([['en', en], ['fr', frLang], ['rm', rm]])('vr.intl i18n (%s)', (lang, dict) => {
  it('alle Auslandbezug-Keys vorhanden', () => {
    for (const k of [
      'intlTitle', 'intlIntro',
      'intlLeavingTitle', 'intlLeavingText',
      'intlVoluntaryTitle', 'intlVoluntaryText',
      'intlRefundTitle', 'intlRefundText',
      'intlContact', 'intlMore',
    ]) {
      expect(present(dict.vr?.[k]), `${lang}: vr.${k}`).toBe(true);
    }
  });
});
