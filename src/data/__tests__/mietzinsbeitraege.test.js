import { describe, it, expect } from 'vitest';
import { getMietzinsbeitraege, MIETZINS_OVERVIEW_URL } from '../mietzinsbeitraege.js';

describe('mietzinsbeitraege', () => {
  it('returns confirmed programs as "has" with a link', () => {
    for (const c of ['BS', 'BL', 'GE', 'ZG']) {
      const r = getMietzinsbeitraege(c);
      expect(r.state).toBe('has');
      expect(r.url).toMatch(/^https:\/\//);
      expect(r.canton).toBe(c);
    }
  });

  it('falls back to "check" (never a false "none") for unconfirmed cantons', () => {
    for (const c of ['ZH', 'BE', 'SO', 'AR', 'VS', 'JU']) {
      const r = getMietzinsbeitraege(c);
      expect(r.state).toBe('check');
      expect(r.url).toBe(MIETZINS_OVERVIEW_URL);
    }
  });

  it('handles unknown input as "check"', () => {
    expect(getMietzinsbeitraege('').state).toBe('check');
    expect(getMietzinsbeitraege(undefined).state).toBe('check');
  });
});
