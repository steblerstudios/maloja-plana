// Test-Hilfe zu E9: heute ist kein Kanton in CANTONAL_IPV amtlich belegt, darum
// zeigt die App nirgends einen IPV-Betrag. Tests, die das Verhalten MIT belegtem
// Kanton festhalten (Betrag wie bisher), simulieren den Beleg hier und stellen den
// Ausgangszustand danach wieder her. Kein Produktionscode liest diese Datei.
import { CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

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

// ⟨28.09.2026, K31 BS — Befund Fachprüfung W3⟩ Ein fester MUSTER-KANTON für die Tests des linearen
// Muster-Abbaus und der Orientierung ohne Beleg. Bis heute liefen diese Tests mit einem echten,
// noch unbelegten Kanton (LU → BS → VD → GE). Seit alle Kantone ein eigenes Modul bekommen, gibt
// es keinen stabilen Stellvertreter mehr: sobald der gewählte Kanton sein Modul hat, springt
// calculateIPV dorthin, und die Muster-Erwartungen brechen — ohne Textkonflikt, erst in der CI.
// Darum macht dieser Helfer aus dem genannten Kanton für die Dauer des Tests einen Muster-Kanton:
// Musterwerte fest (die bisherigen GE-Musterwerte), Modul ausgeblendet, Beleg nach Wunsch.
// Gibt eine Funktion zurück, die Zeile und Register-Eintrag wiederherstellt.
export const MUSTERWERTE = Object.freeze({
  maxIncome: 60000, subsidySingle: 3600, subsidyFamily: 7200, subsidyChild: 1800,
  modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData',
});
export function musterKanton(kanton = 'GE', { belegt = false } = {}) {
  const zeile = CANTONAL_IPV[kanton];
  const modul = IPV_MODULE[kanton];
  CANTONAL_IPV[kanton] = { ...MUSTERWERTE, beleg: belegt ? { quelle: TEST_QUELLE, stand: 'Test' } : null };
  delete IPV_MODULE[kanton];
  return () => {
    CANTONAL_IPV[kanton] = zeile;
    if (modul) IPV_MODULE[kanton] = modul;
  };
}
