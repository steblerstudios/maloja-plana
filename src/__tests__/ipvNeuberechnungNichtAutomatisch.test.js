import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Fachprüfung 02.11.2026: Die App sagte, die Prämienverbilligung werde nach Heirat,
// Geburt oder Trennung neu berechnet. Das geschieht nicht überall von selbst: Art. 65
// Abs. 3 KVG nennt den Antrag, das Nähere regelt der Kanton.
const lies = (sprache) => fs.readFileSync(path.resolve(process.cwd(), 'src/i18n', `${sprache}.js`), 'utf8');

describe('Prämienverbilligung: keine Zusage einer automatischen Neuberechnung', () => {
  it.each([
    ['de', 'neu berechnet — ein zweiter Blick', 'aufs gemeinsame Einkommen berechnet'],
    ['en', 'is recalculated on', 'is now assessed on the combined income'],
    ['fr', 'est recalculée sur', 'est désormais calculée sur le revenu commun'],
    ['it', 'viene ricalcolata sulla', 'viene ora calcolata sul reddito comune'],
    ['rm', 'vegn calculada danovamain sin', 'vegn ussa calculada sin il retgav'],
  ])('%s', (sprache, ...alt) => {
    const text = lies(sprache);
    for (const a of alt) expect(text).not.toContain(a);
  });
});
