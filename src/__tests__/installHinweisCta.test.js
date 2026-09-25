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

// Karte im Bergpanorama (25.09.2026): am Handy ein Handy-Zeichen, am Computer ein Bildschirm; im
// schmalen Ausschnitt nur Zeichen, «×» und Knopf — der Satz wandert in den Namen des Knopfs.
describe('InstallHinweis · Karte im Panorama', () => {
  const mitGeraet = (ua, touch, fn) => {
    const alt = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    Object.defineProperty(globalThis, 'navigator', { value: { userAgent: ua, platform: '', maxTouchPoints: touch }, configurable: true });
    try { return fn(); } finally { if (alt) Object.defineProperty(globalThis, 'navigator', alt); else delete globalThis.navigator; }
  };
  afterEach(() => { delete globalThis.localStorage; });

  it('Zeichen folgt dem Gerät: iPhone → Handy, Mac-Chrome → Computer', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    const iphone = mitGeraet('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1', 5, () => rendern({}));
    const mac = mitGeraet('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36', 0, () => rendern({}));
    expect(iphone).toContain('data-zeichen="handy"');
    expect(mac).toContain('data-zeichen="computer"');
  });

  it('der Satz steht immer sichtbar da, am Handy (klein) und am Computer — und nur einmal', () => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} };
    const klein = rendern({ klein: true });
    expect(klein).toMatch(/>install\.navSub</);
    // kein zweites Mal im Knopf-Namen — sonst liest ein Screenreader den Satz doppelt
    expect(klein).not.toMatch(/aria-label="install\.navSub/);
    expect(rendern({})).toMatch(/>install\.navSub</);
  });
});
