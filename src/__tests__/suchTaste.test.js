// Suche per Taste (10.11.2026): «/» und ⌘K bzw. Strg+K öffnen die Lupe.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { istSuchTaste, istEingabeFeld, suchTasteAnmelden, slashAn, slashSetzen, SLASH_SCHLUESSEL, kuerzelNennen } from '../utils/suchTaste.js';

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
  const feld = { markiert: false, focus() { fokus = feld; }, select() { feld.markiert = true; } };
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
    expect(f.feld.markiert).toBe(true); // ein früherer Begriff wird durch Tippen ersetzt
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
  it('abmelden entfernt die Zuhörer (Taste und Nachführen der Lupe)', () => {
    const f = fenster();
    const ab = suchTasteAnmelden(() => true, f);
    expect(f.zuhoerer.size).toBeGreaterThan(0);
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
  it('die Lupe nennt die Tasten für Vorleseprogramme (Vorgabe im Startbündel, mit «/»)', () => {
    expect(main).toMatch(/'aria-keyshortcuts': isMobile \? undefined : '\/ Control\+K Meta\+K'/);
  });
});

// WCAG 2.1.4 (Entscheid Stebler Studios 11.11.2026): «/» lässt sich abschalten, ⌘K/Strg+K bleiben.
describe('«/» abschaltbar', () => {
  const speicher = (wert) => {
    const m = new Map(wert == null ? [] : [['or5_suchtaste', wert]]);
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
  };

  it('Standard: an — auch ohne Speicher', () => {
    expect(slashAn(speicher(null))).toBe(true);
    expect(slashAn(undefined)).toBe(true);
    expect(slashAn({ getItem: () => { throw new Error('gesperrt'); } })).toBe(true);
  });

  it('aus- und wieder einschalten wird gemerkt', () => {
    const s = speicher(null);
    slashSetzen(false, s); expect(slashAn(s)).toBe(false);
    slashSetzen(true, s); expect(slashAn(s)).toBe(true);
  });

  it('abgeschaltet: «/» öffnet nichts, ⌘K und Strg+K weiter', () => {
    expect(istSuchTaste(taste('/'), { slash: false })).toBe(false);
    expect(istSuchTaste(taste('k', { metaKey: true }), { slash: false })).toBe(true);
    expect(istSuchTaste(taste('k', { ctrlKey: true }), { slash: false })).toBe(true);
  });

  it('der Zuhörer liest den Schalter bei jedem Tastendruck', () => {
    const f = fenster();
    f.localStorage = speicher('0');
    let offen = 0;
    suchTasteAnmelden(() => { offen++; return true; }, f);
    const e = ereignis('/'); f.druecke(e);
    expect(offen).toBe(0);
    expect(e.defaultPrevented).toBe(false);
    f.localStorage.setItem('or5_suchtaste', '1');
    f.druecke(ereignis('/'));
    expect(offen).toBe(1);
  });

  it('der Schalter steht in den Einstellungen unter Barrierefreiheit, in allen Sprachen', async () => {
    const quelle = fs.readFileSync(path.join(__dirname, '..', 'SettingsView.jsx'), 'utf8');
    expect(quelle).toMatch(/g\.key === 'a11y' \? \{ \.\.\.g, controls: \[\.\.\.g\.controls, slashKnopf\] \}/);
    expect(quelle).toContain("'aria-pressed': slash");
    // Die Einstellungs-Seite liest und schreibt denselben Schlüssel, ohne suchTaste.js zu importieren
    // (der Import kostete Platz im Startbündel, Vorlade-Liste).
    // Verhalten statt Zählen (a11y-Reste 16.11.2026): jeder Suchtasten-Schlüssel dort ist derselbe.
    const schluessel = quelle.match(/'or5_[a-z]*such[a-z]*'/g);
    expect(schluessel.length).toBeGreaterThan(0);
    expect(new Set(schluessel)).toEqual(new Set([`'${SLASH_SCHLUESSEL}'`]));
    expect(quelle).not.toMatch(/from '\.\/utils\/suchTaste\.js'/);
    for (const l of ['de', 'fr', 'it', 'en', 'rm']) {
      const t = (await import(`../i18n/${l}.js`)).default;
      expect(t.search.tasteSchalter, l).toMatch(/\//);
    }
  });
});

// a11y-Reste 16.11.2026: aria-keyshortcuts und Hinweis nennen «/» nur, solange die Taste an ist.
describe('Lupe nennt «/» nur, wenn es wirkt', () => {
  const knopf = (kuerzel = '/ Control+K Meta+K', titel = 'Suchen (/)') => {
    const a = { 'aria-keyshortcuts': kuerzel, title: titel };
    return { getAttribute: (k) => (k in a ? a[k] : null), setAttribute: (k, v) => { a[k] = v; }, a };
  };
  const doc = (k) => ({ querySelector: (sel) => (sel === '[aria-keyshortcuts~="Meta+K"]' ? k : null) });

  it('aus: «/» und «(/)» fallen weg, ⌘K/Strg+K bleiben', () => {
    const k = knopf();
    kuerzelNennen(doc(k), false);
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
    expect(k.a.title).toBe('Suchen');
  });
  it('wieder an: genau einmal «/» — auch mehrfach aufgerufen', () => {
    const k = knopf();
    kuerzelNennen(doc(k), false); kuerzelNennen(doc(k), true); kuerzelNennen(doc(k), true);
    expect(k.a['aria-keyshortcuts']).toBe('/ Control+K Meta+K');
    expect(k.a.title).toBe('Suchen (/)');
  });
  it('ohne Knopf (Handy, Einführung) passiert nichts', () => {
    expect(() => kuerzelNennen(doc(null), false)).not.toThrow();
    expect(() => kuerzelNennen(undefined, false)).not.toThrow();
  });
  it('das Anmelden des Zuhörers setzt den Knopf nach dem Schalter', () => {
    const k = knopf();
    const f = fenster();
    const frage = f.document.querySelector;
    f.document.querySelector = (sel) => (sel === '[aria-keyshortcuts~="Meta+K"]' ? k : frage(sel));
    f.localStorage = { getItem: () => '0', setItem: () => {} };
    suchTasteAnmelden(() => true, f);
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
  });
  it('Fokus auf die Lupe holt nach, was React zurückgesetzt hat oder der Schalter geändert hat', () => {
    const k = knopf();
    const f = fenster();
    let wert = '1';
    f.localStorage = { getItem: () => wert, setItem: () => {} };
    suchTasteAnmelden(() => true, f);
    expect(k.a['aria-keyshortcuts']).toBe('/ Control+K Meta+K');
    wert = '0';                                            // Schalter in den Einstellungen aus
    const lupe = { ...k, matches: (sel) => sel === '[aria-keyshortcuts~="Meta+K"]' };
    f.druecke({ ...ereignis('Tab'), target: lupe });     // focusin/pointerover (die Attrappe kennt keine Typen)
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
    expect(k.a.title).toBe('Suchen');
    k.a['aria-keyshortcuts'] = '/ Control+K Meta+K'; k.a.title = 'Search (/)';   // React nach Sprachwechsel
    f.druecke({ ...ereignis('Tab'), target: lupe });
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
    expect(k.a.title).toBe('Search');
  });
  // Entscheid Stebler Studios 16.11. «zuerst eine Lösung»: was React nach einem Sprachwechsel wieder setzt, holt der
  // Beobachter ein — ohne dass jemand die Lupe berührt.
  it('Sprachwechsel bei abgeschalteter Taste: der Beobachter nimmt «(/)» und «/» sofort wieder weg', () => {
    const k = knopf();
    let melde = null, beobachtet = null, getrennt = false;
    const f = fenster();
    f.document.body = {};
    const frage = f.document.querySelector;
    f.document.querySelector = (sel) => (sel === '[aria-keyshortcuts~="Meta+K"]' ? k : frage(sel));
    f.localStorage = { getItem: () => '0', setItem: () => {} };
    f.MutationObserver = class { constructor(cb) { melde = cb; } observe(ziel, opt) { beobachtet = opt; } disconnect() { getrennt = true; } };
    const ab = suchTasteAnmelden(() => true, f);
    expect(beobachtet).toMatchObject({ subtree: true, childList: true, attributeFilter: ['title', 'aria-keyshortcuts'] });
    expect(k.a.title).toBe('Suchen');
    k.a.title = 'Rechercher (/)'; k.a['aria-keyshortcuts'] = '/ Control+K Meta+K';   // React nach Wechsel auf fr
    melde([{ type: 'attributes' }]);
    expect(k.a.title).toBe('Rechercher');
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
    ab();
    expect(getrennt).toBe(true);
  });
  it('der Schalter in den Einstellungen meldet sich mit «or5:suchtaste» — die Lupe folgt sofort', () => {
    const k = knopf();
    const f = fenster();
    let wert = '1';
    const frage = f.document.querySelector;
    f.document.querySelector = (sel) => (sel === '[aria-keyshortcuts~="Meta+K"]' ? k : frage(sel));
    f.localStorage = { getItem: () => wert, setItem: () => {} };
    const ereignisse = {};
    f.addEventListener = (typ, cb) => { ereignisse[typ] = cb; };
    suchTasteAnmelden(() => true, f);
    expect(k.a.title).toBe('Suchen (/)');
    wert = '0';
    ereignisse['or5:suchtaste']();
    expect(k.a.title).toBe('Suchen');
    expect(k.a['aria-keyshortcuts']).toBe('Control+K Meta+K');
    const quelle = fs.readFileSync(path.join(__dirname, '..', 'SettingsView.jsx'), 'utf8');
    expect(quelle).toContain("window.dispatchEvent(new Event('or5:suchtaste'))");
  });
  it('schreibt nur, was sich ändert (kein Wecken des Beobachters im Kreis)', () => {
    const k = knopf('Control+K Meta+K', 'Suchen');
    let schreibe = 0;
    const set = k.setAttribute; k.setAttribute = (n, v) => { schreibe++; set(n, v); };
    kuerzelNennen({ querySelector: () => k }, false);
    expect(schreibe).toBe(0);
    kuerzelNennen({ querySelector: () => k }, true);
    expect(schreibe).toBe(2);
    kuerzelNennen({ querySelector: () => k }, true);
    expect(schreibe).toBe(2);
  });
  it('angemeldet wird auf keydown, focusin, pointerover und or5:suchtaste — abgemeldet auf allen', () => {
    const an = [], ab = [];
    const f = { document: { querySelector: () => null }, addEventListener: (typ) => an.push(typ), removeEventListener: (typ) => ab.push(typ) };
    suchTasteAnmelden(() => true, f)();
    expect(an.sort()).toEqual(['focusin', 'keydown', 'or5:suchtaste', 'pointerover']);
    expect(ab.sort()).toEqual(an);
  });
});
