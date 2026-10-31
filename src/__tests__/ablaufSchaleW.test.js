import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { ablaufStandKey } from '../utils/ablaufStand.js';
import { AblaufContainer, AblaufStep, AblaufFooter, AblaufVerwandt, AblaufLink, FristButton, passPunkte, passHoehe, istInfoSchritt, ohneNummer, ablaufKapitel } from '../AblaufSchale.jsx';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { Heirat } from '../Heirat.jsx';
import { NotfallVorlesekarte } from '../NotfallVorlesekarte.jsx';

// Ablauf-Schale (W), Entscheid Stebler Studios 24.10.2026, gebaut 27.10.2026 (F7-A1): jeder Ablauf im Register
// geht Schritt für Schritt auf einer Passstrasse mit n Kehren; Frist als Karte; «Verwandte Ereignisse» und
// Fuss immer unten; Stand je Ablauf gespeichert. Seiten ohne Ablauf (Notfallkarte) bleiben untereinander.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const t = createT({ de }, 'de', 'sie');
const palette = LIGHT_PALETTE;
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const heirat = (stand) => {
  if (stand) store[ablaufStandKey('heirat')] = JSON.stringify(stand);
  return renderToStaticMarkup(React.createElement(Heirat, { palette, t, onNavigate: () => {} }));
};
const sichtbar = (html, n) => html.includes('data-ablauf-schritt="' + n + '"><');

describe('Schritt für Schritt aus der Schale', () => {
  it('Start: «Schritt 1 von 4», nur Schritt 1 sichtbar, die übrigen im DOM aber hidden', () => {
    const html = heirat();
    expect(html).toContain('Schritt 1 von 4');
    expect(sichtbar(html, 1)).toBe(true);
    for (const n of [2, 3, 4]) expect(html).toContain('data-ablauf-schritt="' + n + '" hidden=""');
    expect(html).toContain(esc(ohneNummer(t('heirat.step1Title'))));
    expect(html).not.toContain(esc(t('heirat.step1Title'))); // ohne «1 · »
    expect(html).not.toContain('data-ablauf-marken');
  });

  it('Schritt mit Knopf: «Erledigt, weiter ›»; reiner Info-Schritt: «Weiter ›»; zuletzt «Ablauf abschliessen»', () => {
    expect(heirat()).toContain('data-ablauf-weiter="erledigt"');
    const zwei = heirat({ schritt: 1, fertig: false });
    expect(zwei).toContain('data-ablauf-weiter="info"');
    expect(zwei).toContain('Weiter ›');
    expect(zwei).toContain('Zurück');
    const letzter = heirat({ schritt: 3, fertig: false });
    expect(letzter).toContain('data-ablauf-weiter="abschliessen"');
    expect(letzter).toContain('Ablauf abschliessen');
  });

  it('erledigte Schritte stehen als Marken da', () => {
    const html = heirat({ schritt: 2, fertig: false });
    expect(html).toContain('data-ablauf-marken');
    expect(html).toContain('aria-label="Erledigte Schritte"');
    expect((html.match(/<li /g) || []).length).toBe(2);
  });

  it('Abschluss: «Alle 4 Schritte sind erledigt», «Zur Übersicht», «Ablauf nochmals ansehen»', () => {
    const html = heirat({ schritt: 3, fertig: true });
    expect(html).toContain('Alle 4 Schritte sind erledigt');
    expect(html).toContain('Zur Übersicht');
    expect(html).toContain('Ablauf nochmals ansehen');
    expect(html).toContain('data-ablauf-pass="fertig"');
    for (const n of [1, 2, 3, 4]) expect(html).toContain('data-ablauf-schritt="' + n + '" hidden=""');
  });

  it('der Stand gilt je Ablauf (eigener Schlüssel)', () => {
    store[ablaufStandKey('umzug')] = JSON.stringify({ schritt: 3, fertig: true });
    expect(heirat()).toContain('Schritt 1 von 4');
  });

  it('Kopf mit Brotkrume: Übersicht › Kapitel aus dem Register › Ablauf', () => {
    const html = heirat();
    expect(html).toContain('data-ablauf-band');
    expect(html).toContain('aria-label="Pfad"');
    expect(html).toContain(esc(t('chapters.basis.title'))); // Familie → Persönliche Basis
  });

  it('die Schrittfläche ist fokussierbar, aber keine Live-Region (keine doppelte Ansage)', () => {
    const html = heirat();
    const flaeche = html.match(/<div[^>]*data-ablauf-flaeche[^>]*>/)[0];
    expect(flaeche).toContain('tabindex="-1"');
    expect(flaeche).not.toContain('aria-live');
  });

  it('Frist als Karte: Titel der Erinnerung, Datum, «In den Kalender»', () => {
    const html = heirat();
    expect(html).toContain('data-frist-karte="offen"');
    expect(html).toContain(esc(t('heirat.reminderTitle')));
    expect(html).toContain('Erinnerung am ');
    expect(html).toContain('In den Kalender');
  });

  it('nach «In den Kalender» geht der Fokus auf die Bestätigung (Live-Region)', () => {
    const src = readFileSync(resolve(__dirname, '..', 'AblaufSchale.jsx'), 'utf8');
    expect(src).toMatch(/ref: bestaetigung, tabIndex: -1, role: 'status'/);
    expect(src).toMatch(/if \(done && bestaetigung\.current\) bestaetigung\.current\.focus\(\)/);
  });
});

