// «Heute» ist das Schweizer Datum, nicht das UTC-Datum.
//
// Bis 24.09.2026 rechneten Kalender und Fristen-Band «heute» mit
// `new Date().toISOString()`. Zwischen Mitternacht und 1 Uhr (Winter) bzw. 2 Uhr
// (Sommer) ist das in UTC noch gestern — eine heute fällige Frist galt dann als
// morgen fällig, eine gestrige als heute. Geprüft um 00:30 Zürcher Zeit.
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { inDays } from '../utils/helpers.js';

const altTZ = process.env.TZ;
beforeAll(() => {
  process.env.TZ = 'Europe/Zurich';
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-24T22:30:00Z')); // = 25.09.2026, 00:30 in Zürich
});
afterAll(() => { vi.useRealTimers(); process.env.TZ = altTZ; });

describe('heute nach Schweizer Uhr', () => {
  it('die Messung trifft das Fenster (UTC sagt noch gestern)', () => {
    expect(new Date().toISOString().slice(0, 10)).toBe('2026-09-24');
  });
  it('inDays(0) sagt das Schweizer Datum', () => {
    expect(inDays(0)).toBe('2026-09-25');
    expect(inDays(30)).toBe('2026-10-25');
  });
  it('Kalender und Fristen-Band nehmen «heute» nicht aus toISOString', () => {
    for (const d of ['CalendarReminders.jsx', 'OverdueBanner.jsx']) {
      // Kommentarzeilen raus: die Korrektur zitiert das alte Muster in ihrer Begründung.
      const q = fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8').split('\n').filter((z) => !/^\s*\/\//.test(z)).join('\n');
      expect(q, d).not.toMatch(/new Date\(\)\.toISOString\(\)/);
      expect(q, d).not.toMatch(/new Date\(Date\.now\(\)[^)]*\)\.toISOString\(\)/);
      expect(q, d).toMatch(/const todayISO = \(\) => inDays\(0\)/);
    }
  });
  it('das Fristen-Band navigiert über handleNavigate (Sprung nach oben, Fokus)', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    expect(q).toMatch(/createElement\(OverdueBanner, \{ palette, t, onNavigate: handleNavigate \}\)/);
  });
});
