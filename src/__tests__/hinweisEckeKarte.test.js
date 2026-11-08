// Ecke nach Rolle (Brand Book §7a, Regel C; #734): Eine Fläche über die volle Breite ist eine
// Karte und bekommt radius.lg (16 px), nicht die Knopf-/Feld-Ecke radius.md (10 px).
// Der Hinweis «Frühe Version» (AlphaBanner) stand nach #734 auf radius.md und wirkte neben der
// Karte «Was ist jetzt dran?» direkt darunter spitzer (im Browser gesehen 08.11.2026).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(__dirname, '../Dashboard.jsx'), 'utf8');

describe('Hinweis «Frühe Version» ist eine Karte', () => {
  it('AlphaBanner nutzt die Karten-Ecke radius.lg', () => {
    const start = src.indexOf('const AlphaBanner');
    expect(start).toBeGreaterThan(-1);
    const block = src.slice(start, src.indexOf('boxShadow', start));
    expect(block).toMatch(/borderRadius:\s*radius\.lg/);
  });
});
