import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { NOTFALL_ANKER } from '../components/NotfallImKapitel.jsx';

// Seiten bündeln, Gruppe D (docs/entscheide/seiten-buendeln.md, Entscheid 4, 24.10.2026): der
// Notfall-Einstieg ist keine eigene Seite mehr, sondern steht im Kapitel Notfall — oben Vorlesekarte
// und Notfallpass, unten die drei Lagen. Die Vorlesekarte bleibt eigene Seite.
// Den Inhalt des Kapitels (seit AE «ein Ort») prüft notfallKapitel.test.js.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');

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

describe('main.jsx: keine eigene Einstiegs-Seite mehr', () => {
  it('kein Render-Zweig, kein Lazy-Import, keine Datei', () => {
    const main = quelle('main.jsx');
    expect(main).not.toMatch(/view === 'notfalleinstieg' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/NotfallEinstieg\.jsx'\)/);
    expect(fs.existsSync(path.resolve(__dirname, '..', 'NotfallEinstieg.jsx'))).toBe(false);
  });
});
