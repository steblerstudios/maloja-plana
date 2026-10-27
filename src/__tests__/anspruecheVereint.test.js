import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { MIT_ANGABEN_ANKER } from '../Lebenssituationen.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { SEARCH_VIEWS, ansichtName } from '../config/ansichtenRegister.js';

// ─────────────────────────────────────────────────────────────
// Ansprüche an EINEM Ort (F7-L5, Gruppe A, docs/entscheide/seiten-buendeln.md §2 A und §7).
//
// Bis 27.10.2026 sicherte diese Datei den Entscheid vom 27.09.2026: #/schnellcheck und #/ansprueche
// zeigten dieselbe Seite (Schnellcheck mit mitLandkarte). Bewusst geändert mit Entscheid O
// (24.10.2026, VERGLEICH.md «Was steht mir zu? (O)»): beide Adressen führen jetzt auf «Was steht mir
// zu?» (situationen), zur Sprungmarke «Mit Ihren Angaben». Die Landkarte steht dort als «Weitere
// Wege» (wasStehtMirZu.test.js); der Schnellcheck bleibt nur Schritt 1 des geführten Checks.
// ─────────────────────────────────────────────────────────────

const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;

describe('#/schnellcheck und #/ansprueche führen auf «Was steht mir zu?»', () => {
  for (const alt of ['schnellcheck', 'ansprueche']) {
    it(`#/${alt} → situationen, Sprungmarke «Mit Ihren Angaben»`, () => {
      expect(parseHash('#/' + alt)).toEqual({ view: 'situationen', chapterIndex: null, anker: MIT_ANGABEN_ANKER });
    });
    it(`#/${alt} bleibt gültig — alte Links und Lesezeichen laufen nicht ins Leere`, () => {
      expect(VALID_VIEWS.has(alt)).toBe(true);
      expect(VALID_VIEWS.has(UMLEITUNGEN[alt].view)).toBe(true);
    });
  }

  it('main.jsx zeichnet keine eigene Schnellcheck-Seite mehr; handleNavigate liest UMLEITUNGEN', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'schnellcheck'/);
    expect(main).not.toMatch(/view === 'ansprueche'/);
    expect(main).toContain('const umleitung = UMLEITUNGEN[viewName];');
    expect(main).toMatch(/view === 'situationen' && React\.createElement\(Lebenssituationen/);
  });

  it('«Neben dem eigenen Stand rechnen» steht jetzt auf «Was steht mir zu?»', () => {
    expect(quelle('main.jsx')).toMatch(/SANDBOX_VIEWS = \[[^\]]*'situationen'[^\]]*\]/);
    expect(quelle('main.jsx')).not.toMatch(/SANDBOX_VIEWS = \[[^\]]*'schnellcheck'/);
  });
});

describe('Register, Rucksack, Suche: nur noch «Was steht mir zu?»', () => {
  it('kein Register-Eintrag führt auf schnellcheck, ansprueche oder anspruchcheck', () => {
    const views = SEARCH_VIEWS.map((a) => a.view);
    for (const v of ['schnellcheck', 'ansprueche', 'anspruchcheck']) expect(views).not.toContain(v);
  });
  it('Werkzeug-Register und Rucksack nennen die alten Seiten nicht', () => {
    for (const datei of ['data/werkzeugRegister.js', 'data/gepaeck.js']) {
      const s = quelle(datei);
      expect(s, datei).not.toMatch(/'schnellcheck'|'ansprueche'/);
    }
  });
  it('«Zurück zu …» nennt die alten Adressen beim neuen Namen', () => {
    for (const v of ['schnellcheck', 'ansprueche', 'situationen']) expect(ansichtName(v)).toBe('dashboard.anspruchTitle');
  });
  it('Links ausserhalb des Dashboards zeigen direkt auf situationen', () => {
    expect(quelle('Lebensbaum.jsx')).not.toContain("onNavigate('ansprueche')");
    expect(quelle('VorsorgeRechner.jsx')).not.toContain("onNavigate('schnellcheck')");
  });
});

describe('Schnellcheck = Schritt 1 des geführten Checks', () => {
  it('ohne Einkommen: die zwei Wegweiser-Listen wie bisher, keine Landkarte', () => {
    const html = renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, data: {} }));
    expect(html).toContain('schnellcheck.lageTitle');
    expect(html).not.toContain('anspruch.items.serafe.label');
    expect(html).not.toContain('schnellcheck.title');
  });
});
