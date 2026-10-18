// Sammel-Fix 14.10.2026, Punkt 2 (K123): «AHV im QR» wird jedes Mal neu gewählt.
// handleSave leerte die Felder, liess das Kästchen aber stehen. Kein DOM-Test
// (vitest ohne jsdom): Quelltext-Wächter auf handleSave.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const quelle = fs.readFileSync(path.resolve(__dirname, '../KKScanner.jsx'), 'utf8');

describe('KK-Karte: Kästchen «AHV im QR» nach dem Speichern', () => {
  it('handleSave setzt ahvImQr auf false zurück', () => {
    const start = quelle.indexOf('const handleSave');
    const ende = quelle.indexOf('};', start);
    expect(start).toBeGreaterThan(-1);
    expect(quelle.slice(start, ende)).toMatch(/setAhvImQr\(false\)/);
  });
});
