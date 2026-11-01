import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Rundgang im Browser 01.11.2026: jedes Sprungziel liegt unter der klebenden Kopfzeile frei, und der Rahmen
// bleibt bei dem, was man bedient. Ein Ziel ohne Abstand landet hinter der Kopfzeile.
const lies = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('Sprungziele', () => {
  it('der Steuer-Import hält Abstand zur Kopfzeile', () => {
    expect(lies('TaxCalculator.jsx')).toMatch(/id: TAX_IMPORT_ANKER[^\n]*scrollMarginTop: 'var\(--mp-sprungabstand\)'/);
  });

  it('grosse Flächen tragen keinen Fokusrahmen, Überschriften und Knöpfe schon', () => {
    const css = lies('tokens.css');
    const regel = css.match(/([^}]*)\{\s*outline: none !important;\s*\}/);
    expect(regel[1]).toMatch(/main\[tabindex="-1"\]:focus-visible/);
    expect(regel[1]).toMatch(/section\[tabindex="-1"\]:focus-visible/);
    expect(regel[1]).toMatch(/details\[tabindex="-1"\]:focus-visible/);
    expect(regel[1]).not.toMatch(/h[1-6]\[|button|\[tabindex\]:focus-visible/);
  });
});
