import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LIGHT_PALETTE } from '../config/constants.js';
import BergLandschaft, { STATIONEN, TAL_PLAETZE } from '../components/BergLandschaft.jsx';

// ─────────────────────────────────────────────────────────────
// Wanderrucksack (Entscheide 27.09.2026)
//
// · Am Computer steht er als Kreis auf der linken Tal-Strasse im Bergpanorama —
//   ein Zugang, kein Kapitel: kein Fortschrittsring, kein Weg dorthin.
// · Am Handy liegt das Tal ausserhalb des Ausschnitts; dort steht er in der unteren
//   Leiste neben der Übersicht (sechs Plätze, rechts die Suche vor dem Menü).
// · Er heisst «Wanderrucksack» (vorher «Mein Gepäck»).
// ─────────────────────────────────────────────────────────────

const KAPITEL = STATIONEN.map((s) => ({ key: s.key, title: s.key }));
const rendern = (talStationen) => renderToStaticMarkup(React.createElement(BergLandschaft, {
  palette: LIGHT_PALETTE, chapters: KAPITEL, chapterCompletions: [0, 0, 0, 0, 0, 0, 0], completion: 0,
  onSelectChapter: () => {}, lang: 'de', hyphenStyle: {}, titel: 'T',
  fortschritt: { begonnen: 0, abgeschlossen: 0, gesamt: 7 }, fortschrittLabels: {}, prozent: 0,
  talStationen,
}));
const src = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('Wanderrucksack · Panorama, untere Leiste, Name', () => {
  it('der Kreis auf der Tal-Strasse erscheint mit Namen und ohne Fortschrittsring', () => {
    const ohne = rendern([]);
    const mit = rendern([{ key: 'gepaeck', label: 'Wanderrucksack', zeichen: () => null, farbe: LIGHT_PALETTE.gold, onClick: () => {} }]);
    expect(ohne).not.toContain('Wanderrucksack');
    expect(mit).toContain('aria-label="Wanderrucksack"');
    // Stationen tragen je einen Ring (data-ring); der Rucksack fügt keinen hinzu.
    expect((mit.match(/data-ring=/g) || []).length).toBe((ohne.match(/data-ring=/g) || []).length);
  });

  it('der erste Tal-Platz liegt rechts der Passstrasse (im Tal), nicht auf einer Station', () => {
    const [platz] = TAL_PLAETZE;
    expect(platz.x).toBeGreaterThan(Math.max(...STATIONEN.map((s) => s.x)) + 100);
  });

  it('das Dashboard gibt den Wanderrucksack ins Panorama und führt ins Gepäck', () => {
    expect(src('Dashboard.jsx')).toMatch(/talStationen: \[\s*\{ key: 'gepaeck', label: t\('gepaeck\.link'\)[^}]*onNavigate\('gepaeck'\)/);
  });

  it('untere Leiste: Übersicht · Rucksack · Kalender | + | Anspruch · Suche · Menü', () => {
    expect(src('main.jsx')).toContain(': [left1, leftR, left2, center, right1, rightS, right2];');
  });

  it('der Name ist in allen fünf Sprachen umgestellt', () => {
    const erwartet = { de: 'Wanderrucksack', fr: 'Sac à dos de randonnée', it: 'Zaino da escursione', en: 'Hiking backpack', rm: 'Sac à dos de randonnée' };
    for (const [l, name] of Object.entries(erwartet)) {
      const i18n = src(`i18n/${l}.js`);
      const block = i18n.slice(i18n.indexOf('\n  gepaeck: {'));
      expect(block, l).toContain(`title: '${name}'`);
      expect(block, l).toContain(`link: '${name}'`);
    }
  });
});
