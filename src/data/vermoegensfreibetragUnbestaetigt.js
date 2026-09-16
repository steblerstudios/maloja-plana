// Vermögensfreibetrag: Kantone, deren Betrag in data/sozialhilfeRechner.js (VFB_KANTON)
// NICHT kantonal bestätigt ist (Entscheid 16.09.2026, «Je Kanton, gekennzeichnet»).
// Beleg-Dokument docs/sources/skos-vermoegensfreibetrag-2026.md, Status ⚠️:
//   SG  nur indirekt belegt (Beiblatt KOS-Handbuch, Stadt Wil, Asylsozialhilfe)
//   FR  Quelle veraltet (Directives LASoc 2017, vor der neuen LASoc 2026)
//   VD  Quelle veraltet (RLASV «Etat au 01.02.2008»)
//   AI  nicht amtlich belegt (nicht-öffentliche Richtlinien der Standeskommission)
//   OW  nicht amtlich belegt (kein Vermögensartikel in SHG/SHV)
//   BL  nicht amtlich belegt (nur SKOS-Karte)
//   TI  nicht amtlich belegt (nur SKOS-Karte)
// Eigene Datei, damit die Liste nur im Lazy-Chunk der Sozialhilfe-Ansicht liegt
// (Hauptbundle-Budget). Die App zeigt dort: «Kantonal nicht bestätigt — bitte beim
// Sozialdienst der Gemeinde prüfen».
export const VFB_UNBESTAETIGT = ['SG', 'FR', 'VD', 'AI', 'OW', 'BL', 'TI'];

export const vermoegensfreibetragUnbestaetigt = (kanton) => VFB_UNBESTAETIGT.includes(kanton);
