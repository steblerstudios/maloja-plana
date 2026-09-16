import { describe, it, expect } from 'vitest';
import { steuerkantonVorbelegung } from '../steuerkanton.js';
import { steuerkantonVorbelegung as ausRechner } from '../../TaxCalculator.jsx';

// Die kleine Datei ersetzt den Import aus dem Steuerrechner (sonst lädt jede Ansicht
// mit OfficialLinkBox den ganzen Rechner mit). Beide müssen gleich entscheiden.
describe('steuerkantonVorbelegung (utils)', () => {
  const faelle = [
    [{ behoerden: { cantoneOfTaxation: 'ZH' }, basis: { canton: 'BS' } }, 'ZH'],
    [{ canton: 'GE', basis: { canton: 'BS' } }, 'GE'],
    [{ basis: { canton: 'BS' } }, 'BS'],
    [{ canton: { alt: true }, basis: { canton: 'VD' } }, 'VD'],
    [{}, ''],
    [undefined, ''],
  ];
  it.each(faelle)('%j → %s', (data, erwartet) => {
    expect(steuerkantonVorbelegung(data)).toBe(erwartet);
    expect(ausRechner(data)).toBe(erwartet);
  });
});
