import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Sammel-Fix 14.10.2026, Punkt 7: DSG Art. 5 lit. c — «Daten über Massnahmen der sozialen Hilfe»
// sind Ziff. 6 (Ziff. 4 wären die biometrischen Daten). compliance-overview.md nennt es richtig.
const lies = (p) => fs.readFileSync(path.resolve(__dirname, '../../docs', p), 'utf8');

describe('DSFA-Kurzfassung: Ziffer der sozialen Hilfe in Art. 5 lit. c DSG', () => {
  it('nennt Ziff. 6, nicht Ziff. 4', () => {
    const text = lies('legal/dsfa-kurzfassung.md');
    expect(text).toMatch(/Massnahmen der sozialen Hilfe \(Ziff\. 6\)/);
    expect(text).not.toMatch(/Massnahmen der sozialen Hilfe \(Ziff\. 4\)/);
  });
  it('stimmt mit compliance-overview.md überein', () => {
    expect(lies('security/compliance-overview.md')).toMatch(/Massnahmen der sozialen Hilfe \(Ziff\. 6\)/);
  });
});
