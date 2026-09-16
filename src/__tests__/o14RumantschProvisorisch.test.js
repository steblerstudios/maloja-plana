// O14 (Bauliste §10, E30): Rumantsch wurde in der Sprachwahl wie eine fertige Sprache
// angeboten, obwohl rm.js sich selbst als provisorisch markiert (rm.js Z. 2, TODO(rm)).
// Diese Tests halten fest, dass beide Sprachwahl-Stellen — Onboarding.jsx (Schritt 0)
// und main.jsx (LanguageSwitcher) — das Label mit einem Zusatz zeigen, statt es
// unkommentiert unter die vier fertigen Sprachen zu mischen. Quell-Scan statt Render,
// gleiches Muster wie src/__tests__/themeInit.test.js.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const onboarding = read('../Onboarding.jsx');
const mainJsx = read('../main.jsx');

describe('O14 — Rumantsch in der Sprachwahl als provisorisch gekennzeichnet', () => {
  it('Onboarding.jsx: das Label für rm trägt einen Zusatz, nicht nur "Rumantsch"', () => {
    const match = onboarding.match(/rm:\s*'([^']+)'/);
    expect(match).not.toBeNull();
    expect(match[1]).not.toBe('Rumantsch');
    expect(match[1]).toMatch(/provisor/i);
  });

  it('main.jsx: LANGUAGE_NATIVE_NAMES.rm trägt denselben Zusatz', () => {
    const match = mainJsx.match(/rm:\s*'([^']+)'/);
    expect(match).not.toBeNull();
    expect(match[1]).not.toBe('Rumantsch');
    expect(match[1]).toMatch(/provisor/i);
  });

  it('die anderen vier Sprachen bleiben unverändert (kein versehentlicher Zusatz)', () => {
    for (const label of ['English', 'Deutsch', 'Français', 'Italiano']) {
      expect(onboarding).toContain(`'${label}'`);
      expect(mainJsx).toContain(`'${label}'`);
    }
  });
});
