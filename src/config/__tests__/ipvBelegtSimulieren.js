// Test-Hilfe zu E9: heute ist kein Kanton in CANTONAL_IPV amtlich belegt, darum
// zeigt die App nirgends einen IPV-Betrag. Tests, die das Verhalten MIT belegtem
// Kanton festhalten (Betrag wie bisher), simulieren den Beleg hier und stellen den
// Ausgangszustand danach wieder her. Kein Produktionscode liest diese Datei.
import { CANTONAL_IPV } from '../cantonalData.js';

const TEST_QUELLE = 'Test-Simulation (kein amtlicher Beleg)';

// Markiert die genannten Kantone (ohne Angabe: alle) als belegt.
// Gibt eine Funktion zurück, die den vorherigen Zustand wiederherstellt.
export function kantoneBelegtSimulieren(kantone = Object.keys(CANTONAL_IPV)) {
  const vorher = kantone.map((k) => [k, CANTONAL_IPV[k].beleg]);
  for (const k of kantone) CANTONAL_IPV[k].beleg = { quelle: TEST_QUELLE, stand: 'Test' };
  return () => {
    for (const [k, alt] of vorher) CANTONAL_IPV[k].beleg = alt;
  };
}
