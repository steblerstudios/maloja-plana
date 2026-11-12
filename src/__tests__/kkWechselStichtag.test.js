// Bugsuche 09.11.2026, Fund 5 · Die Vorlage «Krankenkasse wechseln» zielt immer aufs
// nächste 30.11. — nicht aufs 30.11. des laufenden Jahres.
//
// Vorher (Nachstellen, TZ Europe/Zurich): am 30.11. gab daysBetween 0, `daysFromNow || 30`
// machte daraus 30 → Termin 30.12. Am 10.12. gab es −10 → Termin 30.11., schon vorbei.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { tageBisNaechstem } from '../CalendarReminders.jsx';

describe('tageBisNaechstem(heute, "11-30")', () => {
  it('vor dem Stichtag: bis zum 30.11. dieses Jahres', () => {
    expect(tageBisNaechstem('2026-11-09', '11-30')).toBe(21);
  });
  it('am Stichtag selbst: 0 Tage, also heute', () => {
    expect(tageBisNaechstem('2026-11-30', '11-30')).toBe(0);
  });
  it('nach dem Stichtag: aufs 30.11. des nächsten Jahres', () => {
    expect(tageBisNaechstem('2026-12-10', '11-30')).toBe(355);
  });
  it('über ein Schaltjahr hinweg richtig gezählt', () => {
    expect(tageBisNaechstem('2027-12-01', '11-30')).toBe(365); // 2028 ist Schaltjahr, 30.11. danach
  });
});

describe('die Vorlage übernimmt 0 Tage als heute', () => {
  it('kein «|| 30», das aus 0 Tagen still 30 macht', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'CalendarReminders.jsx'), 'utf8');
    expect(src).not.toMatch(/daysFromNow\s*\|\|\s*30/);
    // Gruppe B L5 (11.11.2026): seither zehn Tage vor dem letzten Werktag im November (kkWechselErinnerung).
    expect(src).toMatch(/kkChange[^\n]*kkWechselErinnerung\(todayISO\(\)\)/);
  });
});
