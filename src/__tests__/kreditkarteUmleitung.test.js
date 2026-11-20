import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { Kreditkarte } from '../Kreditkarte.jsx';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';

// Seitenrunde Finanzen (Stebler Studios 20.11.2026, _werkbank/SEITEN-FINANZEN-2026-11-20.md, F1): «Lohnt sich die
// Karte?» ist keine eigene Seite mehr, sondern ein aufklappbarer Teil im Kapitel Finanzen. Alte Links, die Suche,
// das Menü und der Verweis aus «18 werden» landen dort.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

describe('#/kreditkarte führt ins Kapitel Finanzen', () => {
  it('der Router löst den alten Link auf: Kapitel Finanzen, Sprungmarke Kreditkarte', () => {
    expect(parseHash('#/kreditkarte')).toEqual({ view: 'chapter', chapterIndex: CHAPTER_KEYS.indexOf('finanzen'), anker: 'mp-kreditkarte' });
  });

  it('die Umleitung zeigt auf das Kapitel, das wirklich «finanzen» heisst', () => {
    expect(CHAPTER_KEYS[UMLEITUNGEN.kreditkarte.chapterIndex]).toBe('finanzen');
  });

  it('der alte View bleibt gültig — sonst liefen alte Links ins Leere', () => {
    expect(VALID_VIEWS.has('kreditkarte')).toBe(true);
  });

  it('die Sprungmarke ist ein <details> im Kapitel, das den Rechner eingebettet lädt', () => {
    const kapitel = quelle('ChapterView.jsx');
    expect(kapitel).toMatch(/React\.createElement\('details', \{\s*key: 'kreditkarte', id: 'mp-kreditkarte'/);
    expect(kapitel).toContain("import('./Kreditkarte.jsx')");
    expect(kapitel).toContain('eingebettet: true');
  });
});

describe('main.jsx: keine eigene Kreditkarten-Seite mehr', () => {
  const main = quelle('main.jsx');
  it('kein Render-Zweig und kein Lazy-Import', () => {
    expect(main).not.toMatch(/view === 'kreditkarte' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/Kreditkarte\.jsx'\)/);
  });
});

describe('Werkzeug-Register', () => {
  it('der Eintrag bleibt für Suche und Menü, seine Adresse ist eine Umleitung', () => {
    expect(WERKZEUGE.find((w) => w.view === 'kreditkarte')).toBeTruthy();
    expect(UMLEITUNGEN.kreditkarte).toBeTruthy();
  });
});

describe('eingebettet: ohne eigenen Seitenkopf', () => {
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const t = createT({ de }, 'de');
  const render = (props) => renderToStaticMarkup(React.createElement(Kreditkarte, { palette, t, data: {}, onUpdateData: () => {}, onNavigate: () => {}, ...props }));

  it('als Seite: Brotkrume und Seitentitel', () => {
    const html = render({});
    expect(html).toContain('<nav');
    expect(html).toContain('aria-current="page"');
  });

  it('im Kapitel: kein zweiter Seitentitel, keine Brotkrume, der Satz bleibt', () => {
    const html = render({ eingebettet: true });
    expect(html).not.toContain('<nav');
    expect(html).not.toContain('aria-current="page"');
    expect(html).toContain(de.kreditkarteView.intro.slice(0, 20));
  });
});
