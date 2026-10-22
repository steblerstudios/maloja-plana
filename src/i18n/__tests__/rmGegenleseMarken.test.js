// Wächter: provisorische rm-Texte tragen die Marke `// TODO(rm): provisorisch — Gegenlese (…)`
// direkt über dem Schlüssel, bis eine Person mit Rumantsch gegengelesen hat. Fehlt die Marke,
// geht der Rückstand beim nächsten Durchgang verloren. Schlüssel erst austragen, wenn die
// Gegenlese erfolgt ist (dann auch die Marke in rm.js entfernen). Quell-Scan wie o14.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const rm = readFileSync(new URL('../rm.js', import.meta.url), 'utf8').split('\n');

const PROVISORISCH = {
  vr: [
    'gutschriftGeteilt',               // AHV B8 (#524), 21.10.2026
    'beitragsjahreHint',               // AHV Vorbezug (#529), 22.10.2026
    'beitragsjahreAngenommen',
    'beitragsjahreAngenommenVorbezug',
    'renteAbReferenzalter',
    'vorbezugNeuberechnung',
    'abAlterKurz',
  ],
};

describe('rm: provisorische Texte tragen die Gegenlese-Marke', () => {
  for (const [bereich, schluessel] of Object.entries(PROVISORISCH)) {
    for (const k of schluessel) {
      it(`${bereich}.${k}`, () => {
        const i = rm.findIndex((z) => z.startsWith('    ' + k + ': '));
        expect(i, `${k} nicht in rm.js gefunden`).toBeGreaterThan(0);
        expect(rm[i - 1].trim()).toMatch(/^\/\/ TODO\(rm\): provisorisch — Gegenlese \(/);
      });
    }
  }
});
