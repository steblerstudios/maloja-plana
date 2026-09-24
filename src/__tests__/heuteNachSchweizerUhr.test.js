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
import { nextIpvStatus } from '../data/ipvStatus.js';

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

  // Seit 24.09. spätabends für ganz src/, nicht nur Kalender und Band: dieselbe Falle stand
  // an elf Stellen (Erinnerungen, Dokument-Abläufe, Dashboard, Benachrichtigungen, KVG,
  // Prämienverbilligung, Dateinamen). Zeitstempel (volle ISO-Zeit) sind richtig und frei.
  it('nirgends in src/ wird ein Kalenderdatum aus «jetzt» in UTC gebildet', () => {
    const MUSTER = /new Date\(\)\.toISOString\(\)\.(split\('T'\)\[0\]|slice\(0, ?10\))/;
    const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return e.name === '__tests__' ? [] : dateien(p);
      return /\.(jsx?|ts)$/.test(e.name) ? [p] : [];
    });
    const befund = [];
    for (const p of dateien(path.resolve(__dirname, '..'))) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((z, i) => {
        if (!/^\s*\/\//.test(z) && MUSTER.test(z)) befund.push(path.basename(p) + ':' + (i + 1));
      });
    }
    expect(befund).toEqual([]);
  });
});

describe('Prämienverbilligung am Jahreswechsel', () => {
  it('Datum und Jahr einer bestätigten Verfügung widersprechen sich um 00:30 am 1. Januar nicht', () => {
    vi.setSystemTime(new Date('2026-12-31T23:30:00Z')); // = 01.01.2027, 00:30 in Zürich
    const s = nextIpvStatus('bestaetigt', { betrag: 1200, kanton: 'BS' });
    expect(s.datum).toBe('2027-01-01');
    expect(s.jahr).toBe(2027);
    vi.setSystemTime(new Date('2026-09-24T22:30:00Z'));
  });
});
