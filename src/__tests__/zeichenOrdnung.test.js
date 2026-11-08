import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icons } from '../IconKern.jsx';
import '../IconSystem.jsx';
import { ICON_INVENTAR, GRUPPEN } from '../config/iconInventar.js';
import { alleWege } from '../data/gepaeck.js';
import { ansichtIkon, seitenZeichenName, SEITEN_BEREICH } from '../config/ansichtenRegister.js';

// Icon-Plan November 2026, Schritt 7 «Aufräumen» (Auftrag Stebler Studios 06.11.2026: «lass uns
// Logik, System und Einheit in das Ganze bringen»). Grundlage: docs/design/icon-inventar-2026-11-06.html.
//
// 7a  Jedes Icon steht in EINER Liste (config/iconInventar.js) mit Gruppe und Bedeutung.
// 7b  Die Lebensereignisse haben ein eigenes Zeichen — das aus dem Rucksack — und tragen es
//     überall: Rucksack, Suche, Übersicht, Seitentitel. Vorher zeigten Suche und Übersicht
//     9× die Helvetia, 5× das Haus, 3× das Herz für verschiedene Ereignisse.
// 7c  Doppelte aufgelöst: die zweite Glocke ist weg, `mappe` (Schritt 3) ist weg.

const SRC = resolve(__dirname, '..');
const wurzel = (name) => renderToStaticMarkup(React.createElement(Icons[name])).match(/<svg[^>]*>/)[0];
const istStrich = (name) => /fill="none"/.test(wurzel(name)) && /stroke="/.test(wurzel(name));

describe('7a · eine Liste für alle Zeichen', () => {
  it('jedes Icon im Register steht in der Liste, und die Liste nennt keines, das es nicht gibt', () => {
    // Die Seiten-Zeichen `seite:<view>` (Bauplan B4) sind erzeugt, nicht gezeichnet: ihr Inventar ist
    // config/seitenZeichen.js mit eigenem Wächter (seitenZeichen.test.js, abzeichen.test.js).
    const gezeichnet = Object.keys(Icons).filter((n) => !n.startsWith('seite:'));
    expect(Object.keys(ICON_INVENTAR).sort()).toEqual(gezeichnet.sort());
    expect(Object.keys(Icons).filter((n) => n.startsWith('seite:')).sort())
      .toEqual([...SEITEN_BEREICH.keys()].map(seitenZeichenName).sort());
  });
  it('jeder Eintrag hat eine bekannte Gruppe und eine Bedeutung in Worten', () => {
    for (const [name, e] of Object.entries(ICON_INVENTAR)) {
      expect(Object.keys(GRUPPEN), name).toContain(e.gruppe);
      expect(typeof e.bedeutung === 'string' && e.bedeutung.length > 3, name).toBe(true);
    }
  });
  it('Strich-Gruppen (Funktion, Navigation, Barrierefreiheit, Ereignis) sind wirklich Strich', () => {
    const falsch = Object.entries(ICON_INVENTAR)
      .filter(([, e]) => GRUPPEN[e.gruppe].strich)
      .filter(([n]) => !istStrich(n))
      .map(([n, e]) => `${n} (${e.gruppe})`);
    expect(falsch).toEqual([]);
  });
});

describe('7b · ein Lebensereignis, ein Zeichen', () => {
  const wege = alleWege();
  it('findet die Wege überhaupt (sonst prüft der Wächter die leere Menge)', () => {
    expect(wege.length).toBeGreaterThan(35);
  });
  it('jeder Weg im Rucksack nennt ein Register-Zeichen der Gruppe E, statt eigene Pfade zu zeichnen', () => {
    for (const w of wege) {
      expect(w.g, w.key).toBeUndefined();
      expect(ICON_INVENTAR[w.icon]?.gruppe, w.key).toBe('E');
    }
  });
  // Seit Bauplan B4 (08.11.2026) tragen Suche, Übersicht und Seitenkopf das Seiten-Zeichen
  // (Leitform + Abzeichen), Kapitel für Kapitel — und der Rucksack auch (Entscheid «B, hell mit
  // Rand»: er liest ansichtIkon wie alle, siehe seitenZeichenRegister.test.js).
  it('Suche und Übersicht zeigen für das Ereignis dasselbe Zeichen wie der Rucksack — oder das Seiten-Zeichen', () => {
    const anders = wege.filter((w) => ansichtIkon(w.view) !== w.icon && ansichtIkon(w.view) !== seitenZeichenName(w.view))
      .map((w) => `${w.view}: ${ansichtIkon(w.view)} ≠ ${w.icon}`);
    expect(anders).toEqual([]);
  });
  it('der Seitentitel eines Ablaufs nimmt sein Zeichen aus dem Register', () => {
    expect(readFileSync(resolve(SRC, 'AblaufSchale.jsx'), 'utf8')).toMatch(/ansichtIkon\(ablauf, icon\)/);
  });
  it('kein Ereignis-Zeichen steht doppelt (zwei Ereignisse, ein Bild)', () => {
    const e = Object.keys(ICON_INVENTAR).filter((n) => ICON_INVENTAR[n].gruppe === 'E');
    const bilder = e.map((n) => renderToStaticMarkup(React.createElement(Icons[n])));
    expect(new Set(bilder).size).toBe(e.length);
  });
});

describe('7c · Doppelte aufgelöst', () => {
  it('nur noch eine Glocke: die Kuhglocke für Erinnerungen', () => {
    expect(Icons.emergency).toBeUndefined();
    expect(ICON_INVENTAR.cowbell.bedeutung).toMatch(/Erinnerung/);
  });
  it('Behörden ist die Helvetia', () => {
    expect(ICON_INVENTAR.behoerden.bedeutung).toMatch(/Helvetia/);
  });
});
