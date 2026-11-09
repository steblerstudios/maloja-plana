// Ecke nach Rolle (Brand Book §7a, Regel C «Ecke wächst mit der Grösse»; #734, #761):
// Ein Kasten über die volle Breite, deutlich höher als ein Bedienelement (44 px), ist eine
// Karte und bekommt radius.lg (16 px). radius.md (10) gehört zu Knöpfen, Feldern, Auswahlen.
// Gefunden beim Browser-Durchlauf über alle 74 Ansichten auf main a045d901 (08.11.2026).
// Kacheln im Raster gelten auch als Karten (Stebler Studios 09.11.2026, «Ja, Kacheln 16»):
// halbbreit, aber 64–88 px hoch, also weit über Bedienhöhe. Alle Kacheln eines Rasters zusammen.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');

// [Datei, Merkmal direkt vor der Ecke, was es ist]
const STELLEN = [
  ['AsylView.jsx', 'disclaimer: {', 'Asyl: Hinweis «Orientierung, keine Rechtsberatung»'],
  ['AsylView.jsx', 'fristen: {', 'Asyl: Kasten Beschwerdefristen'],
  ['AblaufSchale.jsx', 'const kartenStil', 'Frist-Karte in allen Abläufen'],
  ['components/MietVergleich.jsx', "padding: '12px', background: palette.up", 'Mietzins: «Wo steht Ihre Miete?»'],
  ['NotfallVorlesekarte.jsx', 'readCard: {', 'Notfallkarte: Abschnitte'],
  ['NotfallpassBlatt.jsx', 'hinweis: {', 'Notfallpass: Hinweis'],
  ['NotfallpassBlatt.jsx', 'liste: {', 'Notfallpass: Listen'],
  ['Lebenssituationen.jsx', 'const extCard', 'Situationen: Link-Karten'],
  ['Lebenssituationen.jsx', 'const cardStyle', 'Situationen: Berechtigungs-Karten'],
  ['AnspruchLandkarte.jsx', 'const cardStyle', 'Situationen/Anspruch-Landkarte: Karten (SERAFE, SBB …)'],
  ['components/NotfallImKapitel.jsx', 'const rahmen', 'Notfall-Kapitel: Rahmen Patientenverfügung'],
  ['components/NotfallImKapitel.jsx', 'const kachel = ', 'Notfall-Kapitel: Kacheln «Ihre Notfall-Unterlagen»'],
  ['components/NotfallImKapitel.jsx', 'const stil = { display', 'Notfall-Kapitel: Kacheln Vorsorge (Organspende …)'],
];

describe('Kästen über die volle Breite sind Karten (radius.lg)', () => {
  for (const [datei, merkmal, was] of STELLEN) {
    it(was, () => {
      const src = fs.readFileSync(path.join(SRC, datei), 'utf8');
      const start = src.indexOf(merkmal);
      expect(start, `Merkmal «${merkmal}» in ${datei}`).toBeGreaterThan(-1);
      const ecke = src.slice(start).match(/borderRadius:\s*(radius\.\w+)/);
      expect(ecke && ecke[1]).toBe('radius.lg');
    });
  }
});
