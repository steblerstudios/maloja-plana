import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { UnfallKrankheit } from '../UnfallKrankheit.jsx';
import { IvVerfahren } from '../IvVerfahren.jsx';

// F7-A7 (Entscheid Stebler Studios 27.10.2026): «Unfall oder Krankheit» und «Krankheit & IV» NICHT zusammenlegen,
// sondern an der Gabelung gegenseitig verlinken. Beide Verweise gab es schon (27.09.2026); dieser Wächter hält
// sie an ihrem Ort: im kurzen Ablauf beim Schritt «Wenn Sie nicht arbeiten können» → IV, im IV-Ablauf Schritt 1 →
// zurück auf den kurzen.
beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const zeile = (datei, key) => readFileSync(resolve(__dirname, '..', datei), 'utf8').split('\n').find((z) => z.includes(key));
const schritt = (html, n) => html.slice(html.indexOf('data-ablauf-schritt="' + n + '"'), html.indexOf('data-ablauf-schritt="' + (n + 1) + '"'));

describe('Gabelung Unfall/Krankheit ↔ IV', () => {
  it('kurzer Ablauf, Schritt 3 (nicht arbeiten können): «Dauert es länger» → IV', () => {
    expect(zeile('UnfallKrankheit.jsx', 'unfallKrankheit.step3LinkIv')).toContain("onNavigate('iv')");
    const html = renderToStaticMarkup(React.createElement(UnfallKrankheit, { palette: LIGHT_PALETTE, t, chapters: [], onNavigate: () => {} }));
    expect(schritt(html, 3)).toContain(esc(t('unfallKrankheit.step3LinkIv')));
  });
  it('IV-Ablauf, Schritt 1: zurück auf «Unfall oder Krankheit»', () => {
    expect(zeile('IvVerfahren.jsx', 'iv.step1Link')).toContain("onNavigate('unfallkrankheit')");
    const html = renderToStaticMarkup(React.createElement(IvVerfahren, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(schritt(html, 1)).toContain(esc(t('iv.step1Link')));
  });
  it('beide bleiben eigene Abläufe', () => {
    expect(readFileSync(resolve(__dirname, '..', 'UnfallKrankheit.jsx'), 'utf8')).toContain("ablauf: 'unfallkrankheit'");
    expect(readFileSync(resolve(__dirname, '..', 'IvVerfahren.jsx'), 'utf8')).toContain("ablauf: 'iv'");
  });
});
