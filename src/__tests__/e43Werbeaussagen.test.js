import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// E43 (Entscheid 17.09.2026): keine absolute «100 % privat / lokal»-Werbung mehr —
// beim Laden verarbeitet der Hoster technische Daten (Datenschutzerklärung §5).
// Belegbar ist: Eingaben werden lokal gespeichert und bleiben auf dem Gerät.
// Im Oktober zusätzlich zur Jurist:in (Bau-Liste K48).
const ABSOLUT = /100\s?%\s*(privat|lokal|private|local|privé|privato|locale|auf|on|sur|sul|sin)(?!\p{L})/iu;
const DATEIEN = [
  'index.html',
  'public/manifest.json',
  'src/i18n/de.js',
  'src/i18n/en.js',
  'src/i18n/fr.js',
  'src/i18n/it.js',
  'src/i18n/rm.js',
];

describe('E43 · keine absolute Privatheits-Werbung', () => {
  for (const datei of DATEIEN) {
    it(`${datei}: kein «100 % privat/lokal»`, () => {
      const zeilen = readFileSync(join(process.cwd(), datei), 'utf8').split('\n');
      const treffer = zeilen.map((z, i) => [i + 1, z]).filter(([, z]) => ABSOLUT.test(z)).map(([n]) => n);
      expect(treffer, `${datei} Zeilen: ${treffer.join(', ')}`).toEqual([]);
    });
  }

  it('Gegenprobe: das Muster erkennt die alten Formen, nicht Rechen-Prozente', () => {
    for (const alt of ['100% privat, offline-fähig', '100% lokal.', '100% on your device', '100% privé', '100% sul Suo dispositivo']) {
      expect(alt).toMatch(ABSOLUT);
    }
    expect('auf 100% hochgerechnet').not.toMatch(ABSOLUT);
    expect('ab jetzt zahlt die Kasse 100%.').not.toMatch(ABSOLUT);
  });
});
