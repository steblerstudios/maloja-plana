import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AHV_PARAMS, BVG_PARAMS, AHV_DATA_VERSION, AHV_DATA_SOURCE, berechneAltersrente, BVG_EINTRITTSSCHWELLE_JAHR } from '../ahvRechner.js';
import { KOORDINATIONSABZUG } from '../lohnAbzuege.js';
import { EO_DATA_VERSION, EO_DATA_SOURCE } from '../eoRechner.js';
import { ALV_PARAMS, ALV_DATA_VERSION } from '../alvRechner.js';
import { SAEULE3A_HOECHSTABZUG, SAEULE3A_MAX } from '../saeule3a.js';

// Was beim LADEN aus der Uhr gebildet wird: mit fester Uhr 15.01.2027 muss die App von selbst die
// Werte 2027 zeigen (Weg A: Deploy im Dezember, Umschalten am 1.1. ohne neuen Deploy).
// `vi.hoisted` läuft vor den Importen.
vi.hoisted(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2027-01-15T10:00:00')); });

describe('Uhr 15.01.2027: die Konstanten zeigen die Werte 2027', () => {
  // Die feste Test-Uhr (src/__tests__/festeUhr.setup.js) stellt vor jedem Test auf 22.10.2026
  // zurück. Für Rechnungen «ohne Stichtag = heute» hier wieder auf 2027.
  beforeEach(() => { vi.setSystemTime(new Date('2027-01-15T10:00:00')); });
  it('AHV', () => {
    expect(AHV_PARAMS).toMatchObject({ minRente: 1280, maxRente: 2560, maxEhepaar: 3840, maxVersichertesEinkommen: 92160 });
    expect(AHV_DATA_VERSION).toBe('2027');
    expect(AHV_DATA_SOURCE).toContain('1.1.2027');
    // ohne Stichtag rechnet der Rechner mit heute
    const r = berechneAltersrente({ geburtsjahr: 1965, durchschnittlichesJahreseinkommen: 10000, beitragsjahre: 44 });
    expect(r.monatsrente).toBe(1280);
    expect(r.werteJahr).toBe(2027);
  });
  it('BVG — eine Quelle für die Eintrittsschwelle, Mindestzins unverändert', () => {
    expect(BVG_PARAMS.eintrittsschwelle).toBe(23040);
    expect(BVG_EINTRITTSSCHWELLE_JAHR).toBe(23040);
    expect(BVG_PARAMS.koordinationsabzug).toBe(26880);
    expect(KOORDINATIONSABZUG).toBe(26880);
    expect(BVG_PARAMS.mindestzins).toBe(1.25);
  });
  // ALV: seit 26.10.2026 (Werte 2027 vorbereiten) bleibt die Version auf 2026, solange der Grenzbetrag
  // für den 80-%-Satz (AVIV Art. 33 Abs. 2) für 2027 nicht belegt ist — vorher wies der Rechner «2027» aus.
  it('EO Version 2027; ALV bleibt 2026, bis der Grenzbetrag 80 % für 2027 belegt ist', () => {
    expect(EO_DATA_VERSION).toBe('2027');
    expect(EO_DATA_SOURCE).toContain('AS 2026 542');
    expect(ALV_PARAMS.version).toBe('2026');
    expect(ALV_DATA_VERSION).toBe('2026');
    expect(ALV_PARAMS.satz80Belegt).toBe(false);
    expect(ALV_PARAMS.versicherterVerdienstMax).toBe(12350);
  });
  it('Säule 3a: laufendes Steuerjahr 2027', () => {
    expect(SAEULE3A_HOECHSTABZUG.steuerjahr).toBe(2027);
    expect(SAEULE3A_HOECHSTABZUG.mitPensionskasse).toBe(7373);
    expect(SAEULE3A_MAX).toBe(7373);
  });
});
