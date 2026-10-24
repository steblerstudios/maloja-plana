import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS, getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { NotfallImKapitel, NOTFALL_ANKER, SCENARIOS } from '../components/NotfallImKapitel.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

// Seiten bündeln, Gruppe D (docs/entscheide/seiten-buendeln.md, Entscheid 4, 24.10.2026): der
// Notfall-Einstieg ist keine eigene Seite mehr, sondern steht im Kapitel Notfall — oben Vorlesekarte
// und Notfallpass, unten die drei Lagen. Die Vorlesekarte bleibt eigene Seite.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const chapters = getChapters(t);
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const zeichne = (teil, data = DEMO_DATA, onNavigate = () => {}) =>
  renderToStaticMarkup(React.createElement(NotfallImKapitel, { teil, palette: LIGHT_PALETTE, t, data, chapters, onNavigate }));

describe('#/notfalleinstieg führt ins Kapitel Notfall', () => {
  it('der Router löst den alten Link auf: Kapitel Notfall, oben beim Ernstfall', () => {
    expect(parseHash('#/notfalleinstieg')).toEqual({ view: 'chapter', chapterIndex: CHAPTER_KEYS.indexOf('notfall'), anker: NOTFALL_ANKER });
  });

  it('die Umleitung zeigt auf das Kapitel, das wirklich «notfall» heisst', () => {
    expect(CHAPTER_KEYS[UMLEITUNGEN.notfalleinstieg.chapterIndex]).toBe('notfall');
  });

  it('der alte View bleibt gültig — Dashboard, Lebensbaum, Abläufe und Brotkrume rufen ihn weiter auf', () => {
    expect(VALID_VIEWS.has('notfalleinstieg')).toBe(true);
  });

  it('die Vorlesekarte bleibt eigene Seite (Entscheid 4)', () => {
    expect(UMLEITUNGEN.notfallkarte).toBeUndefined();
    expect(quelle('main.jsx')).toMatch(/view === 'notfallkarte' && React\.createElement/);
  });
});

describe('Kapitel Notfall, oben: der Ernstfall mit einem Griff', () => {
  it('Vorlesekarte und Notfallpass stehen mit der Sprungmarke da', () => {
    const html = zeichne('oben');
    expect(html).toContain(`id="${NOTFALL_ANKER}"`);
    expect(html).toContain(esc(t('notfallEinstieg.vorlesekarteTitle')));
    expect(html).toContain(esc(t('notfallpass.einstiegTitel')));
  });

  it('die Knöpfe führen zur Vorlesekarte und zum Notfallpass', () => {
    const src = quelle('components/NotfallImKapitel.jsx');
    expect(src).toContain("onNavigate('notfallkarte')");
    expect(src).toContain("onNavigate('notfallpass')");
  });

  it('der obere Teil steht gleich nach dem Kopf, vor dem Formular', () => {
    const cv = quelle('ChapterView.jsx');
    expect(cv.indexOf("NotfallImKapitel, { teil: 'oben'")).toBeLessThan(cv.indexOf('React.createElement(MirrorCards'));
  });
});

describe('Kapitel Notfall, unten: die drei Lagen', () => {
  it('alle drei Lagen mit Titel und Zähler', () => {
    const html = zeichne('unten');
    expect(html).toContain(esc(t('notfallEinstieg.title')));
    for (const s of SCENARIOS) expect(html).toContain(esc(t('notfallEinstieg.' + s.key + '.title')));
    expect(html).toMatch(/\d+\/9/);
  });

  it('ohne Angaben: nur andere Kapitel bekommen einen Knopf — das eigene steht im Formular darüber', () => {
    const html = zeichne('unten', {});
    const titel = Object.fromEntries(chapters.map((c) => [c.key, c.title]));
    for (const k of ['basis', 'wohnen', 'versicherungen', 'behoerden']) expect(html).toContain('>' + esc(titel[k]) + '</button>');
    expect(html).not.toContain('>' + esc(titel.notfall) + '</button>');
  });

  it('ein Knopf führt ins richtige Kapitel', () => {
    const src = quelle('components/NotfallImKapitel.jsx');
    expect(src).toContain("onNavigate('chapter', CHAPTER_KEYS.indexOf(chapterKey))");
  });
});

describe('main.jsx: keine eigene Einstiegs-Seite mehr', () => {
  it('kein Render-Zweig, kein Lazy-Import, keine Datei', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'notfalleinstieg' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/NotfallEinstieg\.jsx'\)/);
    expect(fs.existsSync(path.resolve(__dirname, '..', 'NotfallEinstieg.jsx'))).toBe(false);
  });
});
