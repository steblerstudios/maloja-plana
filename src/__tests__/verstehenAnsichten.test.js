import { it, expect } from 'vitest';
// Laufzeit-Probe zu «Verstehen im Werkzeug» (09.11.2026): Die fünf Werkzeuge echt rendern, mit Kanton BE.
// Der Build merkt nicht, wenn `canton` im Gültigkeitsbereich fehlt; dann stürzt die Ansicht erst zur Laufzeit ab.
// Zeigt die Zeile «Ihr Kanton auf der Karte», ist der Kanton angekommen.
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE as P } from '../config/constants.js';
const t = createT({ de }, 'de', 'sie');
const data = { basis: { canton: 'BE' }, wohnen: {}, finanzen: {}, versicherungen: {}, arbeit: {} };
const faelle = [['TaxCalculator', 'TaxCalculator'], ['MietzinsOrientierung', 'MietzinsOrientierung'], ['AlvRechner', 'AlvRechner'], ['SozialhilfeView', 'SozialhilfeView'], ['Ergaenzungsleistungen', 'Ergaenzungsleistungen']];
it.each(faelle)('%s rendert den Block', async (datei, name) => {
  const m = await import(`../${datei}.jsx`);
  const C = m[name] || m.default;
  const html = renderToStaticMarkup(React.createElement(C, { palette: P, t, data, onNavigate: () => {}, onUpdateData: () => {}, updateData: () => {} }));
  expect(html).toContain('data-teil="verstehen-im-werkzeug"');
  expect(html).toContain(t('erklaerseite.karteMitKanton'));
});
