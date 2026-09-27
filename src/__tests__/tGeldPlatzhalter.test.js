import { describe, it, expect } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Seitenrundgang 27.09.2026: rohe Zahlen in «CHF {…}»-Texten — «Einkommen über Grenze
// (CHF 64000)», «ca. CHF 2160/Jahr». t() formatiert Zahlen hinter «CHF» jetzt selbst.
describe('t() formatiert Geld-Platzhalter', () => {
  const t = createT({ de: { a: 'CHF {x}', b: 'ca. CHF {x}/Jahr', c: 'Jahr {x}', d: 'CHF {x} und {y} %', e: 'CHF {x}' } }, 'de', 'sie');

  it('ganze Zahl mit Apostroph, ohne Nachkommastellen', () => {
    expect(t('a', { x: 64000 })).toBe('CHF 64’000');
    expect(t('b', { x: 2160 })).toBe('ca. CHF 2’160/Jahr');
    expect(t('e', { x: 1500 })).toBe('CHF 1’500');
  });
  it('Bruchteil mit zwei Stellen', () => {
    expect(t('a', { x: 1234.5 })).toBe('CHF 1’234.50');
  });
  it('schon formatierte Texte bleiben, wie sie sind', () => {
    expect(t('a', { x: '1’500' })).toBe('CHF 1’500');
    expect(t('a', { x: '32.50' })).toBe('CHF 32.50');
  });
  it('ohne «CHF» davor wird nichts angefasst', () => {
    expect(t('c', { x: 2026 })).toBe('Jahr 2026');
    expect(t('d', { x: 1000, y: 1000 })).toBe('CHF 1’000 und 1000 %');
  });
  it('fehlender Wert bleibt als Platzhalter stehen', () => {
    expect(t('a', {})).toBe('CHF {x}');
  });
  it('echte Texte: IPV-Grenze und Nebenkosten', () => {
    const td = createT({ de }, 'de', 'sie');
    expect(td('ipv.incomeAboveLimit', { value: 64000 })).toContain('64’000');
    expect(td('wohnen.nkEstimate', { monthly: 180, annual: 2160 })).toContain('2’160');
  });
});
