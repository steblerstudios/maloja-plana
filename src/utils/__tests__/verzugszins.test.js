import { describe, it, expect } from 'vitest';
import { verzugszins, tageZwischen, leseSatz, zinsEingabeStatus, SATZ_GESETZ } from '../verzugszins.js';

// OR Art. 104 Abs. 1 (5 % für das Jahr), Abs. 2 (höherer Vertragssatz), Art. 105 Abs. 3
// (kein Zinseszins). Tageszählung nicht im Gesetz → 365 und 360 nebeneinander.
describe('Verzugszins — Annäherung', () => {
  it('Gesetz: 5 % pro Jahr', () => {
    expect(SATZ_GESETZ).toBe(5);
  });
  it('1000 Franken, ein Jahr (365 Tage) → 50 Franken; 360er-Zählung etwas mehr', () => {
    const r = verzugszins({ betrag: 1000, seit: '2025-01-01', bis: '2026-01-01' });
    expect(r.tage).toBe(365);
    expect(r.zins365).toBe(50);
    expect(r.zins360).toBe(50.69);
  });
  it('einfacher Zins, kein Zinseszins: zwei Jahre = doppelt so viel', () => {
    const r = verzugszins({ betrag: 1000, seit: '2024-01-01', bis: '2025-12-31' });
    expect(r.tage).toBe(730);
    expect(r.zins365).toBe(100);
  });
  it('Tag des Verzugsbeginns zählt nicht mit, Stichtag schon', () => {
    expect(tageZwischen('2026-09-26', '2026-09-27')).toBe(1);
    expect(tageZwischen('2026-03-28', '2026-03-30')).toBe(2); // über die Sommerzeit-Umstellung
  });
  it('höherer Vertragssatz wird übernommen (Abs. 2)', () => {
    expect(verzugszins({ betrag: 1000, satz: '9,9', seit: '2025-01-01', bis: '2026-01-01' }).zins365).toBe(99);
  });
  it('ungültig → kein Betrag statt eines falschen', () => {
    expect(verzugszins({ betrag: 0, seit: '2025-01-01', bis: '2026-01-01' })).toBeNull();
    expect(verzugszins({ betrag: 1000, seit: '2026-10-01', bis: '2026-09-27' })).toBeNull(); // Zukunft
    expect(verzugszins({ betrag: 1000, seit: '2026-09-27', bis: '2026-09-27' })).toBeNull(); // 0 Tage
    expect(verzugszins({ betrag: 1000, seit: '2026-02-31', bis: '2026-09-27' })).toBeNull();
    expect(verzugszins({ betrag: 1000, satz: '50', seit: '2025-01-01', bis: '2026-01-01' })).toBeNull();
  });
  it('Satz-Eingabe: Komma/Punkt, nur 0 < Satz ≤ 30', () => {
    expect(leseSatz('5')).toBe(5);
    expect(leseSatz('7,5')).toBe(7.5);
    expect(leseSatz('0')).toBeNull();
    expect(leseSatz('31')).toBeNull();
    expect(leseSatz('5%')).toBe(5);
    expect(leseSatz('7,5 %')).toBe(7.5);
    expect(leseSatz('5 Prozent')).toBeNull();
  });
  it('Status sagt, warum nichts gerechnet wird (Deploy-Gate 27.09.)', () => {
    expect(zinsEingabeStatus({ betrag: 0, seit: '2026-01-01', bis: '2026-09-27' })).toBe('fehlt');
    expect(zinsEingabeStatus({ betrag: 100, seit: '', bis: '2026-09-27' })).toBe('fehlt');
    expect(zinsEingabeStatus({ betrag: 100, satz: '50', seit: '2026-01-01', bis: '2026-09-27' })).toBe('satz');
    expect(zinsEingabeStatus({ betrag: 100, seit: '2026-09-27', bis: '2026-09-27' })).toBe('zukunft');
    expect(zinsEingabeStatus({ betrag: 100, seit: '2026-10-01', bis: '2026-09-27' })).toBe('zukunft');
    expect(zinsEingabeStatus({ betrag: 100, satz: '5 %', seit: '2026-01-01', bis: '2026-09-27' })).toBe('ok');
  });
});
