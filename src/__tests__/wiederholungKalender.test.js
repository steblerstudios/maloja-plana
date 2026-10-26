// Seitenrundgang 26.10.2026, W10: wiederkehrende Termine nach Kalender statt fester Tageszahl.
import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { naechsterTermin, INTERVALLE, bisHeuteWeiter } from '../utils/wiederholung.js';
import { buildICS } from '../utils/icsExport.js';
import { syncDocumentReminders } from '../utils/docReminders.js';

afterEach(() => { vi.useRealTimers(); });

describe('naechsterTermin', () => {
  it('monatlich bleibt am selben Tag (vorher alle 30 Tage: 15.1. → 14.2. → 16.3. …)', () => {
    let d = '2026-01-15';
    for (let i = 0; i < 12; i++) d = naechsterTermin(d, 'monthly');
    expect(d).toBe('2027-01-15');
  });
  it('jährlich über das Schaltjahr 2028 ohne zu rutschen (vorher 365 Tage)', () => {
    expect(naechsterTermin('2027-03-10', 'yearly')).toBe('2028-03-10');
    expect(naechsterTermin('2028-03-10', 'yearly')).toBe('2029-03-10');
  });
  it('Monatsende wie bei den Fristen: 31.1. + 1 Monat → letzter Februartag', () => {
    expect(naechsterTermin('2027-01-31', 'monthly')).toBe('2027-02-28');
    expect(naechsterTermin('2028-01-31', 'monthly')).toBe('2028-02-29');
  });
  it('Quartal, Halbjahr, Woche, Tag', () => {
    expect(naechsterTermin('2026-11-30', 'quarterly')).toBe('2027-02-28');
    expect(naechsterTermin('2026-08-31', 'halfYearly')).toBe('2027-02-28');
    expect(naechsterTermin('2026-12-28', 'weekly')).toBe('2027-01-04');
    expect(naechsterTermin('2026-12-31', 'daily')).toBe('2027-01-01');
  });
  it('einmalig, Unbekanntes und Unlesbares → null; Uhrzeit dahinter wird abgeschnitten', () => {
    expect(naechsterTermin('2026-05-01', 'once')).toBeNull();
    expect(naechsterTermin('2026-05-01', 'irgendwas')).toBeNull();
    expect(naechsterTermin('2026-05-01', undefined)).toBeNull();
    expect(naechsterTermin('kaputt', 'monthly')).toBeNull();
    expect(naechsterTermin('2026-02-31', 'monthly')).toBeNull();
    expect(naechsterTermin('2026-05-01T23:30:00.000Z', 'monthly')).toBe('2026-06-01');
    expect(Object.keys(INTERVALLE)).toEqual(['once', 'daily', 'weekly', 'monthly', 'quarterly', 'halfYearly', 'yearly']);
  });
});

describe('Ankertag: Monatsende-Serien kehren auf den 31. zurück', () => {
  it('31.1. → 28.2. → 31.3. → 30.4.', () => {
    let d = '2027-01-31'; const r = [];
    for (let i = 0; i < 3; i++) { d = naechsterTermin(d, 'monthly', 31); r.push(d); }
    expect(r).toEqual(['2027-02-28', '2027-03-31', '2027-04-30']);
  });
  it('29.2. jährlich → 28.2. → … → 29.2.2032', () => {
    let d = '2028-02-29';
    for (let i = 0; i < 4; i++) d = naechsterTermin(d, 'yearly', 29);
    expect(d).toBe('2032-02-29');
  });
});

