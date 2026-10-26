import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import FinanzUebersicht from '../FinanzUebersicht.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

// Brutto-Hinweis beim Armutsgrenzen-Befund (25.10.2026): im Rentenalter rechnet der Richtwert ohne ALV und
// Pensionskasse — der alte Satz «geschätzt aus AHV/ALV und Pensionskasse» begründete die Zahl falsch.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const seite = (d) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: d, onNavigate: () => {} }));
const knapp = (dateOfBirth) => ({
  basis: { canton: 'ZH', maritalStatus: 'single', dateOfBirth, gender: 'male' },
  finanzen: { monthlyIncome: '1800', incomeType: 'netto', sideIncome: '600' },
  wohnen: { rentAmount: '1400' },
  versicherungen: { kkPremium: '350' },
});

beforeAll(() => { preloadPLZ(); });

describe('povertyBruttoHint: eigene Fassung im Rentenalter', () => {
  it('im Rentenalter: Rente-Fassung mit Freibetrag', () => {
    const html = seite(knapp('1950-03-01'));
    expect(html).toContain('finanzUebersicht.belowPoverty');
    expect(html).toContain('finanzUebersicht.povertyBruttoHintRente(');
    expect(html).toMatch(/povertyBruttoHintRente\([^)]*\|CHF 1.400\)/);
  });

  it('vor dem Referenzalter: bisherige Fassung', () => {
    const html = seite(knapp('1992-03-01'));
    expect(html).toContain('finanzUebersicht.povertyBruttoHint(');
    expect(html).not.toContain('povertyBruttoHintRente');
  });

  it('in allen fünf Sprachen, mit {brutto} und {freibetrag}, sie/du wo üblich', () => {
    for (const s of [de, fr, itSprache, rm]) {
      for (const form of ['sie', 'du']) {
        expect(s.finanzUebersicht.povertyBruttoHintRente[form]).toMatch(/\{brutto\}.*\{freibetrag\}/);
      }
    }
    expect(en.finanzUebersicht.povertyBruttoHintRente).toMatch(/\{brutto\}.*\{freibetrag\}/);
  });
});
