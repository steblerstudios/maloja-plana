// Menü-Suche mit Treffern zeichnen (Befund 06.11.2026): Nach #713 «eine Quelle für alle Zeichen»
// stand in MobileNav.jsx noch `v.view === 'gepaeck' ? rucksack : v.icon` — die Konstante
// `rucksack` gab es nicht mehr. Fand die Suche den Rucksack, warf das Menü einen ReferenceError.
// Die übrigen Menü-Tests zeichnen nur das leere Suchfeld; dieser zeichnet Treffer.
//
// Kein DOM (vitest ohne jsdom): das Suchwort wird über den ersten useState('') gesetzt —
// MobileNav hat genau einen, das Suchfeld (Wächter unten).
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';

const SUCHWORT = { wert: '' };
vi.mock('react', async (original) => {
  const echt = await original();
  const useState = (anfang) => echt.useState(anfang === '' ? SUCHWORT.wert : anfang);
  return { ...echt, default: { ...echt.default, useState }, useState };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const { createT } = await import('../i18n/index.js');
const de = (await import('../i18n/de.js')).default;
const { LIGHT_PALETTE, getChapters } = await import('../config/constants.js');
const { MobileNav } = await import('../MobileNav.jsx');

const zeichne = (suchwort) => {
  SUCHWORT.wert = suchwort;
  const t = createT({ de }, 'de', 'sie');
  return renderToStaticMarkup(React.createElement(MobileNav, {
    palette: LIGHT_PALETTE, t, isOpen: true, onClose: () => {}, onNavigate: () => {},
    activeView: 'dashboard', activeChapter: 0, chapters: getChapters(t), completion: 63,
    onToggleSimpleView: () => {}, feedbackHref: 'mailto:info@malojaplana.ch',
  }));
};

describe('Menü-Suche zeichnet Treffer', () => {
  it('MobileNav hat genau ein useState(\'\') — das Suchfeld (sonst trifft der Kniff oben das Falsche)', () => {
    const src = readFileSync(new URL('../MobileNav.jsx', import.meta.url), 'utf8');
    expect(src.match(/useState\(''\)/g)).toHaveLength(1);
  });

  for (const wort of ['ruck', 'heirat', 'steuer', 'einstellungen']) {
    it(`«${wort}»: Menü zeichnet ohne Fehler und zeigt Treffer`, () => {
      const html = zeichne(wort);
      expect(html).not.toContain('no-results');
      expect(html).toMatch(/<button/);
    });
  }

  it('«ruck» findet den Rucksack', () => {
    expect(zeichne('ruck')).toContain(de.gepaeck.menuAlle.sie ?? de.gepaeck.menuAlle);
  });
});
