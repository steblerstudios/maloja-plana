import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { EOrechner } from '../EOrechner.jsx';

// EOG Art. 16q: höchstens 98 Taggelder (bis 25.09.2026 zeigte der Rechner 14). Die Zeile ist
// ein Höchstwert — bei zwei erwerbstätigen Eltern hat jeder höchstens die Hälfte, je nach
// eigenem Einkommen (Abs. 4, Art. 16r). Geprüft wird, was die Nutzerin sieht.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const data = { finanzen: { monthlyIncome: 8000, incomeType: 'brutto', dreizehnter: 'yes' } }; // 104'000 → Taggeld gedeckelt 220

describe('EO-Rechner — Betreuungsentschädigung als Höchstwert mit 98 Taggeldern', () => {
  const html = renderToStaticMarkup(React.createElement(EOrechner, { palette, t: createT({ de, en, fr, it: itTranslations, rm }, 'de'), data }));

  it('zeigt «bis 98 Taggelder» und ein Total mit «höchstens»', () => {
    expect(html).toContain('bis 98 Taggelder');
    expect(html).toMatch(/höchstens CHF 21.560/); // 220 × 98
  });

  it('der Hinweis nennt 98, 18 Monate und die hälftige Aufteilung', () => {
    expect(html).toMatch(/98 Taggelder innerhalb von 18 Monaten/);
    expect(html).toMatch(/Hälfte/);
  });

  it('alle Sprachen haben Dauer, «höchstens» und Hinweis mit 98', () => {
    for (const tr of [de, en, fr, itTranslations, rm]) {
      expect(tr.eo.betreuungDauer).toContain('{n}');
      expect(tr.eo.hoechstens).toBeTruthy();
      expect(tr.eo.hinweisBetreuung).toMatch(/\b98\b/);
    }
  });
});
