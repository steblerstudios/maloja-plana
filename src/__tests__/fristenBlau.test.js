// Fristen blau (Fassung 9, Stebler Studios 05.11.2026, Farbrollen Variante B und «Ja, Fristen blau»):
// Blau = informieren und Fristen, Rot = vorbei/überfällig, Gold nur noch für Handlungen.
// Geprüft wird das gerenderte Markup der gemeinsamen Fristkarte, nicht der Quelltext.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FristButton } from '../AblaufSchale.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

const t = (k) => k;
const karte = (palette) => renderToStaticMarkup(React.createElement(FristButton, {
  palette, t, art: 'frist', buttonLabel: 'In den Kalender', doneLabel: 'gespeichert',
  reminder: { title: 'Kündigung Krankenkasse', dueDate: '2099-11-30', category: 'admin', recurrence: 'once' },
}));

describe('Fristkarte', () => {
  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: offene Frist hat einen blauen Rand, nicht Gold`, () => {
      const html = karte(p);
      const tag = html.match(/<div data-frist-karte="offen" style="[^"]*"/);
      expect(tag, 'Fristkarte').not.toBeNull();
      expect(tag[0]).toContain('border:1px solid ' + p.sky);
      expect(tag[0]).not.toContain(p.gold);
    });
  }
});
