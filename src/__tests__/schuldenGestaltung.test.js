// Schulden R2 Teil 2, Fix-Welle 13.10.2026 (E): Token statt rohe px, Datum lesbar, Luft vor der Kartenliste.
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { VerlustscheinZeitachse, BetreibungZeitleiste } from '../components/SchuldenBilder.jsx';
import { SchuldenManager } from '../SchuldenManager.jsx';
import { LIGHT_PALETTE as palette } from '../config/constants.js';
import { space, text, radius } from '../config/tokens.js';

const t = (k, v) => k + (v ? JSON.stringify(v) : '');
const quelle = fs.readFileSync(path.resolve(__dirname, '../components/SchuldenBilder.jsx'), 'utf8');
// Nur die zwei Bilder dieser Runde (ab «⑤ Verlustscheine»), nicht die älteren Bilder davor.
const neu = quelle.slice(quelle.indexOf('export const VerlustscheinZeitachse'));

describe('17 · Masse der Spur sind benannt, Tokens statt Rohwerte', () => {
  it('SPUR steht am Dateikopf', () => {
    const kopf = quelle.slice(0, quelle.indexOf('export const STUFEN_TON'));
    expect(kopf).toMatch(/const SPUR = \{ hoehe: 12, marke: 2, punkt: 10, minBreite: 4, ueberstand: 3 \};/);
  });
  it('keine rohen px / 50 % in VerlustscheinZeitachse und BetreibungZeitleiste', () => {
    expect(neu).not.toMatch(/'(?:12|10|2|1|-3)px'/);
    expect(neu).not.toMatch(/max\(4px/);
    expect(neu).not.toContain("'50%'");
    expect(neu).not.toMatch(/rowGap: '/);
  });
  it('gerendert: Höhe/Marken aus SPUR, Gap aus space, Kreis radius.full, dünne Marke radius.hair', () => {
    const vs = renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege: [{ id: 1, creditor: 'A', date: '2021-03-15' }], heute: '2026-10-13' }));
    expect(vs).toContain('row-gap:' + space['2xs'] + 'px');
    expect(vs).toContain('height:12px');
    expect(vs).toContain('width:2px;top:-3px;bottom:-3px');
    expect(vs).toMatch(new RegExp('width:2px;top:-3px;bottom:-3px;background:#24262A;border-radius:' + radius.hair + 'px'));
    const bt = renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, eintraege: [{ id: 1, creditor: 'A', registerDate: '2022-03-15' }], heute: '2026-10-13' }));
    expect(bt).toContain('row-gap:' + space['2xs'] + 'px');
    expect(bt).toMatch(new RegExp('top:1px;width:10px;height:10px;border-radius:' + radius.full + 'px'));
    expect(bt).toMatch(new RegExp('width:2px;top:-3px;bottom:-3px;background:#24262A;border-radius:' + radius.hair + 'px'));
  });
});

describe('18 · Datum in der Zeile lesbar (sm, Schriftfarbe); Jahr/Heute bleiben klein', () => {
  const datum = (h, key) => h.match(new RegExp('<span style="([^"]*)">' + key.replace(/\./g, '\\.')))[1];
  it('Verjährung', () => {
    const h = renderToStaticMarkup(React.createElement(VerlustscheinZeitachse, { palette, t, eintraege: [{ id: 1, creditor: 'A', date: '2021-03-15' }], heute: '2026-10-13' }));
    const st = datum(h, 'schulden.verlustschein.verjaehrt');
    expect(st).toContain('font-size:' + text.sm + 'px');
    expect(st).toContain('color:' + palette.text);
    expect(h).toContain('font-size:' + text.xs + 'px;color:' + palette.mid + ';margin-top:4px">schulden.verlustschein.zeitachse.heute');
  });
  it('Eingetragen', () => {
    const h = renderToStaticMarkup(React.createElement(BetreibungZeitleiste, { palette, t, eintraege: [{ id: 1, creditor: 'A', registerDate: '2022-03-15' }], heute: '2026-10-13' }));
    const st = datum(h, 'schulden.betreibung.zeitleiste.eingetragen');
    expect(st).toContain('font-size:' + text.sm + 'px');
    expect(st).toContain('color:' + palette.text);
    expect(h).toContain('font-size:' + text.xs + 'px;color:' + palette.mid + ';margin-top:4px">schulden.betreibung.zeitleiste.heute');
  });
});

describe('19 · Luft vor der Kartenliste (space.lg)', () => {
  const rendern = (view, daten) => renderToStaticMarkup(React.createElement(SchuldenManager, {
    palette, t, data: { schulden: [], betreibung: [], verlustscheine: [], finanzen: {}, basis: {}, ...daten }, onSave: () => {}, onNavigate: () => {}, startView: view,
  }));
  it('Verlustscheine: Zeitachse schliesst mit space.lg', () => {
    const h = rendern('verlustscheine', { verlustscheine: [{ id: 1, creditor: 'A', amount: 1, date: '2021-03-15', rolle: 'schulde' }] });
    expect(h).toContain('margin:' + space.md + 'px 0 ' + space.lg + 'px"><div style="font-weight:600;font-size:15px;color:#24262A;margin-bottom:4px">schulden.verlustschein.zeitachse.titel');
  });
  it('Betreibung: Regeltext schliesst mit space.lg', () => {
    const h = rendern('betreibung', { betreibung: [{ id: 1, creditor: 'A', amount: 1, registerDate: '2022-03-15', status: 'open' }] });
    expect(h).toMatch(new RegExp('margin:0 0 ' + space.lg + 'px">schulden\\.betreibung\\.auszugRegel'));
  });
});
