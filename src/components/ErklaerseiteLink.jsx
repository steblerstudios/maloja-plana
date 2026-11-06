import React from 'react';
import { ExternerLink } from './ExternerLink.jsx';
import { text, weight, space } from '../config/tokens.js';

// Vom Werkzeug zur eigenen öffentlichen Erklärseite (Verbesserungen D1, 06.11.2026). Seit E1 führt die
// Erklärseite ins Werkzeug; hier der Weg zurück, für wer verstehen will, wie das System dahinter funktioniert.
//
// - Neuer Tab (ExternerLink, angekündigt): die Erklärseite ist eine eigene, statische Seite. Im selben Tab
//   ginge das Beispiel verloren, und die offene Eingabe wäre weg aus dem Blick.
// - Immer die deutsche Fassung, wie die Liste im Beta-Tor (BetaGate.jsx ERKLAERSEITEN): fr/it/en/rm sind noch
//   nicht gegengelesen. Der Linktext sagt das in den anderen Sprachen.
// - Farbe Blau = informieren (Farbrollen Fassung 9).
export const ERKLAERSEITE = {
  sozialhilfe: '/sozialhilfe/',
  tax: '/steuern/',
  premium: '/praemienverbilligung/',
  praemien: '/krankenkasse/',
};

export const ErklaerseiteLink = ({ palette, t, view }) => {
  const href = ERKLAERSEITE[view];
  if (!href) return null;
  return React.createElement('p', { style: { margin: space.sm + 'px 0 0', fontSize: text.sm } },
    React.createElement(ExternerLink, {
      t, href, hrefLang: 'de',
      style: { color: palette.skyDeep || palette.text, fontWeight: weight.medium, textDecoration: 'underline', textUnderlineOffset: '2px' },
    }, t('erklaerseite.link')));
};

export default ErklaerseiteLink;
