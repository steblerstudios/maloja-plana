// Charts-Legende zeigte rohe Schlüssel («budgetSync.taxes», «budgetSync.groceries» …):
// die Schlüssel gab es nie, t() gab den Schlüssel zurück, und der Rückfall-Text griff nie.
// Gefunden bei der Massstab-Prüfung aller Seiten am 21.10.2026.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChartsAdvanced } from '../ChartsAdvanced.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

// Echtes Nachschlagen wie in der App: fehlt der Schlüssel, kommt der Schlüssel selbst zurück.
const tFuer = (sprache) => (k) => {
  const wert = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), sprache);
  if (typeof wert === 'string') return wert;
  if (wert && typeof wert === 'object' && typeof wert.sie === 'string') return wert.sie;
  return k;
};

// Jede Kategorie mit einem Betrag, damit jede Legendenzeile erscheint.
const daten = {
  wohnen: { rentAmount: '1500', utilities: '150' },
  versicherungen: { kkPremium: '385', bvgContribution: '300', liabilityAmount: '10', householdInsuranceAmount: '20', autoInsuranceAmount: '30' },
  finanzen: {
    monthlyIncome: '6200', monthlyTax: '850', groceries: '450', communication: '85',
    mobility: '120', debtPayments: '100', otherInsurance: '40',
  },
};

const zeichne = (sprache) => renderToStaticMarkup(React.createElement(ChartsAdvanced, { palette, t: tFuer(sprache), data: daten }));

describe('Charts-Legende ohne rohe Schlüssel', () => {
  for (const [name, sprache] of [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]]) {
    it(name + ': kein «budgetSync.» im sichtbaren Text', () => {
      expect(zeichne(sprache)).not.toMatch(/budgetSync\./);
    });
  }

  it('de: die Kategorien stehen mit ihren Namen da', () => {
    const html = zeichne(de);
    for (const name of ['Steuern', 'Lebensmittel &amp; Haushalt', 'Internet &amp; Telefon', 'Mobilität', 'Schuldenraten', 'Weitere Versicherungen', 'Nebenkosten', 'Krankenkasse']) {
      expect(html).toContain(name);
    }
  });
});
