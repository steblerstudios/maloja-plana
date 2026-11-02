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

// Rechtsprüfung #641: «Sie müssen nichts tun» galt pauschal, und der Rat stand nur im
// Schätz-Zustand. Art. 65 Abs. 3 KVG nennt den Antrag ausdrücklich, darum steht der Rat in jedem Zustand.
describe('Prämienverbilligung: Rat bei Änderungen', () => {
  const ipvStatus = (text) => text.slice(text.indexOf('wayAuto:'), text.indexOf('wayApply:'));
  const zeile = (text, schluessel) => text.split('\n').find((z) => z.trim().startsWith(`${schluessel}:`)) || '';

  it.each([
    ['de', 'Sie müssen nichts tun', 'du musst nichts tun', 'zuständigen Stelle'],
    ['en', 'you do nothing,', 'you do nothing,', 'responsible office'],
    ['fr', 'vous n’avez rien à faire,', 'tu n’as rien à faire,', 'office compétent'],
    ['it', 'non deve fare nulla,', 'non devi fare nulla,', 'ufficio competente'],
    ['rm', 'na stuais Vus far nagut,', 'na stos ti far nagut,', 'post cumpetent'],
  ])('%s: wayAuto ohne Pauschale, aenderung nennt die Stelle', (sprache, sie, du, stelle) => {
    const text = lies(sprache);
    const block = zeile(text, 'wayAuto');
    expect(block).not.toBe('');
    // Nur mit «meist» oder Entsprechung erlaubt: der pauschale Satz am Satzanfang fehlt.
    expect(block).not.toContain(`— ${sie}`);
    expect(block).not.toContain(`— ${du}`);
    expect(zeile(text, 'aenderung')).toContain(stelle);
    expect(ipvStatus(text)).toContain('aenderung:');
  });

  it('die Komponente zeigt den Rat in jedem Zustand', () => {
    const quelle = fs.readFileSync(path.resolve(process.cwd(), 'src/PremiumSubsidy.jsx'), 'utf8');
    expect(quelle).toContain("return weg([head(), aenderung]);");
    expect((quelle.match(/^\s+aenderung,$/gm) || []).length).toBe(3);
  });
});
