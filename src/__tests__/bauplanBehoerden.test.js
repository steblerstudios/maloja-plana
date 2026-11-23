// Wächter · Bauplan Lebensbereich, Behörden (Stebler Studios 21.11.2026: «gleich aufbauen wie wohnen», Szene
// «Gemeindehaus», Skizze _werkbank/entwuerfe/behoerden-kapitel.html «Ja, so bauen»).
// Analyse: stebler-studios/analysen/2026-11-21-behoerden-bauplan.md
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { ladeIPVModelle } from '../config/cantonalData.js';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { BehoerdenZuhause, steuerfristLage, gaengeLage, leistungenLage } from '../bereiche/behoerden/behoerden.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, teil) => (html.match(new RegExp('data-teil="' + teil + '"', 'g')) || []).length;
const kapitel = (behoerden = DEMO_DATA.behoerden, checked = {}, allData = DEMO_DATA) => renderToStaticMarkup(React.createElement(BehoerdenZuhause, {
  palette: LIGHT_PALETTE, t, behoerden, allData, checked, onToggle: () => {}, onNavigate: () => {}, isDarkMode: false,
}));
const mitLohn = (lohn, incomeType = 'netto') => ({ ...DEMO_DATA, finanzen: { ...DEMO_DATA.finanzen, monthlyIncome: String(lohn), incomeType } });
// Fester Tag, damit die Zahlen nicht mit dem Kalender wandern: 21.11.2026 mittags.
const HEUTE = new Date(2026, 10, 21, 12);

// Muss vor dem ersten ladeIPVModelle stehen: die Modelle bleiben danach für die ganze Datei geladen.
describe('Bauplan Behörden · solange das Kantonsmodell lädt', () => {
  it('keine Zahl und kein Weg, nur «Laden»; nach einem Ladefehler die Orientierung «prüfen»', () => {
    const html = kapitel();
    expect(html).toContain('data-kompass="laden"');
    expect(html).not.toContain('data-instrument-zahl="leistungen"');
    expect(html).not.toContain('Ein möglicher Weg');
    expect(leistungenLage(DEMO_DATA, { fertig: true }).wege.map((w) => w.key)).toEqual(['ipv']);
  });
});

describe('Bauplan Behörden · drei Fragen, je eine Rechnung', () => {
  beforeAll(() => ladeIPVModelle(), 30000);
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
  it('C Leistungen: Maria (ZH) liegt über der IPV-Grenze, kein direkter Weg', () => {
    const l = leistungenLage(DEMO_DATA);
    expect(l.state).toBe('none');
    expect(l.anzahl).toBe(0);
    expect(leistungenLage({}).state).toBe('idle');
  });
  it('Kapitel und Übersicht zeigen dasselbe, netto, brutto und mit offener Einkommensart', () => {
    const gesehen = new Set();
    for (const incomeType of ['netto', 'brutto', '']) {
      for (let lohn = 1500; lohn <= 8000; lohn += 250) {
        const d = mitLohn(lohn, incomeType);
        const uebersicht = renderToStaticMarkup(React.createElement(QuickCheck, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {} }))
          .match(/>Leistungs-Kompass<\/span><span[^>]*>([^<]*)</)[1];
        const html = kapitel(d.behoerden, {}, d);
        const hier = html.match(/data-teil="kompass-unter"[^>]*>([^<]*)</)[1];
        const idle = html.includes('data-kompass="idle"');
        expect(idle ? t('instrumente.setup') : hier, lohn + ' ' + incomeType).toBe(uebersicht);
        gesehen.add(html.match(/data-kompass="([^"]*)"/)[1]);
      }
    }
    expect([...gesehen].sort()).toEqual(['found', 'idle', 'none']);
  });
});

describe('Bauplan Behörden · jedes Bild einmal, die Zahl darunter', () => {
  beforeAll(() => ladeIPVModelle(), 30000);
  const TIEF = mitLohn(2000);
  it('ein Anschlagbrett, ein Gemeindehaus, ein Wegweiser, ein Kalenderblatt', () => {
    const html = kapitel();
    for (const teil of ['anschlagbrett', 'gemeindehaus', 'wegweiser', 'kalenderblatt']) expect(zaehle(html, teil), teil).toBe(1);
  });
  it('je eine Hauptzahl, jede unter ihrem Bild', () => {
    const html = kapitel(TIEF.behoerden, {}, TIEF);
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
    const html = kapitel(TIEF.behoerden, {}, TIEF);
    expect(html).toMatch(/data-teil="leistungen-satz"[^>]*>[^<]*(mögliche Wege|möglicher Weg) aus Ihren Angaben: /);
    expect(html).toContain('kein Entscheid über einen Anspruch');
    expect(html).toContain('data-weg="situationen"');
  });
  it('nichts Direktes: weitere Wege, keine grosse «0»', () => {
    const html = kapitel();
    expect(html).toContain('data-kompass="none"');
    expect(html).not.toContain('data-instrument-zahl="leistungen"');
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
