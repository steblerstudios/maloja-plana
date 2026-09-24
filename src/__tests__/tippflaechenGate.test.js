// Gate 24.09.2026 (0.1.40-beta, a11y) · Mindest-Tippflächen und Aufklapp-Bezüge.
// App-Massstab: WCAG 2.2, 2.5.8 (mindestens 24 × 24 CSS-Pixel), wo es geht 44 px wie der
// Melde-Link im Fehlerschirm. Geprüft wird das gerenderte Markup, nicht der Quelltext.
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import ErrorBoundary from '../ErrorBoundary.jsx';
import { InstallHinweis } from '../InstallHinweis.jsx';
import { NotfallpassBlatt } from '../NotfallpassBlatt.jsx';
import { Tour } from '../Tour.jsx';
import { DARK_PALETTE, LIGHT_PALETTE, getChapters } from '../config/constants.js';

const t = (k) => k;
const knopf = (html, merkmal) => {
  const m = html.match(new RegExp(`<button[^>]*${merkmal}[^>]*>`));
  expect(m, `Knopf mit ${merkmal}`).not.toBeNull();
  return m[0];
};
const mindestens = (tag, eigenschaft, px) => {
  const m = tag.match(new RegExp(`${eigenschaft}:\\s*(\\d+)px`));
  expect(m, `${eigenschaft} gesetzt in ${tag}`).not.toBeNull();
  expect(Number(m[1])).toBeGreaterThanOrEqual(px);
};

describe('Tippflächen', () => {
  afterEach(() => { delete globalThis.localStorage; });

  it('InstallHinweis: «×» mindestens 44 × 44', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    const html = renderToStaticMarkup(React.createElement(InstallHinweis, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    const tag = knopf(html, 'aria-label="common.close"');
    mindestens(tag, 'min-width', 44);
    mindestens(tag, 'min-height', 44);
  });

  it('Rundgang: «×» (Später) mindestens 44 × 44 — in beiden Paletten', () => {
    for (const palette of [LIGHT_PALETTE, DARK_PALETTE]) {
      const html = renderToStaticMarkup(React.createElement(Tour, { palette, t, steps: [{ key: 'welcome' }], onFinish: () => {}, onLater: () => {} }));
      const tag = knopf(html, 'aria-label="tour.later"');
      mindestens(tag, '(?<!-)width', 44);
      mindestens(tag, '(?<![-a-z])height', 44);
    }
  });

  it('NotfallpassBlatt: Zurück-Knopf mindestens 44 hoch', () => {
    const html = renderToStaticMarkup(React.createElement(NotfallpassBlatt, { palette: LIGHT_PALETTE, t, data: {}, chapters: getChapters(t), onNavigate: () => {} }));
    const m = html.match(/<button[^>]*>(?:(?!<\/button>).)*notfallpass\.zurueck/);
    expect(m).not.toBeNull();
    mindestens(m[0].match(/<button[^>]*>/)[0], 'min-height', 44);
  });

  it('Fehlerschirm: «Try again» und «Reload» mindestens 44 hoch, wie der Melde-Link', () => {
    const eb = new ErrorBoundary({});
    eb.state = { hasError: true, error: new Error('x') };
    eb.context = null;
    const html = renderToString(eb.render());
    const knoepfe = html.match(/<button[^>]*>/g) || [];
    expect(knoepfe.length).toBe(2);
    for (const k of knoepfe) mindestens(k, 'min-height', 44);
  });

  it('Fehlerschirm: Gipfelpunkt in derselben Farbe wie die Bergkontur, Rückfall aus DARK_PALETTE', () => {
    const eb = new ErrorBoundary({});
    eb.state = { hasError: true, error: new Error('x') };
    eb.context = null;
    const html = renderToString(eb.render());
    const kontur = html.match(/<polyline[^>]*stroke="([^"]+)"/)[1];
    const punkt = html.match(/<circle[^>]*fill="([^"]+)"/)[1];
    expect(punkt).toBe(kontur);
    expect(kontur).toBe(DARK_PALETTE.sand);
  });
});
