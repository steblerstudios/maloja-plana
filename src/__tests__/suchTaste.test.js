// Suche per Taste (10.11.2026): «/» und ⌘K bzw. Strg+K öffnen die Lupe.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { istSuchTaste, istEingabeFeld } from '../utils/suchTaste.js';

const taste = (key, mehr = {}) => ({ key, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, target: { tagName: 'BODY' }, ...mehr });
const feld = (tagName, extra = {}) => ({ tagName, ...extra });

describe('istSuchTaste', () => {
  it('«/» auf der Seite öffnet die Suche', () => {
    expect(istSuchTaste(taste('/'))).toBe(true);
  });
  it('⌘K und Strg+K öffnen die Suche, auch gross geschrieben (Feststelltaste)', () => {
    expect(istSuchTaste(taste('k', { metaKey: true }))).toBe(true);
    expect(istSuchTaste(taste('k', { ctrlKey: true }))).toBe(true);
    expect(istSuchTaste(taste('K', { ctrlKey: true }))).toBe(true);
  });
  it('⌘K wirkt auch aus einem Feld heraus — das tippt niemand als Text', () => {
    expect(istSuchTaste(taste('k', { metaKey: true, target: feld('INPUT') }))).toBe(true);
  });

  // Die Falle: «/» ist ein gewöhnliches Zeichen («50/50», «Basel/Stadt», Datum «1/2027»).
  for (const tag of ['INPUT', 'TEXTAREA', 'SELECT']) {
    it(`«/» in einem ${tag} bleibt ein Zeichen`, () => {
      expect(istSuchTaste(taste('/', { target: feld(tag) }))).toBe(false);
    });
  }
  it('«/» in einem bearbeitbaren Bereich bleibt ein Zeichen', () => {
    expect(istSuchTaste(taste('/', { target: feld('DIV', { isContentEditable: true }) }))).toBe(false);
  });

  it('ein offener Dialog hält den Fokus — keine Suche dahinter', () => {
    expect(istSuchTaste(taste('/'), { dialogOffen: true })).toBe(false);
    expect(istSuchTaste(taste('k', { metaKey: true }), { dialogOffen: true })).toBe(false);
  });
  it('mitten in einer Zeicheneingabe (z. B. Akzent oder Japanisch) nichts abfangen', () => {
    expect(istSuchTaste(taste('/', { isComposing: true }))).toBe(false);
  });
  it('schon von jemand anderem behandelt — nichts tun', () => {
    expect(istSuchTaste(taste('/', { defaultPrevented: true }))).toBe(false);
  });
  it('andere Kombinationen gehören anderen Programmen', () => {
    expect(istSuchTaste(taste('k'))).toBe(false); // nur «k»
    expect(istSuchTaste(taste('k', { metaKey: true, shiftKey: true }))).toBe(false);
    expect(istSuchTaste(taste('k', { ctrlKey: true, altKey: true }))).toBe(false);
    expect(istSuchTaste(taste('/', { ctrlKey: true }))).toBe(false);
    expect(istSuchTaste(taste('/', { altKey: true }))).toBe(false);
    expect(istSuchTaste(taste('Enter'))).toBe(false);
  });
  it('ohne Ereignis oder ohne Ziel kein Absturz', () => {
    expect(istSuchTaste(null)).toBe(false);
    expect(istSuchTaste(taste('/', { target: null }))).toBe(true);
    expect(istEingabeFeld(null)).toBe(false);
  });
});

describe('Einbau', () => {
  const main = fs.readFileSync(path.join(__dirname, '..', 'main.jsx'), 'utf8');
  const suche = fs.readFileSync(path.join(__dirname, '..', 'SearchView.jsx'), 'utf8');
  it('der Hook steht vor der Einführungs-Weiche (kein Hook hinter einem frühen return)', () => {
    const hook = main.indexOf("window.addEventListener('keydown', onKey);\n    return () => window.removeEventListener('keydown', onKey);\n  }, []);");
    const weiche = main.indexOf('if (!onboardingDone) {\n    return ');
    expect(hook).toBeGreaterThan(0);
    expect(weiche).toBeGreaterThan(hook);
  });
  it('das Suchfeld trägt die Marke, an der der Fokus landet', () => {
    expect(suche).toMatch(/'data-suchfeld': 'true'/);
    expect(main).toMatch(/document\.querySelector\('\[data-suchfeld\]'\)/);
  });
  it('die Lupe nennt die Tasten für Vorleseprogramme', () => {
    expect(main).toMatch(/'aria-keyshortcuts': isMobile \? undefined : '\/ Control\+K Meta\+K'/);
  });
});
