// Wächter · Bauplan Lebensbereich Notfall & Gesundheit (Stebler Studios 18.11.2026: «B · Herz mit Puls», «Ja, so bauen»).
// Drei Fragen, drei Bilder: Franchise = Thermometer · Als Nächstes fällig = Kalenderblatt (Arztkoffer) · Bereit = Herz
// mit Puls (Kapitel Notfall und Kachel). Analyse: stebler-studios/analysen/2026-11-18-notfall-gesundheit-bauplan.md
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE, getChapters } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { ArztkofferView } from '../ArztkofferView.jsx';
import { NotfallImKapitel } from '../components/NotfallImKapitel.jsx';
import { GesundheitZuhause, naechstesFaellig, naechsteVorsorge, lagenStand, bereitschaft } from '../bereiche/notfall/notfall.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, re) => (html.match(re) || []).length;
const HEUTE = new Date('2026-11-18T10:00:00');
const MIT_BELEG = (() => {
  const d = JSON.parse(JSON.stringify(DEMO_DATA));
  d.versicherungen = { ...d.versicherungen, franchise: 'f2500',
    kkBelege: [{ id: 'b1', datum: '2026-10-02', betrag: 820, status: 'offen', frist: '2026-12-15' }] };
  return d;
})();
const arztkoffer = (d) => renderToStaticMarkup(React.createElement(ArztkofferView, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {}, isDarkMode: false }));
const kapitel = (d) => renderToStaticMarkup(React.createElement(NotfallImKapitel, { palette: LIGHT_PALETTE, t, data: d, chapters: getChapters(t),
  onNavigate: () => {}, onUpdate: () => {}, zumFeld: () => {}, karteMoeglich: true }));

