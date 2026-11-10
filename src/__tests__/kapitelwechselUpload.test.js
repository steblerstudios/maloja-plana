// Bugsuche 09.11.2026, Fund 9 · Ein angefangener Datei-Upload wandert nicht ins nächste Kapitel.
//
// ChapterView wird beim Kapitelwechsel nicht neu aufgebaut (main.jsx gibt keinen key, bewusst:
// «Kapitelwechsel ohne Neuaufbau»). Vorher (Nachstellen): in Basis Typ «Ausweis», Ablaufdatum
// und Datei wählen, nicht hochladen, «Weiter mit Wohnen» → in Wohnen stand das Formular noch
// gefüllt; Hochladen legte das Dokument als chapter 'wohnen' mit Typ 'id' ab.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.join(__dirname, '..', 'ChapterView.jsx'), 'utf8');

describe('Kapitelwechsel leert das Upload-Formular', () => {
  it('ein Effekt auf chapter.key setzt Datei, Typ, Ablaufdatum und Meldungen zurück', () => {
    const effekte = src.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[chapter\.key\]\)/g) || [];
    const reset = effekte.find((e) => e.includes('setUploadFile(null)'));
    expect(reset, 'kein Effekt auf chapter.key, der den Upload leert').toBeTruthy();
    for (const aufruf of ["setUploadFile(null)", "setUploadType('')", "setUploadExpiry('')", "setUploadError('')", "setUploadSuccess('')"]) {
      expect(reset).toContain(aufruf);
    }
  });
});
