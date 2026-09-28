// Startdatei (65-kB-Grenze): cantonalData.js gehört NICHT hinein.
// Bis 28.09.2026 holte main.jsx die PLZ-Funktionen aus cantonalData.js — damit lag die ganze Datei
// samt IPV-, Sozialhilfe- und EL-Rechnung in der Startdatei (≈ 4,3 kB gzip), obwohl kein Startmodul
// rechnet. Seither liegt der kleine Teil in kantonPLZ.js. Dieser Test folgt den STATISCHEN Importen
// ab main.jsx (dynamische `import()` zählen nicht, die werden eigene Chunks) und schlägt an, sobald
// cantonalData.js wieder erreichbar ist.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as kantonPLZ from '../config/kantonPLZ.js';
import * as cantonalData from '../config/cantonalData.js';

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function datei(von, spez) {
  const basis = resolve(dirname(von), spez);
  for (const k of [basis, basis + '.js', basis + '.jsx', basis + '/index.js']) {
    if (existsSync(k) && !k.endsWith('/')) {
      try { readFileSync(k); return k; } catch { /* Ordner */ }
    }
  }
  return null;
}

function statischeImporte(pfad) {
  const text = readFileSync(pfad, 'utf8');
  const ziele = [
    ...text.matchAll(/^\s*import\s[^;]*?from\s+['"]([^'"]+)['"]/gm),
    ...text.matchAll(/^\s*import\s+['"]([^'"]+)['"]/gm),
    ...text.matchAll(/^\s*export\s[^;]*?from\s+['"]([^'"]+)['"]/gm),
  ].map((m) => m[1]).filter((s) => s.startsWith('.'));
  return ziele.map((s) => datei(pfad, s)).filter(Boolean);
}

function erreichbar(start) {
  const gesehen = new Set();
  const offen = [start];
  while (offen.length) {
    const p = offen.pop();
    if (gesehen.has(p)) continue;
    gesehen.add(p);
    offen.push(...statischeImporte(p));
  }
  return gesehen;
}

const start = erreichbar(resolve(SRC, 'main.jsx'));

describe('Startdatei ohne cantonalData.js', () => {
  it('findet die Startmodule überhaupt (Muster greift)', () => {
    expect(start.has(resolve(SRC, 'Dashboard.jsx'))).toBe(true);
    expect(start.has(resolve(SRC, 'config/constants.js'))).toBe(true);
    expect(start.has(resolve(SRC, 'config/kantonPLZ.js'))).toBe(true);
  });

  it('kein Startmodul importiert cantonalData.js statisch', () => {
    expect(start.has(resolve(SRC, 'config/cantonalData.js'))).toBe(false);
  });
});

describe('cantonalData.js reicht die PLZ-Funktionen unverändert weiter', () => {
  it('dieselben Funktionen, nicht Kopien', () => {
    expect(cantonalData.cantonFromPLZ).toBe(kantonPLZ.cantonFromPLZ);
    expect(cantonalData.gemeindeFromPLZ).toBe(kantonPLZ.gemeindeFromPLZ);
    expect(cantonalData.getCantonName).toBe(kantonPLZ.getCantonName);
    expect(cantonalData.CANTON_CODES).toBe(kantonPLZ.CANTON_CODES);
  });

  it('Kanton aus PLZ wie vorher (Bereichs-Rückfall)', () => {
    expect(kantonPLZ.cantonFromPLZ('4051')).toBe('BS');
    expect(kantonPLZ.cantonFromPLZ('8001')).toBe('ZH');
    expect(kantonPLZ.cantonFromPLZ('999')).toBe(null);
  });
});
