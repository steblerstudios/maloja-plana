import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Sammel-Fix 14.10.2026, Punkt 1: Die Beispiel-Kachel im Dashboard setzte demoMode,
// lud aber DEMO_DATA nicht. activeData fiel dann auf die ECHTEN Daten zurück
// (demoMode && demoData ? demoData : data) — das «Beispiel» zeigte den echten Stand.
const quelle = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');

describe('Beispiel betreten lädt die Beispieldaten', () => {
  it('onEnterDemo ruft die gemeinsame Funktion auf, die DEMO_DATA lädt', () => {
    const m = quelle.match(/onEnterDemo:\s*([^\n]+)/);
    expect(m).toBeTruthy();
    expect(m[1]).toMatch(/beispielBetreten/);
    expect(m[1]).not.toMatch(/setDemoMode\(true\)/);
  });
  it('beispielBetreten setzt demoMode erst nach dem Laden von demoData.js', () => {
    const m = quelle.match(/const beispielBetreten = [\s\S]*?\n/);
    expect(m).toBeTruthy();
    const z = m[0];
    expect(z).toMatch(/import\('\.\/config\/demoData\.js'\)/);
    expect(z.indexOf('setDemoData(m.DEMO_DATA)')).toBeGreaterThan(-1);
    expect(z.indexOf('setDemoData(m.DEMO_DATA)')).toBeLessThan(z.indexOf('setDemoMode(true)'));
  });
  it('der Fusszeilen-Knopf nutzt dieselbe Funktion', () => {
    expect(quelle.match(/import\('\.\/config\/demoData\.js'\)/g)).toHaveLength(1);
    expect(quelle).toMatch(/else beispielBetreten\(\);/);
  });
});
