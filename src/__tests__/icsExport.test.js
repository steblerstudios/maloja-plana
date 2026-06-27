import { describe, it, expect } from 'vitest';
import { buildICS } from '../utils/icsExport.js';

const reminders = [
  { id: 'a1', title: 'Steuererklärung', dueDate: '2026-03-31', category: 'finance', recurrence: 'yearly' },
  { id: 'a2', title: 'RAV-Termin; wichtig, pünktlich', dueDate: '2026-07-14', category: 'admin', recurrence: 'monthly' },
  { id: 'a3', title: 'Einmaltermin', dueDate: '2026-09-01', category: 'health', recurrence: 'once' },
];

describe('icsExport buildICS', () => {
  const ics = buildICS(reminders, (k) => k);

  it('gültiger VCALENDAR-Rahmen', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('\r\n'); // CRLF-Zeilenenden
  });

  it('ein VEVENT pro Termin mit All-Day-Datum + Erinnerung', () => {
    expect((ics.match(/BEGIN:VEVENT/g) || []).length).toBe(3);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260331');
    expect(ics).toContain('SUMMARY:Steuererklärung');
    expect((ics.match(/BEGIN:VALARM/g) || []).length).toBe(3);
    expect(ics).toContain('TRIGGER:-P1D');
  });

  it('RRULE nur bei Wiederkehr (nicht bei once)', () => {
    expect(ics).toContain('RRULE:FREQ=YEARLY');
    expect(ics).toContain('RRULE:FREQ=MONTHLY');
    expect((ics.match(/RRULE:/g) || []).length).toBe(2); // yearly + monthly, NICHT once
  });

  it('escaped Sonderzeichen (Komma/Semikolon) in SUMMARY', () => {
    expect(ics).toContain('SUMMARY:RAV-Termin\\; wichtig\\, pünktlich');
  });

  it('überspringt Einträge ohne Datum, bleibt gültig', () => {
    const out = buildICS([{ title: 'kein Datum' }, { title: 'ok', dueDate: '2026-01-05' }], (k) => k);
    expect((out.match(/BEGIN:VEVENT/g) || []).length).toBe(1);
    expect(out).toContain('DTSTART;VALUE=DATE:20260105');
  });

  it('leere Liste → leerer, gültiger Kalender', () => {
    const out = buildICS([], (k) => k);
    expect(out).toContain('BEGIN:VCALENDAR');
    expect(out).not.toContain('BEGIN:VEVENT');
  });
});
