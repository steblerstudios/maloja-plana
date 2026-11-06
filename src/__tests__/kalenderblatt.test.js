// Kalenderblatt (F9-A14, Variante E, Stebler Studios 06.11.2026, «Ja, E so»).
// Prüft die Gestalt am gerenderten Markup und den Kontrast des Monats auf dem getönten Band.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Kalenderblatt, blattDatum, BAND_ALPHA } from '../components/Kalenderblatt.jsx';
import { BehoerdenInstrument } from '../components/BehoerdenInstrument.jsx';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

const blatt = (props) => renderToStaticMarkup(React.createElement(Kalenderblatt, { palette: LIGHT_PALETTE, ...props }));

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mische = (vorne, hinten, a) => hex(vorne).map((v, i) => Math.round(v * a + hex(hinten)[i] * (1 - a)));
const lum = (rgb) => { const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const kontrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

describe('Kalenderblatt', () => {
  it('offen: Rahmen, Kante und Band in Blau; Band mit Alpha 55', () => {
    const html = blatt({ iso: '2027-03-31' });
    expect(html).toContain('data-zustand="offen"');
    expect(html).toContain('border:1px solid ' + LIGHT_PALETTE.sky);
    expect(html).toMatch(new RegExp('data-teil="kante" style="height:3px;background:' + LIGHT_PALETTE.sky + '"'));
    expect(html).toContain('background:' + LIGHT_PALETTE.sky + BAND_ALPHA);
    expect(BAND_ALPHA).toBe('55');
  });

  it('vorbei: dasselbe in Rot', () => {
    const html = blatt({ iso: '2027-03-31', vorbei: true });
    expect(html).toContain('data-zustand="vorbei"');
    expect(html).toContain('border:1px solid ' + LIGHT_PALETTE.rose);
    expect(html).not.toContain(LIGHT_PALETTE.sky);
  });

  it('ist für Screenreader stumm, das Datum steht im Satz daneben', () => {
    expect(blatt({ iso: '2027-03-31' })).toMatch(/^<div aria-hidden="true"/);
  });

  it('Tag und Jahr; klein ohne Jahr', () => {
    expect(blatt({ iso: '2027-03-31' })).toContain('>31<');
    expect(blatt({ iso: '2027-03-31' })).toContain('>2027<');
    expect(blatt({ iso: '2027-03-31', klein: true })).not.toContain('>2027<');
  });

  it('ohne gültiges Datum kein Blatt (leer, Unsinn, 31. Februar)', () => {
    for (const iso of ['', null, undefined, 'morgen', '2027-02-31']) expect(blatt({ iso }), String(iso)).toBe('');
    expect(blattDatum('2027-03-31T00:00:00Z').getDate()).toBe(31);
  });

  it('unbekannte Sprache fällt auf de-CH zurück statt zu werfen', () => {
    expect(blatt({ iso: '2027-03-31', locale: 'calendar.locale' })).toContain('>31<');
  });

  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: Monat auf dem Band hält AA (4.5:1), blau und rot`, () => {
      const a = parseInt(BAND_ALPHA, 16) / 255;
      for (const farbe of [p.sky, p.rose]) expect(kontrast(hex(p.text), mische(farbe, p.surface, a))).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('Kapitel Behörden zeigt die Steuerfrist als blaues Blatt', () => {
    const html = renderToStaticMarkup(React.createElement(BehoerdenInstrument, {
      palette: LIGHT_PALETTE, t: (k) => k, behoerden: { taxFilingDeadline: '2099-03-31' }, lang: 'de',
    }));
    expect(html).toContain('data-teil="kalenderblatt" data-zustand="offen"');
    expect(html).toContain('border:1px solid ' + LIGHT_PALETTE.sky);
  });
});