describe('bisHeuteWeiter (Rollover im Kalender)', () => {
  it('schaltet einen alten erledigten Termin in mehreren Schritten bis heute weiter und merkt den Ankertag', () => {
    const r = bisHeuteWeiter({ id: 1, done: true, recurrence: 'monthly', dueDate: '2025-01-31' }, '2026-10-26');
    expect(r).toMatchObject({ dueDate: '2026-10-31', ankerTag: 31, done: false, completedDate: null });
  });
  it('ohne bekannte Wiederholung, nicht erledigt oder in der Zukunft: nichts', () => {
    expect(bisHeuteWeiter({ done: true, recurrence: undefined, dueDate: '2026-01-01' }, '2026-10-26')).toBeNull();
    expect(bisHeuteWeiter({ done: true, recurrence: 'xyz', dueDate: '2026-01-01' }, '2026-10-26')).toBeNull();
    expect(bisHeuteWeiter({ done: false, recurrence: 'monthly', dueDate: '2026-01-01' }, '2026-10-26')).toBeNull();
    expect(bisHeuteWeiter({ done: true, recurrence: 'monthly', dueDate: '2026-11-01' }, '2026-10-26')).toBeNull();
  });
  it('Altwert mit Uhrzeit rollt am selben Tag', () => {
    expect(bisHeuteWeiter({ done: true, recurrence: 'weekly', dueDate: '2026-10-26T10:00' }, '2026-10-26')).toMatchObject({ dueDate: '2026-11-02' });
  });
});

describe('.ics: dieselben Wiederholungen wie in der App', () => {
  const regel = (r) => (buildICS([{ id: 'x', title: 'T', ...r }]).match(/RRULE:([^\r\n]+)/) || [])[1];
  it('jede Wiederholung der App hat eine RRULE', () => {
    for (const w of Object.keys(INTERVALLE).filter((k) => INTERVALLE[k])) expect(regel({ dueDate: '2026-11-10', recurrence: w }), w).toBeTruthy();
    expect(regel({ dueDate: '2026-11-10', recurrence: 'quarterly' })).toBe('FREQ=MONTHLY;INTERVAL=3');
  });
  it('Monatsende: letzter vorhandener Tag statt Überspringen', () => {
    expect(regel({ dueDate: '2027-01-31', recurrence: 'monthly' })).toBe('FREQ=MONTHLY;BYMONTHDAY=28,29,30,31;BYSETPOS=-1');
    expect(regel({ dueDate: '2028-02-29', recurrence: 'yearly' })).toBe('FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=28,29;BYSETPOS=-1');
    expect(regel({ dueDate: '2027-01-15', recurrence: 'monthly' })).toBe('FREQ=MONTHLY');
  });
});

describe('Dokument-Erinnerung 30 Tage vor Ablauf', () => {
  const speicher = {};
  const mitSpeicher = () => {
    for (const k of Object.keys(speicher)) delete speicher[k];
    globalThis.localStorage = { getItem: (k) => (k in speicher ? speicher[k] : null), setItem: (k, v) => { speicher[k] = String(v); }, removeItem: (k) => { delete speicher[k]; } };
  };
  const gespeichert = () => JSON.parse(Object.values(speicher)[0] || '[]');
  afterEach(() => { delete globalThis.localStorage; });

  it('30 Kalendertage vor dem Ablauf', () => {
    mitSpeicher();
    syncDocumentReminders([{ id: 'a', fileName: 'Pass', expiryDate: '2027-03-31' }], null);
    expect(gespeichert().map((r) => r.dueDate)).toEqual(['2027-03-01']);
  });
  it('unlesbares Ablaufdatum → keine Erinnerung', () => {
    mitSpeicher();
    expect(() => syncDocumentReminders([{ id: 'b', fileName: 'X', expiryDate: 'irgendwann' }], null)).not.toThrow();
    expect(gespeichert()).toEqual([]);
  });
});

describe('Quelltext-Wächter', () => {
  it('Wiederholungen laufen über utils/wiederholung.js, nicht über feste Tageszahlen', () => {
    const src = fs.readFileSync(path.resolve(__dirname, '..', 'CalendarReminders.jsx'), 'utf8');
    expect(src).not.toMatch(/monthly: 30|yearly: 365|interval \* 86400000/);
    expect(src).toMatch(/bisHeuteWeiter\(r, today\)/);
  });
});
