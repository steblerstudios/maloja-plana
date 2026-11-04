import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LebenslagenAuswahl } from '../Lebenssituationen.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Der Altersfilter der Familien-EL an der echten Karte (04.11.2026), nicht nur an der Funktion:
// Solothurn (PLZ 4500, Kinder unter 6), Lebenslage «alleinerziehend» offen.
const t = createT({ de }, 'de', 'sie');
const TITEL = de.lebenszustaende.alleinerziehend.berechtigungen.familienEL.titel;

let alt;
beforeAll(() => {
  alt = globalThis.localStorage;
  globalThis.localStorage = { getItem: (k) => (k === 'or5_lebenszustaende' ? '["alleinerziehend"]' : null), setItem: () => {}, removeItem: () => {} };
});
afterAll(() => { if (alt === undefined) delete globalThis.localStorage; else globalThis.localStorage = alt; });

const karte = (children, plz = '4500') => renderToStaticMarkup(React.createElement(LebenslagenAuswahl, {
  palette: LIGHT_PALETTE, t, onNavigate: () => {},
  data: { wohnen: { postalCode: plz }, basis: { household: { adults: 1, children } } },
})).includes(TITEL);

describe('Familien-EL-Karte nach Kindesalter', () => {
  it('SO mit 4-jährigem Kind: Karte da', () => expect(karte([{ age: 4 }])).toBe(true));
  it('SO mit 10-jährigem Kind: keine Karte', () => expect(karte([{ age: 10 }])).toBe(false));
  it('SO mit Kind ohne bekanntes Alter: Karte da', () => expect(karte([{ age: 0, birthDate: '' }])).toBe(true));
  it('VD (1003) mit 10-jährigem Kind: Karte da', () => expect(karte([{ age: 10 }], '1003')).toBe(true));
  it('ZH (8001): nie eine Karte', () => expect(karte([{ age: 4 }], '8001')).toBe(false));
});
