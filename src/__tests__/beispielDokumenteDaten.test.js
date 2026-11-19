import { describe, it, expect } from 'vitest';
import { DEMO_DOCS } from '../config/demoData.js';
import { DEMO_DOCS as AUS_SPEICHER } from '../demo/demoSpeicher.js';
import { imFach, ablageZaehler } from '../DocumentTresor.jsx';

// 19.11.2026 (Sophie: «Beispiel soll alles anzeigen»): Maria bringt Dokumente mit, damit die Ablage
// im Beispiel nicht leer ist und alle drei Fächer etwas zeigen.
describe('Beispiel-Dokumente', () => {
  it('jedes Dokument liegt in einem Fach (sonst wäre es unsichtbar)', () => {
    for (const d of DEMO_DOCS) {
      expect(imFach(d, 'aktiv') || imFach(d, 'archiv')).toBe(true);
    }
  });
  it('alle drei Fächer sind belegt: gültig, bald fällig, Archiv', () => {
    const z = ablageZaehler(DEMO_DOCS);
    expect(z.active).toBeGreaterThan(0);
    expect(z.expiring).toBeGreaterThan(0);
    expect(z.archived).toBeGreaterThan(0);
  });
  it('Form wie ein Upload: eindeutige id, Kapitel, Art, Datei inline', () => {
    const ids = new Set(DEMO_DOCS.map((d) => d.id));
    expect(ids.size).toBe(DEMO_DOCS.length);
    for (const d of DEMO_DOCS) {
      expect(d.chapter && d.type && d.fileName && d.expiryDate).toBeTruthy();
      expect(d.data).toMatch(/^data:text\/plain/);
      expect(decodeURIComponent(d.data)).toContain('Keine echte Urkunde');
    }
  });
  it('die Code-Wand bekommt dieselben Dokumente', () => {
    expect(AUS_SPEICHER).toBe(DEMO_DOCS);
  });
});
