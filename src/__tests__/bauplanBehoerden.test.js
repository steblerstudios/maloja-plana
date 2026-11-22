// Wächter · Bauplan Lebensbereich, Behörden (Stebler Studios 21.11.2026: «gleich aufbauen wie wohnen», Szene
// «Gemeindehaus», Skizze _werkbank/entwuerfe/behoerden-kapitel.html «Ja, so bauen»).
// Analyse: stebler-studios/analysen/2026-11-21-behoerden-bauplan.md
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { BehoerdenZuhause, steuerfristLage, gaengeLage, leistungenLage } from '../bereiche/behoerden/behoerden.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, teil) => (html.match(new RegExp('data-teil="' + teil + '"', 'g')) || []).length;
const kapitel = (behoerden = DEMO_DATA.behoerden, checked = {}, allData = DEMO_DATA) => renderToStaticMarkup(React.createElement(BehoerdenZuhause, {
  palette: LIGHT_PALETTE, t, behoerden, allData, checked, onToggle: () => {}, onNavigate: () => {}, isDarkMode: false,
}));
// Fester Tag, damit die Zahlen nicht mit dem Kalender wandern: 21.11.2026 mittags.
const HEUTE = new Date(2026, 10, 21, 12);

describe('Bauplan Behörden · drei Fragen, je eine Rechnung', () => {
  it('A Steuerfrist: Maria, 31.03.2027 → 4 Monate, nicht vorbei', () => {
    const f = steuerfristLage(DEMO_DATA.behoerden, HEUTE);
    expect(f.iso).toBe('2027-03-31');
    expect(f.abstand).toMatchObject({ tage: 130, n: 4, einheit: 'monate', vorbei: false });
    expect(f.zeigen).toBe(true);
    expect(steuerfristLage({}, HEUTE)).toBeNull();
  });
  it('B Gänge: 1 von 5 (Steuererklärung 2025 als Vorschlag), eigene Haken zählen', () => {
    const g = gaengeLage({}, DEMO_DATA.behoerden, HEUTE);
    expect([g.erledigt, g.total]).toEqual([1, 5]);
    expect(g.liste[0]).toMatchObject({ id: 'steuererklaerung', erledigt: true, jahr: 2025, vorschlag: true });
    expect(gaengeLage({ betreibungsauszug: true, steuererklaerung: false }, DEMO_DATA.behoerden, HEUTE).erledigt).toBe(1);
  });
  it('C Leistungen: dieselbe Peilung wie die Übersicht, Maria (ZH) ein Weg, die Prämienverbilligung', () => {
    const l = leistungenLage(DEMO_DATA);
    expect(l.state).toBe('found');
    expect(l.anzahl).toBe(1);
    expect(l.wege.map((w) => w.key)).toEqual(['ipv']);
    expect(leistungenLage({}).state).toBe('idle');
  });
});

describe('Bauplan Behörden · jedes Bild einmal, die Zahl darunter', () => {
  it('ein Anschlagbrett, ein Gemeindehaus, ein Wegweiser, ein Kalenderblatt', () => {
    const html = kapitel();
    for (const teil of ['anschlagbrett', 'gemeindehaus', 'wegweiser', 'kalenderblatt']) expect(zaehle(html, teil), teil).toBe(1);
  });
  it('je eine Hauptzahl, jede unter ihrem Bild', () => {
    const html = kapitel();
    for (const [zahl, bild] of [['steuerfrist', 'anschlagbrett'], ['gaenge', 'gemeindehaus'], ['leistungen', 'wegweiser']]) {
      expect((html.match(new RegExp('data-instrument-zahl="' + zahl + '"', 'g')) || []).length, zahl).toBe(1);
      expect(html.indexOf('data-instrument-zahl="' + zahl + '"'), zahl).toBeGreaterThan(html.indexOf('data-teil="' + bild + '"'));
    }
  });
  it('die Szene steht vor den Abschnitten, «Mehr dazu» zuletzt mit Testament, Dossier und Sozialhilfe', () => {
    const html = kapitel();
    const reihe = ['behoerden-strasse', 'steuerfrist', 'behoerdengaenge', 'leistungen', 'behoerden-mehr'].map((x) => html.indexOf('data-teil="' + x + '"'));
    expect(reihe.every((x) => x >= 0)).toBe(true);
    expect([...reihe].sort((a, b) => a - b)).toEqual(reihe);
    const mehr = html.slice(html.indexOf('data-teil="behoerden-mehr"'));
    expect(mehr).toContain('data-teil="fall-der-faelle"');
    expect(mehr).toContain('data-weg="dossier"');
    expect(mehr).toContain('data-weg="sozialhilfe"');
  });
  it('die Haken schalten die Fenster: so viele hell, wie Gänge erledigt sind', () => {
    const fenster = (checked) => (kapitel(DEMO_DATA.behoerden, checked).match(/data-an="ja"/g) || []).length;
    expect(fenster({})).toBe(1);
    expect(fenster({ betreibungsauszug: true, ausweisRenewal: true })).toBe(3);
    expect(fenster({ steuererklaerung: false })).toBe(0);
  });
  it('Leistungen: ein Hinweis, kein Anspruch, mit Weg zu «Was steht mir zu?»', () => {
    const html = kapitel();
    expect(html).toMatch(/data-teil="leistungen-satz"[^>]*>Ein möglicher Weg aus Ihren Angaben: Prämienverbilligung/);
    expect(html).toContain('kein Entscheid über einen Anspruch');
    expect(html).toContain('data-weg="situationen"');
  });
  it('ohne Frist kein Brett, ohne Einkommen ruht der Kompass ohne Zahl', () => {
    const html = kapitel({ ...DEMO_DATA.behoerden, taxFilingDeadline: '' }, {}, { ...DEMO_DATA, finanzen: {} });
    expect(html).not.toContain('data-teil="anschlagbrett"');
    expect(html).toContain('data-kompass="idle"');
    expect(html).not.toContain('data-instrument-zahl="leistungen"');
    expect(zaehle(html, 'gemeindehaus')).toBe(1);
  });
});

describe('Bauplan Behörden · Ordnung im Code', () => {
  const appDateien = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || rel === path.join('bereiche', 'behoerden') ? [] : appDateien(rel);
    return /\.(js|jsx)$/.test(e.name) ? [rel] : [];
  });
  it('rechnung.js rechnet nur: kein React, kein Bauteil', () => {
    const q = lies('bereiche/behoerden/rechnung.js');
    expect(q).not.toMatch(/from 'react'/);
    expect(q).not.toMatch(/from '[^']+\.jsx'/);
  });
  it('ausserhalb des Bereichs kommt Behörden nur über bereiche/behoerden/behoerden.js', () => {
    const falsch = appDateien('.').filter((f) => /from '[^']*bereiche\/behoerden\/(?!behoerden\.js')[^']*'|import\('[^']*bereiche\/behoerden\/(?!behoerden\.js')/.test(lies(f)));
    expect(falsch).toEqual([]);
  });
  it('der Eingang heisst nicht index.js, das alte Instrument ist weg', () => {
    expect(fs.existsSync(path.join(SRC, 'bereiche/behoerden/index.js'))).toBe(false);
    expect(fs.existsSync(path.join(SRC, 'components/BehoerdenInstrument.jsx'))).toBe(false);
  });
  it('Kachel und Kapitel zeigen dasselbe Gemeindehaus', () => {
    expect(lies('components/InstrumentePanel.jsx')).toMatch(/h\(Gemeindehaus, \{ palette, erledigt: erledigteGaenge, total: GAENGE\.length,[^}]*groesse: 'klein' \}\)/);
  });
});
