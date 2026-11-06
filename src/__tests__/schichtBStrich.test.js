import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Icons } from '../IconKern.jsx';
import '../IconSystem.jsx';

// Icon-Plan November 2026, Schritt 5 — Entscheid E1 (Stebler Studios, 06.11.2026): Schicht B,
// die Funktions-Icons, ist ganz Strich. ICON_KONVENTION.md: «Funktional → ein Outline-Set, nie
// gefüllte Flächen.» Abgenommen am Entwurf docs/design/icons-schicht-b-entwurf-2026-11-06.html.
//
// Die dreizehn waren volle Flächen mit fest weissen Innenzeichen (`fill: 'white'`) — im
// Dunkelmodus ist die Fläche hell (currentColor) und das «i», der Haken, das Ausrufezeichen
// verschwinden darin.

export const SCHICHT_B_STRICH = [
  'info', 'warning', 'success', 'error', 'delete', 'filter', 'phone',
  'debt', 'csv', 'qr', 'barcode', 'timeline', 'document',
];

const zeichnung = (name) => renderToStaticMarkup(React.createElement(Icons[name]));

describe('Schicht B ist Strich', () => {
  it.each(SCHICHT_B_STRICH)('%s: Wurzel ohne Fläche, mit Strich', (name) => {
    const wurzel = zeichnung(name).match(/<svg[^>]*>/)[0];
    expect(wurzel).toMatch(/fill="none"/);
    expect(wurzel).toMatch(/stroke="currentColor"/);
  });

  it.each(SCHICHT_B_STRICH)('%s: keine fest weissen Innenzeichen', (name) => {
    expect(zeichnung(name)).not.toMatch(/(fill|stroke)="white"/);
  });

  it.each(SCHICHT_B_STRICH)('%s: kein Text im Zeichen (rendert je Schrift anders)', (name) => {
    expect(zeichnung(name)).not.toMatch(/<text/);
  });
});
