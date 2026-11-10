// Sichtschutz «Beträge verbergen» (10.11.2026): Bildschirm zeigt «CHF ···»,
// Exporte (zipExport, dossierGenerator) bleiben beim wahren Betrag.
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { betrag, betragEcht, betraegeVerborgen } from '../geld.js';
import { createT } from '../../i18n/index.js';

// Kein jsdom im Projekt: ein schlankes document reicht, geld.js liest nur das dataset.
globalThis.document = { documentElement: { dataset: {} } };

const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

afterEach(() => { delete document.documentElement.dataset.betraege; });

describe('Beträge verbergen', () => {
  it('ohne Attribut: betrag zeigt den Betrag', () => {
    expect(betraegeVerborgen()).toBe(false);
    expect(betrag(1234)).toBe('CHF 1’234');
  });
  it('mit data-betraege="aus": betrag zeigt CHF ···, auch bei Minus', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(betrag(1234)).toBe('CHF ···');
    expect(betrag(-50, { stellen: 2 })).toBe('CHF ···');
  });
  it('Leeres bleibt «–», damit kein Betrag vorgetäuscht wird', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(betrag(null)).toBe('–');
    expect(betrag(NaN)).toBe('–');
  });
  it('betragEcht verbirgt nie', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(betragEcht(1234)).toBe('CHF 1’234');
  });
  it('Exporte nehmen betragEcht, nicht betrag', () => {
    for (const f of ['../../zipExport.js', '../../dossierGenerator.js']) {
      expect(quelle(f)).toMatch(/import \{ betragEcht as betrag \} from '\.\/utils\/geld\.js'/);
    }
  });
  it('theme-init.js setzt das Attribut vor dem Rendern', () => {
    expect(quelle('../../../public/theme-init.js')).toMatch(/or5_betraege[\s\S]*dataset\.betraege = 'aus'/);
  });
});

describe('Beträge verbergen in Texten mit «CHF {x}»', () => {
  const t = createT({ de: { a: 'Davon Bund ≈ CHF {bund}.', b: 'Im Jahr {jahr} sind es {n} Fälle.' } }, 'de', 'sie');
  it('ohne Sichtschutz: Zahl wie bisher', () => {
    expect(t('a', { bund: 977 })).toBe('Davon Bund ≈ CHF 977.');
  });
  it('mit Sichtschutz: CHF ···, auch wenn schon formatiert übergeben', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(t('a', { bund: 977 })).toBe('Davon Bund ≈ CHF ···.');
    expect(t('a', { bund: '1’500' })).toBe('Davon Bund ≈ CHF ···.');
  });
  it('Platzhalter ohne CHF (Jahre, Anzahlen) bleiben sichtbar', () => {
    document.documentElement.dataset.betraege = 'aus';
    expect(t('b', { jahr: 2027, n: 3 })).toBe('Im Jahr 2027 sind es 3 Fälle.');
  });
});
