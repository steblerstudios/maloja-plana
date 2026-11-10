// Sozialhilfequote 2025 (BFS, publiziert 27.10.2026; PxWeb px-x-1304030000_121, abgerufen 10.11.2026).
// Pinnt die Sache: Karte und Daten nennen dasselbe Jahr, alle 26 Kantone + CH haben einen Wert 2025,
// und der CH-Wert entspricht der BFS-Mitteilung («Sozialhilfequote von 2,9 %», rund 267 300 Personen).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { KARTEN } from '../data/kantonskarten.js';

const daten = JSON.parse(readFileSync(new URL('../../scripts/daten/kantonsatlas/sozialhilfe.json', import.meta.url), 'utf8'));
const KANTONE = ['ZH', 'BE', 'LU', 'UR', 'SZ', 'OW', 'NW', 'GL', 'ZG', 'FR', 'SO', 'BS', 'BL', 'SH', 'AR', 'AI', 'SG', 'GR', 'AG', 'TG', 'TI', 'VD', 'VS', 'NE', 'GE', 'JU'];

describe('Sozialhilfequote 2025', () => {
  it('alle Kantone und CH haben q25', () => {
    for (const k of ['CH', ...KANTONE]) expect(typeof daten[k].q25, k).toBe('number');
    expect(daten.CH.q25).toBe(2.9);
  });

  it('die Karte nennt 2025 und die Publikation vom 27.10.2026', () => {
    const karte = (Array.isArray(KARTEN) ? KARTEN : Object.values(KARTEN)).find((k) => k.titel === 'Sozialhilfequote');
    expect(karte).toBeTruthy();
    expect(karte.legende).toContain('2025');
    expect(JSON.stringify(karte)).toContain('publiziert 27.10.2026');
    expect(JSON.stringify(karte)).not.toContain('2024, publiziert');
  });

  it('die Vergleichsseite liest q25, nicht q24', () => {
    const src = readFileSync(new URL('../../scripts/seiten-vergleich.mjs', import.meta.url), 'utf8');
    expect(src).toMatch(/A\.sozialhilfe\[k\]\.q25/);
    expect(src).not.toMatch(/A\.sozialhilfe\[k\]\.q24/);
  });
});
