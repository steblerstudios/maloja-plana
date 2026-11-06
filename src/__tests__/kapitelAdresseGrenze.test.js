import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseHash } from '../utils/hashRouter.js';
import { CHAPTER_KEYS } from '../config/constants.js';

// Seitenlandkarte V1 (docs/entscheide/seitenlandkarte-2026-11.md, 05.11.2026): eine Kapitel-Adresse,
// die es nicht gibt (#/chapter/7 bei sieben Kapiteln 0–6), zeigte still das Kapitel Notfall und liess
// die falsche Adresse stehen. Jetzt führt sie zur Übersicht, und die Adresse wird nachgeführt.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const letztes = CHAPTER_KEYS.length - 1;

describe('Kapitel-Adresse ausserhalb der Kapitel', () => {
  it('jedes echte Kapitel bleibt ein Kapitel', () => {
    for (let i = 0; i <= letztes; i++) {
      expect(parseHash(`#/chapter/${i}`)).toEqual({ view: 'chapter', chapterIndex: i });
    }
  });

  it.each([CHAPTER_KEYS.length, CHAPTER_KEYS.length + 2, 20, 99, -1])('#/chapter/%s führt zur Übersicht', (i) => {
    expect(parseHash(`#/chapter/${i}`)).toEqual({ view: 'dashboard', chapterIndex: null, ersetzen: true });
  });

  it('eine Kapitel-Adresse ohne Zahl führt ebenfalls zur Übersicht', () => {
    expect(parseHash('#/chapter/abc')).toEqual({ view: 'dashboard', chapterIndex: null, ersetzen: true });
  });

  it('die App führt die Adresse nach, statt die falsche stehen zu lassen', () => {
    expect(quelle('main.jsx')).toMatch(/if \(parsed\.anker \|\| parsed\.ersetzen\) replaceHash\(parsed\.view, parsed\.chapterIndex\);/);
  });
});
