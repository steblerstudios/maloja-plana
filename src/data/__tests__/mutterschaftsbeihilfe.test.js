import { describe, it, expect } from 'vitest';
import { getMutterschaftsbeihilfe } from '../mutterschaftsbeihilfe.js';

describe('mutterschaftsbeihilfe', () => {
  it('returns the four verified Typ-A cantons as "has" with an https link', () => {
    for (const c of ['GR', 'SG', 'ZG', 'FR']) {
      const r = getMutterschaftsbeihilfe(c);
      expect(r.has).toBe(true);
      expect(r.url).toMatch(/^https:\/\//);
    }
  });

  it('returns has:false for cantons without a verified need-based benefit', () => {
    // ZH (2016 abgeschafft), VD (nur Typ B / PC Familles), and cantons never in scope.
    for (const c of ['ZH', 'VD', 'BE', 'BS', 'TI', 'NE', 'GL', 'SH', 'LU']) {
      expect(getMutterschaftsbeihilfe(c).has).toBe(false);
      expect(getMutterschaftsbeihilfe(c).url).toBeNull();
    }
  });

  it('handles empty / unknown input gracefully', () => {
    expect(getMutterschaftsbeihilfe('').has).toBe(false);
    expect(getMutterschaftsbeihilfe(undefined).has).toBe(false);
    expect(getMutterschaftsbeihilfe(' GR ').has).toBe(true); // trims whitespace
  });
});
