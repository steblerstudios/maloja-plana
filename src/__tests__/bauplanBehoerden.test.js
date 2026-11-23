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
  // Zweite Runde (Stebler Studios 23.11.2026, «Ja, so bauen», Skizze behoerden-kapitel-2.html).
  it('Aufbau wie Wohnen: Kopf, Szene, Erklärungen am Bild, Gang-Karte, Rand; kein «Mehr dazu»', () => {
    const html = kapitel();
    const reihe = ['behoerden-kopf', 'behoerden-strasse', 'steuerfrist', 'leistungen', 'behoerdengaenge', 'behoerden-rand'].map((x) => html.indexOf('data-teil="' + x + '"'));
    expect(reihe.every((x) => x >= 0)).toBe(true);
    expect([...reihe].sort((a, b) => a - b)).toEqual(reihe);
    expect(html).not.toContain('behoerden-mehr');
    const rand = html.slice(html.indexOf('data-teil="behoerden-rand"'));
    for (const r of ['betreibung', 'rechtsbeistand', 'fall-der-faelle']) expect(rand, r).toContain('data-rand="' + r + '"');
    // Kein Text-Schlüssel auf der Seite (gesehen 23.11.2026: «nav.ankerSatz.betreibungsauszug ›»).
    expect(html).not.toMatch(/>[a-zA-Z]+\.[a-zA-Z.]+ ›</);
    expect(rand).toContain('Auszug bestellen ›');
    expect(html.slice(html.indexOf('data-teil="leistungen"'))).toContain('data-weg="sozialhilfe"');
  });
  it('Kopf: Kanton gross, Steuernummer, offene Erklärungen und eingereichtes Jahr klein', () => {
    const html = kapitel();
    expect(html).toMatch(/data-teil="kopf-kanton"[^>]*>Kanton Zürich/);
    expect(html).toMatch(/data-kopf-teil="steuernummer"[\s\S]*ZH-2024-123456[\s\S]*data-kopf-teil="offen"[\s\S]*>0<[\s\S]*data-kopf-teil="eingereicht"[\s\S]*>2025</);
    const leer = kapitel({ ...DEMO_DATA.behoerden, cantoneOfTaxation: '', taxId: '' }, {}, { ...DEMO_DATA, basis: { ...DEMO_DATA.basis, canton: '' } });
    expect(leer).toContain('Steuerkanton noch leer');
    expect(leer).not.toContain('data-kopf-teil="steuernummer"');
  });
  it('Fenster sind Knöpfe je Gang, mit Name und Stand; die Karte zeigt den gewählten Gang', () => {
    const html = kapitel();
    expect((html.match(/data-fenster="\d" data-an="(ja|nein)"[^>]*role="button"/g) || []).length).toBe(5);
    expect(html).toContain('aria-label="Steuererklärung 2025 eingereicht, erledigt"');
    expect(html).toContain('aria-label="Betreibungsauszug bestellt, offen"');
    expect(html).toMatch(/data-teil="gang-karte" data-gang="steuererklaerung"[\s\S]*Haken gesetzt, weil keine Steuererklärung offen ist/);
    expect((html.match(/data-gang-knopf=/g) || []).length).toBe(5);
  });
  // Dritte Runde (23.11.2026 abends, wie «Warum ein Drittel? ›» bei Wohnen): je unter ihrem Bild ein <details>, zu.
  it('Erklärungen: unter ihrem Bild zum Aufklappen, zu, aber im Dokument; eine verpasste Frist steht offen da', () => {
    const html = kapitel();
    for (const [teil, bild] of [['steuerfrist', 'strasse-frist'], ['leistungen', 'strasse-wegweiser']]) {
      expect(html, teil).toMatch(new RegExp('<details data-teil="' + teil + '"'));
      expect(html, teil).not.toMatch(new RegExp('<details data-teil="' + teil + '"[^>]* open'));
      expect(html.indexOf('data-teil="' + teil + '"'), teil).toBeGreaterThan(html.indexOf('data-teil="' + bild + '"'));
    }
    const vorbei = kapitel({ ...DEMO_DATA.behoerden, taxFilingDeadline: '2020-03-31', pendingTaxReturns: '1' });
    expect(vorbei).toMatch(/data-teil="frist-vorbei"[^>]*>Die erfasste Frist ist vorbei/);
  });
  // Dritte Runde (23.11.2026 abends, Muster Wohnen): unter jeder Zahl, woraus sie kommt.
  it('Detail unter den Bildern: Datum der Frist, offene Gänge; ohne Weg der ganze Satz', () => {
    const html = kapitel();
    expect(html).toMatch(/data-teil="frist-detail"[^>]*>\d{1,2}\. [A-Za-zä]+ \d{4}</);
    expect(html).toMatch(/data-teil="gaenge-detail"[^>]*>Offen: Betreibung · Ausweis · Wohnsitz · Strafregister</);
    expect(html).toMatch(/data-teil="kompass-detail"[^>]*>Über das Einkommen nichts Direktes/);
    const alle = kapitel(DEMO_DATA.behoerden, { betreibungsauszug: true, ausweisRenewal: true, wohnsitzbestaetigung: true, strafregisterauszug: true });
    expect(alle).toMatch(/data-teil="gaenge-detail"[^>]*>Alle Gänge erledigt</);
  });
  it('Passend: Steuern, Betreibungsauszug und Ablage stehen oben schon, hier nicht noch einmal; zwei Gruppen', () => {
    const q = lies('ChapterView.jsx');
    const block = q.slice(q.indexOf("case 'behoerden': {"), q.indexOf("case 'notfall':"));
    for (const w of ["weg('tax'", "weg('betreibungsauszug')", 'ablage(']) expect(block, w).not.toContain(w);
    for (const g of ['gruppeUnterwegs', 'gruppeSchreiben']) expect(block, g).toContain(g);
    for (const w of ['ausweis', 'fuehrerausweis', 'wegzug', 'dienst', 'betreibung', 'selbstmahnen', 'briefe']) expect(block, w).toContain("weg('" + w + "'");
  });
  it('die Haken schalten die Fenster: so viele hell, wie Gänge erledigt sind', () => {
    const fenster = (checked) => (kapitel(DEMO_DATA.behoerden, checked).match(/data-an="ja"/g) || []).length;
    expect(fenster({})).toBe(1);
    expect(fenster({ betreibungsauszug: true, ausweisRenewal: true })).toBe(3);
    expect(fenster({ steuererklaerung: false })).toBe(0);
  });
  it('Leistungen: ein Hinweis, kein Anspruch, mit Weg zu «Was steht mir zu?» (in der Erklärung)', () => {
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
