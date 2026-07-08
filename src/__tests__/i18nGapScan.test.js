import { describe, it, expect } from 'vitest';
import { isLikelyLegit } from '../../scripts/i18n-gap-scan.mjs';

// Der Gap-Scan misst offene Übersetzungen. Sein rohes Signal lügt nach oben:
// Kognaten, Eigennamen, Codes und Format-Strings sind bewusst identisch zum
// Deutschen. `isLikelyLegit` zieht diese Fehlalarme ab, damit die verbleibende
// Zahl ehrlich ist. Diese Tests halten fest, was der Filter darf — und was NICHT
// (zweifelhafte Fälle müssen als Verdacht sichtbar bleiben).
describe('i18n-Gap-Scan: Fehlalarm-Filter', () => {
  it('echte deutsche Prosa in fr/it/rm bleibt Verdacht', () => {
    expect(isLikelyLegit('umzug.step1',
      'Melden Sie sich innert 14 Tagen bei der neuen Gemeinde an.')).toBe(false);
  });

  it('Format-Strings sind kein Verdacht', () => {
    expect(isLikelyLegit('common.chf', 'CHF {value}')).toBe(true);
    expect(isLikelyLegit('kvg.belegTpResult', '= CHF {betrag}')).toBe(true);
    expect(isLikelyLegit('common.percent', '{value}%')).toBe(true);
  });

  it('Eigennamen/Codes über Schlüssel-Muster sind kein Verdacht', () => {
    expect(isLikelyLegit('cantons.UR', 'Uri')).toBe(true);
    expect(isLikelyLegit('legal.resources.threema.name', 'Threema')).toBe(true);
    expect(isLikelyLegit('chapters.basis.placeholders.ahv', '756.XXXX.XXXX.XX')).toBe(true);
  });

  it('internationale Kognaten sind kein Verdacht', () => {
    expect(isLikelyLegit('nav.budget', 'Budget')).toBe(true);
    expect(isLikelyLegit('eo.total', 'Total')).toBe(true);
  });

  it('zweifelhafte Wortwahl bleibt bewusst Verdacht', () => {
    expect(isLikelyLegit('legal.tabs.imprint', 'Impressum')).toBe(false);
    expect(isLikelyLegit('legal.resources.affiliateMarker', 'Affiliate')).toBe(false);
  });
});
