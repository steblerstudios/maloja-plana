import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Deploy-Gate 27.09.2026 (Code-Review): Nach «Beispiel verlassen» blieb der Schuldenmanager
// eingehängt, hielt die Beispiel-Listen im eigenen Zustand und schrieb sie beim nächsten
// Speichern über die echten Daten. Der Schlüssel `datenModus` baut ihn beim Moduswechsel neu auf.
// Gelesen wird der Quelltext, weil main.jsx als Ganzes nicht testbar eingehängt werden kann.
const src = readFileSync(resolve(__dirname, '..', 'main.jsx'), 'utf8');

describe('Schuldenmanager wird beim Wechsel Beispiel/Probe/echt neu aufgebaut', () => {
  it('datenModus unterscheidet die drei Stände', () => {
    expect(src).toMatch(/const datenModus = demoMode && demoData \? 'beispiel' : sandboxActive \? 'probe' : 'echt';/);
  });
  it('SchuldenManager trägt key: datenModus', () => {
    expect(src).toMatch(/React\.createElement\(SchuldenManager, \{\s*key: datenModus,/);
  });
});
