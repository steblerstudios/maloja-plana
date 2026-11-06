// Fristen blau (Fassung 9, Stebler Studios 05.11.2026, Farbrollen Variante B und «Ja, Fristen blau»):
// Blau = informieren und Fristen, Rot = vorbei/überfällig, Gold nur noch für Handlungen.
// Seit F9-A14 Variante E (06.11.2026, «Ja, E so») trägt das Kalenderblatt die Farbe, der Kartenrand
// ist neutral. Vorher prüfte dieser Test einen blauen Kartenrand.
// Geprüft wird das gerenderte Markup der gemeinsamen Fristkarte, nicht der Quelltext.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FristButton, EreignisFrist } from '../AblaufSchale.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

const t = (k) => k;
const karte = (palette, art = 'frist') => renderToStaticMarkup(React.createElement(FristButton, {
  palette, t, art, buttonLabel: 'In den Kalender', doneLabel: 'gespeichert',
  reminder: { title: 'Kündigung Krankenkasse', dueDate: '2099-11-30', category: 'admin', recurrence: 'once' },
}));
const ereignis = (palette, wert) => renderToStaticMarkup(React.createElement(EreignisFrist, {
  palette, t, art: 'frist', id: 'x', labelKey: 'l', hinweisKey: 'h', vorbeiKey: 'v', doneKey: 'd',
  reminderTitle: 'Rechtsvorschlag', frist: (d) => d, wert, onWert: () => {},
}));
const kartenTag = (html, zustand) => html.match(new RegExp('<div data-frist-karte="' + zustand + '" style="[^"]*"'));
const blattTag = (html) => html.match(/<div aria-hidden="true" data-teil="kalenderblatt" data-zustand="(offen|vorbei)" style="[^"]*"/);

describe('Fristkarte', () => {
  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: offene Frist hat ein blaues Blatt, die Karte bleibt neutral`, () => {
      const html = karte(p);
      const tag = kartenTag(html, 'offen');
      expect(tag, 'Fristkarte').not.toBeNull();
      expect(tag[0]).toContain('border:1px solid ' + p.border);
      expect(tag[0]).not.toContain(p.sky);
      expect(tag[0]).not.toContain(p.gold);
      const blatt = blattTag(html);
      expect(blatt, 'Kalenderblatt').not.toBeNull();
      expect(blatt[1]).toBe('offen');
      expect(blatt[0]).toContain('border:1px solid ' + p.sky);
    });

    it(`${name}: vorbei hat ein rotes Blatt, die Karte bleibt neutral`, () => {
      const html = ereignis(p, '2001-01-15');
      const tag = kartenTag(html, 'vorbei');
      expect(tag, 'Fristkarte vorbei').not.toBeNull();
      expect(tag[0]).toContain('border:1px solid ' + p.border);
      expect(tag[0]).not.toContain(p.rose);
      const blatt = blattTag(html);
      expect(blatt[1]).toBe('vorbei');
      expect(blatt[0]).toContain('border:1px solid ' + p.rose);
    });
  }

  it('eine Erinnerung (keine Frist) bekommt kein Blatt', () => {
    expect(karte(LIGHT_PALETTE, 'erinnerung')).not.toContain('data-teil="kalenderblatt"');
  });
});
