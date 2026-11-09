// Bugsuche 09.11.2026, B-14 · Jeder Brief mit Wohnort trägt «Ort, Datum».
// Vorher fehlte der Ort in Fristerstreckung Steuern und Kassenwechsel (Felder ohne `city`,
// `f.city ? …` lief nie) und in der KK-Reklamation (nur das Datum gesetzt).
import { describe, it, expect } from 'vitest';
import { generateLetter } from '../briefGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

const t = createT({ de }, 'de');
const data = {
  basis: { firstName: 'Anna', lastName: 'Muster', canton: 'BS' },
  wohnen: { address: 'Rheingasse 1', postalCode: '4058', city: 'Basel' },
  versicherungen: { kkInsurer: 'Beispielkasse' },
};
const datumsZeile = (html) => (html.match(/<div class="date-line">([^<]*)<\/div>/) || [])[1];

describe('Ort vor dem Datum', () => {
  for (const key of ['leaseTermination', 'taxExtension', 'insuranceSwitch', 'kkReklamation']) {
    it(`${key}: «Basel, <Datum>»`, () => {
      expect(datumsZeile(generateLetter(key, data, t))).toMatch(/^Basel, \d{2}\.\d{2}\.\d{4}$/);
    });
  }

  it('ohne Wohnort bleibt es beim Datum allein', () => {
    const ohneOrt = { ...data, wohnen: { address: 'Rheingasse 1' } };
    expect(datumsZeile(generateLetter('kkReklamation', ohneOrt, t))).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  });
});
