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
import { UMLEITUNGEN } from '../utils/hashRouter.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itL from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const hol = (w, k) => k.split('.').reduce((o, s) => o?.[s], w);
const t = (k) => { const v = hol(de, k); return v && typeof v === 'object' ? v.sie : (v ?? k); };

const ANSICHTEN = { lebensmappe: 'Lebensmappe.jsx', behoerdendossier: 'BehoerdenDossier.jsx', notfalldossier: 'NotfallDossier.jsx', briefe: 'BriefGenerator.jsx', notfallpass: 'NotfallpassBlatt.jsx', notfallkarte: 'NotfallVorlesekarte.jsx', praemien: 'PraemienOrientierung.jsx' };

describe('Pfade', () => {
  // Seit Runde 9 AE («ein Ort», 25.10.2026) auch die Notfallkarte; das Notfall-Dossier hängt unter Notfall.
  // Seit Runde 9 AB (25.10.2026) auch die Versicherungs-Übersicht, unter dem Kapitel Versicherungen.
  it('genau die sieben entschiedenen Ansichten', () => {
    expect(Object.keys(PFADE).sort()).toEqual(Object.keys(ANSICHTEN).sort());
  });
  it('jede Stufe hat eine Beschriftung in allen fünf Sprachen', () => {
    const schluessel = ['nav.backToDashboard', 'nav.pfad', ...Object.values(ELTERN_TITEL), ...Object.values(PFADE).map((p) => p.titel)];
    for (const [lang, w] of Object.entries({ de, fr, it: itL, en, rm })) {
      for (const k of schluessel) expect(hol(w, k), lang + ' ' + k).toBeTruthy();
    }
  });
  // Eine Eltern-Stufe darf auch eine Umleitung sein (UMLEITUNGEN): seit 24.10.2026 ist
  // `notfalleinstieg` keine eigene Seite mehr, die Stufe «Notfall» führt ins Kapitel Notfall.
  it('Ansicht und Eltern gibt es in main.jsx wirklich (oder als Umleitung)', () => {
    const main = lies('main.jsx');
    for (const v of Object.keys(PFADE)) {
      expect(main, v).toMatch(new RegExp("view === '" + v + "' && React\\.createElement"));
    }
    for (const v of new Set(Object.values(PFADE).map((p) => p.eltern))) {
      if (UMLEITUNGEN[v]) continue;
      expect(main, v).toMatch(new RegExp("view === '" + v + "' && React\\.createElement"));
    }
  });
  it('drei Stufen: Übersicht › Eltern › hier', () => {
    expect(stufen('briefe').map((s) => s.ziel)).toEqual(['dashboard', 'tresor', null]);
    expect(stufen('notfallpass').map((s) => s.ziel)).toEqual(['dashboard', 'notfalleinstieg', null]);
    expect(stufen('notfalldossier').map((s) => s.ziel)).toEqual(['dashboard', 'notfalleinstieg', null]);
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
    expect(html).toContain('>Dokumentenablage</button>'); // F7-S4
  });
  it('Tippfläche mindestens 44 px (App-Massstab; WCAG 2.5.8 verlangt 24)', () => {
    expect(html).toMatch(/<button[^>]*min-height:44px/);
  });
});

describe('ein Weg zurück', () => {
  it('Logo-Knopf und «Übersicht» navigieren über handleNavigate (Sprung nach oben, Fokus)', () => {
    const main = lies('main.jsx');
    expect(main).toMatch(/onClick: \(\) => handleNavigate\('dashboard'\),\s*'aria-label': t\('common\.appName'\)/);
  });
  it('InstallGuide trägt keinen zweiten Zurück-Knopf unter «Übersicht»', () => {
    expect(lies('InstallGuide.jsx')).not.toMatch(/onNavigate\('dashboard'\)/);
  });
  // Seit 27.09.2026: kam man von der Übersicht, führt «Übersicht» per history.back() an die
  // alte Stelle zurück; sonst weiter über handleNavigate (Sprung nach oben, Fokus).
  it('main.jsx lässt in diesen Ansichten «Übersicht» weg und navigiert sonst über handleNavigate', () => {
    const main = lies('main.jsx');
    // Fassung 5: der Umzug zeichnet seine Brotkrume im eigenen Kopf (AblaufSchale `kopf`); seit dem Muster
    // M5 (25.10.2026) auch die Kapitel («Übersicht › Kapitel» im Band, ChapterView), seit Fassung G
    // (27.10.2026) auch «Was ansteht» (CalendarReminders); seit F7-A2 (27.10.2026) die Rechner in der Form X
    // (RECHNER_KAPITEL, components/RechnerForm.jsx — Entscheid X: Brotkrume im Kopf des Rechners).
    expect(main).toMatch(/view !== 'dashboard' && !PFADE\[view\] && !RECHNER_KAPITEL\[view\] && view !== 'umzug' && view !== 'chapter' && view !== 'calendar' && React\.createElement\('button', \{\s*onClick: \(\) => \(herkunft && herkunft\.view === 'dashboard' \? window\.history\.back\(\) : handleNavigate\('dashboard'\)\)/);
  });
  it('die Darstellung liegt NICHT im Hauptbündel: main.jsx importiert nur die Pfade', () => {
    const main = lies('main.jsx');
    // RECHNER_KAPITEL sind ebenfalls nur Daten (F7-A2, 27.10.2026).
    expect(main).toMatch(/import \{ PFADE, RECHNER_KAPITEL \} from '\.\/config\/brotkrumePfade\.js'/);
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
