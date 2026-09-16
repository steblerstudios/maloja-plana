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
// Eigene Datei (klein). Seit R4 (16.09.2026) liest auch calculateSozialhilfe die Liste
// (Flag `vfbUnbestaetigt`), damit Dashboard und Schnellcheck den Hinweis zeigen, wenn der
// Freibetrag in einen «Anspruch» einfliesst — die Liste liegt damit im Hauptbundle.
// Die App zeigt: «Kantonal nicht bestätigt — bitte beim Sozialdienst der Gemeinde prüfen».
export const VFB_UNBESTAETIGT = ['SG', 'FR', 'VD', 'AI', 'OW', 'BL', 'TI'];

// Nur für Haushalte MIT minderjährigen Kindern nicht bestätigt (Einzel/Paar dort belegt,
// die Kinder-Regel ist von uns gedeutet — Entscheid 16.09.2026):
//   SH  Kinderzuschlag und Höchstbetrag in Ziff. D.6.1 nicht geregelt → App rechnet ohne Zuschlag
//   AG  «Freibeträge pro Person» → App liest: Kinder zählen als Person (+1'500, max. 4'500)
export const VFB_UNBESTAETIGT_MIT_KINDERN = ['SH', 'AG'];

export const vermoegensfreibetragUnbestaetigt = (kanton, minorChildren = 0) =>
  VFB_UNBESTAETIGT.includes(kanton) || (minorChildren > 0 && VFB_UNBESTAETIGT_MIT_KINDERN.includes(kanton));
