// Die KK-Karte sagt, was los ist — bei Fehler, beim Speichern und beim leeren Foto.
//
// Bis 24.09.2026 brach Speichern bei ungültiger Eingabe stumm ab (`return`), ein
// gelungenes Speichern leerte das Formular ohne ein Wort, und ein Foto ohne Inhalt
// wurde als «Scan erfolgreich (OCR)» gemeldet. Kein DOM-Test (das Projekt fährt
// vitest ohne jsdom): die Logik direkt, die Verdrahtung als Quelltext-Wächter.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { scanHatInhalt, validateKKData } from '../kkScanner.js';
import de from '../i18n/de.js';

const quelle = fs.readFileSync(path.resolve(__dirname, '../KKScanner.jsx'), 'utf8');

describe('scanHatInhalt', () => {
  it('leeres OCR-Ergebnis ist kein Erfolg', () => {
    expect(scanHatInhalt(null)).toBe(false);
    expect(scanHatInhalt({})).toBe(false);
    expect(scanHatInhalt({ insurer: '', cardNumber: '  ', ahv: undefined })).toBe(false);
  });
  it('ein einziger gelesener Wert genügt', () => {
    expect(scanHatInhalt({ insurer: 'CSS', cardNumber: '' })).toBe(true);
    expect(scanHatInhalt({ franchise: 300 })).toBe(true);
  });
});

describe('Fehler werden gezeigt, nicht verschluckt', () => {
  it('leere Eingabe liefert Gründe, die im Deutschen sagen, was fehlt', () => {
    const t = (k) => k.split('.').reduce((o, s) => o?.[s], de);
    const { valid, errors } = validateKKData({}, t);
    expect(valid).toBe(false);
    expect(errors).toEqual(['Versicherer fehlt', 'Kartennummer fehlt oder ist unvollständig']);
  });

  it('jeder Aufruf von validateKKData reicht die Gründe weiter, bevor er abbricht', () => {
    const aufrufe = [...quelle.matchAll(/validateKKData\(kkData, t\);\n([^\n]*)\n([^\n]*)/g)];
    expect(aufrufe.length).toBe(2);
    for (const [, z1, z2] of aufrufe) {
      expect(z1).toMatch(/setFehler\(validation\.errors\)/);
      expect(z2).toMatch(/if \(!validation\.valid\) return;/);
    }
  });

  it('die Fehlerliste ist eine Alarm-Region und am Knopf verknüpft', () => {
    expect(quelle).toMatch(/id: 'kk-fehler', role: 'alert'/);
    expect(quelle).toMatch(/'aria-describedby': fehler\.length > 0 \? 'kk-fehler'/);
  });

  it('Speichern und leeres Foto melden sich in einer Status-Region', () => {
    expect(quelle).toMatch(/setGespeichert\(true\)/);
    // Seit 24.09. abends über den gemeinsamen Baustein (GespeichertZeile), nicht mehr inline.
    expect(quelle).toMatch(/createElement\(GespeichertZeile, \{ palette, t, sichtbar: gespeichert \}\)/);
    expect(quelle).toMatch(/nichtsGelesen && !scanning && React\.createElement\('p', \{\s*role: 'status'/);
  });
});
