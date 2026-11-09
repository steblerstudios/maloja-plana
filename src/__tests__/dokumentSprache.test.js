// Bugsuche 09.11.2026, B-16 · Erzeugte Briefe und Dossiers tragen die Sprache, in der sie
// geschrieben sind. Vorher stand überall fest <html lang="de">, auch im französischen Brief.
import { describe, it, expect } from 'vitest';
import { generateLetter } from '../briefGenerator.js';
import { generateLebensmappe, generateNotfallDossier } from '../dossierGenerator.js';
import { htmlSprache } from '../utils/htmlSprache.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTr from '../i18n/it.js';
import fs from 'node:fs';
import path from 'node:path';

const tFr = createT({ fr }, 'fr');
const tDe = createT({ de }, 'de');
const tIt = createT({ it: itTr }, 'it');
const data = { basis: { firstName: 'Anna', lastName: 'Muster' }, wohnen: { address: 'Rue 1', city: 'Genève' } };
const lang = (html) => (html.match(/<html lang="([^"]*)">/) || [])[1];

describe('htmlSprache', () => {
  it('liest die Sprache aus dem Übersetzer', () => {
    expect(htmlSprache(tFr)).toBe('fr');
    expect(htmlSprache(tIt)).toBe('it');
    expect(htmlSprache(tDe)).toBe('de');
  });
  it('fällt ohne brauchbaren Übersetzer auf «de» zurück', () => {
    expect(htmlSprache(undefined)).toBe('de');
    expect(htmlSprache((k) => k)).toBe('de');
  });
});

describe('erzeugte Dokumente', () => {
  it('ein französischer Brief ist als französisch ausgezeichnet', () => {
    expect(lang(generateLetter('leaseTermination', data, tFr))).toBe('fr');
    expect(lang(generateLetter('leaseTermination', data, tDe))).toBe('de');
  });
  it('Lebensmappe und Notfall-Dossier auf Italienisch: lang="it"', () => {
    expect(lang(generateLebensmappe(data, [], tIt, []))).toBe('it');
    expect(lang(generateNotfallDossier(data, [], tIt))).toBe('it');
  });
  it('kein fest verdrahtetes lang="de" mehr in den Generatoren', () => {
    for (const f of ['briefGenerator.js', 'dossierGenerator.js']) {
      expect(fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).not.toContain('<html lang="de">');
    }
  });
});