describe('Bauplan Notfall & Gesundheit · jedes Bild einmal je Seite', () => {
  it('Arztkoffer: ein Thermometer (gross), ein Kalenderblatt, je eine Hauptzahl darunter', () => {
    const html = arztkoffer(MIT_BELEG);
    expect(zaehle(html, /data-franchise="gross"/g)).toBe(1);
    expect(zaehle(html, /data-franchise="/g)).toBe(1);
    expect(zaehle(html, /data-teil="kalenderblatt"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="franchise"/g)).toBe(1);
    expect(zaehle(html, /data-instrument-zahl="faellig"/g)).toBe(1);
    expect(html.indexOf('data-instrument-zahl="franchise"')).toBeGreaterThan(html.indexOf('data-franchise="gross"'));
    expect(html.indexOf('data-instrument-zahl="faellig"')).toBeGreaterThan(html.indexOf('data-teil="kalenderblatt"'));
    // die Fragen stehen vor den Fächern
    const erstesFach = html.indexOf(t('arztkoffer.faecher.kvg.title').replace('&', '&amp;'));
    expect(erstesFach).toBeGreaterThan(-1);
    expect(html.indexOf('data-teil="gesundheit-zuhause"')).toBeLessThan(erstesFach);
  });
  it('Arztkoffer ohne Franchise und ohne Termine: kein Bild, ruhige Sätze statt Zahlen', () => {
    const d = JSON.parse(JSON.stringify(DEMO_DATA));
    d.versicherungen = { ...d.versicherungen, franchise: '', kkBelege: [] };
    const html = renderToStaticMarkup(React.createElement(GesundheitZuhause, { palette: LIGHT_PALETTE, t, data: d, onNavigate: () => {}, letzteBesuche: {}, heute: HEUTE }));
    expect(html).not.toContain('data-franchise=');
    expect(html).not.toContain('data-teil="kalenderblatt"');
    expect(html).toContain('data-teil="franchise-leer"');
    expect(html).toContain('data-teil="faellig-leer"');
  });
  it('Kapitel Notfall: ein Herz mit Puls (gross), die Zahl darunter, kein Balken und kein Ring mehr', () => {
    for (const d of [DEMO_DATA, MIT_BELEG, {}]) {
      const html = kapitel(d);
      expect(zaehle(html, /data-teil="herz-puls"/g)).toBe(1);
      expect(html).toContain('data-groesse="gross"');
      expect(zaehle(html, /data-instrument-zahl="bereit"/g)).toBe(1);
      expect(html.indexOf('data-instrument-zahl="bereit"')).toBeGreaterThan(html.indexOf('data-teil="herz-puls"'));
      expect(html).not.toContain('data-bereit=');
    }
  });
  it('Kachel: dasselbe Herz klein, mit derselben Rechnung', () => {
    const panel = lies('components/InstrumentePanel.jsx');
    expect(panel).toMatch(/HerzPuls, \{ palette, lagen: lagenStand\(data\), groesse: 'klein' \}/);
    expect(panel).not.toMatch(/BereitRingKlein/);
  });
});

describe('Ablesung am Thermometer (Sophie 18.11.2026, «A · Skala am Thermometer»)', () => {
  it('Arztkoffer: Selbstbehalt, Franchise, noch offen, erreicht stehen am Thermometer, in dieser Reihenfolge von oben', () => {
    const html = arztkoffer(MIT_BELEG);
    const pos = ['ablese-selbstbehalt', 'ablese-franchise', 'ablese-offen', 'ablese-erreicht'].map((teil) => html.indexOf('data-teil="' + teil + '"'));
    expect(pos.every((p) => p > -1)).toBe(true);
    const top = (teil) => Number((html.match(new RegExp('data-teil="' + teil + '" style="position:absolute;left:0;top:(\\d+)px')) || [])[1]);
    expect(top('ablese-selbstbehalt')).toBeLessThan(top('ablese-franchise'));
    expect(top('ablese-franchise')).toBeLessThan(top('ablese-offen'));
    expect(top('ablese-offen')).toBeLessThan(top('ablese-erreicht'));
  });
  it('KVG-Reiter: die alte Textzeile unter dem Bild ist weg, die Ablesung steht am Thermometer', () => {
    const q = lies('KVGLeistungen.jsx');
    expect(q).toMatch(/FranchiseAblesung, \{ palette, t, stand: result, groesse: 'mittel' \}/);
    expect(q).not.toMatch(/'data-teil': 'franchise-franken'|'data-teil': 'selbstbehalt-franken'/);
  });
});

describe('Bauplan Notfall & Gesundheit · Rechnungen', () => {
  it('Herz: ein Schlag je Lage, voll nur, wenn alle Angaben der Lage bereit sind', () => {
    const l = lagenStand(DEMO_DATA);
    expect(l.map((x) => x.key)).toEqual(['unfall', 'spital', 'behoerde']);
    expect(l.every((x) => x.voll === (x.erledigt === x.gesamt))).toBe(true);
    expect(lagenStand({}).every((x) => !x.voll)).toBe(true);
    expect(bereitschaft({}).erledigt).toBe(0);
  });
  it('nächste Vorsorge: letzte Untersuchung + Intervall; ohne Datum nichts', () => {
    expect(naechsteVorsorge('2024-03-10', 36)).toBe('2027-03-10');
    expect(naechsteVorsorge('', 36)).toBeNull();
    expect(naechsteVorsorge('2024-03-10', undefined)).toBeNull();
  });
  it('Als Nächstes fällig = das Früheste aus offener Belegfrist und Vorsorge', () => {
    const vorsorgeFrueher = naechstesFaellig(MIT_BELEG, { mammografie: '2024-11-01' }, HEUTE);
    expect(vorsorgeFrueher).toMatchObject({ art: 'vorsorge', key: 'mammografie', iso: '2026-11-01', vorbei: true });
    const belegFrueher = naechstesFaellig(MIT_BELEG, { darmkrebs: '2024-01-01' }, HEUTE);
    expect(belegFrueher).toMatchObject({ art: 'beleg', iso: '2026-12-15', vorbei: false });
    const bezahlt = JSON.parse(JSON.stringify(MIT_BELEG));
    bezahlt.versicherungen.kkBelege[0].status = 'bezahlt';
    expect(naechstesFaellig(bezahlt, {}, HEUTE)).toBeNull();
  });
  it('der Katalog rechnet die nächste Vorsorge mit derselben Funktion (keine eigene Monatsrechnung)', () => {
    const q = lies('KVGLeistungen.jsx');
    expect(q).toMatch(/naechsteVorsorge\(lastVisit, recMonths\)/);
    expect(q).not.toMatch(/setMonth\(next\.getMonth\(\) \+ recMonths\)/);
  });
});

describe('Bauplan Notfall & Gesundheit · Ordnung im Code', () => {
  const appDateien = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || rel === path.join('bereiche', 'notfall') ? [] : appDateien(rel);
    return /\.(js|jsx)$/.test(e.name) ? [rel] : [];
  });
  it('rechnung.js rechnet nur: kein React, kein Bauteil', () => {
    const q = lies('bereiche/notfall/rechnung.js');
    expect(q).not.toMatch(/from 'react'/);
    expect(q).not.toMatch(/from '[^']+\.jsx'/);
  });
  it('ausserhalb des Bereichs kommt Notfall & Gesundheit nur über bereiche/notfall/notfall.js', () => {
    const falsch = appDateien('.').filter((f) => /from '[^']*bereiche\/notfall\/(?!notfall\.js')[^']*'|import\('[^']*bereiche\/notfall\/(?!notfall\.js')/.test(lies(f)));
    expect(falsch).toEqual([]);
  });
  it('der Eingang heisst nicht index.js', () => {
    expect(fs.existsSync(path.join(SRC, 'bereiche/notfall/index.js'))).toBe(false);
  });
  it('die Bereitschaft wird nur einmal gerechnet: das Kapitel-Bauteil rechnet nicht selbst', () => {
    const k = lies('components/NotfallImKapitel.jsx');
    expect(k).not.toMatch(/export const (bereitschaft|SCENARIOS|NOTFALL_ANGABEN|VORSORGE|BereitRingKlein)\b/);
    expect(fs.existsSync(path.join(SRC, 'components/FranchiseThermometer.jsx'))).toBe(false);
  });
});
