// Kern + Rest müssen wieder genau die Sprachdatei ergeben, und nichts im Startbündel darf
// eine Ansicht öffnen, bevor alle Texte da sind.
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { gzipSync } from 'node:zlib';
import de from '../de.js';
import en from '../en.js';
import fr from '../fr.js';
import itSprache from '../it.js';
import rm from '../rm.js';
import { createT, zusammenfuegen } from '../index.js';
import { ersteBilder, startModule, kernPfade, teilen } from '../../../scripts/i18nKern.mjs';

const src = path.resolve(__dirname, '../..');
const module = startModule(path.join(src, 'main.jsx'));
const pfade = kernPfade(ersteBilder(src), de);

describe('Sprachen teilen', () => {
  it.each([['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]])('%s: Kern + Rest = Original', (_, sprache) => {
    const { kern, rest } = teilen(sprache, pfade);
    expect(zusammenfuegen(kern, rest)).toEqual(sprache);
  });

  it('der Kern enthält die Schlüssel der Startseite und bleibt klein', () => {
    expect(pfade).toContain('error.viewCrash');
    expect(pfade).toContain('beta.demoEnter');
    const { kern } = teilen(de, pfade);
    expect(gzipSync(JSON.stringify(kern)).length).toBeLessThan(40_000);
    expect(module.length).toBeGreaterThan(30);
  });

  it('fehlt ein Schlüssel, solange der Rest kommt, bleibt er leer, danach zeigt er sich', () => {
    const tabelle = { de: { a: 'A' } };
    expect(createT(tabelle, 'de', 'sie', true)('b.c')).toBe('');
    expect(createT(tabelle, 'de', 'sie', false)('b.c')).toBe('b.c');
    expect(createT(tabelle, 'de', 'sie', true)('a')).toBe('A');
  });

  it('das Startbündel öffnet keine Ansicht ohne Texte', () => {
    const fremd = module
      .filter((datei) => !datei.endsWith('i18n/index.js') && !datei.endsWith('BetaGateTor.jsx'))
      .filter((datei) => /(?<![\w.])(?:React\.)?lazy\(/.test(fs.readFileSync(datei, 'utf8')));
    expect(fremd).toEqual([]);
  });
});
