import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// ─────────────────────────────────────────────────────────────
// SEO-Audit 20.09.2026 · docs/audits/seo-audit-2026-09-20.md
//
// Das «M» von «Maloja» ist in beiden Einstiegs-Titeln der Gipfel im SVG, nicht
// ein Buchstabe im Text. Der Textknoten begann dadurch bei «aloja Plana».
// Screenreader waren über aria-label versorgt — Suchmaschinen und KI-Crawler
// lesen aber den Textknoten und sahen den Markennamen falsch geschrieben.
// Das sind die zwei einzigen h1, die ein Crawler überhaupt erreicht: hinter dem
// Beta-Gate kommt er nicht weiter.
//
// Ein verstecktes <span>M</span> (visuallyHiddenStyle) stellt den Namen im Text
// her, ohne das Bild zu ändern. Dieser Wächter hält es fest.
//
// Seit 24.09.2026 (Markenpaket 1.0) ist das ganze Logo ein Bild (MarkenLogo.jsx),
// der volle Name steht dort als versteckter Text. Die Zusage bleibt dieselbe.
//
// I18nProvider lädt die Sprachdatei in einem useEffect und rendert serverseitig
// nichts — deshalb hier die Hook-Attrappe statt des echten Providers.
// ─────────────────────────────────────────────────────────────

vi.mock('../i18n/index.js', () => ({
  useT: () => ({ t: (k) => k, lang: 'de', anrede: 'sie' }),
  I18nProvider: ({ children }) => children,
}));

const { BetaGate } = await import('../BetaGate.jsx');
const { Onboarding } = await import('../Onboarding.jsx');

// Markup → Text, so wie eine Text-Extraktion ihn liest: Grafik trägt keinen
// Text, versteckte Spans schon (genau darum geht es hier).
const textVon = (markup) =>
  markup
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

const ersteH1 = (markup) => {
  const treffer = markup.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return treffer ? textVon(treffer[1]) : null;
};

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

describe('Markenname im Titel — die zwei h1, die ein Crawler erreicht', () => {
  it('BetaGate: die h1 liest sich als «Maloja Plana», nicht «aloja Plana»', () => {
    const markup = renderToStaticMarkup(
      React.createElement(BetaGate, null, React.createElement('div'))
    );
    expect(ersteH1(markup)).toBe('Maloja Plana');
  });

  it('Onboarding: dieselbe h1, dieselbe Regel', () => {
    const markup = renderToStaticMarkup(
      React.createElement(Onboarding, {
        palette, t: (k) => k, setLanguage: () => {},
        supportedLanguages: ['de'], onComplete: () => {}, onUpdateData: () => {},
      })
    );
    expect(ersteH1(markup)).toBe('Maloja Plana');
  });

  it('der Wächter würde den alten Zustand bemerken', () => {
    // Gegenprobe: ohne das versteckte «M» darf die Prüfung NICHT durchgehen —
    // sonst misst sie nur sich selbst (vgl. «eine Kennzahl muss unterscheiden»).
    expect(ersteH1('<h1><svg><path/></svg>aloja Plana</h1>')).toBe('aloja Plana');
    expect(ersteH1('<h1><svg><path/></svg><span>M</span>aloja Plana</h1>')).toBe('Maloja Plana');
  });
});
