import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WerkzeugGruppen } from '../components/WerkzeugGruppen.jsx';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';

// Verbesserungen A2 (docs/entscheide/verbesserungen-2026-11.md, 06.11.2026): «Lebensereignisse» zeigte
// 36 Abläufe als flache Liste. Jeder Ablauf trägt seinen Lebensbereich (`bereich` in ABLAEUFE); die Gruppe
// gliedert sie jetzt mit Zwischentiteln danach — Reihenfolge der Bereiche wie im Register.
const t = createT({ de }, 'de', 'sie');
const BEREICHE = [...new Set(ABLAEUFE.map((a) => a.bereich))];

const offeneLebensereignisse = () => {
  const speicher = new Map([['mp_offene_werkzeuggruppen', JSON.stringify([t('dashboard.toolGroups.lebensereignisse')])]]);
  globalThis.sessionStorage = { getItem: (k) => speicher.get(k) ?? null, setItem: (k, v) => speicher.set(k, String(v)) };
  const html = renderToStaticMarkup(React.createElement(WerkzeugGruppen, {
    palette: LIGHT_PALETTE, t, simpleView: false, onNavigate: () => {}, onSelectChapter: () => {}, chapters: [],
  }));
  const start = html.indexOf('<details open=""');
  return html.slice(start, html.indexOf('</details>', start));
};

describe('Lebensereignisse nach Lebensbereich', () => {
  let alt;
  beforeEach(() => { alt = globalThis.sessionStorage; });
  afterEach(() => { globalThis.sessionStorage = alt; });

  it('jeder Bereich hat einen Zwischentitel, in der Reihenfolge des Registers', () => {
    const html = offeneLebensereignisse();
    const titel = [...html.matchAll(/<h4[^>]*>([^<]+)<\/h4>/g)].map((m) => m[1]);
    expect(titel).toEqual(BEREICHE.map((b) => t('dashboard.bereich.' + b)));
  });

  it('alle 36 Abläufe stehen weiter da, keiner doppelt', () => {
    const html = offeneLebensereignisse();
    const knoepfe = (html.match(/<button/g) || []).length;
    expect(knoepfe).toBe(ABLAEUFE.length);
  });

  it('die Zwischentitel stehen in allen fünf Sprachen', () => {
    for (const l of [de, fr, it_, en, rm]) {
      for (const b of BEREICHE) expect(typeof l.dashboard.bereich?.[b], b).toBe('string');
    }
  });
});
