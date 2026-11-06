import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WerkzeugGruppen } from '../components/WerkzeugGruppen.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE } from '../config/constants.js';

// Verbesserungen B1 (docs/entscheide/verbesserungen-2026-11.md, 06.11.2026): der Aufklapp-Pfeil der
// Werkzeuggruppen war fest auf «zu» gesetzt, auch bei offener Gruppe. Jetzt folgt er dem Zustand,
// wie in «Was steht mir zu?» (Lebenssituationen.jsx).
const t = createT({ de }, 'de', 'sie');
const KEY = 'mp_offene_werkzeuggruppen';
const zeige = () => renderToStaticMarkup(React.createElement(WerkzeugGruppen, {
  palette: LIGHT_PALETTE, t, simpleView: false, onNavigate: () => {}, onSelectChapter: () => {}, chapters: [],
}));
// Je Gruppe: ist sie offen, und ist ihr Pfeil gedreht?
const gruppen = (html) => [...html.matchAll(/<details([^>]*)>([\s\S]*?)<\/summary>/g)].map((m) => ({
  offen: /\sopen=""/.test(m[1]),
  gedreht: /rotate\(90deg\)/.test(m[2]),
  titel: m[2].replace(/<[^>]+>/g, '').replace(/\d+$/, '').trim(),
}));

describe('Aufklapp-Pfeil der Werkzeuggruppen', () => {
  let alt;
  beforeEach(() => {
    alt = globalThis.sessionStorage;
    const speicher = new Map();
    globalThis.sessionStorage = { getItem: (k) => speicher.get(k) ?? null, setItem: (k, v) => speicher.set(k, String(v)) };
  });
  afterEach(() => { globalThis.sessionStorage = alt; });

  it('alle zu: kein Pfeil gedreht', () => {
    const g = gruppen(zeige());
    expect(g.length).toBeGreaterThan(5);
    expect(g.every((x) => !x.offen && !x.gedreht)).toBe(true);
  });

  it('eine gemerkte offene Gruppe zeigt ihren Pfeil offen, die anderen nicht', () => {
    globalThis.sessionStorage.setItem(KEY, JSON.stringify([t('dashboard.toolGroups.ankommen')]));
    const g = gruppen(zeige());
    const offen = g.filter((x) => x.offen);
    expect(offen.map((x) => x.titel)).toEqual([t('dashboard.toolGroups.ankommen')]);
    for (const x of g) expect(x.gedreht, x.titel).toBe(x.offen);
  });
});
