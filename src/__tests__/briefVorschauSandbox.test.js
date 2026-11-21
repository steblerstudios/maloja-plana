// 19.11.2026: Die Brief-Vorschau zeigt HTML aus Nutzereingaben in einem iframe (srcDoc).
// Ohne sandbox liefe darin eingetipptes Skript mit der Herkunft der App und käme an ihren
// Speicher. Leeres sandbox sperrt Skripte, Formulare und gibt dem Rahmen eine eigene Herkunft.
// Offener «Kann»-Punkt aus der Predeploy-Ampel vom 02.11.2026 («Brief-Vorschau ohne sandbox»).
// Kein DOM in dieser Testumgebung (kein jsdom) → der Vertrag wird am Quelltext gehalten.
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync(path.join(__dirname, '..', 'BriefGenerator.jsx'), 'utf8');

describe('Brief-Vorschau läuft im sandbox', () => {
  const start = src.indexOf("React.createElement('iframe'");
  const iframe = src.slice(start, src.indexOf('}),', start));

  it('es gibt genau einen iframe, und der zeigt die Vorschau', () => {
    expect(src.split("React.createElement('iframe'").length - 1).toBe(1);
    expect(iframe).toContain('srcDoc: previewHtml');
  });

  it('der iframe hat ein leeres sandbox, ohne jede Lockerung', () => {
    expect(iframe).toMatch(/sandbox: ''/);
    expect(iframe).not.toMatch(/allow-scripts|allow-same-origin/);
  });

  it('der Brief selbst braucht kein Skript', () => {
    const brief = fs.readFileSync(path.join(__dirname, '..', 'briefGenerator.js'), 'utf8');
    expect(brief).not.toMatch(/<script/i);
  });
});
