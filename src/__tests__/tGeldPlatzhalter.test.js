import { describe, it, expect } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Seitenrundgang 27.09.2026: rohe Zahlen in «CHF {…}»-Texten — «Einkommen über Grenze
// (CHF\u00a064000)», «ca. CHF\u00a02160/Jahr». t() formatiert Zahlen hinter «CHF» jetzt selbst.
describe('t() formatiert Geld-Platzhalter', () => {
  const t = createT({ de: { a: 'CHF\u00a0{x}', b: 'ca. CHF\u00a0{x}/Jahr', c: 'Jahr {x}', d: 'CHF\u00a0{x} und {y} %', e: 'CHF\u00a0{x}' } }, 'de', 'sie');

  it('ganze Zahl mit Apostroph, ohne Nachkommastellen', () => {
    expect(t('a', { x: 64000 })).toBe('CHF\u00a064’000');
    expect(t('b', { x: 2160 })).toBe('ca. CHF\u00a02’160/Jahr');
    expect(t('e', { x: 1500 })).toBe('CHF 1’500');
  });
  it('Bruchteil mit zwei Stellen', () => {
    expect(t('a', { x: 1234.5 })).toBe('CHF\u00a01’234.50');
  });
  it('schon formatierte Texte bleiben, wie sie sind', () => {
    expect(t('a', { x: '1’500' })).toBe('CHF\u00a01’500');
    expect(t('a', { x: '32.50' })).toBe('CHF\u00a032.50');
  });
  it('ohne «CHF» davor wird nichts angefasst', () => {
    expect(t('c', { x: 2026 })).toBe('Jahr 2026');
    expect(t('d', { x: 1000, y: 1000 })).toBe('CHF\u00a01’000 und 1000 %');
  });
  it('fehlender Wert bleibt als Platzhalter stehen', () => {
    expect(t('a', {})).toBe('CHF\u00a0{x}');
  });
  it('echte Texte: IPV-Grenze und Nebenkosten', () => {
    const td = createT({ de }, 'de', 'sie');
    expect(td('ipv.incomeAboveLimit', { value: 64000 })).toContain('64’000');
    expect(td('wohnen.nkEstimate', { monthly: 180, annual: 2160 })).toContain('2’160');
  });
});
