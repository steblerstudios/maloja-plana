import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Zusammenlegung Kapitel Finanzen + Finanz-Übersicht, Bauschritt 5 (docs/entscheide/finanzen-fusion.md):
// der Mietvergleich, der auf der Finanz-Übersicht unter dem Lohn stand, gehört zum Wohnen — er
// steht im Kapitel Wohnen direkt unter dem Wohnkostenanteil.
const QUELLE = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');

describe('Mietvergleich im Kapitel Wohnen', () => {
  it('erst bei Bedarf geladen, wie die anderen Bausteine nur eines Kapitels', () => {
    expect(QUELLE).toMatch(/const MietVergleich = React\.lazy\(\(\) => import\('\.\/components\/MietVergleich\.jsx'\)/);
  });

  it('nur im Kapitel Wohnen, mit dem ganzen Profil (Kanton und Haushalt stehen in anderen Kapiteln)', () => {
    expect(QUELLE).toMatch(/chapter\.key === 'wohnen' && allData && React\.createElement\(React\.Suspense, \{ key: 'miet-vergleich'/);
    expect(QUELLE).toMatch(/React\.createElement\(MietVergleich, \{ palette, t: tr, data: allData, isDarkMode \}\)/);
  });

  it('direkt unter dem Wohnkostenanteil, vor dem Versicherungs-Schutzschild', () => {
    const anteil = QUELLE.indexOf('// Wohnkostenanteil');
    const miete = QUELLE.indexOf("key: 'miet-vergleich'");
    const schild = QUELLE.indexOf('// Versicherungs-Schutzschild');
    expect(anteil).toBeGreaterThan(-1);
    expect(anteil).toBeLessThan(miete);
    expect(miete).toBeLessThan(schild);
  });
});
