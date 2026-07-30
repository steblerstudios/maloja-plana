import { describe, it, expect } from 'vitest';
import { getChapters } from '../constants.js';

// ─────────────────────────────────────────────────────────────
// Kapitel-Reihenfolge-Anker
//
// Mehrere Views navigieren mit HARTCODIERTEN Indizes ins Kapitel-Array
// (`onNavigate('chapter', <n>)`), z.B.:
//   - FinanzUebersicht.jsx  → ('chapter', 2)  = finanzen
//   - ChapterView.jsx       → ('chapter', 1)  = wohnen
//   - ChapterView.jsx       → ('chapter', 2)  = finanzen
//   - ChapterView.jsx       → ('chapter', 4)  = ausbildung
//   - InstrumentePanel.jsx  → ('chapter', 3)  = versicherungen
//   - Schnellcheck.jsx      → ('chapter', 0)  = basis
//
// Sortiert jemand die Kapitel in getChapters() um, zeigen diese Zahlen
// STILL ins falsche Kapitel — kein Fehler, kein roter Test, erst die
// Nutzerin merkt es. Dieser Test verankert die Reihenfolge: bricht er,
// müssen die hartcodierten Indizes oben mitgezogen werden (oder besser:
// auf Kapitel-KEY statt Index umgestellt werden).
// ─────────────────────────────────────────────────────────────

// Passthrough-Stub: getChapters(t) braucht ein t nur für Titel/Labels,
// die KEYS sind davon unabhängig.
const t = (key) => key;

describe('Kapitel-Reihenfolge (Anker für hartcodierte Navigations-Indizes)', () => {
  const keys = getChapters(t).map((c) => c.key);

  it('hält die exakte Kapitel-Reihenfolge', () => {
    expect(keys).toEqual([
      'basis',        // 0
      'wohnen',       // 1
      'finanzen',     // 2
      'versicherungen', // 3
      'ausbildung',   // 4
      'behoerden',    // 5
      'notfall',      // 6
    ]);
  });

  // Jede Zeile spiegelt einen echten hartcodierten Sprung in einer View.
  // Ändert sich einer, schlägt genau der betroffene Anker fehl.
  it.each([
    [0, 'basis',          'Schnellcheck.jsx'],
    [1, 'wohnen',         'ChapterView.jsx'],
    [2, 'finanzen',       'FinanzUebersicht.jsx + ChapterView.jsx'],
    [3, 'versicherungen', 'InstrumentePanel.jsx'],
    [4, 'ausbildung',     'ChapterView.jsx'],
  ])('Index %i ist "%s" (genutzt von %s)', (idx, erwarteterKey) => {
    expect(keys[idx]).toBe(erwarteterKey);
  });

  it('enthält keine doppelten Kapitel-Keys', () => {
    expect(new Set(keys).size).toBe(keys.length);
  });
});
