// Brotkrume statt zwei Zurück-Knöpfen — Entscheid 25.09.2026 (IDEEN.md §15).
//
// Vorher in fünf Ansichten zwei Wege zurück mit verschiedenem Ziel: «Übersicht» oben
// (main.jsx) und ein eigener Knopf «Zurück zu Meine Unterlagen» / «Zurück zum Notfall».
import { describe, it, expect } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { Brotkrume, PFADE, ELTERN_TITEL, stufen } from '../components/Brotkrume.jsx';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itL from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const hol = (w, k) => k.split('.').reduce((o, s) => o?.[s], w);
const t = (k) => { const v = hol(de, k); return v && typeof v === 'object' ? v.sie : (v ?? k); };

const ANSICHTEN = { lebensmappe: 'Lebensmappe.jsx', behoerdendossier: 'BehoerdenDossier.jsx', notfalldossier: 'NotfallDossier.jsx', briefe: 'BriefGenerator.jsx', notfallpass: 'NotfallpassBlatt.jsx' };

describe('Pfade', () => {
  it('genau die fünf entschiedenen Ansichten', () => {
    expect(Object.keys(PFADE).sort()).toEqual(Object.keys(ANSICHTEN).sort());
  });
  it('jede Stufe hat eine Beschriftung in allen fünf Sprachen', () => {
    const schluessel = ['nav.backToDashboard', 'nav.pfad', ...Object.values(ELTERN_TITEL), ...Object.values(PFADE).map((p) => p.titel)];
    for (const [lang, w] of Object.entries({ de, fr, it: itL, en, rm })) {
      for (const k of schluessel) expect(hol(w, k), lang + ' ' + k).toBeTruthy();
    }
  });
  it('Ansicht und Eltern gibt es in main.jsx wirklich', () => {
    const main = lies('main.jsx');
    for (const v of [...Object.keys(PFADE), ...new Set(Object.values(PFADE).map((p) => p.eltern))]) {
      expect(main, v).toMatch(new RegExp("view === '" + v + "' && React\\.createElement"));
    }
  });
  it('drei Stufen: Übersicht › Eltern › hier', () => {
    expect(stufen('briefe').map((s) => s.ziel)).toEqual(['dashboard', 'unterlagen', null]);
    expect(stufen('notfallpass').map((s) => s.ziel)).toEqual(['dashboard', 'notfalleinstieg', null]);
    expect(stufen('dashboard')).toBeNull();
    expect(stufen('tax')).toBeNull();
  });
});

describe('Darstellung', () => {
  const html = renderToStaticMarkup(React.createElement(Brotkrume, { palette: { mid: '#555', text: '#111', border: '#ccc' }, t, view: 'behoerdendossier', onNavigate: () => {} }));
  it('nav mit Namen, geordnete Liste, aktuelle Seite markiert', () => {
    expect(html).toMatch(/^<nav aria-label="Pfad"/);
    expect(html).toContain('<ol');
    expect(html).toMatch(/aria-current="page"[^>]*>Behörden-Dossier|aria-current="page"[^>]*>[^<]+<\/span><\/li><\/ol>/);
  });
  it('die Stufen davor sind Knöpfe, die letzte nicht', () => {
    expect((html.match(/<button/g) || []).length).toBe(2);
    expect(html).toContain('>Übersicht</button>');
    expect(html).toContain('>Meine Unterlagen</button>');
  });
  it('Tippfläche mindestens 44 px (App-Massstab; WCAG 2.5.8 verlangt 24)', () => {
    expect(html).toMatch(/<button[^>]*min-height:44px/);
  });
});

describe('ein Weg zurück', () => {
  it('main.jsx lässt in diesen Ansichten «Übersicht» weg und navigiert sonst über handleNavigate', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/view !== 'dashboard' && !PFADE\[view\] && React\.createElement\('button', \{\s*onClick: \(\) => handleNavigate\('dashboard'\)/);
  });
  it('die Darstellung liegt NICHT im Hauptbündel: main.jsx importiert nur die Pfade', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/import \{ PFADE \} from '\.\/config\/brotkrumePfade\.js'/);
    expect(main).not.toMatch(/components\/Brotkrume/);
  });
  it('jede der fünf Ansichten zeichnet ihre Brotkrume mit dem eigenen Namen', () => {
    for (const [v, datei] of Object.entries(ANSICHTEN)) {
      expect(lies(datei), datei).toMatch(new RegExp("createElement\\(Brotkrume, \\{ palette, t, view: '" + v + "', onNavigate \\}\\)"));
    }
  });
  it('die fünf Ansichten haben keinen eigenen Zurück-Knopf mehr', () => {
    for (const [v, datei] of Object.entries(ANSICHTEN)) {
      const q = lies(datei);
      expect(q, datei).not.toMatch(new RegExp("onNavigate\\('" + PFADE[v].eltern + "'\\)"));
      expect(q, datei).not.toMatch(/zurueckZeichen\(\)/);
    }
  });
});
