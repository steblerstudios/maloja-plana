// Der Text-Export (MANIFEST.txt) ist lesbar und behauptet nichts, was nicht erfasst ist.
//
// Bis 25.09.2026: Auswahlfelder als Rohschlüssel («CHF f2500», «handwritten», «yes»),
// Beträge ohne Tausendertrennung, ein LEERES Betragsfeld als «CHF 0» und ein leeres
// Testament-Feld als «Nein». «Nicht erfasst» ist weder null noch nein.
import { describe, it, expect } from 'vitest';
import { prepareDownloadFiles } from '../zipExport.js';
import de from '../i18n/de.js';

const t = (k, p) => {
  const v = k.split('.').reduce((o, s) => o?.[s], de);
  if (v === undefined) return k;
  const s = typeof v === 'object' && v && v.sie ? v.sie : v;
  return typeof s === 'string' && p ? s.replace(/\{(\w+)\}/g, (_, n) => p[n] ?? '') : s;
};
const text = (data) => prepareDownloadFiles(data, [], t).manifest.content;
const zeile = (txt, label) => txt.split('\n').find((z) => z.includes('- ' + label + ':'))?.split(': ').slice(1).join(': ');

describe('Text-Export', () => {
  const voll = text({
    basis: { firstName: 'Attrappe' },
    wohnen: { rentAmount: '1850', utilities: '' },
    finanzen: { monthlyIncome: 6500.5, pension3a: '7258' },
    versicherungen: { franchise: 'f2500', kkPremium: '412.35' },
    ausbildung: { educationLevel: 'apprenticeship' },
    behoerden: { betreibungsStatus: 'none', willMade: 'handwritten' },
    notfall: { organDonor: 'declined' },
  });

  it('Auswahlfelder mit Beschriftung, nicht als Schlüssel', () => {
    expect(voll).toContain('CHF 2’500');
    expect(voll).not.toContain('f2500');
    expect(voll).toContain('Lehre EFZ');
    expect(voll).toContain('Keine Einträge');
    expect(voll).toContain('Ja Holografisches');
    expect(voll).toContain('Widersprochen');
    for (const roh of ['apprenticeship', 'handwritten', 'declined']) expect(voll).not.toContain(roh);
  });

  it('Beträge mit Schweizer Trennung, Rappen bleiben', () => {
    expect(voll).toContain('CHF 1’850');
    expect(voll).toContain('CHF 6’500.5');
    expect(voll).toContain('CHF 7’258');
    expect(voll).toContain('CHF 412.35');
  });

  it('leer ist «—», nicht «CHF 0» und nicht «Nein»', () => {
    const leer = text({});
    expect(leer).not.toMatch(/CHF 0\b/);
    expect(zeile(voll, t('zipExport.manifest.utilities'))).toBe('—');
    expect(zeile(leer, t('zipExport.manifest.rent'))).toBe('—');
    expect(zeile(leer, t('zipExport.manifest.franchise'))).toBe('—');
    expect(zeile(leer, t('zipExport.manifest.will'))).toBe('—');
  });

  it('die Prüfzeilen finden ihre Zeilen (sonst prüfte der Test die leere Menge)', () => {
    for (const k of ['utilities', 'rent', 'franchise', 'will']) {
      expect(zeile(text({}), t('zipExport.manifest.' + k)), k).toBeDefined();
    }
  });
});
