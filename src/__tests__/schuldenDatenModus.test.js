import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { belegAlsForderung, abgleichBelege, uebernehmen, nachSchuldenSpeichern } from '../utils/offenePosten.js';

// Deploy-Gate 27.09.2026 (Code-Review): Nach «Beispiel verlassen» blieb der Schuldenmanager
// eingehängt, hielt die Beispiel-Listen im eigenen Zustand und schrieb sie beim nächsten
// Speichern über die echten Daten. Der Schlüssel `datenModus` baut ihn beim Moduswechsel neu auf.
// Gelesen wird der Quelltext, weil main.jsx als Ganzes nicht testbar eingehängt werden kann.
const src = readFileSync(resolve(__dirname, '..', 'main.jsx'), 'utf8');

describe('Schuldenmanager wird beim Wechsel Beispiel/Probe/echt neu aufgebaut', () => {
  it('datenModus unterscheidet die drei Stände', () => {
    expect(src).toMatch(/const datenModus = demoMode && demoData \? 'beispiel' : sandboxActive \? 'probe' : 'echt';/);
  });
  it('SchuldenManager trägt key: datenModus', () => {
    expect(src).toMatch(/React\.createElement\(SchuldenManager, \{\s*key: datenModus,/);
  });
});

// Schulden R2 · Task 4: ③ und der Bezahlt-Abgleich laufen als reine Funktionen, main.jsx ruft nur sie auf.
describe('Übernehmen und Abgleich: Verdrahtung in main.jsx', () => {
  const HEUTE = '2026-10-05';
  const prev = {
    basis: { canton: 'BS' },
    schulden: [],
    versicherungen: { franchise: 300, kkBelege: [{ id: 'b1', datum: '2026-08-01', betrag: 400, status: 'offen', frist: '2026-09-01' }] },
  };
  it('uebernehmen(prev, …) = { ...prev, ...belegAlsForderung(prev, …) }', () => {
    const erwartet = { ...prev, ...belegAlsForderung(prev, 'b1', HEUTE, 77) };
    expect(uebernehmen(prev, 'b1', HEUTE, 77)).toEqual(erwartet);
    expect(uebernehmen(prev, 'b1', HEUTE, 77).schulden).toHaveLength(1);
    expect(uebernehmen(prev, 'b1', HEUTE, 77).basis).toEqual({ canton: 'BS' });
  });
  it('zweiter Klick legt keine zweite Forderung an', () => {
    const einmal = uebernehmen(prev, 'b1', HEUTE, 77);
    expect(uebernehmen(einmal, 'b1', HEUTE, 78).schulden).toHaveLength(1);
  });
  it('nachSchuldenSpeichern(prev, s) = abgleichBelege({ ...prev, ...s })', () => {
    const verbunden = uebernehmen(prev, 'b1', HEUTE, 77);
    const s = { schulden: verbunden.schulden.map(f => ({ ...f, status: 'paid' })), betreibung: [], verlustscheine: [] };
    const erwartet = abgleichBelege({ ...verbunden, ...s });
    expect(nachSchuldenSpeichern(verbunden, s)).toEqual(erwartet);
    expect(nachSchuldenSpeichern(verbunden, s).versicherungen.kkBelege[0].status).toBe('bezahlt');
  });
  it('Forderung gelöscht: Beleg verliert forderungId und bleibt offen', () => {
    const verbunden = uebernehmen(prev, 'b1', HEUTE, 77);
    const nach = nachSchuldenSpeichern(verbunden, { schulden: [], betreibung: [], verlustscheine: [] });
    expect(nach.versicherungen.kkBelege[0].forderungId).toBeUndefined();
    expect(nach.versicherungen.kkBelege[0].status).toBe('offen');
  });
  it('kein Array bei schulden: nicht abgleichen, Beleg behält forderungId', () => {
    const verbunden = uebernehmen(prev, 'b1', HEUTE, 77);
    const nach = nachSchuldenSpeichern(verbunden, { betreibung: [] });
    expect(nach.versicherungen.kkBelege[0].forderungId).toBe('77');
  });
  it('main.jsx ruft nur die beiden Funktionen auf', () => {
    expect(src).toMatch(/onSave: \(schuldenData\) => writeData\(prev => nachSchuldenSpeichern\(prev, schuldenData\)\)/);
    expect(src).toMatch(/uebernehmen\(prev, id, heuteIso\(\), Date\.now\(\)\)/);
  });
  it('Beispielmodus: onUebernehmen wird nicht übergeben (wie updateData)', () => {
    expect(src).toMatch(/onUebernehmen: demoMode \? undefined : /);
  });
});
