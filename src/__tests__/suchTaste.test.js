// Suche per Taste (10.11.2026): «/» und ⌘K bzw. Strg+K öffnen die Lupe.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { istSuchTaste, istEingabeFeld, suchTasteAnmelden } from '../utils/suchTaste.js';

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

// Ein Ersatz-Fenster: Zuhörer, Bilder (requestAnimationFrame) und Dokument von Hand.
const fenster = ({ dialog = false, feldAbBild = 0 } = {}) => {
  const zuhoerer = new Set(), bilder = [];
  let bild = 0, fokus = null;
  const feld = { focus() { fokus = feld; } };
  const document = {
    get activeElement() { return fokus; },
    querySelector: (sel) => (sel === '[aria-modal="true"]' ? (dialog ? {} : null)
      : sel === '[data-suchfeld]' ? (bild >= feldAbBild ? feld : null) : null),
  };
  return {
    document, feld, zuhoerer,
    get fokus() { return fokus; },
    get anstehend() { return bilder.length; },
    addEventListener: (_, f) => zuhoerer.add(f),
    removeEventListener: (_, f) => zuhoerer.delete(f),
    requestAnimationFrame: (f) => bilder.push(f),
    druecke(e) { zuhoerer.forEach(f => f(e)); },
    bilderLaufen(n = 100) { for (let i = 0; i < n && bilder.length; i++) { bild++; bilder.splice(0).forEach(f => f()); } },
  };
};
const ereignis = (key, mehr) => ({ ...taste(key, mehr), defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } });

describe('suchTasteAnmelden', () => {
  it('«/» öffnet die Suche, verhindert das Zeichen und legt den Fokus ins Suchfeld', () => {
    const f = fenster(); let offen = 0;
    suchTasteAnmelden(() => { offen++; return true; }, f);
    const e = ereignis('/'); f.druecke(e);
    expect(offen).toBe(1);
    expect(e.defaultPrevented).toBe(true);
    f.bilderLaufen();
    expect(f.fokus).toBe(f.feld);
  });
  it('lädt die Suchansicht erst nach, wartet sie auf das Feld', () => {
    const f = fenster({ feldAbBild: 10 });
    suchTasteAnmelden(() => true, f);
    f.druecke(ereignis('k', { metaKey: true }));
    f.bilderLaufen(5); expect(f.fokus).toBe(null);
    f.bilderLaufen(); expect(f.fokus).toBe(f.feld);
  });
  it('gibt nach rund einer Sekunde auf, statt endlos zu suchen', () => {
    const f = fenster({ feldAbBild: 1000 });
    suchTasteAnmelden(() => true, f);
    f.druecke(ereignis('/'));
    f.bilderLaufen(500);
    expect(f.fokus).toBe(null);
    // Die Sache: es steht kein weiteres Bild mehr an. Am Fokus allein sähe man das nicht
    // (Mutationsprobe: «endlos suchen» blieb mit der ersten Fassung grün).
    expect(f.anstehend).toBe(0);
  });
  it('in der Einführung (oeffnen meldet false) bleibt «/» ein Zeichen', () => {
    const f = fenster();
    suchTasteAnmelden(() => false, f);
    const e = ereignis('/'); f.druecke(e);
    expect(e.defaultPrevented).toBe(false);
  });
  it('hinter einem offenen Dialog: nichts', () => {
    const f = fenster({ dialog: true }); let offen = 0;
    suchTasteAnmelden(() => { offen++; return true; }, f);
    f.druecke(ereignis('/'));
    expect(offen).toBe(0);
  });
  it('abmelden entfernt den Zuhörer', () => {
    const f = fenster();
    const ab = suchTasteAnmelden(() => true, f);
    expect(f.zuhoerer.size).toBe(1);
    ab();
    expect(f.zuhoerer.size).toBe(0);
  });
});

describe('Einbau', () => {
  const main = fs.readFileSync(path.join(__dirname, '..', 'main.jsx'), 'utf8');
  const suche = fs.readFileSync(path.join(__dirname, '..', 'SearchView.jsx'), 'utf8');
  it('nachgeladen, nicht ins Startbündel gezogen (sonst über der 65-kB-Grenze)', () => {
    expect(main).toMatch(/import\('\.\/utils\/suchTaste\.js'\)/);
    expect(main).not.toMatch(/^import [^\n]*suchTaste/m);
  });
  it('der Hook steht vor der Einführungs-Weiche (kein Hook hinter einem frühen return)', () => {
    const hook = main.indexOf("import('./utils/suchTaste.js')");
    const weiche = main.indexOf('if (!onboardingDone) {\n    return ');
    expect(hook).toBeGreaterThan(0);
    expect(weiche).toBeGreaterThan(hook);
  });
  it('das Suchfeld trägt die Marke, an der der Fokus landet', () => {
    expect(suche).toMatch(/'data-suchfeld': 'true'/);
  });
  it('die Lupe nennt die Tasten für Vorleseprogramme', () => {
    expect(main).toMatch(/'aria-keyshortcuts': isMobile \? undefined : '\/ Control\+K Meta\+K'/);
  });
});
