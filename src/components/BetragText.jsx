import React from 'react';
import { betrag, betragSpanne, VERBORGEN } from '../utils/geld.js';
import { visuallyHiddenStyle } from '../config/tokens.js';

// Ein Betrag am Bildschirm, der auch für den Bildschirmleser stimmt (Nachzug Sichtschutz, 16.11.2026).
// Sichtbar: «CHF 1’234» oder, bei «Beträge verbergen», «CHF ···». Die drei Punkte wurden als
// «CHF Punkt Punkt Punkt» angesagt (a11y-Befund Vortor 13.11.) — hier hört man «Betrag verborgen».
// `n` darf eine Spanne [von, bis] sein (betragSpanne). `davor`/`danach` hängen Text an («höchstens », « / Monat»), ohne dass Aufrufer Kinder-Listen bauen.
// Nur für Stellen, die als Element dargestellt werden. In SVG-Text, Attributen und t()-Parametern
// bleibt es bei betrag(); ein t()-Satz mit «CHF {x}» ist ein Text und kann keine Hülle tragen.
// Wächter: src/__tests__/sichtschutzNachzug.test.js
export function betragText(t, n, optionen, davor = '', danach = '') {
  const s = Array.isArray(n) ? betragSpanne(n[0], n[1], optionen) : betrag(n, optionen);
  if (s !== VERBORGEN) return davor + s + danach;
  return React.createElement('span', null,
    davor,
    React.createElement('span', { 'aria-hidden': true }, s),
    React.createElement('span', { style: visuallyHiddenStyle }, t('common.betragVerborgen')),
    danach);
}
