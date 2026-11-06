import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Verbesserungen B2 (docs/entscheide/verbesserungen-2026-11.md, 06.11.2026): mit der Vorgabe von 5 s liefen
// unter Last (drei gleichzeitige Läufe) 8–10 Tests in die Zeitgrenze, jedes Mal andere. Mit 30 s: 0.
// Dieser Test hält fest, dass die Grenze nicht still auf die Vorgabe zurückfällt.
const config = fs.readFileSync(path.resolve(__dirname, '../../vite.config.js'), 'utf8');

describe('Zeitgrenze der Testreihe', () => {
  it('Tests und Vorbereitungen haben 30 s, nicht die Vorgabe von 5 s', () => {
    expect(config).toMatch(/testTimeout: 30_000/);
    expect(config).toMatch(/hookTimeout: 30_000/);
  });
});
