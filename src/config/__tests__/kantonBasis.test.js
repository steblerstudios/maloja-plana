import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as basis from '../kantonBasis.js';
import * as kanton from '../cantonalData.js';

// Startbündel (28.09.2026): Kantonskürzel, -namen und PLZ liegen in kantonBasis.js, die
// IPV-/Sozialhilfe-/EL-Rechnung in cantonalData.js. Importiert eine Datei des Startbündels
// cantonalData.js direkt, wandert die ganze Rechnung zurück ins Startbündel
// (gemessen: 64,94 → 60,79 kB gz, als sie herauskam).
const lies = (pfad) => readFileSync(new URL(pfad, import.meta.url), 'utf8');
const START = { '../../main.jsx': lies('../../main.jsx'), '../../Dashboard.jsx': lies('../../Dashboard.jsx'), '../constants.js': lies('../constants.js') };

describe('Kantons-Grundlagen bleiben klein', () => {
  it('die Dateien des Startbündels importieren cantonalData.js nicht', () => {
    const treffer = Object.entries(START).filter(([, src]) => /from\s+'[./]*(config\/)?cantonalData\.js'/.test(src)).map(([p]) => p);
    expect(treffer).toEqual([]);
  });
  it('kantonBasis.js hat keine statischen Importe (nur Nachladen per import())', () => {
    expect(lies('../kantonBasis.js')).not.toMatch(/^import\s/m);
  });
  it('cantonalData.js reicht dieselben Funktionen weiter — eine Wahrheit, alte Importe gültig', () => {
    for (const k of ['cantonFromPLZ', 'preloadPLZ', 'gemeindeFromPLZ', 'CANTON_CODES', 'getCantonName']) {
      expect(kanton[k]).toBe(basis[k]);
    }
  });
  it('Namen und PLZ funktionieren wie vorher', () => {
    expect(basis.CANTON_CODES).toHaveLength(26);
    expect(basis.getCantonName('BS', (k) => (k === 'cantons.BS' ? 'Basel-Stadt' : k))).toBe('Basel-Stadt');
    expect(basis.getCantonName('')).toBe('');
    expect(basis.cantonFromPLZ('4051')).toBe('BS');
    expect(basis.cantonFromPLZ('999')).toBeNull();
  });
});
