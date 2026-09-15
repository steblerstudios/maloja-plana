import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LegendenMarke } from '../LegendenMarke.jsx';

// Die Legenden-Marken ersetzen die rohen Glyphen ▬ ● ▏ der Barometer. Zwei Dinge müssen
// halten: sie sind für Screenreader unsichtbar (der Wert steht im Text daneben), und die
// Farbe ist die des Aufrufers — dieselbe Variable wie die Marke auf dem Balken.
const palette = { surface: '#fff' };

describe('LegendenMarke', () => {
  it.each(['fuellung', 'punkt', 'strich', 'schwelle'])('%s: aria-hidden, Farbe vom Aufrufer', (form) => {
    const html = renderToStaticMarkup(React.createElement(LegendenMarke, { form, color: '#123456', palette }));
    expect(html).toMatch(/^<svg/);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('#123456');
  });

  it('Punkt trägt den surface-Halo wie auf dem Balken', () => {
    const html = renderToStaticMarkup(React.createElement(LegendenMarke, { form: 'punkt', color: '#123456', palette }));
    expect(html).toContain('stroke="#fff"');
  });

  it('unbekannte Form rendert nichts (kein Fremdzeichen)', () => {
    expect(renderToStaticMarkup(React.createElement(LegendenMarke, { form: 'kreis', color: '#000', palette }))).toBe('');
  });
});
