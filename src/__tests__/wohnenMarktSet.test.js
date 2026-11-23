// Dreier-Set «Mietbeiträge und Wohnungsmarkt» im Kapitel Wohnen (Stebler Studios 20.11.2026, «Ja, so bauen»):
// Mietbeiträge als Kachelkarte, Miete 3 Zimmer nur als Karte, Leerwohnungen in Wohnen-Grün nur als Rangfolge.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import { LIGHT_PALETTE } from '../config/constants.js';
import { KARTEN } from '../data/kantonskarten.js';
import { HaeuserRang } from '../bereiche/wohnen/bilder.jsx';
import { marktWerte } from '../bereiche/wohnen/zuhause.jsx';
import { ZUM_VERSTEHEN } from '../components/ErklaerseiteLink.jsx';

const QUELLE = fs.readFileSync(path.resolve(__dirname, '../bereiche/wohnen/zuhause.jsx'), 'utf8');

describe('Dreier-Set Wohnen', () => {
  it('Leerwohnungen: Rangfolge höchster links, Ihr Kanton voll mit Rand, Schweiz gestrichelt', () => {
    const { leer, leerCh } = marktWerte(KARTEN);
    expect(Object.keys(leer)).toHaveLength(26);
    const html = renderToStaticMarkup(React.createElement(HaeuserRang, { palette: LIGHT_PALETTE, werte: leer, kanton: 'ZH', ch: leerCh, chText: 'CH 0,93 %' }));
    const reihe = [...html.matchAll(/data-kanton="([A-Z]{2})"/g)].map((m) => m[1]);
    expect(reihe[0]).toBe('JU'); // 3,35 %, der höchste Wert
    expect(reihe.at(-1)).toBe('ZG'); // 0,20 %
    expect(html).toMatch(/data-kanton="ZH" data-ihr="ja"><path[^>]*fill-opacity="1"/);
    expect(html).toContain('data-teil="rang-schweiz"');
  });
  it('Miete nur als Karte, Leerwohnungen nur als Rangfolge, Daten nachgeladen', () => {
    expect(QUELLE).toMatch(/key: 'miete'[\s\S]*?farbe: mieteFarbe[\s\S]*?teil: 'markt-miete'/);
    expect(QUELLE).not.toMatch(/key: 'miete'[\s\S]{0,600}HaeuserRang/);
    expect(QUELLE).toMatch(/key: 'leer'[\s\S]*?HaeuserRang[\s\S]*?HaeuserRang/);
    expect(QUELLE).toMatch(/import\('\.\.\/\.\.\/data\/kantonskarten\.js'\)/);
  });
  it('am Kapitelende keine Atlas-Links mehr für Wohnen', () => {
    expect(ZUM_VERSTEHEN.wohnen.karten).toEqual([]);
  });
});
