// Bugsuche 09.11.2026, B-16 · Die .ics-Datei hält RFC 5545 §3.1 ein: Zeilen höchstens 75 Byte
// (UTF-8), längere werden mit CRLF + Leerzeichen gefaltet, ohne ein Zeichen zu zerschneiden; die
// Datei endet mit CRLF. Vorher: SUMMARY eines langen Titels 106 Byte am Stück, kein CRLF am Ende.
import { describe, it, expect } from 'vitest';
import { buildICS } from '../utils/icsExport.js';

const lang = 'Prämienverbilligung beantragen – Unterlagen für die Gemeinde Zürich zusammenstellen und einreichen';
const ics = buildICS([{ id: 'r1', title: lang, dueDate: '2026-12-15', category: 'finance', recurrence: 'yearly' }]);
const bytes = (s) => new TextEncoder().encode(s).length;
// Entfalten nach RFC 5545: CRLF gefolgt von einem Leerzeichen entfernen.
const entfaltet = ics.replace(/\r\n /g, '');

describe('.ics: Zeilen falten', () => {
  it('keine physische Zeile über 75 Byte', () => {
    const zeilen = ics.split('\r\n');
    for (const z of zeilen) expect(bytes(z), z).toBeLessThanOrEqual(75);
  });

  it('entfaltet steht der Titel wieder ganz da — kein Umlaut zerschnitten', () => {
    expect(entfaltet).toContain('SUMMARY:' + lang.replace(/,/g, '\\,'));
    expect(ics).not.toContain('�');
  });

  it('Fortsetzungszeilen beginnen mit einem Leerzeichen', () => {
    const zeilen = ics.split('\r\n');
    const i = zeilen.findIndex((z) => z.startsWith('SUMMARY:'));
    expect(zeilen[i + 1].startsWith(' ')).toBe(true);
  });

  it('die Datei endet mit CRLF', () => {
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('kurze Zeilen bleiben unverändert', () => {
    expect(ics).toContain('\r\nDTSTART;VALUE=DATE:20261215\r\n');
  });
});
