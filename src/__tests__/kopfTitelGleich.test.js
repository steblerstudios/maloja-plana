// Kopf-Titel wie Entwurf G (30 px, Display-Schrift), Stebler Studios 27.10.2026: «Kopf-Titel 30 px in der
// Display-Schrift wie Entwurf G, und die Kapitel-Köpfe genauso angleichen». Beide Köpfe (Muster M5) tragen
// denselben Titelstil — wer einen ändert, ändert beide.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');
const titelStil = (src) => {
  const m = src.match(/React\.createElement\(PageTitle, \{ palette, style: (\{[^}]*\}) \}, (?:chapter\.title|t\('nav\.wasAnsteht'\))\)/);
  return m && m[1];
};

describe('Kopf-Titel: Kapitel und «Was ansteht» gleich', () => {
  it('beide 30 px in der Display-Schrift', () => {
    const kapitel = titelStil(quelle('ChapterView.jsx'));
    const kalender = titelStil(quelle('CalendarReminders.jsx'));
    expect(kapitel).toMatch(/fontFamily: fontFamilyDisplay, fontSize: '30px'/);
    expect(kalender).toBe(kapitel);
  });
});
