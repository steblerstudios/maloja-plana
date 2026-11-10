// Bugsuche 09.11.2026, B-13 · Der Ankunfts-Satz verschwindet nach 6 Sekunden — auch wenn
// gleich ein zweites Feld ausgefüllt wird — und wandert nicht ins nächste Kapitel.
//
// Vorher (ChapterView.jsx): der Effekt kehrte mit `return () => clearTimeout(timer)` zurück,
// BEVOR prevFilledRef nachgeführt war. Zweites Feld innerhalb von 6 s → Aufräumen löschte den
// Timer, setShowAnkunft(false) lief nie; der Satz blieb und stand nach «Weiter» im nächsten
// Kapitel (ChapterView wird beim Wechsel bewusst nicht neu aufgebaut).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ankunftZeigen } from '../ChapterView.jsx';

const src = fs.readFileSync(path.join(__dirname, '..', 'ChapterView.jsx'), 'utf8');

describe('ankunftZeigen(vorher, jetzt, schonGesehen)', () => {
  it('zeigt beim ersten Feld eines leeren Kapitels', () => {
    expect(ankunftZeigen({ key: 'basis', anzahl: 0 }, { key: 'basis', anzahl: 1 }, false)).toBe(true);
  });
  it('zeigt nicht beim zweiten Feld', () => {
    expect(ankunftZeigen({ key: 'basis', anzahl: 1 }, { key: 'basis', anzahl: 2 }, false)).toBe(false);
  });
  it('zeigt nicht, wenn das Kapitel schon einmal angekommen war', () => {
    expect(ankunftZeigen({ key: 'basis', anzahl: 0 }, { key: 'basis', anzahl: 1 }, true)).toBe(false);
  });
  it('zeigt nicht beim blossen Kapitelwechsel in ein Kapitel mit Daten', () => {
    expect(ankunftZeigen({ key: 'basis', anzahl: 0 }, { key: 'wohnen', anzahl: 3 }, false)).toBe(false);
  });
});

describe('der Satz verschwindet sicher', () => {
  it('der 6-Sekunden-Timer hängt am Zeigen selbst, nicht am Feld-Zähler', () => {
    expect(src).toMatch(/useEffect\(\(\) => \{\s*if \(!showAnkunft\) return[^]*?setTimeout\(\(\) => setShowAnkunft\(false\), 6000\)[^]*?\}, \[showAnkunft\]\)/);
  });
  it('ein Kapitelwechsel blendet ihn aus', () => {
    const effekte = src.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[chapter\.key\]\)/g) || [];
    expect(effekte.some((e) => e.includes('setShowAnkunft(false)'))).toBe(true);
  });
});
