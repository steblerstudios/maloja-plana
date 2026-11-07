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

// Ergänzung A (Wege durch Maloja, Entscheid Stebler Studios 07.11.2026): aus dem Werkzeug zur passenden Karte
// im Kantonsatlas — sonst führt aus der App kein Weg dorthin. Die Anker erzeugt scripts/seiten/kantonsatlas.mjs
// (`karte-${key.toLowerCase()}`); der Wächter appZurErklaerseite.test.js prüft, dass jedes Ziel auf der Seite steht.
export const KANTONSKARTE = {
  praemien: '/kantonsatlas/#karte-praemie',
  premium: '/kantonsatlas/#karte-lastnachipv',
  tax: '/kantonsatlas/#karte-steuer',
  mietzins: '/kantonsatlas/#karte-miete',
  alv: '/kantonsatlas/#karte-alq',
  sozialhilfe: '/kantonsatlas/#karte-sozialhilfe',
  ergaenzungsleistungen: '/kantonsatlas/#karte-el',
};

const linkStil = (palette) => ({ color: palette.skyDeep || palette.text, fontWeight: weight.medium, textDecoration: 'underline', textUnderlineOffset: '2px' });

export const ErklaerseiteLink = ({ palette, t, view }) => {
  const href = ERKLAERSEITE[view];
  const karte = KANTONSKARTE[view];
  if (!href && !karte) return null;
  const zeile = (ziel, schluessel) => React.createElement('p', { key: schluessel, style: { margin: space.sm + 'px 0 0', fontSize: text.sm } },
    React.createElement(ExternerLink, { t, href: ziel, hrefLang: 'de', style: linkStil(palette) }, t(schluessel)));
  return React.createElement(React.Fragment, null,
    href && zeile(href, 'erklaerseite.link'),
    karte && zeile(karte, 'erklaerseite.karte'));
};

export default ErklaerseiteLink;
