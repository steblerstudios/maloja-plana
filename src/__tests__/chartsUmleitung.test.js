import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';

// Seiten bündeln, Gruppe I (docs/entscheide/seiten-buendeln.md, 24.10.2026): `charts` ist keine
// eigene Seite mehr. Sie rechnete seit 21.10. wie das Kapitel Finanzen, und der Geldfluss steht
// seit 24.10. am Anfang der Auswertung dort. Alte Links, Lesezeichen und Aufrufer landen dort.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('#/charts führt ins Kapitel Finanzen', () => {
  it('der Router löst den alten Link auf: Kapitel Finanzen, Sprungmarke Auswertung', () => {
    expect(parseHash('#/charts')).toEqual({ view: 'chapter', chapterIndex: CHAPTER_KEYS.indexOf('finanzen'), anker: 'mp-finanz-auswertung' });
  });

  it('die Umleitung zeigt auf das Kapitel, das wirklich «finanzen» heisst', () => {
    expect(CHAPTER_KEYS[UMLEITUNGEN.charts.chapterIndex]).toBe('finanzen');
  });

  it('der alte View bleibt gültig — sonst liefen alte Links ins Leere', () => {
    expect(VALID_VIEWS.has('charts')).toBe(true);
  });

  it('der Geldfluss steht in der Auswertung, zu der die Sprungmarke führt', () => {
    const auswertung = quelle('components/FinanzAuswertung.jsx');
    expect(auswertung).toContain("id: 'mp-finanz-auswertung'");
    expect(auswertung).toContain('GeldflussImKapitel');
  });
});

describe('main.jsx: keine eigene Charts-Seite mehr', () => {
  const main = quelle('main.jsx');

  it('kein Render-Zweig und kein Lazy-Import', () => {
    expect(main).not.toMatch(/view === 'charts' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/ChartsAdvanced\.jsx'\)/);
  });

  it('die Komponente ist weg', () => {
    expect(fs.existsSync(path.resolve(__dirname, '..', 'ChartsAdvanced.jsx'))).toBe(false);
  });
});

describe('Werkzeug-Register', () => {
  // F7-L11 (Sophie 27.10.2026): kein eigener Eintrag mehr; die Adresse bleibt als Umleitung, das Suchwort hängt
  // am Eintrag «Finanzen & Geld».
  it('kein eigener Eintrag, die Adresse bleibt als Umleitung', () => {
    expect(WERKZEUGE.find((w) => w.view === 'charts')).toBeFalsy();
    expect(UMLEITUNGEN.charts).toBeTruthy();
    expect(WERKZEUGE.find((w) => w.view === 'finanzuebersicht').aliases).toContain('charts');
  });
});