describe('Aufbau: was keine Station ist, steht unten', () => {
  const Probe = () => React.createElement(AblaufContainer, { palette, t, onNavigate: () => {}, ablauf: 'heirat', icon: 'heart', title: 'T' },
    React.createElement('p', { key: 'vorn' }, 'VORN'),
    React.createElement(AblaufStep, { key: 's1', palette, title: '1 · Eins' }, React.createElement('p', null, 'E')),
    React.createElement(AblaufStep, { key: 's2', palette, title: '2 · Zwei' }, React.createElement(AblaufLink, { palette, label: 'L', onClick: () => {} })),
    React.createElement('p', { key: 'hinten' }, 'HINTEN'),
    React.createElement(AblaufVerwandt, { key: 'v', palette, title: 'VERWANDT' }),
    React.createElement(AblaufFooter, { key: 'f', palette, t, notes: ['FUSS'] }));

  it('vorne · Pass · Schritte · danach · Verwandte · Fuss', () => {
    const html = renderToStaticMarkup(React.createElement(Probe));
    const pos = ['VORN', 'data-ablauf-pass', 'Eins', 'HINTEN', 'VERWANDT', 'FUSS'].map((x) => html.indexOf(x));
    pos.forEach((p) => expect(p).toBeGreaterThan(-1));
    expect([...pos].sort((a, b) => a - b)).toEqual(pos);
    expect(html).toContain('data-kehren="2"');
  });
});

describe('Ohne Ablauf (Notfallkarte): alles untereinander wie bisher', () => {
  it('keine Passstrasse, keine Schritt-Zeile', () => {
    const html = renderToStaticMarkup(React.createElement(NotfallVorlesekarte, { palette, t, data: {}, chapters: [], onNavigate: () => {} }));
    expect(html).not.toContain('data-ablauf-pass');
    expect(html).not.toContain('Schritt 1 von');
  });
});

describe('Passstrasse mit n Kehren', () => {
  it.each([1, 3, 4, 5, 6, 7])('%i Schritte: eine Station je Kehre, von unten nach oben, abwechselnd links/rechts', (n) => {
    const pts = passPunkte(n);
    expect(pts).toHaveLength(n);
    for (let i = 1; i < n; i++) {
      expect(pts[i].y).toBeLessThan(pts[i - 1].y);
      expect(pts[i].x < 170).toBe(i % 2 === 0);
    }
    pts.forEach((p) => { expect(p.y).toBeGreaterThan(0); expect(p.y).toBeLessThan(passHoehe(n)); });
  });
  it('die Höhe wächst mit den Schritten, mindestens 150', () => {
    expect(passHoehe(3)).toBe(150);
    expect(passHoehe(7)).toBeGreaterThan(passHoehe(6));
  });
});

describe('reiner Info-Schritt', () => {
  it('nur Text → Info; Link, Frist oder Knopf → Aktion; `info` setzt es ausdrücklich', () => {
    const s = (...kinder) => React.createElement(AblaufStep, { palette, title: 'x' }, ...kinder);
    expect(istInfoSchritt(s(React.createElement('p', null, 'a'), React.createElement('ul', null, React.createElement('li', null, 'b'))))).toBe(true);
    expect(istInfoSchritt(s(React.createElement(AblaufLink, { palette, label: 'l' })))).toBe(false);
    expect(istInfoSchritt(s(React.createElement(FristButton, { palette, t, reminder: {} })))).toBe(false);
    expect(istInfoSchritt(s(React.createElement('button', null, 'k')))).toBe(false);
    expect(istInfoSchritt(React.createElement(AblaufStep, { palette, title: 'x', info: true }, React.createElement(AblaufLink, { palette, label: 'l' })))).toBe(true);
  });
});

describe('Kapitel je Ablauf (Brotkrume)', () => {
  it('jeder Ablauf im Register hat ein Kapitel', () => {
    for (const a of ABLAEUFE) expect(CHAPTER_KEYS, a.view).toContain(ablaufKapitel(a.view));
  });
});

describe('die neuen Texte in fünf Sprachen', () => {
  const KEYS = ['weiter', 'weiterInfo', 'abschliessen', 'fertigTitel', 'zurUebersicht', 'nochmals', 'erledigt', 'fristBis', 'fristErinnerung'];
  for (const [lang, dict] of [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]]) {
    it(lang, () => {
      for (const k of KEYS) expect(typeof dict.ablauf?.[k], lang + ' ablauf.' + k).toBe('string');
      expect(dict.ablauf.fertigTitel).toContain('{n}');
      expect(dict.ablauf.fristBis).toContain('{date}');
    });
  }
});
