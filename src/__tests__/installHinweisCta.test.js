// «So geht es» als Hauptknopf (Entscheid 25.09.2026). Wo der Browser nicht selbst installieren
// kann (Safari, Firefox — kein beforeinstallprompt), ist die Anleitung DER Weg und trägt den
// Hauptknopf. Wo «Installieren» steht, bleibt sie der Zweitweg: nie zwei Hauptknöpfe im Kasten.
// Geprüft wird das gerenderte Markup, nicht der Quelltext.
import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { InstallHinweis } from '../InstallHinweis.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';

const t = (k) => k;
const hauptknoepfe = (html) => (html.match(/<button[^>]*background:\s*#?[^;"]*;[^>]*>/g) || [])
  .filter((b) => b.includes('background:' + LIGHT_PALETTE.sand) || b.includes('background: ' + LIGHT_PALETTE.sand)
    || b.toLowerCase().includes('background:' + LIGHT_PALETTE.sand.toLowerCase()));
const rendern = (props) => renderToStaticMarkup(React.createElement(InstallHinweis, {
  palette: LIGHT_PALETTE, t, onNavigate: () => {}, onPromptWeg: () => {}, ...props,
}));

describe('InstallHinweis · «So geht es»', () => {
  afterEach(() => { delete globalThis.localStorage; });

  it('ohne Installier-Möglichkeit: «So geht es» ist der Hauptknopf, bricht nicht um, ≥ 44 px hoch', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    const html = rendern({});
    const tag = html.match(/<button[^>]*data-testid="install-anleitung-cta"[^>]*>/);
    expect(tag, 'Hauptknopf «So geht es»').not.toBeNull();
    expect(tag[0]).toMatch(/white-space:\s*nowrap/);
    expect(Number(tag[0].match(/min-height:\s*(\d+)px/)[1])).toBeGreaterThanOrEqual(44);
    expect(hauptknoepfe(html)).toHaveLength(1);
  });

  it('mit «Installieren»: genau EIN Hauptknopf, «So geht es» ist der Zweitweg', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    const html = rendern({ installPrompt: { prompt: () => {}, userChoice: Promise.resolve() } });
    expect(html).not.toContain('install-anleitung-cta');
    expect(html).toContain('pwa.anleitung');
    expect(hauptknoepfe(html)).toHaveLength(1);
  });
});
