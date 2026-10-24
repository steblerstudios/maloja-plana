import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';

// Zusammenlegung Kapitel Finanzen + Finanz-Übersicht, Bauschritt 4 (docs/entscheide/finanzen-fusion.md):
// `finanzuebersicht` ist keine eigene Seite mehr, sondern ein Alias für «Kapitel Finanzen, bei der
// Auswertung». Alte Links, Lesezeichen, die Zurück-Taste und alle Aufrufer landen dort.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('#/finanzuebersicht führt ins Kapitel Finanzen', () => {
  it('der Router löst den alten Link auf: Kapitel Finanzen, Sprungmarke Auswertung', () => {
    expect(parseHash('#/finanzuebersicht')).toEqual({ view: 'chapter', chapterIndex: CHAPTER_KEYS.indexOf('finanzen'), anker: 'mp-finanz-auswertung' });
  });

  it('die Umleitung zeigt auf das Kapitel, das wirklich «finanzen» heisst', () => {
    expect(CHAPTER_KEYS[UMLEITUNGEN.finanzuebersicht.chapterIndex]).toBe('finanzen');
  });

  it('der alte View bleibt gültig — sonst liefen alte Links und Aufrufer ins Leere', () => {
    expect(VALID_VIEWS.has('finanzuebersicht')).toBe(true);
  });

  it('die Sprungmarke gibt es im Kapitel', () => {
    expect(quelle('components/FinanzAuswertung.jsx')).toContain("id: 'mp-finanz-auswertung'");
  });

  it('andere Links bleiben, wie sie sind', () => {
    expect(parseHash('#/chapter/2')).toEqual({ view: 'chapter', chapterIndex: 2 });
    expect(parseHash('#/tax')).toEqual({ view: 'tax', chapterIndex: null });
  });
});

describe('main.jsx: keine eigene Übersicht-Seite mehr', () => {
  const main = quelle('main.jsx');

  it('handleNavigate leitet um, bevor es eine Ansicht setzt', () => {
    expect(main).toMatch(/const handleNavigate = \(viewName, chapterIdx, extra\) => \{\s*const umleitung = UMLEITUNGEN\[viewName\];/);
  });

  it('kein Render-Zweig und kein Lazy-Import der Übersicht', () => {
    expect(main).not.toMatch(/view === 'finanzuebersicht' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/FinanzUebersicht\.jsx'\)/);
  });

  it('der Probiermodus-Knopf hängt nicht mehr an einer Seite, die es nicht gibt', () => {
    const zeile = main.split('\n').find((z) => z.includes('const SANDBOX_VIEWS'));
    expect(zeile).not.toContain("'finanzuebersicht'");
  });

  it('nach dem Umleiten springt die Seite zur Auswertung', () => {
    expect(main).toContain('springeZuAnker(');
  });
});

describe('Werkzeug-Register', () => {
  const eintrag = WERKZEUGE.find((w) => w.view === 'finanzuebersicht');

  it('der Eintrag führt weiter über die Umleitung (Menü, Suche, Dashboard bleiben gleich)', () => {
    expect(eintrag).toBeTruthy();
    expect(UMLEITUNGEN[eintrag.view]).toBeTruthy();
  });

  it('kein Suchwort «finanzen» mehr — sonst stünde das Kapitel Finanzen doppelt in der Suche', () => {
    expect(eintrag.aliases).not.toContain('finanzen');
  });
});
